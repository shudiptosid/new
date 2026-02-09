import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  Clock,
  Search,
  BookOpen,
  TrendingUp,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  read_time: string;
  featured: boolean;
  view_count: number;
  created_at: string;
  comment_count?: number;
}

const Blog = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs from database
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
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const blogsWithComments = data?.map((blog: any) => ({
        id: blog.id,
        slug: blog.slug,
        title: blog.title,
        excerpt: blog.excerpt,
        category: blog.category,
        read_time: blog.read_time,
        featured: blog.featured,
        view_count: blog.view_count,
        created_at: blog.created_at,
        comment_count: blog.blog_comments[0]?.count || 0,
      }));

      setPosts(blogsWithComments || []);
    } catch (error: any) {
      console.error("Error fetching blogs:", error);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Debounce search to reduce re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 100);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const categories = [
    "All",
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

  // Filter posts based on selected category and search query
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      {/* Hero Section - Academic & Professional with Circuit Animation */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-slate-800 via-slate-700 to-gray-800 text-white relative overflow-hidden">
        {/* Animated Circuit Background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="circuit"
                x="0"
                y="0"
                width="200"
                height="200"
                patternUnits="userSpaceOnUse"
              >
                {/* Horizontal lines */}
                <line
                  x1="0"
                  y1="50"
                  x2="200"
                  y2="50"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <line
                  x1="0"
                  y1="150"
                  x2="200"
                  y2="150"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                {/* Vertical lines */}
                <line
                  x1="50"
                  y1="0"
                  x2="50"
                  y2="200"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <line
                  x1="150"
                  y1="0"
                  x2="150"
                  y2="200"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                {/* Circuit nodes */}
                <circle cx="50" cy="50" r="4" fill="currentColor" />
                <circle cx="150" cy="50" r="4" fill="currentColor" />
                <circle cx="50" cy="150" r="4" fill="currentColor" />
                <circle cx="150" cy="150" r="4" fill="currentColor" />
                {/* Small components */}
                <rect
                  x="95"
                  y="45"
                  width="10"
                  height="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="45"
                  y="95"
                  width="10"
                  height="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#circuit)"
              className="animate-[slide_60s_linear_infinite]"
            />
          </svg>
        </div>

        {/* Floating Circuit Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-10"
              style={{
                left: `${(i * 20) % 100}%`,
                top: `${(i * 15) % 80}%`,
                animation: `float ${20 + i * 5}s ease-in-out infinite`,
                animationDelay: `${i * 2}s`,
              }}
            >
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="30" cy="30" r="8" stroke="white" strokeWidth="2" />
                <line
                  x1="30"
                  y1="0"
                  x2="30"
                  y2="22"
                  stroke="white"
                  strokeWidth="2"
                />
                <line
                  x1="30"
                  y1="38"
                  x2="30"
                  y2="60"
                  stroke="white"
                  strokeWidth="2"
                />
                <line
                  x1="0"
                  y1="30"
                  x2="22"
                  y2="30"
                  stroke="white"
                  strokeWidth="2"
                />
                <line
                  x1="38"
                  y1="30"
                  x2="60"
                  y2="30"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">
                Technical Knowledge Base
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              IoT & Embedded Systems
              <span className="block text-emerald-300 mt-2">
                Research & Insights
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Comprehensive articles on embedded systems, IoT protocols,
              real-time operating systems, and cutting-edge technologies.
              Written for students, educators, and industry professionals.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>Industry Best Practices</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>Academic Research</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>Practical Tutorials</span>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Animation Keyframes */}
        <style>{`
          @keyframes slide {
            0% { transform: translate(0, 0); }
            100% { transform: translate(100px, 100px); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
        `}</style>
      </section>

      {/* Search and Filter - Clean & Functional */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles by title, topic, or keyword..."
                className="pl-12 pr-4 py-3 text-base border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-lg"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    category === selectedCategory
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-12 flex-grow">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="max-w-2xl mx-auto text-center py-20">
              <p className="text-gray-500">Loading blog posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center py-20">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                No Articles Found
              </h2>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? `No articles match "${searchQuery}". Try different keywords.`
                  : `No articles in ${selectedCategory} category yet.`}
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchInput("");
                  setSearchQuery("");
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {/* Results Info */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === "All"
                    ? "All Articles"
                    : selectedCategory}
                </h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {filteredPosts.length}{" "}
                    {filteredPosts.length === 1 ? "Article" : "Articles"}
                  </span>
                </div>
              </div>

              {/* Grid Layout - 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="group bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-emerald-300"
                  >
                    <div className="p-6">
                      {/* Category & Featured Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                        {post.featured && (
                          <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(post.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.read_time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{post.view_count}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{post.comment_count || 0}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between gap-3">
                        <Link to={`/blog/${post.slug}`} className="flex-1">
                          <Button
                            variant="ghost"
                            className="w-full justify-center text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-semibold text-sm group/btn"
                          >
                            <span className="group-hover/btn:underline">
                              Read Article
                            </span>
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                        <Link to={`/blog/${post.slug}#comments`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-600 hover:text-emerald-600 hover:border-emerald-300"
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {post.comment_count || 0}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
