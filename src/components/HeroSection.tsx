import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import timeLapseBg from "@/assets/time-lapse-bg.mp4";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.95 }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={timeLapseBg} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-60" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated/10 backdrop-blur-sm rounded-full border border-accent/20 mb-6">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-surface-elevated">
              Expert IoT Solutions
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-surface-elevated mb-6 leading-tight">
            Expert Firmware &amp;
            <br />
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              IoT Prototyping
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-surface-elevated/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            We turn complex ideas into working devices. From concept to
            production, get robust embedded solutions built right.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/completed-projects">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold group"
              >
                View My Work
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-surface-elevated/30 text-surface-elevated bg-surface-elevated/5 hover:bg-surface-elevated/15 hover:border-surface-elevated/40 px-8 py-4 text-lg backdrop-blur-sm transition-all duration-200"
            >
              My Services
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-surface-elevated/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">3+</div>
              <div className="text-surface-elevated/70">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">50+</div>
              <div className="text-surface-elevated/70">Projects Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">24h</div>
              <div className="text-surface-elevated/70">Response Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
