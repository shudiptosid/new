import React, { Suspense } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StickyContactBar from "@/components/StickyContactBar";
import FloatingIconsHome from "@/components/FloatingIconsHome";
import { SEO } from "@/components/SEO";
import backgroundImage from "@/assets/bg3.jpg";

// Lazy load below-the-fold components
const ServicesOverview = React.lazy(() => import("@/components/ServicesOverview"));
const FeaturedProjects = React.lazy(() => import("@/components/FeaturedProjects"));
const AboutSnippet = React.lazy(() => import("@/components/AboutSnippet"));
const CustomerReviewsCarousel = React.lazy(() => import("@/components/CustomerReviewsCarousel"));
const LatestBlogPosts = React.lazy(() => import("@/components/LatestBlogPosts"));
const ContactCTA = React.lazy(() => import("@/components/ContactCTA"));
const Footer = React.lazy(() => import("@/components/Footer"));

// Loading fallback for lazy components
const SectionLoader = () => (
  <div className="w-full flex items-center justify-center py-24">
    <div className="w-8 h-8 rounded-full bg-accent/30 animate-ping"></div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <SEO
        title="Home"
        description="Circuit Crafters - Your premier IoT and embedded systems resource center. Explore tutorials, projects, sensor datasheets, and comprehensive learning materials for electronics enthusiasts and professionals."
        keywords={[
          "Circuit Crafters",
          "IoT portfolio",
          "Embedded systems",
          "Electronics projects",
          "Arduino tutorials",
          "ESP32 projects",
          "Sensor datasheets",
          "IoT learning platform",
          "Circuit design",
          "Electronic components",
          "Microcontroller projects",
        ]}
      />
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
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              opacity: 0.9, // Higher opacity for the new image to make it more visible
              backgroundSize: "cover",
            }}
          />
          {/* Semi-transparent overlay adjusted for new background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/25 backdrop-blur-[0.2px]" />

          {/* Content */}
          <div className="relative z-20">
            <Suspense fallback={<SectionLoader />}>
              <ServicesOverview />
              <FeaturedProjects />
              <AboutSnippet />
              <CustomerReviewsCarousel />
              <LatestBlogPosts />
              <ContactCTA />
            </Suspense>
          </div>
        </div>
      </main>
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
