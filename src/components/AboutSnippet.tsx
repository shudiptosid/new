import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Award, Clock, Users } from 'lucide-react';

const AboutSnippet = () => {
  const highlights = [
    {
      icon: <Award className="w-6 h-6" />,
      text: '10+ Years of Experience',
    },
    {
      icon: <Users className="w-6 h-6" />,
      text: 'Trusted by 50+ Companies',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      text: '24h Response Time',
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
              With over 10 years of experience in embedded systems, I specialize in building 
              robust and efficient IoT solutions from the ground up. My expertise spans from 
              low-level firmware development to complete system architecture.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              I work with startups and established companies to transform innovative ideas 
              into production-ready devices that perform reliably in real-world conditions.
            </p>
            <Button 
              size="lg"
              variant="outline"
              className="hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Read Full Story
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <Card className="p-8 shadow-medium">
            <h3 className="text-2xl font-semibold text-foreground mb-6">Why Choose Me</h3>
            <div className="space-y-6">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="text-accent">
                    {highlight.icon}
                  </div>
                  <span className="text-lg text-foreground font-medium">
                    {highlight.text}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-muted-foreground italic">
                "Quality, reliability, and innovation drive every project I undertake. 
                Let's build something amazing together."
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSnippet;