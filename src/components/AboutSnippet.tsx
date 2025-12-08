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
      text: "4h Response Time",
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
            {/* Profile Image - floating above the card */}
            <div className="relative z-20 flex justify-center mb-8">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-accent to-blue-600 transform hover:scale-105 transition-all duration-150 hover:shadow-3xl">
                <img
                  src={profileImage}
                  alt="Shudipto Gain - Embedded Systems Developer"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  style={{
                    objectPosition: "50% 30%",
                  }}
                />
              </div>
            </div>

            {/* Card Content with Glowing Effect */}
            <Card className="glow-card relative -mt-16 pt-20 pb-8 px-6 md:px-8 shadow-xl bg-gradient-to-br from-white to-gray-50/50 border-0">
              {/* Decorative top border */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-accent to-blue-600 rounded-full"></div>

              <div className="text-center relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Why Choose Me
                </h3>

                <div className="space-y-5 mb-8">
                  {highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center gap-4 p-3 rounded-xl bg-white/60 shadow-sm hover:shadow-md transition-all duration-150"
                    >
                      <div className="flex-shrink-0 p-3 bg-gradient-to-br from-accent to-blue-600 rounded-xl text-white shadow-lg">
                        {highlight.icon}
                      </div>
                      <span className="text-lg text-foreground font-semibold">
                        {highlight.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-accent/5 to-blue-600/5 rounded-xl p-6 border border-accent/20">
                  <div className="flex items-start gap-3 justify-center text-center">
                    <Quote className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                    <p className="text-muted-foreground italic text-base font-medium">
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
