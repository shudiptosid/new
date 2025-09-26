import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, Clock, X, ArrowLeft } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";

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
    title: "Real-Time Operating Systems in IoT: A Beginner-Friendly Guide",
    date: "2024-01-20",
    readTime: "10 min read",
    category: "IoT",
    content: [
      `The Internet of Things (IoT) is everywhere — from smart home devices to industrial automation. As IoT systems become more complex, real-time performance is often required. This is where Real-Time Operating Systems (RTOS) come in. In this article, we'll explain what RTOS is, why it matters in IoT, and how to get started with popular options like FreeRTOS and Zephyr.`,

      `🔧 What is an RTOS?

A Real-Time Operating System (RTOS) is a lightweight operating system designed to run tasks with precise timing. Unlike a general-purpose OS (like Windows or Linux), an RTOS focuses on:

• Deterministic behavior – tasks run at predictable times
• Low latency – quick response to external events  
• Multitasking – ability to handle multiple processes efficiently

This makes RTOS perfect for IoT devices where timing is critical — like reading sensor data every few milliseconds or controlling a motor in real-time.`,

      `🚀 Why Use RTOS in IoT Projects?

IoT devices are often resource-constrained and need to be reliable, efficient, and responsive. RTOS helps you achieve this by:

✅ Task Scheduling: Runs tasks based on priority, ensuring critical ones execute first.
✅ Low Power Consumption: Supports sleep modes to extend battery life.
✅ Code Maintainability: Breaks your project into modular tasks for easier debugging.
✅ Real-Time Communication: Ensures sensors, actuators, and network events are handled on time.

Example: In a smart home thermostat, one task can read temperature data, another controls the display, while a third handles Wi-Fi communication — all without blocking each other.`,

      `🏆 Popular RTOS Options for IoT

Here are two of the most widely used RTOS choices for IoT development:

1. FreeRTOS

• Lightweight & Open Source
• Supports over 40 microcontroller architectures (ESP32, STM32, ARM Cortex-M)
• Easy to learn and well-documented
• Large community and official support from AWS IoT
• Best For: Beginners and projects where size and simplicity matter.

2. Zephyr RTOS

• Feature-rich, scalable, and open source
• Built-in support for networking stacks (Bluetooth, Wi-Fi, Thread)
• Ideal for more advanced IoT products
• Backed by the Linux Foundation
• Best For: Professional-grade IoT devices and connected systems.`,

      `🛠️ How to Get Started

1. Choose Your RTOS: FreeRTOS for simple projects, Zephyr for advanced.
2. Pick Your Hardware: ESP32, STM32, or Raspberry Pi Pico are common boards.
3. Set Up Toolchain: Install VS Code or PlatformIO for easy development.
4. Write Modular Tasks: Break your code into small, independent tasks.
5. Test & Debug: Use RTOS trace tools to analyze task execution.`,

      `💡 Best Practices for RTOS in IoT

• Use Priorities Wisely: Don't give every task the highest priority.
• Avoid Long Delays: Keep tasks short and responsive.
• Manage Memory Carefully: Free unused memory to avoid crashes.
• Use Queues & Semaphores: For safe communication between tasks.`,

      `📌 Key Takeaway

A Real-Time Operating System can transform your IoT projects, making them more responsive, power-efficient, and scalable. Whether you're building a DIY project with ESP32 or developing a commercial IoT product, understanding RTOS principles is essential.

Start simple with FreeRTOS, and when you're ready for more complex, connected systems, try Zephyr. Mastering RTOS will make your IoT solutions robust and production-ready.`,
    ],
  },
};

const BlogPost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split("/").pop() || "power-consumption";
  const post = articles[path as keyof typeof articles];

  if (!post) {
    return <div>Article not found</div>;
  }

  const handleClose = () => {
    navigate("/blog");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-grow">
        <article className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Close Button */}
              <div className="flex justify-between items-center mb-8">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors border-2 w-10 h-10 flex items-center justify-center"
                  aria-label="Close article"
                >
                  <X className="w-5 h-5 text-gray-600 hover:text-red-600" />
                </Button>
              </div>
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
