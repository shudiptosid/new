import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Cpu, Calculator } from "lucide-react";
import timeLapseBg from "@/assets/time-lapse-bg.mp4";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video - Lazy loaded for performance */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.95 }}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect width='1920' height='1080' fill='%230a0a0a'/%3E%3C/svg%3E"
      >
        <source src={timeLapseBg} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-60" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated/10 backdrop-blur-sm rounded-full border border-accent/20 mb-6">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-surface-elevated">
              Expert IoT Solutions
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-surface-elevated mb-6 leading-tight">
            Expert Firmware &amp;
            <br />
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              IoT Prototyping
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl text-surface-elevated/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            We turn complex ideas into working devices. From concept to
            production, get robust embedded solutions built right.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projects">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold group"
              >
                View My Work
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/cost-estimator">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold group"
              >
                <Calculator className="mr-2 w-5 h-5" />
                Cost Estimator
              </Button>
            </Link>
            <Link to="/services">
              <Button
                variant="outline"
                size="lg"
                className="border-surface-elevated/30 text-surface-elevated bg-surface-elevated/5 hover:bg-surface-elevated/15 hover:border-surface-elevated/40 px-6 sm:px-8 py-4 text-base sm:text-lg backdrop-blur-sm transition-all duration-200"
              >
                <Cpu className="mr-2 w-5 h-5" />
                My Services
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 pt-8 border-t border-surface-elevated/20">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent mb-2">
                3+
              </div>
              <div className="text-surface-elevated/70 text-sm sm:text-base">
                Years Experience
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent mb-2">
                50+
              </div>
              <div className="text-surface-elevated/70 text-sm sm:text-base">
                Projects Delivered
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent mb-2">
                4h
              </div>
              <div className="text-surface-elevated/70 text-sm sm:text-base">
                Response Time
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
