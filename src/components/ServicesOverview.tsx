import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, Settings, Layers, Zap } from 'lucide-react';

const ServicesOverview = () => {
  const services = [
    {
      icon: <Settings className="w-8 h-8" />,
      title: 'Consulting',
      description: 'Strategic guidance for your embedded systems and IoT architecture decisions.',
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: 'Prototyping',
      description: 'Rapid development of functional prototypes to validate your concepts.',
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: 'Firmware Development',
      description: 'Custom firmware solutions optimized for performance and reliability.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'On-Demand Projects',
      description: 'Complete end-to-end development from concept to production-ready devices.',
    },
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Services That Drive Innovation
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From initial concept to production-ready solutions, I provide comprehensive 
            embedded systems development services tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {services.map((service, index) => (
            <Card key={index} className="p-6 hover:shadow-medium transition-all duration-300 group cursor-pointer border-border/50">
              <div className="text-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-accent transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-4 text-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Explore All Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;