import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MonthlyTheme from "@/components/MonthlyTheme";
import ScheduleSection from "@/components/ScheduleSection";
import ImageCarousel from "@/components/ImageCarousel";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MonthlyTheme />
      <ImageCarousel />
      <ScheduleSection />
      <GallerySection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
