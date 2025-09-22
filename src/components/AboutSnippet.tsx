import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Award, Clock, Users, X, Quote } from "lucide-react";
import profileImage from "@/assets/own.png";

const AboutSnippet = () => {
  const [showStory, setShowStory] = useState(false);
  const highlights = [
    {
      icon: <Award className="w-5 h-5" />,
      text: "3+ Years of Experience",
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "50+ Projects Delivered",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      text: "24h Response Time",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
              Building the Future of
              <span className="text-accent"> Connected Devices</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">
              Turn ideas into working innovations. With 3+ years of hands-on
              experience in prototyping, consulting, and firmware development.
              Specialize in bringing concepts to life — from beginner-friendly
              solutions to complex, high-level systems.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="hover:bg-accent hover:text-accent-foreground transition-colors group"
              onClick={() => setShowStory((v) => !v)}
            >
              {showStory ? "Hide Full Story" : "Read Full Story"}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            {showStory && (
              <div className="mt-6 md:mt-8 bg-white/80 rounded-lg shadow p-4 md:p-6 border border-border relative">
                <button
                  onClick={() => setShowStory(false)}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-accent">
                  My Full Story
                </h2>
                <div className="text-sm md:text-base text-muted-foreground space-y-3">
                  <p>
                    Three years ago, I set out with a passion for building smart
                    solutions — and since then, I've completed 50+ IoT projects,
                    turning ideas into functional innovations for students,
                    startups, and businesses.
                  </p>
                  <p>
                    I specialize in prototyping, consulting, and firmware
                    development, with expertise across a wide range of
                    microcontrollers, sensors, and communication modules.
                  </p>
                  <p>
                    From brainstorming the concept to designing, coding, and
                    testing, I handle every step of the process — ensuring you
                    get a reliable, future-ready solution.
                  </p>
                  <p>
                    I don't just deliver projects — I explain the "why" and
                    "how" behind them, so you gain valuable knowledge along the
                    way.
                  </p>
                  <p>
                    Many of my clients see me as more than a developer — I'm
                    their problem solver, mentor, and partner in innovation.
                  </p>
                  <p>
                    My goal is simple: to empower you with technology that
                    works, scales, and makes a real impact.
                  </p>
                  <p>
                    If you have an idea, let's bring it to life — and create a
                    smarter, more connected future together.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <Card className="p-6 md:p-8 pt-28 md:pt-32 shadow-medium relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0"></div>

              {/* Profile Photo Circle */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-accent shadow-lg overflow-hidden border-4 border-white relative z-50">
                {/* Glowing ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0 rounded-full animate-glow bg-[length:200%_100%] z-0"></div>
                {/* Inner container for photo */}
                <div className="relative z-10 w-full h-full">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: "50% 30%", // Optimized for portrait orientation
                    }}
                  />
                </div>
              </div>
              <div className="mt-16 relative z-10">
                <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-6 text-center">
                  Why Choose Me
                </h3>
                <div className="space-y-4 md:space-y-6">
                  {highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 md:gap-4"
                    >
                      <div className="flex-shrink-0 p-2 bg-accent/10 rounded-full text-accent">
                        {highlight.icon}
                      </div>
                      <span className="text-base md:text-lg text-foreground font-medium">
                        {highlight.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 md:mt-8 pt-6 border-t border-border">
                  <div className="flex items-start gap-3">
                    <Quote className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground italic text-sm md:text-base">
                      "Quality, reliability, and innovation drive every project
                      I undertake. Let's build something amazing together."
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSnippet;
