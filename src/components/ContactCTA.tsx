import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Mail, MessageSquare, Phone } from 'lucide-react';

const ContactCTA = () => {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <Card className="p-12 text-center shadow-strong bg-surface-elevated/95 backdrop-blur-sm border-0">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Let's discuss how I can help bring your embedded system ideas to life. 
            From initial consultation to final delivery, I'm here to guide you through every step.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg"
              className="bg-accent hover:bg-accent/90 px-8 py-4 text-lg font-semibold group"
            >
              <Mail className="mr-2 w-5 h-5" />
              Get In Touch
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg hover:bg-foreground hover:text-background transition-colors"
            >
              <Phone className="mr-2 w-5 h-5" />
              Schedule Call
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border/50">
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