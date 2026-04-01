import { motion } from "framer-motion";
import monthlyTheme from "@/assets/monthly-theme-april.jpg";

const MonthlyTheme = () => {
  return (
    <section className="py-20 lg:py-28" style={{ background: "var(--section-gradient)" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-secondary font-body text-sm tracking-[0.2em] uppercase mb-3">This Month's Declaration</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            March — The Month of Moving Forward
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <img
            src={monthlyTheme}
            alt="March - The Month of Moving Forward"
            className="rounded-2xl w-full"
            style={{ boxShadow: "var(--shadow-elevated)" }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default MonthlyTheme;
