import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const HQ_PAGES = [
  'https://trem.org/',
  'https://trem.org/events/',
  'https://trem.org/news/',
  'https://trem.org/blog/',
];

const MODEL = 'google/gemini-3.6-flash';

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

const CONTENT_TYPES = [
  'monthly_declaration',
  'monthly_theme',
  'monthly_program',
  'church_program',
  'event',
  'conference',
  'special_service',
  'announcement',
  'sermon',
  'devotional',
  'important_date',
];

const schema = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          summary: { type: 'string' },
          original_content: { type: 'string' },
          content_type: { type: 'string', enum: CONTENT_TYPES },
          source_url: { type: 'string' },
          image_url: { type: 'string' },
          publication_date: { type: 'string', description: 'ISO date or empty string' },
          event_date: { type: 'string', description: 'ISO date-time or empty string' },
          event_location: { type: 'string' },
          registration_info: { type: 'string' },
          month_key: { type: 'string', description: 'YYYY-MM for monthly items, else empty string' },
        },
        required: ['title', 'summary', 'content_type'],
        additionalProperties: false,
      },
    },
  },
  required: ['items'],
  additionalProperties: false,
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: run } = await supabase
    .from('hq_sync_runs')
    .insert({ status: 'running' })
    .select('id')
    .single();
  const runId = run?.id;

  const finish = async (patch: Record<string, unknown>, statusCode = 200) => {
    if (runId) {
      await supabase.from('hq_sync_runs').update({ finished_at: new Date().toISOString(), ...patch }).eq('id', runId);
    }
    return new Response(JSON.stringify(patch), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: statusCode,
    });
  };

  try {
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) return await finish({ status: 'failed', error: 'LOVABLE_API_KEY is not configured' }, 500);

    // 1. Fetch HQ pages (bounded: max 4 pages, ~12k chars each)
    const chunks: string[] = [];
    for (const url of HQ_PAGES) {
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TREMOkeAroBot/1.0)' },
          signal: AbortSignal.timeout(20000),
        });
        if (!res.ok) continue;
        const text = htmlToText(await res.text()).slice(0, 12000);
        if (text.length > 200) chunks.push(`SOURCE_URL: ${url}\n${text}`);
      } catch (_) {
        // skip unreachable page
      }
    }

    if (chunks.length === 0) {
      return await finish({ status: 'failed', error: 'Could not reach trem.org' }, 502);
    }

    // 2. Extract structured items with Lovable AI
    const today = new Date().toISOString().slice(0, 10);
    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              `You extract church content from the official TREM International Headquarters website (trem.org). Today is ${today}. ` +
              'Extract ONLY facts that literally appear in the provided page text. Never invent titles, dates, venues or details. ' +
              'If a field is unknown, return an empty string. Ignore navigation menus, cookie notices, donation widgets and footers. ' +
              'Use month_key (YYYY-MM) only for monthly declarations/themes/programs. Return at most 20 items.',
          },
          { role: 'user', content: chunks.join('\n\n---\n\n').slice(0, 45000) },
        ],
        response_format: { type: 'json_schema', json_schema: { name: 'hq_items', strict: true, schema } },
      }),
    });

    if (!aiRes.ok) {
      const body = await aiRes.text();
      const msg = `AI extraction failed (${aiRes.status}): ${body.slice(0, 300)}`;
      return await finish({ status: 'failed', error: msg }, aiRes.status === 429 || aiRes.status >= 500 ? 503 : 400);
    }

    const aiJson = await aiRes.json();
    let parsed: { items?: any[] } = {};
    try {
      parsed = JSON.parse(aiJson.choices?.[0]?.message?.content ?? '{}');
    } catch (_) {
      return await finish({ status: 'failed', error: 'Could not parse AI response' }, 502);
    }
    const items = (parsed.items ?? []).slice(0, 20);

    // 3. Upsert with duplicate detection / change detection
    let created = 0;
    let updated = 0;

    for (const it of items) {
      const title = String(it.title ?? '').trim();
      if (!title) continue;

      const contentType = CONTENT_TYPES.includes(it.content_type) ? it.content_type : 'announcement';
      const monthKey = /^\d{4}-\d{2}$/.test(it.month_key ?? '') ? it.month_key : null;
      // stable identity: monthly items keyed by type+month, everything else by title slug
      const sourceId = monthKey && contentType.startsWith('monthly')
        ? `${contentType}-${monthKey}`
        : slugify(title);

      const summary = String(it.summary ?? '').trim() || null;
      const original = String(it.original_content ?? '').trim() || null;
      const eventDate = it.event_date && !isNaN(Date.parse(it.event_date)) ? new Date(it.event_date).toISOString() : null;
      const pubDate = it.publication_date && !isNaN(Date.parse(it.publication_date))
        ? new Date(it.publication_date).toISOString()
        : null;
      const location = String(it.event_location ?? '').trim() || null;
      const reg = String(it.registration_info ?? '').trim();
      const sourceUrl = String(it.source_url ?? '').startsWith('http') ? it.source_url : 'https://trem.org/';
      const imageUrl = String(it.image_url ?? '').startsWith('http') ? it.image_url : null;

      const hash = await sha256(
        [title, summary, original, eventDate, pubDate, location, reg, imageUrl].join('|'),
      );

      const { data: existing } = await supabase
        .from('hq_updates')
        .select('id,content_hash')
        .eq('source', 'trem_website')
        .eq('source_id', sourceId)
        .maybeSingle();

      const row = {
        title,
        summary: reg ? `${summary ?? ''}${summary ? '\n\n' : ''}Registration: ${reg}`.trim() : summary,
        original_content: original,
        source: 'trem_website',
        source_id: sourceId,
        source_url: sourceUrl,
        image_url: imageUrl,
        content_type: contentType,
        publication_date: pubDate,
        event_date: eventDate,
        event_location: location,
        month_key: monthKey,
        content_hash: hash,
        status: 'published' as const,
        imported_at: new Date().toISOString(),
      };

      if (!existing) {
        const { error } = await supabase.from('hq_updates').insert(row);
        if (!error) created++;
      } else if (existing.content_hash !== hash) {
        const { error } = await supabase.from('hq_updates').update(row).eq('id', existing.id);
        if (!error) updated++;
      }
    }

    return await finish({
      status: 'success',
      items_found: items.length,
      items_created: created,
      items_updated: updated,
    });
  } catch (e) {
    return await finish({ status: 'failed', error: String(e).slice(0, 500) }, 500);
  }
});
