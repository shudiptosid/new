import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Share2, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { SEO } from "../components/SEO";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

// Helper function to parse markdown links
const parseMarkdownLinks = (text: string) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const linkText = match[1];
    const url = match[2];
    const isExternal = url.startsWith("http");
    parts.push(
      <a
        key={match.index}
        href={url}
        target={isExternal ? "_blank" : "_self"}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-accent hover:text-accent/80 underline decoration-accent/50 hover:decoration-accent font-medium transition-colors inline-flex items-center gap-1"
      >
        {linkText}
        {isExternal && <ExternalLink className="w-3 h-3" />}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts.length > 0 ? parts : text;
};

const parseContent = (text: string) => {
  const inlineCodeRegex = /`([^`]+)`/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = inlineCodeRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
      const linkParts = parseMarkdownLinks(beforeText);
      if (Array.isArray(linkParts)) {
        parts.push(...linkParts);
      } else {
        parts.push(linkParts);
      }
    }
    parts.push(
      <code
        key={`code-${match.index}`}
        className="px-2 py-1 bg-accent/10 dark:bg-accent/20 text-accent border border-accent/20 rounded text-sm font-mono"
      >
        {match[1]}
      </code>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    const linkParts = parseMarkdownLinks(remainingText);
    if (Array.isArray(linkParts)) {
      parts.push(...linkParts);
    } else {
      parts.push(linkParts);
    }
  }
  return parts.length > 0 ? parts : parseMarkdownLinks(text);
};

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  view_count: number;
  created_at: string;
  keywords?: string[];
  meta_description?: string;
  og_image?: string;
  og_image_alt?: string;
  author_name?: string;
  tags?: string[];
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastUpdateRef = useRef(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) {
        navigate("/blog");
        return;
      }

      try {
        setLoading(true);

        // Fetch article from database
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("slug", slug)
          .eq("is_active", true)
          .single();

        if (error) throw error;

        if (data) {
          // Increment view count
          await supabase
            .from("blogs")
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq("id", data.id);

          setPost(data);
        } else {
          toast({
            title: "Article not found",
            description: "The article you're looking for doesn't exist.",
            variant: "destructive",
          });
          navigate("/blog");
        }
      } catch (error: any) {
        console.error("Error fetching article:", error);
        toast({
          title: "Error",
          description: "Failed to load article",
          variant: "destructive",
        });
        navigate("/blog");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, navigate, toast]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const now = Date.now();
        if (now - lastUpdateRef.current < 66) return;

        lastUpdateRef.current = now;
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        setScrollProgress(progress);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleShare = useCallback(
    (platform: string) => {
      if (!post) return;

      const url = window.location.href;
      const title = post.title;
      const shareUrls: Record<string, string> = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title,
        )}&url=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url,
        )}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(
          title + " " + url,
        )}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url,
        )}`,
      };
      if (shareUrls[platform]) {
        window.open(shareUrls[platform], "_blank", "width=600,height=400");
      }
    },
    [post],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Article Not Found</h1>
            <p className="text-muted-foreground">
              The article you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/blog")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Split content into paragraphs
  const contentParagraphs = post.content.split("\n\n");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={post.title}
        description={post.meta_description || post.excerpt}
        keywords={post.keywords || ["IoT", "Electronics", "Embedded Systems", post.category]}
        type="article"
        publishedTime={post.created_at}
        category={post.category}
        image={post.og_image || "/default-blog-og-image.jpg"}
        author={post.author_name || "Circuit Crafters Team"}
      />
      <Navigation />

      {/* Progress Indicator */}
      <div className="fixed bottom-8 right-8 z-50 hidden md:block">
        <div className="relative w-28 h-28 group cursor-pointer">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-purple-600 blur-2xl opacity-60 animate-pulse"></div>
          <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-full shadow-2xl border-4 border-white dark:border-gray-800"></div>
          <svg
            className="absolute inset-0 w-28 h-28 transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - scrollProgress / 100)}`}
              className="transition-all duration-300 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
              {Math.round(scrollProgress)}%
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 pt-20">
        <article className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12">
            <div className="mb-8">
              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={() => navigate("/blog")}
                className="mb-6 hover:bg-accent/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>

              <header className="mb-12">
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-accent/10 text-accent text-sm font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-snug text-foreground">
                  {post.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.read_time}</span>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="mt-6 pt-6 border-t flex items-center gap-3">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share:
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleShare("twitter")}
                      variant="outline"
                      size="sm"
                    >
                      Twitter
                    </Button>
                    <Button
                      onClick={() => handleShare("linkedin")}
                      variant="outline"
                      size="sm"
                    >
                      LinkedIn
                    </Button>
                    <Button
                      onClick={() => handleShare("whatsapp")}
                      variant="outline"
                      size="sm"
                    >
                      WhatsApp
                    </Button>
                    <Button
                      onClick={() => handleShare("facebook")}
                      variant="outline"
                      size="sm"
                    >
                      Facebook
                    </Button>
                  </div>
                </div>
              </header>

              {/* Article Content */}
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {contentParagraphs.map((paragraph, index) => {
                  // Check if paragraph contains code block
                  const codeBlockMatch = paragraph.match(
                    /```(\w+)?\n([\s\S]*?)```/,
                  );

                  if (codeBlockMatch) {
                    const language = codeBlockMatch[1] || "text";
                    const code = codeBlockMatch[2];
                    const beforeCode = paragraph.substring(
                      0,
                      codeBlockMatch.index,
                    );
                    const afterCode = paragraph.substring(
                      codeBlockMatch.index! + codeBlockMatch[0].length,
                    );

                    return (
                      <div key={index} className="mb-6">
                        {beforeCode && (
                          <div className="mb-4">
                            {beforeCode.split("\n").map((line, lineIdx) => (
                              <p
                                key={lineIdx}
                                className={
                                  line.startsWith("•") ? "pl-6 my-1" : "mb-2"
                                }
                              >
                                {parseContent(line)}
                              </p>
                            ))}
                          </div>
                        )}
                        <div className="my-6 rounded-lg overflow-hidden border border-gray-700 shadow-2xl">
                          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 flex items-center justify-between border-b border-gray-700">
                            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                              {language}
                            </span>
                            <div className="flex gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                          </div>
                          <pre className="bg-[#1e1e1e] p-6 overflow-x-auto">
                            <code className="text-sm font-mono leading-relaxed text-[#d4d4d4]">
                              {code}
                            </code>
                          </pre>
                        </div>
                        {afterCode && (
                          <div className="mt-4">
                            {afterCode.split("\n").map((line, lineIdx) => (
                              <p
                                key={lineIdx}
                                className={
                                  line.startsWith("•") ? "pl-6 my-1" : "mb-2"
                                }
                              >
                                {parseContent(line)}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Regular paragraph without code block
                  return (
                    <div key={index} className="mb-6">
                      {paragraph.split("\n").map((line, lineIdx) => {
                        if (line.startsWith("```")) {
                          return null;
                        }

                        // Check if this is a heading (starts with ##)
                        if (line.startsWith("## ")) {
                          return (
                            <div
                              key={lineIdx}
                              className="bg-gradient-to-r from-accent/10 to-purple-600/10 border-l-4 border-accent px-6 py-4 rounded-lg mb-4 shadow-md"
                            >
                              <h2 className="text-2xl font-bold text-accent">
                                {line.substring(3)}
                              </h2>
                            </div>
                          );
                        }

                        // Check if this is a subheading (starts with ###)
                        if (line.startsWith("### ")) {
                          return (
                            <h3
                              key={lineIdx}
                              className="text-xl font-semibold text-foreground mt-6 mb-3"
                            >
                              {line.substring(4)}
                            </h3>
                          );
                        }

                        // Check for bold text (**text**)
                        const boldRegex = /\*\*(.*?)\*\*/g;
                        if (boldRegex.test(line)) {
                          return (
                            <p key={lineIdx} className="mb-2">
                              {line.split(boldRegex).map((part, i) =>
                                i % 2 === 1 ? (
                                  <strong key={i} className="font-bold">
                                    {part}
                                  </strong>
                                ) : (
                                  parseContent(part)
                                ),
                              )}
                            </p>
                          );
                        }

                        // Check for italic text (*text*)
                        const italicRegex = /\*(.*?)\*/g;
                        if (italicRegex.test(line)) {
                          return (
                            <p key={lineIdx} className="mb-2">
                              {line.split(italicRegex).map((part, i) =>
                                i % 2 === 1 ? (
                                  <em key={i} className="italic">
                                    {part}
                                  </em>
                                ) : (
                                  parseContent(part)
                                ),
                              )}
                            </p>
                          );
                        }

                        return (
                          <p
                            key={lineIdx}
                            className={
                              line.startsWith("•") ? "pl-6 my-1" : "mb-2"
                            }
                          >
                            {parseContent(line)}
                          </p>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
