import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesOverview from "@/components/ServicesOverview";
import FeaturedProjects from "@/components/FeaturedProjects";
import AboutSnippet from "@/components/AboutSnippet";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import backgroundImage from "@/assets/background.png";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow relative">
        <HeroSection />
        {/* Background wrapper for all content except Hero and Footer */}
        <div className="relative">
          {/* Background Image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundAttachment: "fixed",
            }}
          />
          {/* Semi-transparent overlay for better readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50 backdrop-blur-[1px]" />

          {/* Content */}
          <div className="relative z-10">
            <ServicesOverview />
            <FeaturedProjects />
            <AboutSnippet />
            <LatestBlogPosts />
            <ContactCTA />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
