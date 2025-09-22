import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Calendar, Clock } from 'lucide-react';

const BlogPost = () => {
  const post = {
    title: 'Optimizing Power Consumption in IoT Devices | Best Strategies for Energy Efficiency',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Power Management',
    content: [
      'Optimizing power consumption in IoT devices is a key factor for building reliable and energy-efficient connected systems. IoT devices like smart sensors, wearables, and industrial monitoring units often run on batteries, so extending battery life is crucial to reduce maintenance costs and ensure uninterrupted operation. The main power consumers in an IoT system are the microcontroller, wireless communication module (Wi-Fi, LoRa, BLE, Zigbee), and sensors. Choosing low-power IoT hardware, enabling deep sleep modes, and using duty cycling help keep devices in an ultra-low-power state most of the time.',
      'Another effective way to save energy is to optimize wireless communication. Reducing transmission frequency, batching data, and using low-power IoT protocols like LoRaWAN or MQTT significantly cut down energy usage. Engineers can also disable unused peripherals, use efficient power regulators, and apply interrupt-driven programming to reduce active time. Smart sensor management—turning sensors on only when needed—further contributes to energy savings.',
      'By combining these strategies and monitoring current draw with power profiling tools, IoT devices can operate for months or even years on a single battery charge. This approach is essential for smart agriculture, remote health monitoring, industrial automation, and other IoT applications where maintenance access is limited and energy efficiency directly impacts performance and cost-effectiveness.'
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-grow">
        <article className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <header className="mb-12">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </header>

              {/* Content */}
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {post.content.map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground text-lg leading-relaxed mb-8">
                    {paragraph}
                  </p>
                ))}
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