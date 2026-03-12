import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MonthlyTheme from "@/components/MonthlyTheme";
import ScheduleSection from "@/components/ScheduleSection";
import EventsSection from "@/components/EventsSection";
import ImageCarousel from "@/components/ImageCarousel";
import TestimonySection from "@/components/TestimonySection";
import TestimonyCards from "@/components/TestimonyCards";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MonthlyTheme />
      <ScheduleSection />
      <EventsSection />
      <ImageCarousel />
      <TestimonySection />
      <TestimonyCards />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
