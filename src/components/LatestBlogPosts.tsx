import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  Clock,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import BlogPostDialog from "./BlogPostDialog";

const AUTO_SCROLL_DELAY = 2200;

const posts = [
  {
    title: "Optimizing Power Consumption in IoT Devices",
    excerpt:
      "Learn advanced techniques to extend battery life in your embedded systems through smart power management strategies.",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Power Management",
    color: "from-emerald-500 to-teal-600",
    isFirst: true,
  },
  {
    title: "Secure Firmware Updates Over-The-Air",
    excerpt:
      "Implementing robust OTA update mechanisms that ensure security and reliability in production IoT devices.",
    date: "2024-01-08",
    readTime: "12 min read",
    category: "Security",
    color: "from-blue-500 to-indigo-600",
    isFirst: false,
  },
  {
    title: "Building Resilient LoRaWAN Networks",
    excerpt:
      "Best practices for designing and deploying reliable long-range wireless sensor networks in challenging environments.",
    date: "2024-01-02",
    readTime: "10 min read",
    category: "Networking",
    color: "from-violet-500 to-purple-600",
    isFirst: false,
  },
  {
    title: "MQTT Protocol Deep Dive for IoT",
    excerpt:
      "A comprehensive guide to using MQTT for lightweight messaging in constrained IoT environments, including QoS levels and broker configuration.",
    date: "2023-12-20",
    readTime: "9 min read",
    category: "Protocols",
    color: "from-orange-500 to-amber-600",
    isFirst: false,
  },
  {
    title: "Edge AI with TensorFlow Lite on ESP32",
    excerpt:
      "Deploying machine learning models directly on microcontrollers for real-time intelligent sensing without cloud dependency.",
    date: "2023-12-10",
    readTime: "14 min read",
    category: "AI/ML",
    color: "from-rose-500 to-pink-600",
    isFirst: false,
  },
];

const LatestBlogPosts = () => {
  const [showBlogPost, setShowBlogPost] = useState(false);
  const [selectedSnap, setSelectedSnap] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps",
  });

  // Track selected dot
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedSnap(emblaApi.selectedScrollSnap());
    const onInit = () => {
      setSnapCount(emblaApi.scrollSnapList().length);
      onSelect();
    };
    onInit();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onInit);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onInit);
    };
  }, [emblaApi]);

  // Auto-slide every 2.2s
  useEffect(() => {
    if (!emblaApi) return;
    const autoPlay = setInterval(() => {
      emblaApi.scrollNext();
    }, AUTO_SCROLL_DELAY);
    return () => clearInterval(autoPlay);
  }, [emblaApi]);

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* Heading + Arrows Row */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-accent" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Latest Insights
            </h2>
          </div>
          <p className="text-base md:text-lg text-white/90 font-medium max-w-3xl mx-auto mt-4">
            Stay updated with the latest trends, techniques, and best practices
            in embedded systems and IoT development.
          </p>

          {/* Arrow buttons — same style as CustomerReviewsCarousel */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 px-4 bg-white/90 border-white/70 hover:bg-white"
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 px-4 bg-white/90 border-white/70 hover:bg-white"
              onClick={() => emblaApi?.scrollNext()}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Embla Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -mx-2">
            {posts.map((post, index) => (
              <div
                key={index}
                className="shrink-0 grow-0 basis-full md:basis-1/3 min-w-0 px-2"
              >
                <Card className="p-6 flex flex-col shadow-lg h-full bg-white/95 backdrop-blur-sm border-white/70 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden relative">
                  {/* Top colour strip */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${post.color}`}
                  />

                  <div className="mb-4 mt-1">
                    <span
                      className={`inline-block px-3 py-1 text-white text-xs font-semibold rounded-full bg-gradient-to-r ${post.color}`}
                    >
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight flex-grow">
                    {post.title}
                  </h3>

                  <p className="text-gray-500 mb-4 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4 pb-4 border-b border-gray-100">
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
                    onClick={() => post.isFirst && setShowBlogPost(true)}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1 w-fit transition-colors"
                  >
                    Read Article
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: snapCount }).map((_, index) => (
            <button
              key={`blog-dot-${index}`}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-200 ${selectedSnap === index
                  ? "w-6 bg-accent scale-110"
                  : "w-2 bg-white/70 hover:bg-white"
                }`}
            />
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
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
