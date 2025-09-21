import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Award, Clock, Users, X } from "lucide-react";

const AboutSnippet = () => {
  const [showStory, setShowStory] = useState(false);
  const highlights = [
    {
      icon: <Award className="w-6 h-6" />,
      text: "10+ Years of Experience",
    },
    {
      icon: <Users className="w-6 h-6" />,
      text: "Trusted by 50+ Companies",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      text: "24h Response Time",
    },
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Building the Future of
              <span className="text-accent"> Connected Devices</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              Turn ideas into working innovations. With 3+ years of hands-on
              experience in prototyping, consulting, and firmware development.
              Specialize in bringing concepts to life — from beginner-friendly
              solutions to complex, high-level systems.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => setShowStory((v) => !v)}
            >
              {showStory ? "Hide Full Story" : "Read Full Story"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            {showStory && (
              <div className="mt-8 bg-white/80 rounded-lg shadow p-6 border border-border">
                <h2 className="text-2xl font-bold mb-4 text-accent">
                  My Full Story
                </h2>
                <div className="text-base text-muted-foreground space-y-4">
                  <p>
                    Three years ago, I set out with a passion for building smart
                    solutions — and since then, I’ve completed 50+ IoT projects,
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
                    I don’t just deliver projects — I explain the “why” and
                    “how” behind them, so you gain valuable knowledge along the
                    way.
                  </p>
                  <p>
                    Many of my clients see me as more than a developer — I’m
                    their problem solver, mentor, and partner in innovation.
                  </p>
                  <p>
                    My goal is simple: to empower you with technology that
                    works, scales, and makes a real impact.
                  </p>
                  <p>
                    If you have an idea, let’s bring it to life — and create a
                    smarter, more connected future together.
                  </p>
                </div>
              </div>
            )}
          </div>

          <Card className="p-8 pt-36 shadow-medium relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-accent/0 before:via-accent/30 before:to-accent/0 before:animate-glow before:bg-[length:200%_100%]">
            {/* Profile Photo Circle */}
            <div className="absolute -top-[16rem] left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-accent shadow-lg overflow-hidden border-6 border-white relative">
              {/* Glowing ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0 rounded-full animate-glow bg-[length:200%_100%] z-0"></div>
              {/* Inner container for photo */}
              <div className="relative z-10 w-full h-full">
                <img
                  src="/src/assets/own.png"
                  alt="Profile"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: "50% 30%", // Optimized for portrait orientation
                  }}
                />
              </div>
            </div>
            <div className="-mt-48 relative z-10">
              <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
                Why Choose Me
              </h3>
              <div className="space-y-6">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="text-accent">{highlight.icon}</div>
                    <span className="text-lg text-foreground font-medium">
                      {highlight.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-muted-foreground italic">
                  "Quality, reliability, and innovation drive every project I
                  undertake. Let's build something amazing together."
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSnippet;
