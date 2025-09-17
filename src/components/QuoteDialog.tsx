import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send } from 'lucide-react';

interface QuoteDialogProps {
  children: React.ReactNode;
}

const QuoteDialog = ({ children }: QuoteDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    microcontroller: '',
    sensorCount: '',
    description: '',
    phone: '',
    email: ''
  });

  const microcontrollerOptions = [
    'Arduino Uno',
    'Arduino Nano', 
    'ESP32',
    'ESP32-S3',
    'ESP8266',
    'Raspberry Pi'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Quote form submitted:', formData);
    setOpen(false);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const words = e.target.value.split(/\s+/).filter(word => word.length > 0);
    if (words.length <= 1000) {
      setFormData({ ...formData, description: e.target.value });
    }
  };

  const wordCount = formData.description.split(/\s+/).filter(word => word.length > 0).length;

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
          <div>
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              type="text"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="microcontroller">Microcontroller Type</Label>
            <Select
              value={formData.microcontroller}
              onValueChange={(value) => setFormData({ ...formData, microcontroller: value })}
              required
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a microcontroller" />
              </SelectTrigger>
              <SelectContent>
                {microcontrollerOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sensorCount">Number of Sensors</Label>
            <Input
              id="sensorCount"
              type="number"
              min="0"
              value={formData.sensorCount}
              onChange={(e) => setFormData({ ...formData, sensorCount: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleDescriptionChange}
              className="mt-1 min-h-[120px]"
              placeholder="Describe your project requirements, goals, and any specific features you need..."
              required
            />
            <div className="text-sm text-muted-foreground mt-1">
              {wordCount}/1000 words
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1"
                required
              />
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
          </div>

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
            <Send className="mr-2 w-4 h-4" />
            Submit Quote Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDialog;