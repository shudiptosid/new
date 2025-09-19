import Navigation from "@/components/Navigation";
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
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-surface-elevated mb-6">
              Professional Embedded
              <span className="text-accent"> Development Services</span>
            </h1>
            <p className="text-xl text-surface-elevated/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              From consulting to complete product development, I offer
              comprehensive embedded systems services tailored to your specific
              needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="p-8 hover:shadow-strong transition-all duration-300 group"
              >
                <div className="text-accent mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
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
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss your project requirements and find the best solution
            for your needs.
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 px-8 py-4 text-lg"
          >
            Contact Me Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Services;
