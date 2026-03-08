import { motion } from "framer-motion";
import { Clock, Sun, Flame, Sparkles, Heart } from "lucide-react";

const scheduleData = [
  {
    day: "Sunday",
    icon: Sun,
    label: "Morning Celebration Services",
    services: [
      { name: "Sunday Service", time: "8:00 AM – 10:00 AM" },
    ],
  },
  {
    day: "Tuesday",
    icon: Heart,
    label: "Power for Living Service",
    services: [{ name: "Power for Living", time: "5:00 PM – 6:30 PM" }],
  },
  {
    day: "Friday",
    icon: Flame,
    label: "Miracle Rally / Mount Zion Experience",
    services: [{ name: "Miracle Rally / Mt. Zion Experience", time: "4:30 PM / 5:00 PM" }],
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
          <p className="text-secondary font-body text-sm tracking-[0.2em] uppercase mb-3">Join Us</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
            Weekly Service Schedule
          </h2>
          <p className="text-primary-foreground/60 font-body text-lg max-w-xl mx-auto">
            There's always a place for you at TREM Oke Aro. Come experience God's presence with us.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {scheduleData.map((item, i) => (
            <motion.div
              key={item.day}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-6 border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-primary-foreground text-lg">{item.day}</h3>
                  <p className="text-primary-foreground/50 font-body text-xs">{item.label}</p>
                </div>
              </div>
              <div className="space-y-3">
                {item.services.map((service) => (
                  <div key={service.name} className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-primary-foreground/90 font-body text-sm font-medium">{service.name}</p>
                      <p className="text-secondary font-body text-sm font-semibold">{service.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
