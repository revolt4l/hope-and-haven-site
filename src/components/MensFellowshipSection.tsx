import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Utensils } from "lucide-react";

const EVENT_DATE = new Date("2026-06-21T08:30:00+01:00");

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const distance = EVENT_DATE.getTime() - now;
      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
      setStarted(true);
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-2 sm:p-4 text-center backdrop-blur-sm"
        >
          <div className="font-display text-2xl sm:text-4xl font-bold text-secondary">
            {started ? String(unit.value).padStart(2, "0") : "--"}
          </div>
          <div className="font-body text-[10px] sm:text-xs text-primary-foreground/50 uppercase tracking-wider mt-1">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const programmeItems = [
  { number: "1", activity: "Opening Prayer", officiant: "Bro Bowale Adeyeye" },
  { number: "2", activity: "Praises", officiant: "Choir" },
  { number: "3", activity: "Prayer", officiant: "Dcn Lanre Ogunmola" },
  { number: "4", activity: "Testimony", officiant: "Brother Olusola Sylva" },
  { number: "5", activity: "Worship", officiant: "The Worship Team" },
  { number: "6", activity: "Exhortation", officiant: "Pastor Israel Ogunmola" },
  { number: "7", activity: "Offering", officiant: "Brother Ayodeji" },
  { number: "8", activity: "Award Presentation", officiant: "Elder Ayodele Ologunola" },
  { number: "9", activity: "Comment from Awardee", officiant: "Rev'd Dr. Marcus Akinduko, Resident Pastor, TREM Oke-Aro" },
  { number: "10", activity: "Thanksgiving", officiant: "" },
  { number: "11", activity: "Vote of Thanks", officiant: "Elder Ayodele Ologunola" },
  { number: "12", activity: "Announcement", officiant: "Bro Gbenga Faloye" },
  { number: "13", activity: "Benediction", officiant: "Rev'd Dr. Marcus Akinduko" },
  { number: "14", activity: "Menu! Menu!! Menu!!!", officiant: "", isMenu: true },
];

const MensFellowshipSection = () => {
  return (
    <section id="mens-fellowship-2026" className="py-20 lg:py-28 bg-foreground animated-bg-dark">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-secondary font-body text-sm tracking-[0.2em] uppercase mb-3">
            <CalendarDays className="inline w-4 h-4 mr-1 -mt-0.5" />
            Upcoming Event
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
            Men's Fellowship 2026 — Programme of Events
          </h2>
          <p className="text-primary-foreground/60 font-body text-lg max-w-xl mx-auto">
            TREM Oke-Aro, Akure
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-6 md:p-10 backdrop-blur-sm">
            <div className="border-b border-primary-foreground/20 pb-4 mb-6">
              <p className="text-center font-display text-xl md:text-2xl font-bold text-primary-foreground">
                Order of Programme
              </p>
              <p className="text-center font-body text-sm text-primary-foreground/50 mt-1">
                TREM Oke-Aro Men's Fellowship 2026
              </p>
            </div>

            <div className="space-y-0">
              {programmeItems.map((item, i) => (
                <div
                  key={item.number}
                  className={`flex items-start gap-4 py-4 border-b border-primary-foreground/10 last:border-b-0 ${
                    item.isMenu ? "bg-secondary/10 -mx-4 px-4 md:-mx-6 md:px-6 rounded-lg" : ""
                  }`}
                >
                  <span className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-secondary/20 text-secondary font-body text-sm font-bold flex items-center justify-center mt-0.5">
                    {item.number}
                  </span>
                  <div className="flex-grow flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4">
                    <span className="font-body text-primary-foreground/90 font-medium text-base md:text-lg flex items-center gap-2">
                      {item.isMenu && <Utensils className="w-4 h-4 text-secondary" />}
                      {item.activity}
                    </span>
                    {item.officiant && (
                      <span className="font-body text-sm md:text-base text-primary-foreground/60 md:text-right">
                        {item.officiant}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-secondary/30">
              <p className="text-center font-body text-lg md:text-xl font-bold text-primary-foreground">
                Anchor: <span className="text-secondary">Dcn Olumide Ogundowole</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MensFellowshipSection;
