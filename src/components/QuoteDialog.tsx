import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send } from 'lucide-react';
import { submitQuoteForm } from '@/lib/supabaseService';
import { toast } from '@/components/ui/use-toast';

interface QuoteDialogProps {
  children: React.ReactNode;
}

const QuoteDialog = ({ children }: QuoteDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    projectType: 'Consulting',
    projectDetails: ''
  });

  const projectTypeOptions = [
    'Consulting',
    'Prototyping', 
    'Firmware Development',
    'Complete Project'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await submitQuoteForm({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        company: formData.company,
        projectType: formData.projectType,
        projectDetails: formData.projectDetails,
      });
      
      toast({
        title: "Quote Request Submitted!",
        description: "Thank you for your request. We'll get back to you within 24 hours with a quote.",
      });
      
      // Reset form and close dialog
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        projectType: 'Consulting',
        projectDetails: ''
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your quote request. Please try again.",
        variant: "destructive",
      });
      console.error('Error submitting quote form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const words = e.target.value.split(/\s+/).filter(word => word.length > 0);
    if (words.length <= 1000) {
      setFormData({ ...formData, projectDetails: e.target.value });
    }
  };

  const wordCount = formData.projectDetails.split(/\s+/).filter(word => word.length > 0).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Get Project Quote</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="company">Company (Optional)</Label>
            <Input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="projectType">Project Type</Label>
            <Select
              value={formData.projectType}
              onValueChange={(value) => setFormData({ ...formData, projectType: value })}
              required
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a project type" />
              </SelectTrigger>
              <SelectContent>
                {projectTypeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="projectDetails">Project Details</Label>
            <Textarea
              id="projectDetails"
              value={formData.projectDetails}
              onChange={handleDescriptionChange}
              className="mt-1 min-h-[120px]"
              placeholder="Describe your project requirements, goals, and any specific features you need..."
              required
            />
            <div className="text-sm text-muted-foreground mt-1">
              {wordCount}/1000 words
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-accent hover:bg-accent/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Submitting...
              </span>
            ) : (
              <>
                <Send className="mr-2 w-4 h-4" />
                Submit Quote Request
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDialog;