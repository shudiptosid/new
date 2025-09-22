import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Blog = () => {
  const posts = [
    {
      title: "Optimizing Power Consumption in IoT Devices",
      excerpt:
        "Learn advanced techniques to extend battery life in your embedded systems through smart power management strategies and low-power design patterns.",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "Power Management",
      featured: true,
    },
    {
      title: "Secure Firmware Updates Over-The-Air",
      excerpt:
        "Implementing robust OTA update mechanisms that ensure security and reliability in production IoT devices while maintaining system integrity.",
      date: "2024-01-08",
      readTime: "12 min read",
      category: "Security",
      featured: true,
    },
    {
      title: "Building Resilient LoRaWAN Networks",
      excerpt:
        "Best practices for designing and deploying reliable long-range wireless sensor networks in challenging environments and remote locations.",
      date: "2024-01-02",
      readTime: "10 min read",
      category: "Networking",
      featured: false,
    },
    {
      title: "Real-Time Operating Systems for Embedded Applications",
      excerpt:
        "Choosing and implementing the right RTOS for your project: FreeRTOS, Zephyr, and custom solutions compared.",
      date: "2023-12-20",
      readTime: "15 min read",
      category: "RTOS",
      featured: false,
    },
    {
      title: "Debugging Embedded Systems: Tools and Techniques",
      excerpt:
        "Essential debugging strategies, tools, and methodologies for efficient embedded systems development and troubleshooting.",
      date: "2023-12-15",
      readTime: "11 min read",
      category: "Development",
      featured: false,
    },
    {
      title: "Edge AI: Implementing Machine Learning on MCUs",
      excerpt:
        "Bringing artificial intelligence to resource-constrained microcontrollers: TensorFlow Lite Micro and optimization techniques.",
      date: "2023-12-10",
      readTime: "14 min read",
      category: "AI/ML",
      featured: false,
    },
  ];

  const categories = [
    "All",
    "Power Management",
    "Security",
    "Networking",
    "RTOS",
    "Development",
    "AI/ML",
  ];
  const featuredPosts = posts.filter((post) => post.featured);
  const regularPosts = posts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-surface-elevated mb-6">
              Technical
              <span className="text-accent"> Insights</span>
            </h1>
            <p className="text-xl text-surface-elevated/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              In-depth articles on embedded systems, IoT development, and
              emerging technologies in the world of connected devices.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={
                  category === "All"
                    ? "bg-accent hover:bg-accent/90"
                    : "hover:bg-accent hover:text-accent-foreground"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-20 flex-grow">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Featured Articles
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {featuredPosts.map((post, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-strong transition-all duration-300 group cursor-pointer"
              >
                <div className="p-8">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-semibold mb-4 text-foreground group-hover:text-accent transition-colors leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="p-0 h-auto text-accent hover:text-accent/80 font-medium text-lg"
                  >
                    Read Article
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* All Articles */}
          <h2 className="text-3xl font-bold text-foreground mb-8">
            All Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-medium transition-all duration-300 group cursor-pointer"
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                    {post.category}
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-accent transition-colors leading-tight">
                  {post.title}
                </h3>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <Link to={index === 0 ? "/blog/power-consumption" : "/blog"}>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto text-accent hover:text-accent/80 font-medium"
                  >
                    Read Article
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
