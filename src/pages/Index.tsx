import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ServicesOverview from '@/components/ServicesOverview';
import FeaturedProjects from '@/components/FeaturedProjects';
import AboutSnippet from '@/components/AboutSnippet';
import LatestBlogPosts from '@/components/LatestBlogPosts';
import ContactCTA from '@/components/ContactCTA';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ServicesOverview />
      <FeaturedProjects />
      <AboutSnippet />
      <LatestBlogPosts />
      <ContactCTA />
    </div>
  );
};

export default Index;
