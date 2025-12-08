import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Mail, MessageSquare, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactCTA = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <Card className="p-8 md:p-12 text-center shadow-strong bg-surface-elevated/95 backdrop-blur-sm border-0">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Let's discuss how I can help bring your embedded system ideas to life. 
            From initial consultation to final delivery, I'm here to guide you through every step.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 md:mb-12">
            <Link to="/contact">
              <Button 
                size="lg"
                className="bg-accent hover:bg-accent/90 px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold group w-full sm:w-auto"
              >
                <Mail className="mr-2 w-4 h-4" />
                Get In Touch
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="outline"
                size="lg"
                className="px-6 sm:px-8 py-4 text-base sm:text-lg hover:bg-foreground hover:text-background transition-colors w-full sm:w-auto"
              >
                <Phone className="mr-2 w-4 h-4" />
                Schedule Call
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 md:pt-8 border-t border-border/50">
            <div className="flex items-center justify-center gap-3">
              <Mail className="w-5 h-5 text-accent" />
              <span className="text-muted-foreground">Quick Response</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <MessageSquare className="w-5 h-5 text-accent" />
              <span className="text-muted-foreground">Free Consultation</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Phone className="w-5 h-5 text-accent" />
              <span className="text-muted-foreground">Flexible Scheduling</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ContactCTA;
