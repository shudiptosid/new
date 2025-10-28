import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchInput, setSearchInput] = useState(""); // Immediate input state
  const [searchQuery, setSearchQuery] = useState(""); // Debounced search state

  // Debounce search to reduce re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchInput]);

  const posts = [
    {
      slug: "power-consumption",
      title: "Optimizing Power Consumption in IoT Devices",
      excerpt:
        "Master power optimization techniques to extend battery life 10-50x. Learn sleep modes, DVFS, low-power protocols, and energy harvesting for sustainable IoT devices.",
      date: "2025-10-15",
      readTime: "14 min read",
      category: "Power Management",
      featured: true,
      available: true,
    },
    {
      slug: "rtos",
      title: "Real-Time Operating Systems (RTOS) for IoT: Complete Guide",
      excerpt:
        "Master RTOS for IoT with FreeRTOS & Zephyr. Learn task scheduling, inter-task communication, code examples, and build production-ready embedded systems.",
      date: "2025-10-08",
      readTime: "16 min read",
      category: "RTOS",
      featured: true,
      available: true,
    },
    {
      slug: "lorawan-networks",
      title: "Building Resilient LoRaWAN Networks",
      excerpt:
        "Best practices for designing and deploying reliable long-range wireless sensor networks in challenging environments and remote locations.",
      date: "2025-09-25",
      readTime: "12 min read",
      category: "Networking",
      featured: true,
      available: true,
    },
    {
      slug: "debugging-embedded",
      title: "Debugging Embedded Systems: A Complete Guide",
      excerpt:
        "Master essential debugging strategies, tools, and methodologies for Arduino, ESP32, and STM32 projects. Learn UART logging, IDE debugging, and hardware troubleshooting.",
      date: "2025-10-12",
      readTime: "15 min read",
      category: "Development",
      featured: true,
      available: true,
    },
    {
      slug: "edge-ai",
      title: "Edge AI on Microcontrollers: TensorFlow Lite Micro Guide",
      excerpt:
        "Run machine learning on ESP32, Arduino, STM32. Master TensorFlow Lite Micro, quantization, model optimization, and deploy AI at the edge with complete examples.",
      date: "2025-09-22",
      readTime: "18 min read",
      category: "AI/ML",
      featured: true,
      available: true,
    },
    {
      slug: "mqtt-protocol",
      title: "MQTT Protocol Deep Dive: Complete Guide for IoT Developers",
      excerpt:
        "Master MQTT messaging protocol for IoT. Learn QoS levels, retained messages, Last Will Testament, broker setup (Mosquitto, HiveMQ), and build production-ready ESP32 applications.",
      date: "2025-10-05",
      readTime: "16 min read",
      category: "Protocols",
      featured: true,
      available: true,
    },
    {
      slug: "iot-security",
      title: "IoT Security Best Practices: Complete Guide for Embedded Systems",
      excerpt:
        "Master IoT security for production devices. Learn secure boot, TLS encryption, secure OTA updates, hardware security modules, authentication, and protect against common vulnerabilities.",
      date: "2025-10-18",
      readTime: "18 min read",
      category: "Security",
      featured: true,
      available: true,
    },
    {
      slug: "ble-basics",
      title:
        "BLE (Bluetooth Low Energy) Basics: Complete Guide for IoT Developers",
      excerpt:
        "Master Bluetooth Low Energy for IoT projects. Learn BLE fundamentals, GATT services, ESP32 implementation, beacons, mobile app integration, and build wireless connected devices.",
      date: "2025-10-02",
      readTime: "16 min read",
      category: "Connectivity",
      featured: true,
      available: true,
    },
    {
      slug: "ota-updates",
      title:
        "OTA Firmware Updates: Secure Over-the-Air Updates for IoT Devices",
      excerpt:
        "Master secure OTA firmware updates for ESP32, Arduino, STM32. Learn version management, rollback protection, delta updates, firmware signing, and deploy updates safely to production.",
      date: "2025-09-28",
      readTime: "17 min read",
      category: "Development",
      featured: true,
      available: true,
    },
    {
      slug: "node-red-dashboards",
      title: "Node-RED IoT Dashboards: Build Real-Time Data Visualization",
      excerpt:
        "Master Node-RED for IoT dashboards. Learn flow-based programming, MQTT integration, dashboard widgets, database storage, ESP32 connectivity, and build production-ready monitoring systems.",
      date: "2025-09-20",
      readTime: "15 min read",
      category: "Visualization",
      featured: true,
      available: true,
    },
    {
      slug: "esp32-usb-driver",
      title: "ESP32/ESP8266 USB Driver Installation: Fix Port Detection Issues",
      excerpt:
        "Fix ESP32/ESP8266 COM port not detected. Install CP2102, CH340, FTDI drivers on Windows, Mac, Linux. Complete troubleshooting guide with all backlinks.",
      date: "2025-10-27",
      readTime: "5 min read",
      category: "Troubleshooting",
      featured: true,
      available: true,
    },
  ];

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

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? "default" : "outline"}
                className={
                  category === selectedCategory
                    ? "bg-accent hover:bg-accent/90"
                    : "hover:bg-accent hover:text-accent-foreground"
                }
                onClick={() => setSelectedCategory(category)}
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
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                No Articles Found
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                {searchQuery
                  ? `No articles match "${searchQuery}"`
                  : `No articles in ${selectedCategory} category yet`}
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="bg-accent hover:bg-accent/90"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              {featuredPosts.length > 0 && (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-foreground">
                      Featured Articles
                    </h2>
                    {selectedCategory !== "All" && (
                      <span className="text-muted-foreground">
                        {featuredPosts.length}{" "}
                        {featuredPosts.length === 1 ? "article" : "articles"}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    {featuredPosts.map((post, index) => (
                      <Card
                        key={index}
                        className={`overflow-hidden transition-all duration-300 group ${
                          post.available
                            ? "hover:shadow-strong cursor-pointer"
                            : "opacity-70"
                        }`}
                      >
                        <div className="p-8">
                          <div className="mb-4 flex justify-between items-center">
                            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                              {post.category}
                            </span>
                            {!post.available && (
                              <span className="text-sm text-muted-foreground">
                                Coming Soon
                              </span>
                            )}
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
                                {new Date(post.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>

                          {post.available ? (
                            <Link to={`/blog/${post.slug}`}>
                              <Button
                                variant="ghost"
                                className="p-0 h-auto text-accent hover:text-accent hover:bg-transparent font-medium text-lg group/btn"
                              >
                                <span className="group-hover/btn:underline">
                                  Read Article
                                </span>
                                <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              variant="ghost"
                              className="p-0 h-auto text-muted-foreground font-medium text-lg cursor-not-allowed"
                              disabled
                            >
                              Coming Soon
                              <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {/* All Articles */}
              {regularPosts.length > 0 && (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-foreground">
                      All Articles
                    </h2>
                    {selectedCategory !== "All" && (
                      <span className="text-muted-foreground">
                        {regularPosts.length}{" "}
                        {regularPosts.length === 1 ? "article" : "articles"}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularPosts.map((post, index) => (
                      <Card
                        key={index}
                        className={`p-6 transition-all duration-300 group ${
                          post.available
                            ? "hover:shadow-medium cursor-pointer"
                            : "opacity-70"
                        }`}
                      >
                        <div className="mb-4 flex justify-between items-center">
                          <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                            {post.category}
                          </span>
                          {!post.available && (
                            <span className="text-sm text-muted-foreground">
                              Coming Soon
                            </span>
                          )}
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

                        {post.available ? (
                          <Link to={`/blog/${post.slug}`}>
                            <Button
                              variant="ghost"
                              className="p-0 h-auto text-accent hover:text-accent/80 font-medium"
                            >
                              Read Article
                              <ArrowRight className="ml-1 w-4 h-4" />
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            variant="ghost"
                            className="p-0 h-auto text-muted-foreground font-medium cursor-not-allowed"
                            disabled
                          >
                            Coming Soon
                            <ArrowRight className="ml-1 w-4 h-4" />
                          </Button>
                        )}
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
