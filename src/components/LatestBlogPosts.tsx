import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

const LatestBlogPosts = () => {
  const posts = [
    {
      title: 'Optimizing Power Consumption in IoT Devices',
      excerpt: 'Learn advanced techniques to extend battery life in your embedded systems through smart power management strategies.',
      date: '2024-01-15',
      readTime: '8 min read',
      category: 'Power Management',
    },
    {
      title: 'Secure Firmware Updates Over-The-Air',
      excerpt: 'Implementing robust OTA update mechanisms that ensure security and reliability in production IoT devices.',
      date: '2024-01-08',
      readTime: '12 min read',
      category: 'Security',
    },
    {
      title: 'Building Resilient LoRaWAN Networks',
      excerpt: 'Best practices for designing and deploying reliable long-range wireless sensor networks in challenging environments.',
      date: '2024-01-02',
      readTime: '10 min read',
      category: 'Networking',
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Latest Insights
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay updated with the latest trends, techniques, and best practices 
            in embedded systems and IoT development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => (
            <Card key={index} className="p-6 hover:shadow-medium transition-all duration-300 group cursor-pointer">
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
                  <span>{new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                className="p-0 h-auto text-accent hover:text-accent/80 font-medium"
              >
                Read Article
                <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            View All Articles
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogPosts;