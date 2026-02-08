import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyContactBar from "@/components/StickyContactBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Cpu,
  Settings,
  Layers,
  Zap,
  CheckCircle,
} from "lucide-react";
import ServiceDialog from "@/components/ServiceDialog";

const Services = () => {
  const services = [
    {
      icon: <Settings className="w-12 h-12" />,
      title: "Project On-Demand",
      description:
        "Complete end-to-end development from initial concept to production-ready devices.",
      features: [
        "Full project lifecycle",
        "Hardware & software integration",
        "Testing & validation",
        "Production support",
      ],
      href: "/services/project-on-demand",
    },
    {
      icon: <Cpu className="w-12 h-12" />,
      title: "Consulting",
      description:
        "Strategic guidance and expert advice for your embedded systems architecture.",
      features: [
        "Technical architecture review",
        "Technology selection",
        "Performance optimization",
        "Risk assessment",
      ],
      href: "/services/consulting",
    },
    {
      icon: <Layers className="w-12 h-12" />,
      title: "Prototyping",
      description:
        "Rapid development of functional prototypes to validate and refine your concepts.",
      features: [
        "Rapid prototyping",
        "Proof of concept",
        "Design iteration",
        "Technology validation",
      ],
      href: "/services/prototyping",
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Firmware Development",
      description:
        "Custom firmware solutions optimized for performance, reliability, and efficiency.",
      features: [
        "Low-level programming",
        "RTOS implementation",
        "Driver development",
        "Power optimization",
      ],
      href: "/services/firmware-development",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <StickyContactBar />

      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl sm:max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-surface-elevated mb-4 sm:mb-6">
              Professional Embedded
              <span className="text-accent"> Development Services</span>
            </h1>
            <p className="text-lg sm:text-xl text-surface-elevated/80 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
              From consulting to complete product development, I offer
              comprehensive embedded systems services tailored to your specific
              needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 sm:py-16 md:py-20 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="p-6 sm:p-8 hover:shadow-strong transition-all duration-150 group"
              >
                <div className="text-accent mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-150 flex justify-center">
                  {service.icon}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4 group-hover:text-accent transition-colors text-center">
                  {service.title}
                </h3>

                <p className="text-muted-foreground mb-4 sm:mb-6 leading-relaxed text-center">
                  {service.description}
                </p>

                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                <ServiceDialog title={service.title}>
                  <Button
                    variant="outline"
                    className="w-full hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </ServiceDialog>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-surface">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-md sm:max-w-xl mx-auto">
            Let's discuss your project requirements and find the best solution
            for your needs.
          </p>
          <Button
            size="default"
            className="bg-accent hover:bg-accent/90 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg"
          >
            Contact Me Today
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
