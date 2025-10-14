import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, Phone, Clock, MapPin, Send, Instagram } from 'lucide-react';
import { useState } from 'react';
import { submitContactForm } from '@/lib/supabaseService';
import { toast } from '@/components/ui/use-toast';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    projectType: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const validateEmail = (email: string): boolean => {
    // RFC 5322 compliant email validation regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email before submission
    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address (e.g., example@domain.com)",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitContactForm({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        company: formData.company,
        projectType: formData.projectType,
        message: formData.message,
      });
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        projectType: '',
        message: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
      console.error('Error submitting contact form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-surface-elevated mb-6">
              Let's Build Something
              <span className="text-accent"> Amazing Together</span>
            </h1>
            <p className="text-xl text-surface-elevated/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Ready to start your embedded systems project? I'm here to help bring your ideas to life 
              with expert firmware development and IoT solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-8 shadow-medium">
              <h2 className="text-3xl font-bold text-foreground mb-6">Get In Touch</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and I'll get back to you within 24 hours to discuss your project.
              </p>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      type="text" 
                      className="mt-1" 
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      type="text" 
                      className="mt-1" 
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    className="mt-1" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input 
                    id="company" 
                    type="text" 
                    className="mt-1" 
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="projectType">Project Type</Label>
                  <select 
                    id="projectType" 
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    value={formData.projectType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a service</option>
                    <option value="consulting">Consulting</option>
                    <option value="prototyping">Prototyping</option>
                    <option value="firmware">Firmware Development</option>
                    <option value="full-project">Complete Project</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="message">Project Details</Label>
                  <Textarea 
                    id="message" 
                    rows={5} 
                    className="mt-1" 
                    placeholder="Tell me about your project, timeline, and any specific requirements..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full bg-accent hover:bg-accent/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="mr-2 w-5 h-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-accent mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Email</h4>
                      <p className="text-muted-foreground">circuitcraftersiot@gmail.com</p>
                      <p className="text-sm text-muted-foreground">I respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-accent mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Phone/WhatsApp</h4>
                      <p className="text-muted-foreground">+91 8389090990</p>
                      <p className="text-sm text-muted-foreground">Available for scheduled calls</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Instagram className="w-6 h-6 text-accent mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Social Media</h4>
                      <p className="text-muted-foreground">Instagram: @circuit_crafters_cc</p>
                      <p className="text-sm text-muted-foreground">Follow for updates and projects</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-accent mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Location</h4>
                      <p className="text-muted-foreground">Lovely Professional University, Punjab, India</p>
                      <p className="text-sm text-muted-foreground">Serving clients globally</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-accent mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Response Time</h4>
                      <p className="text-muted-foreground">Within 24 hours</p>
                      <p className="text-sm text-muted-foreground">Monday - Sunday, anytime</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 bg-accent/5 border-accent/20">
                <h3 className="text-2xl font-semibold text-foreground mb-4">Why Work With Me?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-foreground">3+ years of embedded systems experience</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-foreground">50+ successful projects delivered</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-foreground">End-to-end development expertise</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-foreground">Clear communication and regular updates</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  question: "What's your typical project timeline?",
                  answer: "Project timelines vary based on complexity, but most prototypes take 2-4 weeks, while complete products range from 2-6 months. I provide detailed timelines during our initial consultation."
                },
                {
                  question: "Do you work with international clients?",
                  answer: "Yes! I work with clients worldwide and am experienced with remote collaboration. I maintain flexible hours to accommodate different time zones."
                },
                {
                  question: "What's included in your consulting services?",
                  answer: "Consulting includes technical architecture review, technology selection guidance, feasibility analysis, risk assessment, and strategic planning for your embedded systems project."
                },
                {
                  question: "Can you help with existing projects?",
                  answer: "Absolutely! I can assist with debugging, optimization, feature additions, or complete rewrites of existing embedded systems and firmware."
                }
              ].map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Contact;