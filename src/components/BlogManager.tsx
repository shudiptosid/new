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
import { Plus, Edit, Trash2, Eye, MessageSquare, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import RichTextEditor from "@/components/RichTextEditor";

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
  keywords?: string[];
  meta_description?: string;
  og_image?: string;
  og_image_alt?: string;
  author_name?: string;
  tags?: string[];
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
  const [keywords, setKeywords] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [tags, setTags] = useState("");

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
      
      // Process SEO fields
      const keywordsArray = keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k);
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      const finalMetaDesc = metaDescription || excerpt.substring(0, 155) + "...";
      const finalOgImage = ogImage || "/default-blog-og-image.jpg";

      const blogData = {
        title,
        slug,
        excerpt,
        content,
        category,
        read_time: readTime,
        featured,
        keywords: keywordsArray.length > 0 ? keywordsArray : [
          "IoT", "Embedded Systems", "Electronics", category
        ],
        meta_description: finalMetaDesc,
        og_image: finalOgImage,
        og_image_alt: `${title} - Circuit Crafters Blog`,
        author_name: "Circuit Crafters Team",
        tags: tagsArray,
      };

      if (editingBlog) {
        // Update existing blog
        const { error } = await supabase
          .from("blogs")
          .update(blogData)
          .eq("id", editingBlog.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Blog updated successfully with SEO optimization",
        });
      } else {
        // Create new blog
        const { error } = await supabase.from("blogs").insert(blogData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Blog created successfully with SEO optimization",
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
    setKeywords(blog.keywords?.join(", ") || "");
    setMetaDescription(blog.meta_description || "");
    setOgImage(blog.og_image || "");
    setTags(blog.tags?.join(", ") || "");
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
    setKeywords("");
    setMetaDescription("");
    setOgImage("");
    setTags("");
    setEditingBlog(null);
    setShowEditor(false);
  };

  // Calculate word count from HTML content
  const getWordCount = (html: string) => {
    const text = html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text ? text.split(/\s+/).length : 0;
  };

  const wordCount = getWordCount(content);

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

            {/* SEO Section */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-bold text-emerald-600">SEO Optimization</h3>
              
              {/* Meta Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Meta Description (SEO)
                </label>
                <Textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Optimized description for search engines (150-160 chars). Leave blank to auto-generate from excerpt."
                  rows={2}
                  className="text-base"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {metaDescription.length}/160 characters • Appears in search results
                </p>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  SEO Keywords
                </label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="IoT, ESP32, Arduino, Sensors, Embedded Systems (comma-separated)"
                  className="text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Add 5-10 relevant keywords separated by commas for better search rankings
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tags
                </label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="tutorial, beginner-friendly, advanced (comma-separated)"
                  className="text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tags help readers find related content
                </p>
              </div>

              {/* OG Image */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Social Media Image (Open Graph)
                </label>
                <Input
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="/images/blog-featured.jpg or https://example.com/image.jpg"
                  className="text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  📱 Image for Facebook, Twitter, LinkedIn previews (1200x630px recommended)
                </p>
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold">
                  Content <span className="text-red-500">*</span>
                </label>
                <span
                  className={`text-sm font-medium ${
                    wordCount > 1500 ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  {wordCount}/1500 words
                </span>
              </div>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Write your blog content here... Use the toolbar for formatting options."
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Use the toolbar to format text, add headings, lists, links,
                images, and more. Maximum 1500 words recommended for optimal
                readability.
              </p>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Mark as Featured Article
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading
                  ? "Saving..."
                  : editingBlog
                    ? "Update Blog"
                    : "Publish Blog"}
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
