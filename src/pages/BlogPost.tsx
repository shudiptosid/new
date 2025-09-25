import { useLocation } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

interface Article {
  title: string;
  category: string;
  date: string;
  readTime: string;
  content: string[];
}

const articles: Record<string, Article> = {
  "power-consumption": {
    title:
      "Optimizing Power Consumption in IoT Devices | Best Strategies for Energy Efficiency",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Power Management",
    content: [
      `Learn advanced techniques to extend battery life in your embedded systems through smart power management strategies and low-power design patterns.

The Internet of Things (IoT) has transformed how we interact with technology, enabling smart homes, industrial automation, healthcare monitoring, and more. However, one of the biggest challenges for IoT developers is power consumption. Most IoT devices run on batteries, and inefficient power management can drastically reduce their lifespan, increase maintenance costs, and compromise user experience.

In this article, we'll explore proven techniques to reduce power consumption in IoT devices, improve battery life, and make your embedded systems more energy-efficient.`,
      `Why Power Optimization is Crucial in IoT

IoT devices often operate in remote locations or compact enclosures where frequent charging or battery replacement is not practical. Optimizing power consumption helps:

• Extend battery life – reducing maintenance costs
• Enable continuous monitoring – ensuring devices stay online longer
• Improve user satisfaction – fewer interruptions and better reliability
• Support scalability – deploy large networks of devices without worrying about frequent servicing`,
      `1. Choose Low-Power Hardware

Selecting the right microcontroller (MCU) and sensors is the first step in designing an energy-efficient IoT system.

• Low-power MCUs – Look for chips with sleep modes and ultra-low current consumption (e.g., STM32L, ESP32-C3, or Nordic nRF52 series).
• Efficient sensors – Choose sensors with built-in power-saving modes and fast wake-up times.
• Power-efficient communication modules – Opt for LoRa, Zigbee, or NB-IoT for long-range, low-power communication.`,
      `2. Use Sleep and Deep Sleep Modes

Most modern microcontrollers and sensors support multiple power modes:

• Active Mode – For data acquisition and processing
• Sleep Mode – Reduced CPU activity, sensors still on
• Deep Sleep / Hibernate – Minimal power usage, only essential components stay awake

Use these modes to keep your device asleep when not actively sensing or transmitting data.`,
      `3. Optimize Data Transmission

Wireless communication consumes a significant amount of energy.

• Batch data transmission – Collect data in memory and send it at intervals instead of sending every single reading.
• Use low-power protocols – MQTT-SN, CoAP, or LoRaWAN are designed for constrained devices.
• Edge processing – Filter or preprocess data on-device to avoid unnecessary transmissions.`,
      `4. Implement Dynamic Power Scaling

Dynamic Voltage and Frequency Scaling (DVFS) adjusts the MCU's operating frequency based on workload.

• Lower clock speed during idle times
• Increase frequency only when high performance is needed

This technique saves energy without affecting performance.`,
      `5. Use Efficient Firmware Design

Your firmware plays a major role in energy consumption.

• Debounce and filter inputs to avoid unnecessary wake-ups
• Use interrupts instead of polling loops
• Schedule tasks efficiently to maximize sleep time
• Regularly profile power usage with tools like Nordic Power Profiler or Monsoon`,
      `6. Smart Power Management for Peripherals

Peripherals like OLED displays, GPS modules, and LEDs can drain power if left ON.

• Turn off unused peripherals when not in use
• Use PWM (Pulse Width Modulation) to dim LEDs and displays
• Power gate external modules using MOSFETs`,
      `7. Consider Energy Harvesting

For ultra-low-power IoT devices, energy harvesting can be a game changer.

• Solar panels for outdoor sensors
• Vibration or kinetic energy for wearable devices
• RF energy harvesting for battery-less operation

This reduces dependence on battery replacement.`,
      `Key Takeaways

Optimizing power consumption in IoT devices is not just a design choice — it's a necessity for scalability, reliability, and cost-effectiveness. By carefully selecting hardware, using low-power modes, optimizing communication, and designing efficient firmware, you can significantly extend battery life and create sustainable IoT solutions.`,
    ],
  },
  rtos: {
    title: "Real-Time Operating Systems for Embedded Applications",
    date: "2023-12-20",
    readTime: "15 min read",
    category: "RTOS",
    content: [
      `Choosing and implementing the right RTOS for your project: FreeRTOS, Zephyr, and custom solutions compared.

In today's fast-paced world of embedded systems, real-time performance is often the key to success. Whether you're building a medical device, industrial automation system, or IoT product, you need precise timing, predictable task execution, and efficient resource management. This is where a Real-Time Operating System (RTOS) becomes essential.

In this article, we will explore what an RTOS is, why you should use one, and compare three popular choices — FreeRTOS, Zephyr, and custom RTOS solutions — so you can make the right decision for your project.`,

      `What is a Real-Time Operating System (RTOS)?

An RTOS is a lightweight operating system designed to run real-time applications that require deterministic response times. Unlike general-purpose operating systems like Windows or Linux, an RTOS ensures that critical tasks are executed within a guaranteed time frame.

Key Features of RTOS:

• Task Scheduling – Prioritizes tasks based on urgency
• Deterministic Behavior – Ensures tasks run within predictable time limits
• Low Latency – Minimal delay in switching between tasks
• Resource Management – Handles memory, I/O, and CPU efficiently`,

      `Benefits of Using an RTOS in Embedded Systems

Using an RTOS can dramatically improve the performance and reliability of your embedded applications:

• Improved Responsiveness – Handles real-time events efficiently
• Modular Design – Easier to scale and maintain large projects
• Simplified Multitasking – Separate threads for communication, sensing, and control
• Better Debugging – Built-in tracing and monitoring tools`,

      `Choosing the Right RTOS: FreeRTOS vs. Zephyr vs. Custom RTOS

Let's compare three common approaches to real-time systems:

Feature	FreeRTOS	Zephyr OS	Custom RTOS
License	Open source (MIT)	Open source (Apache 2.0)	Proprietary / In-house
Hardware Support	Widely supported (MCUs & MPUs)	Strong support for IoT & ARM	Fully customizable
Community & Support	Large community, great docs	Growing community, backed by Linux Foundation	Limited to internal team
Complexity	Lightweight, easy to learn	More complex, feature-rich	Depends on your design
Best For	Small to medium projects, resource-constrained devices	IoT, networking-heavy, scalable projects	Mission-critical, unique applications`,

      `1. FreeRTOS

FreeRTOS is one of the most popular RTOS options for embedded developers.

Pros:
✅ Lightweight and minimal footprint
✅ Large community and excellent documentation
✅ Easy to integrate with IoT platforms (AWS FreeRTOS, Azure RTOS)

Cons:
❌ Limited advanced features compared to larger RTOSes
❌ No built-in device drivers (you must implement them)`,

      `2. Zephyr OS

Zephyr is a Linux Foundation project that targets IoT, connected devices, and scalable embedded solutions.

Pros:
✅ Advanced networking and security support
✅ Large ecosystem of supported boards and drivers
✅ Supports multi-threading and power management

Cons:
❌ Steeper learning curve
❌ Heavier footprint than FreeRTOS`,

      `3. Custom RTOS

Sometimes, building your own RTOS can make sense — especially for safety-critical or proprietary systems.

Pros:
✅ Fully tailored to your needs
✅ Maximum control over performance and footprint
✅ Can be optimized for specific hardware

Cons:
❌ High development and maintenance cost
❌ Requires deep OS design expertise`,

      `When to Use an RTOS

You should consider using an RTOS if your embedded application needs:

• Real-time performance (low latency, high determinism)
• Multiple concurrent tasks (sensing, processing, communication)
• Scalability for future features and updates
• Networking and connectivity with cloud services

If your project is simple — for example, reading a sensor and blinking an LED — a bare-metal approach might be more efficient.`,

      `Best Practices for RTOS Implementation

• Prioritize Tasks Properly – Misconfigured priorities can lead to missed deadlines
• Minimize Interrupt Latency – Keep ISR (Interrupt Service Routine) short
• Avoid Deadlocks – Use mutexes and semaphores carefully
• Monitor Stack Usage – Prevent crashes due to stack overflow
• Profile Power Consumption – Use RTOS sleep modes for battery-operated devices`,

      `Key Takeaways

Choosing the right RTOS can make or break your embedded project.

• FreeRTOS is ideal for lightweight, resource-constrained devices
• Zephyr OS is perfect for IoT and connectivity-heavy applications
• Custom RTOS is a great option when you need full control and unique features

By understanding your application requirements and hardware constraints, you can select the right RTOS to improve reliability, scalability, and overall performance.`,
    ],
  },
};

const BlogPost = () => {
  const location = useLocation();
  const path = location.pathname.split("/").pop() || "power-consumption";
  const post = articles[path as keyof typeof articles];

  if (!post) {
    return <div>Article not found</div>;
  }

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
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
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
                  <div key={index} className="mb-8">
                    {paragraph.split("\n").map((line, lineIdx) => (
                      <p
                        key={lineIdx}
                        className={`${
                          line.startsWith("•")
                            ? "pl-6 text-muted-foreground my-1"
                            : line.startsWith("Key Takeaways") ||
                              /^\d\./.test(line)
                            ? "text-xl font-semibold text-foreground mt-8 mb-4"
                            : "text-muted-foreground text-lg leading-relaxed"
                        } 
                          ${line === "" ? "mb-4" : "mb-2"}`}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
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
