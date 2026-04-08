import HeroSection from "@/components/HeroSection";
import LiveAppsSection from "@/components/LiveAppsSection";
import FeaturedAppsSection from "@/components/FeaturedAppsSection";
import RoadmapSection from "@/components/RoadmapSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <LiveAppsSection />
      <FeaturedAppsSection />
      <RoadmapSection />
      <HowItWorksSection />
      <FooterSection />
    </div>
  );
};

export default Index;
