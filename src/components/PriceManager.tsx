import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  product_id: string;
  serial_no: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const CATEGORIES = [
  "Sensor",
  "MCU",
  "Display",
  "Power",
  "Actuator",
  "Component",
  "Cable",
  "Audio",
];

const CATEGORY_PREFIX_MAP: Record<string, string> = {
  power: "PWRR",
  sensor: "SEN",
  mcu: "MCU",
  microcontroller: "MCU",
  micrcontroller: "MCU",
  display: "DSP",
  actuator: "ACT",
  component: "CMP",
  cable: "CBL",
  audio: "AUD",
};

const PriceManager = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>(CATEGORIES);

  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // Add product dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Product>>({
    category: "Sensor",
    price: 0,
    is_active: true,
  });
  const [newCategory, setNewCategory] = useState("");

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [saving, setSaving] = useState(false);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching products from Supabase...");

      const { data, error } = await supabase
        .from("component_prices")
        .select("*")
        .eq("is_active", true)
        .order("serial_no", { ascending: true });

      if (error) {
        console.error("❌ Error fetching products:", error);
        throw error;
      }

      console.log(`✅ Loaded ${data?.length || 0} products`);
      const fetchedCategories = (data || [])
        .map((p) => p.category)
        .filter((cat): cat is string => Boolean(cat));

      setCategories(Array.from(new Set([...CATEGORIES, ...fetchedCategories])));
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error: any) {
      console.error("❌ fetchProducts error:", error);
      toast({
        title: "Error loading products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.product_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, products]);

  // Start editing a product
  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Save edited product
  const handleSaveEdit = async (productId: string) => {
    try {
      setSaving(true);

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      // Get old price for history
      const oldPrice = product.price;
      const newPrice = editForm.price || product.price;

      // Update product
      const { error: updateError } = await supabase
        .from("component_prices")
        .update({
          name: editForm.name,
          price: newPrice,
          description: editForm.description,
          category: editForm.category,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId);

      if (updateError) throw updateError;

      // Log price change to history if price changed
      if (oldPrice !== newPrice) {
        const { error: historyError } = await supabase
          .from("price_history")
          .insert({
            product_id: product.product_id,
            old_price: oldPrice,
            new_price: newPrice,
            change_note: "Price updated via Price Manager",
          });

        if (historyError) console.error("History log error:", historyError);
      }

      toast({
        title: "Product updated",
        description: `${editForm.name || product.name} updated successfully`,
      });

      setEditingId(null);
      setEditForm({});
      fetchProducts(); // Refresh list
    } catch (error: any) {
      toast({
        title: "Error updating product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getCategoryPrefix = (category: string) => {
    const normalized = category.trim().toLowerCase();
    const mappedPrefix = CATEGORY_PREFIX_MAP[normalized];

    if (mappedPrefix) {
      return mappedPrefix;
    }

    const fallback = category.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    return (fallback.slice(0, 4) || "PROD").padEnd(3, "X");
  };

  const generateNextProductId = async (category: string) => {
    const trimmedCategory = category.trim();
    const prefix = getCategoryPrefix(trimmedCategory);

    // Serial-wise generation: count active products in selected category, then +1
    const categoryCount = products.filter(
      (product) =>
        product.category.trim().toLowerCase() === trimmedCategory.toLowerCase(),
    ).length;

    const nextSerial = categoryCount + 1;
    const minDigits = Math.max(2, String(nextSerial).length);

    return `${prefix}-${String(nextSerial).padStart(minDigits, "0")}`;
  };

  const autoGenerateProductId = async (category: string) => {
    try {
      const generatedId = await generateNextProductId(category);
      setAddForm((prev) => ({ ...prev, category, product_id: generatedId }));
    } catch (error: any) {
      toast({
        title: "Unable to generate Product ID",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;

    const exists = categories.some(
      (cat) => cat.toLowerCase() === trimmed.toLowerCase(),
    );

    if (exists) {
      toast({
        title: "Category already exists",
        description: `${trimmed} is already available in the list.`,
      });
      return;
    }

    const updated = [...categories, trimmed].sort((a, b) => a.localeCompare(b));
    setCategories(updated);
    setNewCategory("");

    await autoGenerateProductId(trimmed);

    toast({
      title: "Category added",
      description: `${trimmed} added to category list.`,
    });
  };

  const openAddProductDialog = async () => {
    setShowAddDialog(true);
    setNewCategory("");

    const defaultCategory = addForm.category || "Sensor";
    setAddForm((prev) => ({
      ...prev,
      category: defaultCategory,
      price: prev.price ?? 0,
      is_active: true,
    }));

    await autoGenerateProductId(defaultCategory);
  };

  // Add new product
  const handleAddProduct = async () => {
    try {
      if (!addForm.name || !addForm.product_id || !addForm.price) {
        toast({
          title: "Missing fields",
          description:
            "Please fill in all required fields (Product ID, Name, and Price are required)",
          variant: "destructive",
        });
        return;
      }

      // Validate price is greater than 0
      if (addForm.price <= 0) {
        toast({
          title: "Invalid price",
          description: "Price must be greater than 0",
          variant: "destructive",
        });
        return;
      }

      setSaving(true);
      console.log("🔄 Adding new product:", addForm);

      // Get next serial number
      const { data: maxSerial, error: serialError } = await supabase
        .from("component_prices")
        .select("serial_no")
        .order("serial_no", { ascending: false })
        .limit(1);

      if (serialError) {
        console.error("❌ Error fetching serial number:", serialError);
        throw new Error(`Failed to get serial number: ${serialError.message}`);
      }

      const nextSerial =
        maxSerial && maxSerial[0] ? maxSerial[0].serial_no + 1 : 1;

      console.log("📝 Next serial number:", nextSerial);

      const newProduct = {
        product_id: addForm.product_id.trim(),
        serial_no: nextSerial,
        name: addForm.name.trim(),
        category: addForm.category || "Sensor",
        price: addForm.price,
        description: addForm.description?.trim() || "",
        image_url: addForm.image_url?.trim() || "/src/assets/icon/default.png",
        is_active: true,
      };

      console.log("💾 Inserting product:", newProduct);

      const { data, error } = await supabase
        .from("component_prices")
        .insert(newProduct)
        .select();

      if (error) {
        console.error("❌ Insert error:", error);
        throw error;
      }

      console.log("✅ Product added successfully:", data);

      toast({
        title: "✅ Product added successfully!",
        description: `${addForm.name} has been added to the database`,
      });

      setShowAddDialog(false);
      setAddForm({
        category: "Sensor",
        price: 0,
        is_active: true,
      });
      fetchProducts();
    } catch (error: any) {
      console.error("❌ Error in handleAddProduct:", error);

      let errorMessage = error.message;

      // Provide more specific error messages
      if (error.code === "23505") {
        errorMessage = "A product with this Product ID already exists";
      } else if (error.code === "42501") {
        errorMessage =
          "Permission denied. Please check if you're logged in as admin";
      } else if (error.message.includes("JWT")) {
        errorMessage = "Session expired. Please log in again";
      } else if (error.message.includes("category_check")) {
        errorMessage = `Invalid category. Allowed categories are: ${CATEGORIES.join(", ")}. Please run FIX_CATEGORY_CONSTRAINT.sql in Supabase.`;
      } else if (error.message.includes("check constraint")) {
        errorMessage = `Database constraint violation: ${error.message}. Check FIX_CATEGORY_CONSTRAINT.sql for solution.`;
      }

      toast({
        title: "❌ Error adding product",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete product (soft delete)
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from("component_prices")
        .update({
          is_active: false,
          deleted_at: new Date().toISOString(),
        })
        .eq("id", productToDelete.id);

      if (error) throw error;

      toast({
        title: "Product deleted",
        description: `${productToDelete.name} removed from active products`,
      });

      setDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💰 Price Manager
          </CardTitle>
          <CardDescription>
            Manage component prices and product inventory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={openAddProductDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Showing <strong>{filteredProducts.length}</strong> of{" "}
              <strong>{products.length}</strong> products
            </span>
            {categoryFilter !== "all" && (
              <Badge variant="secondary">{categoryFilter}</Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary">Searching: "{searchTerm}"</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[120px]">Category</TableHead>
                  <TableHead className="w-[100px]">Price</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[150px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {searchTerm || categoryFilter !== "all"
                        ? "No products match your filters"
                        : "No products available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      {/* Product ID */}
                      <TableCell className="font-mono text-sm">
                        {product.product_id}
                      </TableCell>

                      {/* Name */}
                      <TableCell>
                        {editingId === product.id ? (
                          <Input
                            value={editForm.name || ""}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="h-8"
                          />
                        ) : (
                          <span className="font-medium">{product.name}</span>
                        )}
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        {editingId === product.id ? (
                          <Select
                            value={editForm.category}
                            onValueChange={(value) =>
                              setEditForm({ ...editForm, category: value })
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline">{product.category}</Badge>
                        )}
                      </TableCell>

                      {/* Price */}
                      <TableCell>
                        {editingId === product.id ? (
                          <Input
                            type="number"
                            value={editForm.price || 0}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                price: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="h-8 w-24"
                            min="0"
                            step="0.01"
                          />
                        ) : (
                          <span className="font-semibold">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </TableCell>

                      {/* Description */}
                      <TableCell>
                        {editingId === product.id ? (
                          <Textarea
                            value={editForm.description || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                description: e.target.value,
                              })
                            }
                            className="min-h-[60px] text-sm"
                            rows={2}
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </span>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        {editingId === product.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(product.id)}
                              disabled={saving}
                            >
                              {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-1" />
                                  Save
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              disabled={saving}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditClick(product)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setProductToDelete(product);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter the details for the new component
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product ID *</label>
                <Input
                  placeholder="e.g. SEN-99"
                  value={addForm.product_id || ""}
                  onChange={(e) =>
                    setAddForm({ ...addForm, product_id: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category *</label>
                <Select
                  value={addForm.category}
                  onValueChange={(value) => autoGenerateProductId(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 pt-2">
                  <Input
                    placeholder="Add new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCategory}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name *</label>
              <Input
                placeholder="e.g. Temperature Sensor (DHT22)"
                value={addForm.name || ""}
                onChange={(e) =>
                  setAddForm({ ...addForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (₹) *</label>
              <Input
                type="number"
                placeholder="0.00"
                value={addForm.price || 0}
                onChange={(e) =>
                  setAddForm({
                    ...addForm,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Product description..."
                value={addForm.description || ""}
                onChange={(e) =>
                  setAddForm({ ...addForm, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                placeholder="/src/assets/icon/sensor.png"
                value={addForm.image_url || ""}
                onChange={(e) =>
                  setAddForm({ ...addForm, image_url: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleAddProduct} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{productToDelete?.name}</strong>? This will remove it from
              the Cost Estimator.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setProductToDelete(null);
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PriceManager;
