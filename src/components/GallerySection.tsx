import { motion } from "framer-motion";
import congregation from "@/assets/congregation.jpg";
import pastor1 from "@/assets/pastor1.jpg";
import pastor2 from "@/assets/pastor2.jpg";

const images = [
  { src: pastor1, alt: "Pastor preaching at TREM Oke Aro" },
  { src: congregation, alt: "Church members during service" },
  { src: pastor2, alt: "Pastor at the pulpit" },
];

const GallerySection = () => {
  return (
    <section id="gallery" className="py-20 lg:py-28 bg-muted">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-secondary font-body text-sm tracking-[0.2em] uppercase mb-3">Our Community</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Life at TREM Oke Aro</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="overflow-hidden rounded-2xl"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full aspect-[4/5] object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
