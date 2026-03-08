import { motion } from "framer-motion";
import { Clock, Sun, Flame, Heart, Calendar } from "lucide-react";

const scheduleData = [
  {
    day: "Sunday",
    icon: Sun,
    label: "Morning Celebration",
    services: [
      { name: "Sunday Worship Service", time: "8:30 AM – 10:30 AM" },
    ],
    accent: "bg-secondary/20 text-secondary",
  },
  {
    day: "Tuesday",
    icon: Heart,
    label: "Midweek Recharge",
    services: [{ name: "Power for Living Service", time: "5:00 PM – 6:00 PM" }],
    accent: "bg-primary/10 text-primary",
  },
  {
    day: "3rd Friday",
    icon: Flame,
    label: "Monthly Encounter",
    services: [{ name: "Miracle Rally Service", time: "5:00 PM – 6:00 PM" }],
    accent: "bg-destructive/10 text-destructive",
  },
];

const ScheduleSection = () => {
  return (
    <section id="schedule" className="py-20 lg:py-28 bg-foreground">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-secondary font-body text-sm tracking-[0.2em] uppercase mb-3">
            <Calendar className="inline w-4 h-4 mr-1 -mt-0.5" />
            Join Us
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
            Weekly Service Schedule
          </h2>
          <p className="text-primary-foreground/60 font-body text-lg max-w-xl mx-auto">
            There's always a place for you. Come experience God's presence — every service is an opportunity for a fresh encounter.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {scheduleData.map((item, i) => (
            <motion.div
              key={item.day}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="rounded-2xl p-8 border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-sm text-center hover:bg-primary-foreground/10 transition-colors"
            >
              <div className={`w-14 h-14 rounded-2xl ${item.accent} flex items-center justify-center mx-auto mb-5`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-primary-foreground text-2xl mb-1">{item.day}</h3>
              <p className="text-primary-foreground/50 font-body text-sm mb-5">{item.label}</p>
              <div className="space-y-3">
                {item.services.map((service) => (
                  <div key={service.name} className="bg-primary-foreground/5 rounded-xl p-4">
                    <p className="text-primary-foreground/90 font-body text-sm font-medium mb-1">{service.name}</p>
                    <div className="flex items-center justify-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-secondary" />
                      <p className="text-secondary font-body text-sm font-bold">{service.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-primary-foreground/40 font-body text-sm mt-10"
        >
          First-time visitor? We'd love to meet you! Come a few minutes early and our greeters will make you feel right at home.
        </motion.p>
      </div>
    </section>
  );
};

export default ScheduleSection;
