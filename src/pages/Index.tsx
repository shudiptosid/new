import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesOverview from "@/components/ServicesOverview";
import FeaturedProjects from "@/components/FeaturedProjects";
import AboutSnippet from "@/components/AboutSnippet";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import StickyContactBar from "@/components/StickyContactBar";
import FloatingIconsHome from "@/components/FloatingIconsHome";
import backgroundImage from "@/assets/bg3.jpg";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Floating icons across the home page with increased density */}
      <div className="pointer-events-none z-10">
        <FloatingIconsHome isHomePage={true} />
      </div>

      <Navigation />
      <StickyContactBar />
      <main className="flex-grow relative z-20">
        <HeroSection />
        {/* Background wrapper for all content except Hero and Footer */}
        <div className="relative">
          {/* Background Image - new bg3.jpg */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundAttachment: "fixed",
              opacity: 0.9, // Higher opacity for the new image to make it more visible
              backgroundSize: "cover",
            }}
          />
          {/* Semi-transparent overlay adjusted for new background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/25 backdrop-blur-[0.2px]" />

          {/* Content */}
          <div className="relative z-20">
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
