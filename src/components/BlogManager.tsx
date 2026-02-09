import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Save,
  X,
  Bold,
  Italic,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  featured: boolean;
  is_active: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  comment_count?: number;
}

const BlogManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);

  const categories = [
    "Power Management",
    "Protocols",
    "Security",
    "Connectivity",
    "Networking",
    "Visualization",
    "RTOS",
    "Development",
    "AI/ML",
    "Tutorials",
    "Projects",
    "Sensors",
    "Hardware",
    "Troubleshooting",
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select(
          `
          *,
          blog_comments(count)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const blogsWithComments = data?.map((blog: any) => ({
        ...blog,
        comment_count: blog.blog_comments[0]?.count || 0,
      }));

      setBlogs(blogsWithComments || []);
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleSave = async () => {
    if (!title || !excerpt || !content || !category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Word limit check
    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount > 1500) {
      toast({
        title: "Word Limit Exceeded",
        description: `Content has ${wordCount} words. Maximum is 1500 words.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const slug = generateSlug(title);
      const readTime = calculateReadTime(content);

      if (editingBlog) {
        // Update existing blog
        const { error } = await supabase
          .from("blogs")
          .update({
            title,
            slug,
            excerpt,
            content,
            category,
            read_time: readTime,
            featured,
          })
          .eq("id", editingBlog.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Blog updated successfully",
        });
      } else {
        // Create new blog
        const { error } = await supabase.from("blogs").insert({
          title,
          slug,
          excerpt,
          content,
          category,
          read_time: readTime,
          featured,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Blog created successfully",
        });
      }

      resetForm();
      fetchBlogs();
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

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setCategory(blog.category);
    setFeatured(blog.featured);
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const { error } = await supabase.from("blogs").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog deleted successfully",
      });

      fetchBlogs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setCategory("");
    setFeatured(false);
    setEditingBlog(null);
    setShowEditor(false);
  };

  const applyFormatting = (format: "bold" | "italic") => {
    const textarea = document.getElementById(
      "blog-content",
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    if (!selectedText) {
      toast({
        title: "Select Text",
        description: "Please select text to format",
        variant: "destructive",
      });
      return;
    }

    let formattedText = "";
    if (format === "bold") {
      formattedText = `**${selectedText}**`;
    } else if (format === "italic") {
      formattedText = `*${selectedText}*`;
    }

    const newContent =
      content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
  };

  const wordCount = content.trim().split(/\s+/).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Blog Manager</h1>
        <Button
          onClick={() => setShowEditor(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Blog
        </Button>
      </div>

      {showEditor ? (
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {editingBlog ? "Edit Blog" : "Create New Blog"}
            </h2>
            <Button variant="ghost" onClick={resetForm}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
                className="text-base"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Excerpt <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the blog (shown in listings)"
                rows={3}
                className="text-base"
              />
            </div>

            {/* Content Editor */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold">
                  Content <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyFormatting("bold")}
                    title="Bold (select text first)"
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyFormatting("italic")}
                    title="Italic (select text first)"
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <span
                    className={`text-sm font-medium ${
                      wordCount > 1500 ? "text-red-500" : "text-gray-600"
                    }`}
                  >
                    {wordCount}/1500 words
                  </span>
                </div>
              </div>
              <Textarea
                id="blog-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog content here (max 1500 words)..."
                rows={15}
                className="text-base font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formatting: **bold text**, *italic text*
              </p>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Mark as Featured
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={loading || wordCount > 1500}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingBlog ? "Update Blog" : "Publish Blog"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Blogs List */}
      <div className="space-y-4">
        {loading && !showEditor ? (
          <p className="text-center text-gray-500 py-8">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">
              No blogs yet. Create your first blog post!
            </p>
          </Card>
        ) : (
          blogs.map((blog) => (
            <Card key={blog.id} className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                      {blog.category}
                    </span>
                    {blog.featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{blog.view_count} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{blog.comment_count || 0} comments</span>
                    </div>
                    <span>{blog.read_time}</span>
                    <span>
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(blog)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(blog.id)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogManager;
