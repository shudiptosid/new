import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Share2, Bookmark } from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams();

  // Mock blog post data - in a real app, this would come from an API
  const blogPosts = {
    'optimizing-power-consumption-iot': {
      title: 'Optimizing Power Consumption in IoT Devices',
      content: `
        <p class="text-lg mb-6">Power management is one of the most critical aspects of IoT device design. With battery-powered devices expected to operate for months or even years on a single charge, engineers must employ sophisticated power optimization strategies to meet these demanding requirements.</p>

        <h2 class="text-2xl font-semibold mb-4 text-foreground">Understanding Power Consumption Patterns</h2>
        <p class="mb-4">IoT devices typically operate in different power states throughout their lifecycle. Understanding these states is crucial for effective power management:</p>
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li><strong>Active Mode:</strong> Full operation with all peripherals running</li>
          <li><strong>Sleep Mode:</strong> Minimal power consumption while maintaining memory state</li>
          <li><strong>Deep Sleep:</strong> Ultra-low power mode with limited wake-up sources</li>
          <li><strong>Shutdown:</strong> Complete power-off state</li>
        </ul>

        <h2 class="text-2xl font-semibold mb-4 text-foreground">Power Management Strategies</h2>
        <p class="mb-4">Implementing effective power management requires a multi-layered approach:</p>

        <h3 class="text-xl font-medium mb-3 text-foreground">1. Hardware-Level Optimization</h3>
        <p class="mb-4">Start with selecting the right microcontroller and components. Modern MCUs offer multiple power domains and can shut down unused peripherals automatically. Consider:</p>
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li>Low-power MCUs with multiple sleep modes</li>
          <li>Efficient voltage regulators with low quiescent current</li>
          <li>Power gating for unused circuit blocks</li>
          <li>Clock gating and frequency scaling</li>
        </ul>

        <h3 class="text-xl font-medium mb-3 text-foreground">2. Software Optimization</h3>
        <p class="mb-4">Software plays a crucial role in power management. Key techniques include:</p>
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li>Efficient algorithms that minimize computation time</li>
          <li>Interrupt-driven programming to avoid polling</li>
          <li>Dynamic frequency and voltage scaling (DVFS)</li>
          <li>Proper use of sleep modes and wake-up sources</li>
        </ul>

        <h3 class="text-xl font-medium mb-3 text-foreground">3. Communication Protocol Optimization</h3>
        <p class="mb-4">Wireless communication is often the biggest power consumer. Optimize by:</p>
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li>Choosing energy-efficient protocols (e.g., LoRaWAN, Zigbee)</li>
          <li>Implementing duty cycling for periodic transmissions</li>
          <li>Using adaptive transmission power based on signal strength</li>
          <li>Employing data compression to reduce transmission time</li>
        </ul>

        <h2 class="text-2xl font-semibold mb-4 text-foreground">Advanced Power Management Techniques</h2>

        <h3 class="text-xl font-medium mb-3 text-foreground">Energy Harvesting</h3>
        <p class="mb-4">For long-term deployments, consider energy harvesting from environmental sources:</p>
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li>Solar panels for outdoor applications</li>
          <li>Vibration energy harvesters for moving equipment</li>
          <li>Thermoelectric generators for temperature differentials</li>
          <li>RF energy harvesting for low-power applications</li>
        </ul>

        <h3 class="text-xl font-medium mb-3 text-foreground">Predictive Power Management</h3>
        <p class="mb-4">Use machine learning algorithms to predict usage patterns and optimize power consumption accordingly. This can include:</p>
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li>Learning user behavior patterns</li>
          <li>Predicting environmental conditions</li>
          <li>Optimizing sampling rates based on data value</li>
          <li>Dynamic adjustment of communication intervals</li>
        </ul>

        <h2 class="text-2xl font-semibold mb-4 text-foreground">Measurement and Validation</h2>
        <p class="mb-4">Accurate power measurement is essential for optimization:</p>
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li>Use precision current measurement tools</li>
          <li>Implement runtime power monitoring</li>
          <li>Profile different operational modes</li>
          <li>Validate theoretical calculations with real measurements</li>
        </ul>

        <h2 class="text-2xl font-semibold mb-4 text-foreground">Conclusion</h2>
        <p class="mb-4">Power optimization in IoT devices requires a holistic approach combining hardware selection, software optimization, and intelligent power management algorithms. By implementing these strategies, developers can significantly extend battery life and improve the overall user experience of their IoT solutions.</p>
        <p>Remember that power optimization is an iterative process. Start with the biggest power consumers and work your way down, always validating your improvements with actual measurements.</p>
      `,
      date: '2024-01-15',
      readTime: '8 min read',
      category: 'Power Management',
      author: 'Shudipto Gain',
      tags: ['IoT', 'Power Management', 'Embedded Systems', 'Energy Efficiency']
    },
    'secure-firmware-updates-ota': {
      title: 'Secure Firmware Updates Over-The-Air',
      content: `
        <p class="text-lg mb-6">Over-the-air (OTA) firmware updates are essential for maintaining IoT devices in the field, but they introduce significant security challenges. This article explores best practices for implementing secure OTA update mechanisms that protect against various attack vectors while ensuring reliable deployment.</p>

        <h2 class="text-2xl font-semibold mb-4 text-foreground">Security Challenges in OTA Updates</h2>
        <p class="mb-4">OTA updates face several security threats:</p>
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li><strong>Man-in-the-middle attacks:</strong> Intercepting and modifying firmware</li>
          <li><strong>Replay attacks:</strong> Reusing old firmware versions</li>
          <li><strong>Downgrade attacks:</strong> Forcing installation of vulnerable versions</li>
          <li><strong>Denial of service:</strong> Disrupting the update process</li>
        </ul>

        <h2 class="text-2xl font-semibold mb-4 text-foreground">Cryptographic Foundations</h2>
        <p class="mb-4">Secure OTA updates rely on strong cryptographic primitives:</p>

        <h3 class="text-xl font-medium mb-3 text-foreground">Digital Signatures</h3>
        <p class="mb-4">Every firmware image should be digitally signed using industry-standard algorithms:</p>
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li>RSA with PKCS#1 v2.1 (minimum 2048-bit keys)</li>
          <li>ECDSA with P-256 or higher curves</li>
          <li>EdDSA (Ed25519) for compact signatures</li>
        </ul>

        <h3 class="text-xl font-medium mb-3 text-foreground">Secure Boot Integration</h3>
        <p class="mb-4">OTA updates should integrate with the device's secure boot process:</p>
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li>Verify signatures during boot process</li>
          <li>Maintain a root of trust in hardware</li>
          <li>Implement rollback protection</li>
          <li>Use verified boot for critical system components</li>
        </ul>

        <h2 class="text-2xl font-semibold mb-4 text-foreground">Update Delivery Mechanisms</h2>

        <h3 class="text-xl font-medium mb-3 text-foreground">Transport Security</h3>
        <p class="mb-4">Secure the communication channel:</p>
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li>Use TLS 1.3 for all communications</li>
          <li>Implement certificate pinning</li>
          <li>Validate server certificates against trusted CAs</li>
          <li>Use mutual authentication when possible</li>
        </ul>

        <h3 class="text-xl font-medium mb-3 text-foreground">Delta Updates</h3>
        <p class="mb-4">Minimize bandwidth and reduce attack surface:</p>
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li>Generate binary diffs between firmware versions</li>
          <li>Sign delta patches separately</li>
          <li>Verify integrity of both source and target versions</li>
          <li>Implement atomic updates to prevent partial installations</li>
        </ul>

        <h2 class="text-2xl font-semibold mb-4 text-foreground">Implementation Best Practices</h2>

        <h3 class="text-xl font-medium mb-3 text-foreground">Dual Boot Architecture</h3>
        <p class="mb-4">Implement a robust update mechanism:</p>
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li>Maintain two firmware slots (active and inactive)</li>
          <li>Download updates to inactive slot</li>
          <li>Verify integrity before switching</li>
          <li>Implement automatic rollback on boot failure</li>
        </ul>

        <h3 class="text-xl font-medium mb-3 text-foreground">Version Management</h3>
        <p class="mb-4">Proper version control prevents attacks:</p>
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li>Use monotonic version numbers</li>
          <li>Implement anti-rollback protection</li>
          <li>Maintain version history in tamper-resistant storage</li>
          <li>Support emergency recovery procedures</li>
        </ul>

        <h2 class="text-2xl font-semibold mb-4 text-foreground">Testing and Validation</h2>
        <p class="mb-4">Comprehensive testing is crucial for secure OTA implementations:</p>
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li>Test update process under various network conditions</li>
          <li>Validate behavior during power interruptions</li>
          <li>Perform security testing with invalid signatures</li>
          <li>Test rollback mechanisms and recovery procedures</li>
        </ul>

        <h2 class="text-2xl font-semibold mb-4 text-foreground">Monitoring and Incident Response</h2>
        <p class="mb-4">Implement comprehensive monitoring:</p>
        <ul class="list-disc list-inside mb-6 space-y-2">
          <li>Track update success/failure rates</li>
          <li>Monitor for unusual update patterns</li>
          <li>Implement emergency update kill switches</li>
          <li>Maintain audit logs for compliance</li>
        </ul>

        <h2 class="text-2xl font-semibold mb-4 text-foreground">Conclusion</h2>
        <p class="mb-4">Secure OTA updates require careful attention to cryptographic details, robust implementation practices, and comprehensive testing. By following these guidelines, developers can create update systems that maintain security while providing the flexibility needed for modern IoT deployments.</p>
        <p>Remember that security is an ongoing process - regularly review and update your OTA implementation to address emerging threats and incorporate new security technologies.</p>
      `,
      date: '2024-01-08',
      readTime: '12 min read',
      category: 'Security',
      author: 'Shudipto Gain',
      tags: ['Security', 'OTA Updates', 'Firmware', 'Cryptography', 'IoT']
    }
  };

  // Get the blog post based on slug
  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog">
              <Button variant="ghost" className="mb-6 text-surface-elevated/80 hover:text-surface-elevated">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Blog
              </Button>
            </Link>

            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-sm font-medium rounded-full">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-surface-elevated mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between text-surface-elevated/80 mb-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-surface-elevated/80 hover:text-surface-elevated">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-surface-elevated/80 hover:text-surface-elevated">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <p className="text-lg text-surface-elevated/80">
              By {post.author}
            </p>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div
              className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-a:text-accent prose-strong:text-foreground prose-ul:text-foreground prose-li:text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-surface text-foreground text-sm rounded-full border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-12 pt-8 border-t border-border">
              <Link to="/blog">
                <Button>
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back to All Articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogDetail;