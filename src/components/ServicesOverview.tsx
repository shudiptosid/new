import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, Settings, Layers, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesOverview = () => {
  const services = [
    {
      icon: <Settings className="w-10 h-10" />,
      title: 'Consulting',
      description: 'Strategic guidance for your embedded systems and IoT architecture decisions.',
    },
    {
      icon: <Layers className="w-10 h-10" />,
      title: 'Prototyping',
      description: 'Rapid development of functional prototypes to validate your concepts.',
    },
    {
      icon: <Cpu className="w-10 h-10" />,
      title: 'Firmware Development',
      description: 'Custom firmware solutions optimized for performance and reliability.',
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: 'On-Demand Projects',
      description: 'Complete end-to-end development from concept to production-ready devices.',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Services That Drive Innovation
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            From initial concept to production-ready solutions, I provide comprehensive 
            embedded systems development services tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="p-6 hover:shadow-medium transition-all duration-150 group cursor-pointer border-border/50 h-full flex flex-col">
              <div className="text-accent mb-4 group-hover:scale-110 transition-transform duration-150">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-accent transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed flex-grow">
                {service.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/services">
            <Button 
              variant="outline" 
              size="lg"
              className="px-6 sm:px-8 py-4 text-base sm:text-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
            >
              Explore All Services
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
