import { motion } from "framer-motion";
import { Megaphone, BookOpen, CalendarDays, ArrowRight } from "lucide-react";

const events = [
  {
    icon: Megaphone,
    tag: "Announcement",
    title: "March Declaration: Moving Forward!",
    description: "This is our month of divine advancement. God is taking us beyond every limitation. Join us in faith as we press forward!",
    date: "All Month",
  },
  {
    icon: BookOpen,
    tag: "Sermon Series",
    title: "Power for Living Series",
    description: "Discover practical wisdom for everyday challenges through our Tuesday evening teachings. The Word of God is alive and powerful!",
    date: "Every Tuesday",
  },
  {
    icon: CalendarDays,
    tag: "Upcoming Event",
    title: "Mt. Zion Experience — Friday Encounter",
    description: "A special evening of intense worship, prayer, and miracles. Come expecting — God is ready to move mightily in your life.",
    date: "Every Friday",
  },
];

const EventsSection = () => {
  return (
    <section id="events" className="py-20 lg:py-28" style={{ background: "var(--section-gradient)" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-secondary font-body text-sm tracking-[0.2em] uppercase mb-3">What's Happening</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            News & Events
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-xl mx-auto">
            Stay connected with what God is doing at TREM Oke Aro. There's always something exciting to look forward to!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-card border border-border rounded-2xl p-7 hover:border-secondary/40 transition-all"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <event.icon className="w-5 h-5 text-secondary" />
                </div>
                <span className="font-body text-xs font-semibold text-secondary tracking-wide uppercase">{event.tag}</span>
              </div>
              <h3 className="font-display font-bold text-foreground text-lg mb-2">{event.title}</h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">{event.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-body text-xs text-muted-foreground/70">{event.date}</span>
                <ArrowRight className="w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
