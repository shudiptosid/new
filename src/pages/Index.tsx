import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesOverview from "@/components/ServicesOverview";
import FeaturedProjects from "@/components/FeaturedProjects";
import AboutSnippet from "@/components/AboutSnippet";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <HeroSection />
        <ServicesOverview />
        <FeaturedProjects />
        <AboutSnippet />
        <LatestBlogPosts />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
