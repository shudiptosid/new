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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  Download,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
  Search,
  Plus,
  Edit,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface StudyMaterial {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  year: number | null;
  category: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  is_active: boolean;
  download_count: number;
  created_at: string;
}

const CATEGORIES = ["CSE", "ECE", "Mechatronics", "MEC", "General"];

export default function StudyMaterialsManager() {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<StudyMaterial | null>(
    null,
  );

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: "",
    author: "",
    description: "",
    year: "",
    category: "ECE",
    is_active: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch materials
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("study_materials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 30 * 1024 * 1024) {
        // 30MB limit
        toast({
          title: "File too large",
          description: "File size must be less than 30MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  // Upload material
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!uploadForm.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for the material",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // 1. Upload file to Supabase Storage
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}-${uploadForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")}.${fileExt}`;
      const filePath = `${uploadForm.category.toLowerCase()}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("Study Material")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("Study Material").getPublicUrl(filePath);

      // 3. Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 4. Insert metadata into database
      const { error: dbError } = await supabase.from("study_materials").insert({
        title: uploadForm.title.trim(),
        author: uploadForm.author.trim() || null,
        description: uploadForm.description.trim() || null,
        year: uploadForm.year ? parseInt(uploadForm.year) : null,
        category: uploadForm.category,
        file_url: publicUrl,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        is_active: uploadForm.is_active,
        uploaded_by: user?.id,
      });

      if (dbError) throw dbError;

      toast({
        title: "Success!",
        description: "Study material uploaded successfully",
      });

      // Reset form
      setUploadForm({
        title: "",
        author: "",
        description: "",
        year: "",
        category: "ECE",
        is_active: true,
      });
      setSelectedFile(null);
      setShowUploadDialog(false);
      fetchMaterials();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Toggle active status
  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("study_materials")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Updated",
        description: `Material ${!currentStatus ? "activated" : "deactivated"}`,
      });
      fetchMaterials();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Delete material
  const deleteMaterial = async (material: StudyMaterial) => {
    if (
      !confirm(
        `Are you sure you want to delete "${material.title}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      // 1. Delete from storage
      const filePath = material.file_url.split("/Study Material/")[1];
      if (filePath) {
        await supabase.storage.from("Study Material").remove([filePath]);
      }

      // 2. Delete from database
      const { error } = await supabase
        .from("study_materials")
        .delete()
        .eq("id", material.id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Study material deleted successfully",
      });
      fetchMaterials();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Filter materials
  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || material.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Format file size
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Study Materials Manager</h2>
          <p className="text-muted-foreground mt-2">
            Manage PDF study materials for students
          </p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Material
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, author, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Materials ({filteredMaterials.length})</CardTitle>
          <CardDescription>
            Total downloads:{" "}
            {materials.reduce((acc, m) => acc + m.download_count, 0)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No materials found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">
                        {material.title}
                      </TableCell>
                      <TableCell>{material.author || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{material.category}</Badge>
                      </TableCell>
                      <TableCell>{material.year || "N/A"}</TableCell>
                      <TableCell>
                        {formatFileSize(material.file_size)}
                      </TableCell>
                      <TableCell>{material.download_count}</TableCell>
                      <TableCell>
                        <Badge
                          variant={material.is_active ? "default" : "secondary"}
                        >
                          {material.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              toggleActive(material.id, material.is_active)
                            }
                          >
                            {material.is_active ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(material.file_url)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteMaterial(material)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Study Material</DialogTitle>
            <DialogDescription>
              Upload a PDF file and fill in the details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <Label>PDF File *</Label>
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                disabled={uploading}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <Label>Title *</Label>
              <Input
                placeholder="Enter material title"
                value={uploadForm.title}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, title: e.target.value })
                }
                disabled={uploading}
              />
            </div>

            {/* Author */}
            <div>
              <Label>Author</Label>
              <Input
                placeholder="Enter author name"
                value={uploadForm.author}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, author: e.target.value })
                }
                disabled={uploading}
              />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description of the material"
                value={uploadForm.description}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, description: e.target.value })
                }
                disabled={uploading}
                rows={3}
              />
            </div>

            {/* Year & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Year</Label>
                <Input
                  type="number"
                  placeholder="2024"
                  value={uploadForm.year}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, year: e.target.value })
                  }
                  disabled={uploading}
                  min="1900"
                  max="2100"
                />
              </div>
              <div>
                <Label>Category *</Label>
                <Select
                  value={uploadForm.category}
                  onValueChange={(value) =>
                    setUploadForm({ ...uploadForm, category: value })
                  }
                  disabled={uploading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={uploadForm.is_active}
                onCheckedChange={(checked) =>
                  setUploadForm({ ...uploadForm, is_active: checked })
                }
                disabled={uploading}
              />
              <Label>Make material immediately available to students</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUploadDialog(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
