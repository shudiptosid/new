import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import BlogPostDialog from "./BlogPostDialog";

const LatestBlogPosts = () => {
  const [showBlogPost, setShowBlogPost] = useState(false);
  const posts = [
    {
      title: "Optimizing Power Consumption in IoT Devices",
      excerpt:
        "Learn advanced techniques to extend battery life in your embedded systems through smart power management strategies.",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "Power Management",
    },
    {
      title: "Secure Firmware Updates Over-The-Air",
      excerpt:
        "Implementing robust OTA update mechanisms that ensure security and reliability in production IoT devices.",
      date: "2024-01-08",
      readTime: "12 min read",
      category: "Security",
    },
    {
      title: "Building Resilient LoRaWAN Networks",
      excerpt:
        "Best practices for designing and deploying reliable long-range wireless sensor networks in challenging environments.",
      date: "2024-01-02",
      readTime: "10 min read",
      category: "Networking",
    },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-accent" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Latest Insights
            </h2>
          </div>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
            Stay updated with the latest trends, techniques, and best practices
            in embedded systems and IoT development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {posts.map((post, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-medium transition-all duration-300 group cursor-pointer h-full flex flex-col"
            >
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                  {post.category}
                </span>
              </div>

              <h3 className="text-lg md:text-xl font-semibold mb-3 text-foreground group-hover:text-accent transition-colors leading-tight flex-grow">
                {post.title}
              </h3>

              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <button
                onClick={() => index === 0 && setShowBlogPost(true)}
                className="text-accent hover:text-accent/80 font-medium text-sm group/link flex items-center gap-1 w-fit"
              >
                Read Article
                <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
              </button>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/blog">
            <Button
              variant="outline"
              size="lg"
              className="px-6 sm:px-8 py-4 text-base sm:text-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
            >
              View All Articles
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      <BlogPostDialog open={showBlogPost} onOpenChange={setShowBlogPost} />
    </section>
  );
};

export default LatestBlogPosts;
