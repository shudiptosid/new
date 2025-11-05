import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Calculator, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Component {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  total: number;
}

interface EstimateBuilderProps {
  open: boolean;
  onClose: () => void;
  onSave: (estimateText: string, estimateData: any) => void;
  requestId?: string;
  customerEmail?: string;
  customerName?: string;
}

const TIMELINE_OPTIONS = [
  "3-5 working days",
  "5-7 working days",
  "7-10 working days",
  "10-14 working days",
  "2-3 weeks",
  "3-4 weeks",
  "Custom",
];

const EstimateBuilder = ({
  open,
  onClose,
  onSave,
  requestId,
  customerEmail,
  customerName,
}: EstimateBuilderProps) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estimate state
  const [components, setComponents] = useState<Component[]>([]);
  const [timeline, setTimeline] = useState("7-10 working days");
  const [customTimeline, setCustomTimeline] = useState("");
  const [notes, setNotes] = useState("");

  // Component selection state
  const [selectedCategory, setSelectedCategory] = useState<string>("MCU");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // Fetch products from Supabase - OPTIMIZED: Only fetch when modal opens
  useEffect(() => {
    if (!open) return; // Don't fetch if modal is closed

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("component_prices")
          .select("product_id, name, price, category") // Only select needed fields
          .eq("is_active", true)
          .order("serial_no", { ascending: true });

        if (error) throw error;

        const mappedProducts = (data || []).map((p) => ({
          id: p.product_id,
          name: p.name,
          price: p.price,
          category: p.category,
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error loading products",
          description: "Failed to fetch component prices",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [open, toast]); // Added dependencies

  // Filter products by category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category))).sort();
  }, [products]);

  // Calculate totals
  const subtotal = useMemo(() => {
    return components.reduce((sum, comp) => sum + comp.total, 0);
  }, [components]);

  const total = subtotal; // No tax/GST as per requirement

  // Add component to estimate - OPTIMIZED with useCallback
  const handleAddComponent = useCallback(() => {
    if (!selectedProduct) {
      toast({
        title: "Select a component",
        description: "Please choose a product to add",
        variant: "destructive",
      });
      return;
    }

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    // Check if already added
    const existingIndex = components.findIndex((c) => c.id === product.id);
    if (existingIndex >= 0) {
      // Update quantity
      const updated = [...components];
      updated[existingIndex].quantity += quantity;
      updated[existingIndex].total =
        updated[existingIndex].quantity * updated[existingIndex].price;
      setComponents(updated);
    } else {
      // Add new
      setComponents([
        ...components,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          quantity: quantity,
          total: product.price * quantity,
        },
      ]);
    }

    // Reset selection
    setSelectedProduct("");
    setQuantity(1);

    toast({
      title: "Component added",
      description: `${product.name} added to estimate`,
    });
  }, [selectedProduct, products, components, quantity, toast]);

  // Remove component
  const handleRemoveComponent = (id: string) => {
    setComponents(components.filter((c) => c.id !== id));
  };

  // Update component quantity
  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updated = components.map((c) =>
      c.id === id
        ? { ...c, quantity: newQuantity, total: c.price * newQuantity }
        : c
    );
    setComponents(updated);
  };

  // Generate estimate text for reply box
  const generateEstimateText = () => {
    const finalTimeline = timeline === "Custom" ? customTimeline : timeline;

    let text = `Dear ${customerName || "Customer"},\n\n`;
    text += `Based on your requirements, here's the cost estimate:\n\n`;
    text += `Components:\n`;

    components.forEach((comp) => {
      text += `• ${comp.name}`;
      if (comp.quantity > 1) {
        text += ` (x${comp.quantity})`;
      }
      text += ` - ₹${comp.total.toFixed(2)}\n`;
    });

    text += `\n`;
    text += `Subtotal: ₹${subtotal.toFixed(2)}\n`;
    text += `Total: ₹${total.toFixed(2)}\n\n`;

    if (finalTimeline) {
      text += `Estimated Timeline: ${finalTimeline}\n\n`;
    }

    if (notes) {
      text += `Additional Notes:\n${notes}\n\n`;
    }

    text += `A detailed PDF estimate will be sent to your email.\n\n`;
    text += `This estimate is valid for 30 days.\n\n`;
    text += `Best regards,\nCircuit Crafters Team`;

    return text;
  };

  // Save estimate
  const handleSaveEstimate = async () => {
    if (components.length === 0) {
      toast({
        title: "No components selected",
        description: "Please add at least one component",
        variant: "destructive",
      });
      return;
    }

    const finalTimeline = timeline === "Custom" ? customTimeline : timeline;

    const estimateData = {
      components,
      subtotal,
      tax: 0,
      total,
      timeline: finalTimeline,
      notes,
    };

    const estimateText = generateEstimateText();

    // Pass data back to AdminPanel
    onSave(estimateText, estimateData);

    // Reset form
    setComponents([]);
    setTimeline("7-10 working days");
    setNotes("");
    setCustomTimeline("");

    toast({
      title: "Estimate added",
      description: "Estimate has been added to your reply",
    });

    onClose();
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Cost Estimate Builder
          </DialogTitle>
          <DialogDescription>
            Create a detailed cost estimate for {customerName || "customer"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Component Selector */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Add Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedProduct}
                  onValueChange={setSelectedProduct}
                >
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Select component" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ₹{product.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-20"
                    placeholder="Qty"
                  />
                  <Button onClick={handleAddComponent} className="flex-1">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Components */}
          {components.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Selected Components</h3>
                <div className="space-y-2">
                  {components.map((comp) => (
                    <div
                      key={comp.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{comp.name}</div>
                        <div className="text-sm text-muted-foreground">
                          <Badge variant="outline" className="mr-2">
                            {comp.category}
                          </Badge>
                          ₹{comp.price} × {comp.quantity} = ₹
                          {comp.total.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={comp.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(
                              comp.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-16 h-8"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveComponent(comp.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline & Notes */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Estimated Timeline
                </label>
                <Select value={timeline} onValueChange={setTimeline}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMELINE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {timeline === "Custom" && (
                  <Input
                    className="mt-2"
                    placeholder="Enter custom timeline"
                    value={customTimeline}
                    onChange={(e) => setCustomTimeline(e.target.value)}
                  />
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Additional Notes (Optional)
                </label>
                <Textarea
                  placeholder="Add any special instructions or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveEstimate}
            disabled={components.length === 0}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Add to Reply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Memoize component to prevent unnecessary re-renders
export default memo(EstimateBuilder);
