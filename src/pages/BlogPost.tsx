import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  X,
  ArrowLeft,
  Share2,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { SEO } from "../components/SEO";

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
      </a>
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
      </code>
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

interface Article {
  title: string;
  category: string;
  date: string;
  readTime: string;
  content: string[];
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    featuredImage?: string;
  };
}

const articles: Record<string, Article> = {
  "power-consumption": {
    title: "Optimizing Power Consumption in IoT Devices",
    date: "2025-10-15",
    readTime: "8 min read",
    category: "Power Management",
    seo: {
      metaTitle: "IoT Power Optimization Guide | Extend Battery Life 10-50x",
      metaDescription: "Master power optimization for IoT devices. Learn sleep modes, DVFS, voltage regulation, low-power protocols, and energy harvesting to extend battery life dramatically.",
      keywords: ["IoT power optimization", "battery life", "sleep modes", "low power design", "ESP32 deep sleep", "Arduino power saving", "STM32 low power", "energy harvesting"],
      featuredImage: "/blog/power-optimization.jpg",
    },
    content: [
      `Power consumption is the #1 challenge in battery-powered IoT devices. A well-designed IoT sensor can run for years on a single battery, while a poorly optimized one dies in weeks. This guide covers proven techniques to reduce power consumption by 10-50x.`,
      
      `**Understanding Power States**\n\nMost microcontrollers offer multiple power modes:\n• Active Mode: Full operation, highest power (80-150mA)\n• Light Sleep: CPU paused, peripherals active (15-30mA)\n• Deep Sleep: Only RTC active, ultra-low power (10-150µA)\n• Hibernation: Complete shutdown, lowest power (2-10µA)\n\nKey strategy: Spend 99% of time in deep sleep, wake only for sensing and transmission.`,
      
      `**Sleep Mode Optimization**\n\nESP32 Example:\n\`\`\`cpp\n#include "esp_sleep.h"\n\nvoid setup() {\n  esp_sleep_enable_timer_wakeup(60 * 1000000); // 60 seconds\n  esp_deep_sleep_start();\n}\n\`\`\`\n\nArduino Example:\n\`\`\`cpp\n#include <avr/sleep.h>\n#include <avr/power.h>\n\nvoid enterSleep() {\n  set_sleep_mode(SLEEP_MODE_PWR_DOWN);\n  sleep_enable();\n  sleep_mode();\n}\n\`\`\``,
      
      `**Dynamic Voltage & Frequency Scaling (DVFS)**\n\nReduce CPU frequency when full speed isn't needed:\n• 240MHz → 80MHz: 40% power reduction\n• 80MHz → 40MHz: Additional 30% savings\n• Lower voltage: 10-20% extra efficiency\n\nSTM32 Example:\n\`\`\`c\nRCC_ClkInitTypeDef clkConfig;\nHAL_RCC_ClockConfig(&clkConfig, FLASH_LATENCY_0);\nSystemClock_Config(); // Set to 16MHz\n\`\`\``,
      
      `**Peripheral Power Management**\n\nDisable unused peripherals:\n• Turn off WiFi when not transmitting\n• Power down ADCs between readings\n• Disable LEDs (each LED = 5-20mA)\n• Use external pull-ups sparingly\n\nExample power budget:\n• Sensor reading: 50mA for 100ms = 1.4mAh/day\n• WiFi transmission: 200mA for 2s = 0.1mAh/day  \n• Deep sleep: 50µA for 23.9hrs = 1.2mAh/day\n• Total: ~2.7mAh/day → 2000mAh battery lasts 2 years!`,
      
      `**Low-Power Communication Protocols**\n\nChoose protocols wisely:\n• LoRaWAN: 10-50mA transmit, excellent range\n• BLE: 15-30mA, good for < 100m\n• WiFi: 200-300mA, power hungry but fast\n• NB-IoT: 100-200mA, cellular coverage\n\nBest practice: Batch data, transmit once per hour instead of every minute.`,
      
      `**Voltage Regulation Efficiency**\n\nLinear regulators waste power as heat. Switch to:\n• Buck converters: 85-95% efficient\n• LDO for < 100mA loads\n• Direct battery power (3.7V → 3.3V)\n\nExample: 500mA at 3.3V from 5V:\n• Linear regulator: 850mW wasted\n• Buck converter: 100mW wasted (8.5x better!)`,
      
      `**Energy Harvesting**\n\nSupplemental power sources:\n• Solar panels: 10-100mW indoors, 1-10W outdoors\n• Piezoelectric: Vibration energy\n• Thermoelectric: Temperature differentials\n• RF energy: Ambient radio waves\n\nTiny solar panel + supercapacitor = infinite battery life for many applications.`,
      
      `**Measurement & Validation**\n\nUse a multimeter or power profiler:\n1. Measure active current\n2. Measure sleep current\n3. Calculate duty cycle\n4. Estimate battery life\n\nFormula:\n\`\`\`\nBattery Life (days) = Battery Capacity (mAh) / Average Current (mA) / 24\n\`\`\`\n\nAlways include 20-30% safety margin for real-world conditions.`,
      
      `**Key Takeaways**\n\n✓ Use deep sleep modes aggressively\n✓ Optimize wake-up time and frequency\n✓ Lower voltage and clock speed when possible\n✓ Disable all unused peripherals\n✓ Choose low-power protocols\n✓ Use efficient voltage regulators\n✓ Consider energy harvesting\n✓ Always measure actual power consumption\n\nWith these techniques, achieving 1-5 year battery life becomes realistic even with frequent sensor readings and cloud connectivity.`
    ],
  },

  "rtos": {
    title: "Real-Time Operating Systems (RTOS) for IoT",
    date: "2025-10-08",
    readTime: "7 min read",
    category: "RTOS",
    seo: {
      metaTitle: "RTOS for IoT: FreeRTOS & Zephyr Complete Guide",
      metaDescription: "Master Real-Time Operating Systems for IoT. Learn FreeRTOS, Zephyr, task scheduling, inter-task communication, and build production-ready embedded systems.",
      keywords: ["RTOS", "FreeRTOS", "Zephyr", "embedded systems", "task scheduling", "real-time OS", "IoT operating system"],
      featuredImage: "/blog/rtos.jpg",
    },
    content: [
      `Real-Time Operating Systems (RTOS) transform complex IoT projects from spaghetti code into well-organized, maintainable systems. Instead of managing timing in a single loop, RTOS handles task scheduling, priorities, and inter-task communication automatically.`,
      
      `**When to Use RTOS**\n\nConsider RTOS when you need:\n• Multiple concurrent tasks (sensors, display, networking)\n• Precise timing requirements\n• Complex state machines\n• Easy code modularity\n• Efficient resource sharing\n\nFor simple projects (< 3 tasks), bare-metal code may suffice. For complex systems (5+ tasks), RTOS is essential.`,
      
      `**Popular RTOS Options**\n\n**FreeRTOS** (Most Popular)\n• ESP32, STM32, Arduino support\n• Small footprint (< 10KB)\n• Preemptive multitasking\n• Free & open source\n\n**Zephyr OS** (Modern Choice)\n• Backed by Linux Foundation\n• Great hardware support\n• Built-in networking stacks\n• Growing community\n\n**CMSIS-RTOS** (ARM Standard)\n• STM32CubeIDE integrated\n• Hardware abstraction\n• Portable code`,
      
      `**FreeRTOS Basic Example**\n\n\`\`\`cpp\n#include <Arduino.h>\n#include <freertos/FreeRTOS.h>\n#include <freertos/task.h>\n\nvoid TaskBlink(void *pvParameters) {\n  pinMode(LED_PIN, OUTPUT);\n  while(1) {\n    digitalWrite(LED_PIN, HIGH);\n    vTaskDelay(1000 / portTICK_PERIOD_MS);\n    digitalWrite(LED_PIN, LOW);\n    vTaskDelay(1000 / portTICK_PERIOD_MS);\n  }\n}\n\nvoid TaskSensor(void *pvParameters) {\n  while(1) {\n    float temp = readTemperature();\n    Serial.println(temp);\n    vTaskDelay(5000 / portTICK_PERIOD_MS);\n  }\n}\n\nvoid setup() {\n  xTaskCreate(TaskBlink, "Blink", 1024, NULL, 1, NULL);\n  xTaskCreate(TaskSensor, "Sensor", 2048, NULL, 2, NULL);\n}\n\nvoid loop() {\n  // Empty - RTOS handles everything\n}\n\`\`\``,
      
      `**Task Priorities & Scheduling**\n\nFreeRTOS uses preemptive priority-based scheduling:\n• Higher priority tasks run first\n• Equal priority tasks use round-robin\n• Idle task runs when nothing else can\n\nExample priorities:\n• Priority 3: Critical safety tasks\n• Priority 2: Time-sensitive (sensors, control)\n• Priority 1: Background (logging, display)\n• Priority 0: Idle housekeeping`,
      
      `**Inter-Task Communication**\n\n**Queues** (Pass data between tasks):\n\`\`\`cpp\nQueueHandle_t dataQueue;\n\nvoid TaskProducer(void *pvParameters) {\n  int data = 42;\n  xQueueSend(dataQueue, &data, portMAX_DELAY);\n}\n\nvoid TaskConsumer(void *pvParameters) {\n  int received;\n  xQueueReceive(dataQueue, &received, portMAX_DELAY);\n}\n\`\`\`\n\n**Semaphores** (Synchronization):\n\`\`\`cpp\nSemaphoreHandle_t mutex;\n\nvoid TaskA(void *pvParameters) {\n  xSemaphoreTake(mutex, portMAX_DELAY);\n  // Access shared resource\n  xSemaphoreGive(mutex);\n}\n\`\`\``,
      
      `**Memory Management**\n\nEach task needs its own stack:\n• Small tasks (blinking LED): 512-1024 bytes\n• Medium tasks (sensors): 2048-4096 bytes\n• Large tasks (WiFi, display): 4096-8192 bytes\n\nMonitor stack usage:\n\`\`\`cpp\nUBaseType_t stackRemaining = uxTaskGetStackHighWaterMark(NULL);\nSerial.print("Stack remaining: ");\nSerial.println(stackRemaining);\n\`\`\``,
      
      `**Power Management with RTOS**\n\nRTOS can automatically enter sleep:\n\`\`\`cpp\nvoid IdleTask() {\n  while(1) {\n    esp_light_sleep_start(); // Automatic sleep\n  }\n}\n\`\`\`\n\nAll tasks blocked → CPU sleeps → Wakes on interrupt or timer`,
      
      `**Common Pitfalls**\n\n❌ Stack overflow (increase task stack size)\n❌ Priority inversion (use mutexes properly)\n❌ Deadlocks (avoid circular dependencies)\n❌ Starvation (balance priorities)\n❌ Watchdog timeouts (feed in each task)`,
      
      `**Key Takeaways**\n\n✓ RTOS simplifies complex multi-task systems\n✓ FreeRTOS is easiest for beginners\n✓ Use queues for data passing\n✓ Use semaphores for synchronization\n✓ Set appropriate task priorities\n✓ Monitor stack usage carefully\n✓ Consider power management\n✓ Test on real hardware early\n\nRTOS transforms IoT development from timing nightmares into clean, modular, maintainable code. Start with FreeRTOS on ESP32—it's the easiest path to professional embedded development.`
    ],
  },

  "lorawan-networks": {
    title: "Building Resilient LoRaWAN Networks",
    date: "2025-09-25",
    readTime: "7 min read",
    category: "Networking",
    seo: {
      metaTitle: "LoRaWAN Network Design | Best Practices for Remote IoT",
      metaDescription: "Design reliable LoRaWAN networks for remote IoT deployments. Learn gateway placement, ADR optimization, network redundancy, and maintenance strategies.",
      keywords: ["LoRaWAN", "LoRa gateway", "long-range IoT", "LPWAN", "remote sensors", "IoT connectivity"],
      featuredImage: "/blog/lorawan.jpg",
    },
    content: [
      `LoRaWAN (Long Range Wide Area Network) enables IoT deployments spanning kilometers with minimal power consumption. Achieving 99%+ reliability in harsh environments requires strategic planning—this guide covers the essentials.`,
      
      `**Why LoRaWAN for Remote IoT**\n\nAdvantages:\n• Range: 2-5km urban, 15-20km rural\n• Low power: 5-10 year battery life\n• Deep penetration: Works indoors/underground\n• Low cost: €5-10 per node\n• Unlicensed spectrum: No carrier fees\n\nTypical applications: Agricultural sensors, utility meters, environmental monitoring, asset tracking.`,
      
      `**Network Architecture**\n\nComponents:\n1. **End Devices** (sensors) - Send data via LoRa\n2. **Gateways** - Receive from multiple devices, forward to network server\n3. **Network Server** - Routes messages, manages network\n4. **Application Server** - Processes sensor data\n\nOne gateway can handle 1000+ devices simultaneously.`,
      
      `**Gateway Placement Strategy**\n\nElevation is critical:\n• Mount gateways as high as possible (10-30m)\n• Clear line-of-sight reduces packet loss by 50%+\n• Avoid obstacles: buildings, trees, hills\n\nRedundancy:\n• Deploy 2-3 gateways with overlapping coverage\n• If one fails, others maintain connectivity\n• Improves overall packet delivery rate`,
      
      `**Adaptive Data Rate (ADR)**\n\nLoRaWAN automatically adjusts data rate based on link quality:\n• Strong signal → Fast data rate (SF7)\n• Weak signal → Slow data rate (SF12)\n• Trades speed for reliability\n\nOptimization tips:\n• Enable ADR for stationary devices\n• Disable ADR for mobile devices\n• Start with SF7, let network optimize\n\nExample:\n\`\`\`cpp\n// Arduino LoRaWAN\nnode.setAdaptiveDataRate(true);\nnode.setDataRate(5); // SF7\n\`\`\``,
      
      `**Frequency Planning**\n\nRegional bands:\n• EU868: 863-870 MHz (Europe)\n• US915: 902-928 MHz (Americas)\n• AS923: 915-928 MHz (Asia)\n• AU915: 915-928 MHz (Australia)\n\nDuty cycle limits:\n• EU: 1% (36 seconds per hour max)\n• US/AU: No restriction\n\nBest practice: Transmit every 10-60 minutes to conserve battery and avoid congestion.`,
      
      `**Security Implementation**\n\nLoRaWAN has built-in AES-128 encryption:\n• Network Session Key (NwkSKey)\n• Application Session Key (AppSKey)\n• Device Address (DevAddr)\n\nActivation methods:\n1. **OTAA** (Over-The-Air Activation) - More secure, recommended\n2. **ABP** (Activation By Personalization) - Simpler, less secure\n\n\`\`\`cpp\n// OTAA Configuration\nstatic const u1_t APPEUI[8] = { 0x00, 0x00, ... };\nstatic const u1_t DEVEUI[8] = { 0x00, 0x00, ... };\nstatic const u1_t APPKEY[16] = { 0x00, 0x00, ... };\n\`\`\``,
      
      `**Network Monitoring & Maintenance**\n\nKey metrics to track:\n• Packet Delivery Rate (target: > 95%)\n• RSSI (Received Signal Strength): > -120 dBm\n• SNR (Signal-to-Noise Ratio): > 0 dB\n• Gateway uptime: > 99%\n\nTroubleshooting:\n• Poor RSSI → Add gateway or relocate device\n• Low SNR → Increase spreading factor\n• Packet loss → Check gateway backhaul\n• High battery drain → Reduce transmit frequency`,
      
      `**Scalability Considerations**\n\nAs network grows:\n• Add gateways every 2-5 km\n• Use network server with auto-scaling\n• Implement message queuing (MQTT, Kafka)\n• Monitor bandwidth per gateway\n\nExample capacity:\n• 1 gateway = 1000 devices at SF7\n• 1 gateway = 250 devices at SF12\n• Multiple SFs → Mix based on distance`,
      
      `**Key Takeaways**\n\n✓ Mount gateways high with clear line-of-sight\n✓ Deploy multiple gateways for redundancy\n✓ Enable ADR for stationary devices\n✓ Respect duty cycle regulations\n✓ Use OTAA activation for security\n✓ Monitor RSSI, SNR, and packet delivery\n✓ Plan for scalability from day one\n✓ Test in real deployment conditions\n\nLoRaWAN offers unmatched range and battery life for remote IoT. With proper network design, achieve years of reliable operation even in challenging environments.`
    ],
  },

  "debugging-embedded": {
    title: "Debugging Embedded Systems: Complete Guide",
    date: "2025-10-12",
    readTime: "7 min read",
    category: "Development",
    seo: {
      metaTitle: "Embedded Systems Debugging Guide | Arduino, ESP32, STM32",
      metaDescription: "Master debugging techniques for embedded systems. Learn UART logging, IDE debugging, JTAG, SWD, oscilloscope analysis, and systematic troubleshooting strategies.",
      keywords: ["embedded debugging", "Arduino debugging", "ESP32 debug", "STM32 debugging", "JTAG", "SWD", "hardware debugging"],
      featuredImage: "/blog/debugging.jpg",
    },
    content: [
      `Debugging embedded systems is fundamentally different from software development. You're dealing with hardware constraints, real-time behavior, and limited visibility. This guide covers proven techniques to find and fix bugs efficiently.`,
      
      `**The Debugging Toolbox**\n\nEssential tools:\n1. **UART Serial** - Basic printf debugging\n2. **IDE Debugger** - Step-through execution\n3. **Logic Analyzer** - Digital signal inspection\n4. **Oscilloscope** - Analog signal analysis\n5. **Multimeter** - Voltage/current measurement\n6. **LED Indicators** - Quick visual feedback`,
      
      `**UART Serial Debugging (Level 1)**\n\nMost accessible method - simple printf statements:\n\n\`\`\`cpp\n// Arduino/ESP32\nvoid setup() {\n  Serial.begin(115200);\n  Serial.println("System boot...");\n}\n\nvoid loop() {\n  int sensorValue = analogRead(A0);\n  Serial.print("Sensor: ");\n  Serial.println(sensorValue);\n  \n  if (sensorValue < 100) {\n    Serial.println("ERROR: Sensor reading too low!");\n  }\n}\n\`\`\`\n\nPro tips:\n• Use higher baud rates (115200 or 460800)\n• Add timestamps for timing issues\n• Use log levels (DEBUG, INFO, WARN, ERROR)\n• Buffer output to avoid timing disruption`,
      
      `**Enhanced Logging System**\n\n\`\`\`cpp\nenum LogLevel { DEBUG, INFO, WARN, ERROR };\n\nvoid log(LogLevel level, const char* msg) {\n  const char* prefix[] = {"[DEBUG]", "[INFO]", "[WARN]", "[ERROR]"};\n  Serial.print(millis());\n  Serial.print(" ");\n  Serial.print(prefix[level]);\n  Serial.print(" ");\n  Serial.println(msg);\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  log(INFO, "System initialized");\n}\n\nvoid loop() {\n  int reading = readSensor();\n  if (reading < 0) {\n    log(ERROR, "Sensor read failed!");\n  } else {\n    log(DEBUG, "Sensor OK");\n  }\n}\n\`\`\``,
      
      `**IDE Debugger (Level 2)**\n\nAdvanced debugging with breakpoints:\n\n**PlatformIO:**\n1. Add to \`platformio.ini\`:\n\`\`\`ini\ndebug_tool = esp-prog\ndebug_speed = 5000\n\`\`\`\n\n2. Set breakpoints in code\n3. Click "Debug" button\n4. Step through code, inspect variables\n\n**Arduino IDE 2.x:**\n• Supports debugging on select boards\n• Requires compatible debugger (ST-Link, CMSIS-DAP)\n• Set breakpoints by clicking line numbers`,
      
      `**Common Embedded Bugs**\n\n**1. Stack Overflow**\nSymptoms: Random crashes, variable corruption\nFix:\n\`\`\`cpp\n// Check stack usage (FreeRTOS)\nUBaseType_t stack = uxTaskGetStackHighWaterMark(NULL);\nif (stack < 512) {\n  Serial.println("WARNING: Low stack!");\n}\n\`\`\`\n\n**2. Race Conditions**\nSymptoms: Intermittent failures\nFix: Use mutexes or disable interrupts\n\`\`\`cpp\nnoInterrupts();\nsharedVariable++;\ninterrupts();\n\`\`\`\n\n**3. Watchdog Timeouts**\nSymptoms: System reboots\nFix: Feed watchdog in long loops\n\`\`\`cpp\nwhile(condition) {\n  esp_task_wdt_reset(); // ESP32\n  // or\n  wdt_reset(); // AVR\n}\n\`\`\``,
      
      `**Hardware Debugging**\n\n**Multimeter Checks:**\n• Verify power supply voltage (should be stable ±5%)\n• Check ground connections (0Ω resistance)\n• Measure current draw (compare to datasheet)\n\n**Oscilloscope Analysis:**\n• Verify clock signals (square waves)\n• Check I2C/SPI timing\n• Detect noise on power rails\n• Measure rise/fall times\n\n**Logic Analyzer:**\n• Decode I2C, SPI, UART protocols\n• Verify communication timing\n• Capture sporadic events\n• Tools: Saleae, DSLogic, cheap USB analyzers`,
      
      `**Systematic Debugging Process**\n\n1. **Reproduce** the bug consistently\n2. **Isolate** - Binary search (comment out code sections)\n3. **Hypothesize** - What could cause this?\n4. **Test** hypothesis with targeted logging\n5. **Fix** and verify\n6. **Prevent** - Add checks to catch similar bugs\n\nExample workflow:\n\`\`\`\nSymptom: WiFi randomly disconnects\n↓\nAdd logging before/after WiFi code\n↓\nDiscover: Happens during sensor reads\n↓\nHypothesis: Sensor blocks too long\n↓\nFix: Move sensor read to separate task\n↓\nVerify: No disconnects for 24 hours\n\`\`\``,
      
      `**Debugging Best Practices**\n\n✓ Start with simple tests (blink LED)\n✓ Add logging early and often\n✓ Use version control (git)\n✓ Test one change at a time\n✓ Document weird behaviors\n✓ Keep backups of working code\n✓ Sleep on tough bugs (fresh perspective helps)\n✓ Ask for help (forums, colleagues)`,
      
      `**Key Takeaways**\n\n✓ Serial logging is your best friend\n✓ Add timestamps and log levels\n✓ Use IDE debugger for complex issues\n✓ Check hardware with multimeter first\n✓ Systematically isolate problems\n✓ Reproduce bugs before fixing\n✓ Prevent future bugs with defensive code\n✓ Build a debugging toolkit over time\n\nDebugging embedded systems requires patience and systematic thinking. Master these techniques, and you'll spend less time stuck and more time building amazing IoT projects.`
    ],
  },

  "edge-ai": {
    title: "Edge AI on Microcontrollers: TensorFlow Lite Micro",
    date: "2025-09-22",
    readTime: "8 min read",
    category: "AI/ML",
    seo: {
      metaTitle: "Edge AI Guide | TensorFlow Lite Micro on ESP32, Arduino, STM32",
      metaDescription: "Run machine learning on microcontrollers. Learn TensorFlow Lite Micro, model quantization, optimization, and deploy AI on ESP32, Arduino, STM32 for real-time inference.",
      keywords: ["edge AI", "TensorFlow Lite Micro", "embedded machine learning", "ESP32 AI", "Arduino AI", "model quantization", "on-device AI"],
      featuredImage: "/blog/edge-ai.jpg",
    },
    content: [
      `Running machine learning directly on microcontrollers enables real-time AI inference without cloud dependency, reducing latency and power consumption. TensorFlow Lite Micro makes this possible on devices with as little as 256KB RAM.`,
      
      `**Why Edge AI?**\n\nBenefits:\n• Zero latency: No network roundtrip\n• Privacy: Data never leaves device\n• Offline operation: Works without connectivity\n• Low power: No WiFi/cellular needed\n• Reduced cost: No cloud compute fees\n\nApplications:\n• Keyword spotting ("Hey device")\n• Gesture recognition\n• Anomaly detection\n• Predictive maintenance\n• Image classification`,
      
      `**Hardware Requirements**\n\nMinimum specs:\n• 256KB RAM (512KB+ recommended)\n• 1MB Flash (2MB+ for larger models)\n• 80MHz+ CPU (faster = better)\n\nRecommended boards:\n• **ESP32** - 520KB RAM, WiFi, $5-10\n• **Arduino Nano 33 BLE Sense** - Built-in IMU, mic\n• **STM32F4/F7** - ARM Cortex-M4/M7, fast\n• **Raspberry Pi Pico** - Dual-core, cheap`,
      
      `**Setup TensorFlow Lite Micro**\n\n**PlatformIO Installation:**\n\`\`\`ini\n[env:esp32dev]\nplatform = espressif32\nboard = esp32dev\nlib_deps = \n    tensorflow/tensorflow-lite-micro@2.16.0\n\`\`\`\n\n**Arduino Library Manager:**\n1. Tools → Manage Libraries\n2. Search "TensorFlowLiteMicro"\n3. Install\n\n**Include in code:**\n\`\`\`cpp\n#include <TensorFlowLite.h>\n#include "model.h" // Your converted model\n\`\`\``,
      
      `**Model Training & Conversion**\n\nWorkflow:\n1. Train model in Python (Keras/TensorFlow)\n2. Convert to TensorFlow Lite\n3. Quantize to 8-bit integers\n4. Generate C array\n5. Flash to microcontroller\n\n**Python conversion:**\n\`\`\`python\nimport tensorflow as tf\n\n# Train your model\nmodel = tf.keras.Sequential([...])\nmodel.fit(x_train, y_train)\n\n# Convert to TFLite\nconverter = tf.lite.TFLiteConverter.from_keras_model(model)\nconverter.optimizations = [tf.lite.Optimize.DEFAULT]\ntflite_model = converter.convert()\n\n# Save\nwith open('model.tflite', 'wb') as f:\n  f.write(tflite_model)\n\`\`\`\n\n**Convert to C array:**\n\`\`\`bash\nxxd -i model.tflite > model.h\n\`\`\``,
      
      `**Running Inference**\n\nBasic inference code:\n\`\`\`cpp\n#include <TensorFlowLite.h>\n#include "model.h"\n\n// Model tensor arena (adjust size based on model)\nconst int kTensorArenaSize = 40 * 1024;\nuint8_t tensor_arena[kTensorArenaSize];\n\nvoid setup() {\n  // Load model\n  const tflite::Model* model = tflite::GetModel(g_model);\n  \n  // Create interpreter\n  tflite::MicroInterpreter interpreter(\n    model, resolver, tensor_arena, \n    kTensorArenaSize, error_reporter\n  );\n  \n  // Allocate tensors\n  interpreter.AllocateTensors();\n  \n  // Get input tensor\n  TfLiteTensor* input = interpreter.input(0);\n  \n  // Fill input (example: audio sample)\n  for (int i = 0; i < input->bytes; i++) {\n    input->data.int8[i] = audio_sample[i];\n  }\n  \n  // Run inference\n  TfLiteStatus invoke_status = interpreter.Invoke();\n  \n  // Get output\n  TfLiteTensor* output = interpreter.output(0);\n  float prediction = output->data.f[0];\n  \n  Serial.print("Prediction: ");\n  Serial.println(prediction);\n}\n\`\`\``,
      
      `**Optimization Techniques**\n\n**1. Quantization**\nConvert float32 → int8:\n• 75% smaller model size\n• 3-4x faster inference\n• Minimal accuracy loss (< 1%)\n\n**2. Pruning**\nRemove unimportant weights:\n• 50-90% size reduction\n• Faster execution\n• Slight accuracy drop\n\n**3. Knowledge Distillation**\nTrain small model to mimic large one:\n• Maintain accuracy\n• Much smaller size\n• Better than training small model directly`,
      
      `**Example: Keyword Spotting**\n\nDetect "yes" or "no" from audio:\n\n1. Train model on speech commands dataset\n2. Input: 1-second audio (16kHz mono)\n3. Model: 3-layer CNN\n4. Output: [yes_probability, no_probability, silence]\n\n\`\`\`cpp\nvoid loop() {\n  // Capture 1 second of audio\n  record_audio(audio_buffer, 16000);\n  \n  // Preprocess\n  compute_mfcc(audio_buffer, mfcc_features);\n  \n  // Run inference\n  copy_to_input_tensor(mfcc_features);\n  interpreter.Invoke();\n  \n  // Get result\n  float yes_score = output->data.f[0];\n  float no_score = output->data.f[1];\n  \n  if (yes_score > 0.8) {\n    Serial.println("Detected: YES");\n  } else if (no_score > 0.8) {\n    Serial.println("Detected: NO");\n  }\n  \n  delay(100);\n}\n\`\`\`\n\nInference time: 50-200ms on ESP32`,
      
      `**Performance Benchmarks**\n\nTypical inference times:\n• Simple model (10KB): 10-50ms\n• Medium model (100KB): 100-300ms\n• Large model (500KB): 500-2000ms\n\nRAM usage:\n• Model weights: 10KB - 1MB\n• Tensor arena: 20KB - 200KB\n• Input/output buffers: 1KB - 10KB\n\nTotal: Plan for 2-3x model size in RAM`,
      
      `**Key Takeaways**\n\n✓ Edge AI enables offline, low-latency inference\n✓ TensorFlow Lite Micro runs on 256KB+ RAM devices\n✓ Quantize models to int8 for 4x speedup\n✓ Test on real hardware early\n✓ Optimize model size ruthlessly\n✓ Balance accuracy vs. speed\n✓ Use pre-trained models when possible\n✓ Monitor inference time and power usage\n\nEdge AI transforms IoT devices from dumb sensors to intelligent systems. With TensorFlow Lite Micro, you can deploy sophisticated machine learning models on $5 microcontrollers, enabling exciting new applications.`
    ],
  },

  "mqtt-protocol": {
    title: "MQTT Protocol Deep Dive for IoT Developers",
    date: "2025-10-05",
    readTime: "7 min read",
    category: "Protocols",
    seo: {
      metaTitle: "MQTT Protocol Guide | Complete IoT Messaging Tutorial",
      metaDescription: "Master MQTT for IoT projects. Learn QoS levels, retained messages, Last Will Testament, broker setup, and build production ESP32 applications.",
      keywords: ["MQTT", "IoT messaging", "MQTT broker", "Mosquitto", "ESP32 MQTT", "publish subscribe", "QoS levels"],
      featuredImage: "/blog/mqtt.jpg",
    },
    content: [
      `MQTT (Message Queuing Telemetry Transport) is the de facto standard for IoT messaging. Its lightweight publish-subscribe model makes it perfect for connecting thousands of sensors to cloud applications with minimal bandwidth and power consumption.`,
      
      `**Why MQTT for IoT?**\n\nAdvantages:\n• Lightweight: 2-byte header vs 8KB+ for HTTP\n• Bi-directional: Server can push to devices\n• QoS levels: Guaranteed delivery options\n• Retained messages: New clients get last value\n• Last Will Testament: Detect offline devices\n• Widely supported: AWS IoT, Azure IoT Hub, HiveMQ\n\nCommon use cases: Smart home automation, industrial monitoring, fleet tracking, real-time dashboards.`,
      
      `**MQTT Architecture**\n\nComponents:\n1. **Publisher** - Sends messages to topics\n2. **Subscriber** - Receives messages from topics\n3. **Broker** - Routes messages (Mosquitto, HiveMQ, EMQX)\n4. **Topics** - Message channels (e.g., \`home/livingroom/temperature\`)\n\nExample flow:\n\`\`\`\nESP32 Sensor → Publish to "sensor/temp" → MQTT Broker → Subscribes "sensor/#" → Node.js Server\n\`\`\`\n\nLearn more about [IoT security best practices](https://www.hivemq.com/mqtt-security-fundamentals/) when implementing MQTT.`,
      
      `**QoS (Quality of Service) Levels**\n\n**QoS 0 - At Most Once**\n• Fire and forget\n• No acknowledgment\n• Fastest, least reliable\n• Use for: Non-critical sensor readings\n\n**QoS 1 - At Least Once**\n• Guaranteed delivery\n• May receive duplicates\n• Balanced approach\n• Use for: Important state updates\n\n**QoS 2 - Exactly Once**\n• Guaranteed single delivery\n• Slowest, most reliable\n• Use for: Critical commands (door unlock, payment)\n\nExample:\n\`\`\`cpp\n// ESP32 with PubSubClient\nclient.publish("sensor/data", payload, qos=1);\n\`\`\`\n\nFor more on reliable messaging, check out [this MQTT QoS guide](https://www.emqx.com/en/blog/introduction-to-mqtt-qos).`,
      
      `**Setting Up Mosquitto Broker**\n\n**Install on Linux:**\n\`\`\`bash\nsudo apt-get update\nsudo apt-get install mosquitto mosquitto-clients\nsudo systemctl enable mosquitto\nsudo systemctl start mosquitto\n\`\`\`\n\n**Configure authentication (\`/etc/mosquitto/mosquitto.conf\`):**\n\`\`\`conf\nallow_anonymous false\npassword_file /etc/mosquitto/passwd\n\`\`\`\n\n**Create user:**\n\`\`\`bash\nsudo mosquitto_passwd -c /etc/mosquitto/passwd myuser\nsudo systemctl restart mosquitto\n\`\`\`\n\n**Test:**\n\`\`\`bash\n# Subscribe\nmosquitto_sub -h localhost -t "test/#" -u myuser -P mypassword\n\n# Publish\nmosquitto_pub -h localhost -t "test/message" -m "Hello MQTT" -u myuser -P mypassword\n\`\`\`\n\nFor cloud brokers, explore [AWS IoT Core](https://aws.amazon.com/iot-core/) or [Azure IoT Hub](https://azure.microsoft.com/en-us/services/iot-hub/).`,
      
      `**ESP32 MQTT Client**\n\n\`\`\`cpp\n#include <WiFi.h>\n#include <PubSubClient.h>\n\nconst char* ssid = "YourWiFi";\nconst char* password = "YourPassword";\nconst char* mqtt_server = "broker.hivemq.com";\n\nWiFiClient espClient;\nPubSubClient client(espClient);\n\nvoid callback(char* topic, byte* payload, unsigned int length) {\n  Serial.print("Message arrived [");\n  Serial.print(topic);\n  Serial.print("]: ");\n  for (int i = 0; i < length; i++) {\n    Serial.print((char)payload[i]);\n  }\n  Serial.println();\n}\n\nvoid reconnect() {\n  while (!client.connected()) {\n    Serial.print("Connecting to MQTT...");\n    if (client.connect("ESP32Client")) {\n      Serial.println("connected");\n      client.subscribe("home/commands/#");\n    } else {\n      Serial.print("failed, rc=");\n      Serial.println(client.state());\n      delay(5000);\n    }\n  }\n}\n\nvoid setup() {\n  Serial.begin(115200);\n  WiFi.begin(ssid, password);\n  client.setServer(mqtt_server, 1883);\n  client.setCallback(callback);\n}\n\nvoid loop() {\n  if (!client.connected()) {\n    reconnect();\n  }\n  client.loop();\n  \n  // Publish sensor data every 30 seconds\n  static unsigned long lastMsg = 0;\n  if (millis() - lastMsg > 30000) {\n    lastMsg = millis();\n    float temp = readTemperature();\n    char msg[50];\n    snprintf(msg, 50, "%.2f", temp);\n    client.publish("home/sensor/temperature", msg);\n  }\n}\n\`\`\`\n\nSee [ESP32 MQTT examples](https://github.com/knolleary/pubsubclient) for more advanced implementations.`,
      
      `**Retained Messages & Last Will**\n\n**Retained Messages:**\nLast published value is saved by broker:\n\`\`\`cpp\nclient.publish("device/status", "online", true); // retained=true\n\`\`\`\nNew subscribers immediately receive last value.\n\n**Last Will Testament (LWT):**\nAutomatic message when client disconnects:\n\`\`\`cpp\nclient.connect("ESP32Client", \n  "device/status",  // LWT topic\n  0,                // LWT QoS\n  true,             // LWT retained\n  "offline"         // LWT message\n);\n\`\`\`\nServer knows device went offline without polling. Learn more about [MQTT LWT](https://www.hivemq.com/blog/mqtt-essentials-part-9-last-will-and-testament/).`,
      
      `**Topic Design Best Practices**\n\nHierarchical structure:\n\`\`\`\ncompany/location/device-type/device-id/measurement\n\`\`\`\n\nExamples:\n• \`factory/floor1/sensor/temp01/temperature\`\n• \`home/bedroom/light/status\`\n• \`vehicle/truck05/gps/location\`\n\nWildcards:\n• Single level: \`home/+/temperature\` (matches home/bedroom/temperature)\n• Multi-level: \`home/#\` (matches everything under home/)\n\nAvoid:\n❌ Leading slash: \`/home/temp\`\n❌ Spaces: \`home kitchen temp\`\n❌ Too deep: \`a/b/c/d/e/f/g/h/i/j\``,
      
      `**Security Considerations**\n\n1. **Use TLS/SSL:**\n\`\`\`cpp\nWiFiClientSecure espClient;\nclient.setServer(mqtt_server, 8883); // Secure port\n\`\`\`\n\n2. **Authentication:**\n• Username/password (minimum)\n• Client certificates (recommended)\n• ACL (Access Control Lists)\n\n3. **Network Isolation:**\n• Firewall rules\n• VPN tunnels\n• Private subnets\n\nFor comprehensive security, read [MQTT Security Fundamentals](https://www.hivemq.com/mqtt-security-fundamentals/).`,
      
      `**Key Takeaways**\n\n✓ MQTT is the standard for IoT messaging\n✓ Choose appropriate QoS level per use case\n✓ Use retained messages for device status\n✓ Implement Last Will Testament for offline detection\n✓ Design hierarchical topic structure\n✓ Always use TLS in production\n✓ Monitor broker performance\n✓ Consider cloud-hosted brokers for scale\n\nMQTT enables scalable, real-time IoT communication with minimal overhead. Master it, and you'll build robust connected systems that work reliably at any scale.`
    ],
  },

  "iot-security": {
    title: "IoT Security Best Practices for Production",
    date: "2025-10-18",
    readTime: "8 min read",
    category: "Security",
    seo: {
      metaTitle: "IoT Security Guide | Protect Embedded Devices from Attacks",
      metaDescription: "Secure IoT devices for production. Learn secure boot, encryption, OTA updates, hardware security, authentication, and protect against common vulnerabilities.",
      keywords: ["IoT security", "embedded security", "secure boot", "TLS encryption", "hardware security module", "secure OTA updates"],
      featuredImage: "/blog/iot-security.jpg",
    },
    content: [
      `IoT security is critical—compromised devices can leak data, join botnets, or cause physical damage. This guide covers essential security practices to protect IoT devices from common attacks and meet compliance requirements.`,
      
      `**The IoT Security Challenge**\n\nUnique threats:\n• Physical access to devices\n• Limited computational resources\n• Long deployment lifetimes (5-10 years)\n• Difficult to patch/update\n• Often on untrusted networks\n\nRecent breaches:\n• Mirai botnet: 600,000 compromised IoT devices\n• Ring camera hacks: Weak passwords\n• Peloton API leak: User data exposed\n\nCost of breach: Avg $4M per incident (IBM Security Report 2024).`,
      
      `**Security Layers**\n\n1. **Hardware Security**\n• Secure boot\n• Hardware encryption accelerators\n• Tamper detection\n• Secure elements (TPM, SE)\n\n2. **Software Security**\n• Code signing\n• Secure OTA updates\n• Input validation\n• Least privilege principle\n\n3. **Network Security**\n• TLS/SSL encryption\n• Certificate management\n• VPN tunnels\n• Firewall rules\n\n4. **Data Security**\n• Encryption at rest\n• Encryption in transit\n• Secure key storage\n• Data anonymization\n\nLearn more about [embedded security fundamentals](https://www.embedded.com/security-in-embedded-systems/).`,
      
      `**Secure Boot Implementation**\n\nSecure boot ensures only trusted firmware runs:\n\n**ESP32 Secure Boot:**\n\`\`\`bash\n# Generate signing key\nespsecure.py generate_signing_key secure_boot_signing_key.pem\n\n# Enable in menuconfig\nidf.py menuconfig\n# → Security features → Enable secure boot v2\n\n# Flash with secure boot\nidf.py flash\n\`\`\`\n\n**STM32 Secure Boot:**\n• Use STM32CubeProgrammer\n• Set Read Protection Level 2\n• Enable secure firmware install (SFI)\n• Lock option bytes\n\nResult: Unsigned firmware is rejected, preventing malware installation.`,
      
      `**TLS/SSL Encryption**\n\nEncrypt all network communication:\n\n**ESP32 HTTPS Client:**\n\`\`\`cpp\n#include <WiFiClientSecure.h>\n\nWiFiClientSecure client;\n\nvoid setup() {\n  WiFi.begin(ssid, password);\n  \n  // Set root CA certificate\n  client.setCACert(root_ca);\n  \n  if (client.connect("api.example.com", 443)) {\n    client.println("GET /data HTTP/1.1");\n    client.println("Host: api.example.com");\n    client.println();\n  }\n}\n\`\`\`\n\n**MQTT over TLS:**\n\`\`\`cpp\nWiFiClientSecure espClient;\nPubSubClient client(espClient);\n\nespClient.setCACert(ca_cert);\nespClient.setCertificate(client_cert);\nespClient.setPrivateKey(client_key);\n\nclient.setServer("mqtt.example.com", 8883); // TLS port\n\`\`\`\n\nFor certificate management, check [Let's Encrypt IoT Guide](https://letsencrypt.org/docs/iot/).`,
      
      `**Secure OTA Updates**\n\nOver-The-Air updates must be protected:\n\n**Firmware Signing:**\n\`\`\`bash\n# Sign firmware\nopenssl dgst -sha256 -sign private_key.pem -out firmware.sig firmware.bin\n\n# Verify on device\nopenssl dgst -sha256 -verify public_key.pem -signature firmware.sig firmware.bin\n\`\`\`\n\n**ESP32 Secure OTA:**\n\`\`\`cpp\n#include <Update.h>\n#include <WiFiClientSecure.h>\n\nvoid performOTA() {\n  WiFiClientSecure client;\n  client.setCACert(root_ca);\n  \n  if (!client.connect(ota_server, 443)) {\n    Serial.println("Connection failed");\n    return;\n  }\n  \n  size_t contentLength = getContentLength();\n  \n  if (!Update.begin(contentLength)) {\n    Serial.println("Not enough space");\n    return;\n  }\n  \n  // Write firmware with signature verification\n  Update.writeStream(client);\n  \n  if (Update.end()) {\n    Serial.println("OTA Success! Rebooting...");\n    ESP.restart();\n  } else {\n    Serial.println("OTA Failed: " + String(Update.errorString()));\n  }\n}\n\`\`\`\n\nImplement [rollback protection](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/security/secure-boot-v2.html) to prevent downgrade attacks.`,
      
      `**Authentication & Authorization**\n\n**API Keys** (Basic):\n\`\`\`cpp\nHTTPClient http;\nhttp.begin("https://api.example.com/data");\nhttp.addHeader("X-API-Key", "your-secret-api-key");\nint httpCode = http.POST(data);\n\`\`\`\n\n**OAuth 2.0** (Better):\n• Device authorization flow\n• Time-limited tokens\n• Refresh tokens\n\n**Mutual TLS** (Best):\nBoth server and client verify each other:\n\`\`\`cpp\nespClient.setCACert(root_ca);      // Verify server\nespClient.setCertificate(device_cert); // Prove identity\nespClient.setPrivateKey(device_key);\n\`\`\`\n\nFor OAuth implementations, see [Auth0 IoT documentation](https://auth0.com/docs/quickstart/native).`,
      
      `**Hardware Security Modules**\n\nSecure key storage:\n\n**ATECC608A Crypto Chip:**\n• Secure key generation\n• ECDSA signatures\n• AES-128 encryption\n• I2C interface\n• $0.50 per unit\n\n**TPM 2.0:**\n• Secure boot measurements\n• Key attestation\n• RNG\n• Common on STM32H7, i.MX RT\n\n**ESP32 Secure Element:**\n• eFuse for keys\n• Flash encryption\n• Secure boot keys\n\nExample:\n\`\`\`cpp\n#include <ATECC608A.h>\n\nATECC608A atecc;\n\nvoid setup() {\n  atecc.begin();\n  \n  byte signature[64];\n  atecc.signMessage(message, signature);\n  \n  // Signature generated with hardware-protected key\n}\n\`\`\`\n\nRead more about [hardware security modules](https://www.microchip.com/en-us/products/security-ics/atecc608a).`,
      
      `**Common Vulnerabilities & Fixes**\n\n**1. Hardcoded Credentials**\n❌ \`const char* password = "admin123";\`\n✓ Store in secure element or environment variables\n\n**2. No Input Validation**\n❌ Accepting any user input\n✓ Validate length, format, range\n\`\`\`cpp\nif (strlen(input) > MAX_LEN || !isAlphanumeric(input)) {\n  return ERROR;\n}\n\`\`\`\n\n**3. Unencrypted Communication**\n❌ HTTP, plain MQTT\n✓ HTTPS, MQTT over TLS\n\n**4. No Update Mechanism**\n❌ Can't patch vulnerabilities\n✓ Implement secure OTA\n\n**5. Debug Ports Enabled**\n❌ JTAG accessible in production\n✓ Disable debug interfaces\n\nSee [OWASP IoT Top 10](https://owasp.org/www-project-internet-of-things/) for complete vulnerability list.`,
      
      `**Security Testing**\n\n**Penetration Testing:**\n• Port scanning (nmap)\n• Packet analysis (Wireshark)\n• Fuzzing inputs\n• Brute force attempts\n\n**Code Review:**\n• Static analysis (Coverity, SonarQube)\n• Secrets scanning\n• Dependency auditing\n• Peer reviews\n\n**Compliance:**\n• IEC 62443 (Industrial)\n• ETSI EN 303 645 (Consumer IoT)\n• NIST Cybersecurity Framework\n• ISO/IEC 27001`,
      
      `**Key Takeaways**\n\n✓ Implement secure boot on all devices\n✓ Encrypt all network traffic with TLS\n✓ Sign and verify OTA firmware updates\n✓ Use hardware security modules for keys\n✓ Never hardcode credentials\n✓ Validate all inputs rigorously\n✓ Disable debug ports in production\n✓ Keep firmware updated regularly\n✓ Follow OWASP IoT Top 10\n✓ Test security before deployment\n\nSecurity isn't optional—it's essential. One compromised device can expose entire networks. Build security in from day one, not as an afterthought.`
    ],
  },

  "ble-basics": {
    title: "BLE (Bluetooth Low Energy) Complete Guide",
    date: "2025-10-02",
    readTime: "7 min read",
    category: "Connectivity",
    seo: {
      metaTitle: "BLE Guide | Bluetooth Low Energy for IoT Projects",
      metaDescription: "Master BLE for IoT. Learn GATT services, characteristics, ESP32 BLE implementation, beacons, mobile app integration, and build wireless devices.",
      keywords: ["BLE", "Bluetooth Low Energy", "GATT services", "ESP32 BLE", "IoT wireless", "BLE beacons", "mobile app BLE"],
      featuredImage: "/blog/ble.jpg",
    },
    content: [
      `Bluetooth Low Energy (BLE) revolutionized short-range IoT connectivity with ultra-low power consumption and smartphone integration. This guide covers BLE fundamentals and practical ESP32 implementation for building wireless IoT devices.`,
      
      `**BLE vs Classic Bluetooth**\n\nKey differences:\n\n**Classic Bluetooth:**\n• High power consumption\n• Continuous connection\n• Audio streaming\n• File transfers\n• Range: 10-100m\n\n**BLE (Bluetooth Low Energy):**\n• 10-100x lower power\n• Connectionless possible\n• Small data packets\n• Sensors & IoT\n• Range: 10-50m\n• Battery life: Years vs weeks\n\nBLE is perfect for: Fitness trackers, smart home sensors, beacons, medical devices, asset tracking.`,
      
      `**GATT (Generic Attribute Profile)**\n\nBLE data hierarchy:\n\n**Profile** → Contains Services\n**Service** → Group of related characteristics (e.g., Heart Rate Service)\n**Characteristic** → Single data value (e.g., Heart Rate Measurement)\n**Descriptor** → Metadata about characteristic\n\nExample structure:\n\`\`\`\nHeart Rate Profile\n└── Heart Rate Service (UUID: 0x180D)\n    ├── Heart Rate Measurement (UUID: 0x2A37)\n    │   └── Client Characteristic Config (CCCD)\n    └── Body Sensor Location (UUID: 0x2A38)\n\`\`\`\n\nStandard services: [Bluetooth SIG Assigned Numbers](https://www.bluetooth.com/specifications/assigned-numbers/).`,
      
      `**ESP32 BLE Server Example**\n\nCreate a temperature sensor service:\n\n\`\`\`cpp\n#include <BLEDevice.h>\n#include <BLEServer.h>\n#include <BLEUtils.h>\n#include <BLE2902.h>\n\nBLEServer* pServer = NULL;\nBLECharacteristic* pCharacteristic = NULL;\nbool deviceConnected = false;\n\n#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"\n#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"\n\nclass ServerCallbacks: public BLEServerCallbacks {\n  void onConnect(BLEServer* pServer) {\n    deviceConnected = true;\n    Serial.println("Client connected");\n  }\n  \n  void onDisconnect(BLEServer* pServer) {\n    deviceConnected = false;\n    Serial.println("Client disconnected");\n    pServer->startAdvertising(); // Restart advertising\n  }\n};\n\nvoid setup() {\n  Serial.begin(115200);\n  \n  // Create BLE Device\n  BLEDevice::init("ESP32_TempSensor");\n  \n  // Create BLE Server\n  pServer = BLEDevice::createServer();\n  pServer->setCallbacks(new ServerCallbacks());\n  \n  // Create BLE Service\n  BLEService *pService = pServer->createService(SERVICE_UUID);\n  \n  // Create BLE Characteristic\n  pCharacteristic = pService->createCharacteristic(\n    CHARACTERISTIC_UUID,\n    BLECharacteristic::PROPERTY_READ |\n    BLECharacteristic::PROPERTY_NOTIFY\n  );\n  \n  // Add descriptor for notifications\n  pCharacteristic->addDescriptor(new BLE2902());\n  \n  // Start service\n  pService->start();\n  \n  // Start advertising\n  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();\n  pAdvertising->addServiceUUID(SERVICE_UUID);\n  pAdvertising->start();\n  \n  Serial.println("BLE Server ready!");\n}\n\nvoid loop() {\n  if (deviceConnected) {\n    float temperature = readTemperature();\n    char tempStr[8];\n    dtostrf(temperature, 1, 2, tempStr);\n    \n    pCharacteristic->setValue(tempStr);\n    pCharacteristic->notify(); // Send notification\n    Serial.print("Sent temperature: ");\n    Serial.println(tempStr);\n  }\n  delay(2000);\n}\n\`\`\`\n\nFor mobile apps, use [React Native BLE](https://github.com/dotintent/react-native-ble-plx) or [Flutter Blue](https://pub.dev/packages/flutter_blue).`,
      
      `**BLE Client (Central) Example**\n\nConnect to BLE server and read data:\n\n\`\`\`cpp\n#include <BLEDevice.h>\n\nstatic BLEUUID serviceUUID("4fafc201-1fb5-459e-8fcc-c5c9c331914b");\nstatic BLEUUID charUUID("beb5483e-36e1-4688-b7f5-ea07361b26a8");\n\nBLERemoteCharacteristic* pRemoteCharacteristic;\nbool connected = false;\n\nstatic void notifyCallback(BLERemoteCharacteristic* pChar, \n                           uint8_t* pData, \n                           size_t length, \n                           bool isNotify) {\n  Serial.print("Notify: ");\n  for (int i = 0; i < length; i++) {\n    Serial.print((char)pData[i]);\n  }\n  Serial.println();\n}\n\nclass ClientCallback : public BLEClientCallbacks {\n  void onConnect(BLEClient* pclient) {\n    connected = true;\n    Serial.println("Connected");\n  }\n  \n  void onDisconnect(BLEClient* pclient) {\n    connected = false;\n    Serial.println("Disconnected");\n  }\n};\n\nvoid setup() {\n  Serial.begin(115200);\n  BLEDevice::init("");\n  \n  BLEScan* pBLEScan = BLEDevice::getScan();\n  pBLEScan->setActiveScan(true);\n  \n  BLEScanResults foundDevices = pBLEScan->start(5);\n  \n  for (int i = 0; i < foundDevices.getCount(); i++) {\n    BLEAdvertisedDevice device = foundDevices.getDevice(i);\n    \n    if (device.haveName() && device.getName() == "ESP32_TempSensor") {\n      BLEClient* pClient = BLEDevice::createClient();\n      pClient->setClientCallbacks(new ClientCallback());\n      pClient->connect(&device);\n      \n      BLERemoteService* pRemoteService = pClient->getService(serviceUUID);\n      pRemoteCharacteristic = pRemoteService->getCharacteristic(charUUID);\n      \n      if (pRemoteCharacteristic->canNotify()) {\n        pRemoteCharacteristic->registerForNotify(notifyCallback);\n      }\n      break;\n    }\n  }\n}\n\nvoid loop() {\n  if (connected) {\n    std::string value = pRemoteCharacteristic->readValue();\n    Serial.print("Temperature: ");\n    Serial.println(value.c_str());\n  }\n  delay(5000);\n}\n\`\`\``,
      
      `**BLE Beacons**\n\nBroadcast-only devices for proximity detection:\n\n**iBeacon Format:**\n\`\`\`cpp\n#include <BLEDevice.h>\n#include <BLEBeacon.h>\n\nvoid setup() {\n  BLEDevice::init("ESP32_Beacon");\n  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();\n  \n  BLEBeacon beacon;\n  beacon.setManufacturerId(0x4C00); // Apple\n  beacon.setProximityUUID(BLEUUID("8ec76ea3-6668-48da-9866-75be8bc86f4d"));\n  beacon.setMajor(100);\n  beacon.setMinor(1);\n  \n  BLEAdvertisementData advData;\n  advData.setFlags(0x06);\n  advData.setManufacturerData(beacon.getData());\n  \n  pAdvertising->setAdvertisementData(advData);\n  pAdvertising->start();\n  \n  Serial.println("iBeacon started");\n}\n\`\`\`\n\nUse cases:\n• Indoor positioning\n• Retail proximity marketing\n• Museum exhibits\n• Asset tracking\n\nLearn more about [Eddystone beacons](https://github.com/google/eddystone).`,
      
      `**Power Optimization**\n\nBLE is low power, but can be even lower:\n\n**Advertising interval:**\n\`\`\`cpp\npAdvertising->setMinInterval(0x20); // 20ms (fast discovery)\npAdvertising->setMaxInterval(0x40); // 40ms\n\n// For long battery life:\npAdvertising->setMinInterval(1600); // 1 second\npAdvertising->setMaxInterval(3200); // 2 seconds\n\`\`\`\n\n**Connection parameters:**\n• Connection interval: 7.5ms - 4s\n• Slave latency: Skip connection events\n• Supervision timeout: Max time before disconnect\n\n**Sleep between transmissions:**\n\`\`\`cpp\npAdvertising->start();\ndelay(1000); // Advertise for 1 second\npAdvertising->stop();\nesp_deep_sleep(60 * 1000000); // Sleep 60 seconds\n\`\`\`\n\nResult: Years of battery life on CR2032 coin cell.`,
      
      `**Security**\n\nBLE 4.2+ includes encryption:\n\n**Pairing:**\n\`\`\`cpp\nBLESecurity *pSecurity = new BLESecurity();\npSecurity->setAuthenticationMode(ESP_LE_AUTH_REQ_SC_BOND);\npSecurity->setCapabilityIOType(ESP_IO_CAP_OUT);\npSecurity->setInitEncryptionKey(ESP_BLE_ENC_KEY_MASK | ESP_BLE_ID_KEY_MASK);\n\`\`\`\n\n**Authentication methods:**\n• Just Works (no security)\n• Passkey entry (6-digit PIN)\n• Out of band (NFC)\n• Numeric comparison\n\nAlways use pairing for sensitive data. For more, see [BLE security guide](https://www.bluetooth.com/blog/bluetooth-pairing-part-1-pairing-feature-exchange/).`,
      
      `**Troubleshooting**\n\n**Connection drops:**\n• Reduce distance (< 10m indoors)\n• Remove obstacles\n• Check for interference (WiFi 2.4GHz)\n• Increase connection interval\n\n**Can't find device:**\n• Check advertising is active\n• Verify UUIDs match\n• Use BLE scanner app (nRF Connect)\n• Check power supply\n\n**High power consumption:**\n• Increase advertising interval\n• Use connection mode instead of always-on advertising\n• Implement sleep modes\n• Reduce TX power`,
      
      `**Key Takeaways**\n\n✓ BLE enables ultra-low-power wireless IoT\n✓ GATT defines services and characteristics\n✓ ESP32 has excellent BLE support\n✓ Use standard UUIDs when possible\n✓ Implement notifications for real-time data\n✓ Optimize advertising intervals for battery life\n✓ Always pair for sensitive applications\n✓ Test with mobile apps early\n✓ BLE beacons perfect for broadcast-only needs\n\nBLE opens up exciting possibilities for battery-powered IoT devices with smartphone integration. With ESP32's built-in BLE, you can build sophisticated wireless sensors for under $5.`
    ],
  },

  "ota-updates": {
    title: "Secure OTA Firmware Updates for IoT",
    date: "2025-10-09",
    readTime: "7 min read",
    category: "Development",
    seo: {
      metaTitle: "OTA Updates Guide | Secure Firmware Updates for ESP32, Arduino, STM32",
      metaDescription: "Implement secure Over-The-Air firmware updates. Learn version management, rollback protection, delta updates, signing, and deploy safely.",
      keywords: ["OTA updates", "firmware updates", "ESP32 OTA", "secure OTA", "remote firmware update", "delta updates", "rollback protection"],
      featuredImage: "/blog/ota-updates.jpg",
    },
    content: [
      `Over-The-Air (OTA) firmware updates are essential for maintaining IoT devices in the field. Without OTA, you're stuck with unfixable bugs and security vulnerabilities. This guide covers secure OTA implementation for ESP32, Arduino, and STM32.`,
      
      `**Why OTA Updates Matter**\n\nBenefits:\n• Fix bugs remotely\n• Patch security vulnerabilities\n• Add new features\n• Reduce support costs\n• No physical access needed\n\nRisks without OTA:\n• Unfixable security holes\n• Bricked devices\n• Manual field updates ($50-200 per device)\n• Customer dissatisfaction\n\nExample: Nest Thermostat receives automatic updates for years after installation. Learn about [IoT update strategies](https://www.embedded.com/ota-updates-for-iot-devices/).`,
      
      `**OTA Architecture**\n\nComponents:\n1. **Firmware Server** - Hosts update files\n2. **Device Client** - Checks for updates\n3. **Version Management** - Track current/available versions\n4. **Signature Verification** - Ensure authenticity\n5. **Rollback Protection** - Prevent downgrades\n\nUpdate flow:\n\`\`\`\nDevice → Check version → Download firmware → Verify signature → Flash → Reboot → Verify boot → Confirm success\n\`\`\`\n\nIf verification fails at any step → Rollback to previous version.`,
      
      `**ESP32 Basic OTA**\n\nSimplest implementation (HTTP):\n\n\`\`\`cpp\n#include <WiFi.h>\n#include <HTTPUpdate.h>\n\nconst char* firmware_url = "http://192.168.1.100:8000/firmware.bin";\n\nvoid performOTA() {\n  Serial.println("Starting OTA update...");\n  \n  WiFiClient client;\n  t_httpUpdate_return ret = httpUpdate.update(client, firmware_url);\n  \n  switch(ret) {\n    case HTTP_UPDATE_FAILED:\n      Serial.printf("Update failed: %s\\n", \n                    httpUpdate.getLastErrorString().c_str());\n      break;\n      \n    case HTTP_UPDATE_NO_UPDATES:\n      Serial.println("No updates available");\n      break;\n      \n    case HTTP_UPDATE_OK:\n      Serial.println("Update successful! Rebooting...");\n      ESP.restart();\n      break;\n  }\n}\n\nvoid loop() {\n  // Check for updates every hour\n  static unsigned long lastCheck = 0;\n  if (millis() - lastCheck > 3600000) {\n    lastCheck = millis();\n    performOTA();\n  }\n}\n\`\`\`\n\n⚠️ This is insecure! Use only for testing.`,
      
      `**Secure OTA with HTTPS**\n\nAdd TLS encryption and certificate verification:\n\n\`\`\`cpp\n#include <WiFiClientSecure.h>\n#include <HTTPUpdate.h>\n\nconst char* firmware_url = "https://updates.example.com/firmware.bin";\nconst char* root_ca = R"EOF(\n-----BEGIN CERTIFICATE-----\nMIIDrzCCApegAwIBAgIQCDvgVpBCRrGhdWrJWZHHSjANBgkqhkiG9w0BAQUFADBh\n...\n-----END CERTIFICATE-----\n)EOF";\n\nvoid performSecureOTA() {\n  WiFiClientSecure client;\n  client.setCACert(root_ca);\n  \n  // Optional: Verify server certificate\n  client.setInsecure(); // For testing only!\n  \n  t_httpUpdate_return ret = httpUpdate.update(client, firmware_url);\n  \n  if (ret == HTTP_UPDATE_OK) {\n    Serial.println("Update successful!");\n    ESP.restart();\n  } else {\n    Serial.printf("Update failed: %s\\n",\n                  httpUpdate.getLastErrorString().c_str());\n  }\n}\n\`\`\`\n\nFor production, get certificates from [Let's Encrypt](https://letsencrypt.org/).`,
      
      `**Version Management**\n\nTrack firmware versions properly:\n\n\`\`\`cpp\n#define FIRMWARE_VERSION "1.2.3"\n\nstruct Version {\n  int major;\n  int minor;\n  int patch;\n};\n\nVersion parseVersion(const char* ver) {\n  Version v;\n  sscanf(ver, "%d.%d.%d", &v.major, &v.minor, &v.patch);\n  return v;\n}\n\nbool isNewerVersion(const char* current, const char* available) {\n  Version curr = parseVersion(current);\n  Version avail = parseVersion(available);\n  \n  if (avail.major > curr.major) return true;\n  if (avail.major == curr.major && avail.minor > curr.minor) return true;\n  if (avail.major == curr.major && avail.minor == curr.minor && \n      avail.patch > curr.patch) return true;\n  \n  return false;\n}\n\nvoid checkForUpdates() {\n  HTTPClient http;\n  http.begin("https://updates.example.com/version.json");\n  int httpCode = http.GET();\n  \n  if (httpCode == 200) {\n    String payload = http.getString();\n    // Parse JSON: {"version": "1.2.4", "url": "https://..."}\n    \n    if (isNewerVersion(FIRMWARE_VERSION, availableVersion)) {\n      Serial.println("New version available!");\n      performOTA(firmware_url);\n    }\n  }\n}\n\`\`\`\n\nUse semantic versioning: [SemVer Guide](https://semver.org/).`,
      
      `**Firmware Signing & Verification**\n\nPrevent malicious firmware:\n\n**Generate keys:**\n\`\`\`bash\n# Private key (keep secret!)\nopenssl genrsa -out private_key.pem 2048\n\n# Public key (embed in device)\nopenssl rsa -in private_key.pem -pubout -out public_key.pem\n\n# Sign firmware\nopenssl dgst -sha256 -sign private_key.pem -out firmware.sig firmware.bin\n\`\`\`\n\n**Verify on device:**\n\`\`\`cpp\n#include <mbedtls/pk.h>\n#include <mbedtls/sha256.h>\n\nbool verifyFirmware(const uint8_t* firmware, size_t firmware_len,\n                   const uint8_t* signature, size_t sig_len) {\n  // Hash firmware\n  uint8_t hash[32];\n  mbedtls_sha256(firmware, firmware_len, hash, 0);\n  \n  // Verify signature\n  mbedtls_pk_context pk;\n  mbedtls_pk_init(&pk);\n  \n  if (mbedtls_pk_parse_public_key(&pk, public_key, sizeof(public_key)) != 0) {\n    return false;\n  }\n  \n  int ret = mbedtls_pk_verify(&pk, MBEDTLS_MD_SHA256,\n                              hash, sizeof(hash),\n                              signature, sig_len);\n  \n  mbedtls_pk_free(&pk);\n  return (ret == 0);\n}\n\`\`\`\n\nFor ESP32 secure boot, check [ESP-IDF documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/security/secure-boot-v2.html).`,
      
      `**Rollback Protection**\n\nPrevent downgrade attacks:\n\n\`\`\`cpp\n#include <Preferences.h>\n\nPreferences prefs;\n\nvoid setup() {\n  prefs.begin("ota", false);\n  \n  String lastVersion = prefs.getString("last_version", "0.0.0");\n  String currentVersion = FIRMWARE_VERSION;\n  \n  if (!isNewerVersion(lastVersion.c_str(), currentVersion.c_str())) {\n    Serial.println("ERROR: Downgrade detected! Reverting...");\n    // Rollback to previous partition\n    esp_ota_set_boot_partition(previous_partition);\n    ESP.restart();\n  }\n  \n  // Update succeeded\n  prefs.putString("last_version", currentVersion);\n}\n\`\`\`\n\n**Dual partition strategy:**\n• Partition A: Current firmware\n• Partition B: New firmware\n• On success: Switch boot partition\n• On failure: Stay on Partition A`,
      
      `**Delta Updates**\n\nSave bandwidth with differential updates:\n\n**Generate delta:**\n\`\`\`bash\n# Using bsdiff\nbsdiff old_firmware.bin new_firmware.bin delta.patch\n\n# Delta is 10-30% of full size!\n\`\`\`\n\n**Apply delta on device:**\n\`\`\`cpp\n#include <bspatch.h>\n\nvoid applyDelta() {\n  // Read current firmware from flash\n  uint8_t* old_firmware = readCurrentFirmware();\n  \n  // Download delta patch\n  uint8_t* delta = downloadDelta();\n  \n  // Apply patch\n  uint8_t* new_firmware = (uint8_t*)malloc(NEW_SIZE);\n  int ret = bspatch(old_firmware, OLD_SIZE,\n                    new_firmware, NEW_SIZE,\n                    delta, DELTA_SIZE);\n  \n  if (ret == 0) {\n    writeToOTAPartition(new_firmware, NEW_SIZE);\n    esp_ota_set_boot_partition(ota_partition);\n    ESP.restart();\n  }\n}\n\`\`\`\n\nBandwidth savings: 500KB full update → 50KB delta. Learn more about [delta updates](https://mender.io/blog/delta-updates-in-iot).`,
      
      `**Best Practices**\n\n✓ Always use HTTPS for downloads\n✓ Sign firmware with private key\n✓ Verify signature before flashing\n✓ Implement rollback protection\n✓ Use semantic versioning\n✓ Test updates on dev devices first\n✓ Monitor update success rates\n✓ Provide manual rollback option\n✓ Log all update attempts\n✓ Keep previous version as backup\n\n**Production checklist:**\n1. Firmware signed?\n2. TLS enabled?\n3. Version check implemented?\n4. Rollback protection active?\n5. Monitoring in place?\n6. Staged rollout strategy?`,
      
      `**Key Takeaways**\n\n✓ OTA updates are essential for IoT maintenance\n✓ Always use HTTPS and signature verification\n✓ Implement dual-partition for safety\n✓ Track versions with semantic versioning\n✓ Use delta updates to save bandwidth\n✓ Test rollback scenarios thoroughly\n✓ Monitor update success rates\n✓ Start with staged rollouts\n✓ Never skip security measures\n\nOTA updates transform IoT devices from static appliances into evolvable platforms. Implement securely, test thoroughly, and you'll be able to support devices for years with confidence.`
    ],
  },

  "node-red-dashboards": {
    title: "Building IoT Dashboards with Node-RED",
    date: "2025-10-01",
    readTime: "8 min read",
    category: "Visualization",
    seo: {
      metaTitle: "Node-RED Dashboard Guide | Build Real-Time IoT Monitoring",
      metaDescription: "Master Node-RED for IoT dashboards. Learn flow-based programming, MQTT integration, dashboard widgets, database storage, and build production monitoring systems.",
      keywords: ["Node-RED", "IoT dashboard", "flow-based programming", "MQTT Node-RED", "real-time monitoring", "IoT visualization", "Node-RED dashboard"],
      featuredImage: "/blog/node-red.jpg",
    },
    content: [
      `Node-RED is a visual programming tool perfect for creating IoT dashboards and automation flows without extensive coding. This guide covers building production-ready real-time monitoring dashboards with MQTT, databases, and responsive UI widgets.`,
      
      `**What is Node-RED?**\n\nKey features:\n• **Flow-based programming** - Drag & drop nodes\n• **Browser-based editor** - No IDE needed\n• **Built-in dashboard** - Responsive UI widgets\n• **MQTT support** - Native IoT protocol integration\n• **Database connectors** - InfluxDB, MySQL, MongoDB\n• **Custom nodes** - 4000+ community packages\n• **REST APIs** - Easy external integrations\n\nBuilt on Node.js, runs on Raspberry Pi, cloud servers, or localhost. Created by IBM, now an OpenJS Foundation project.`,
      
      `**Installation**\n\n**On Raspberry Pi / Linux:**\n\`\`\`bash\nbash <(curl -sL https://raw.githubusercontent.com/node-red/linux-installers/master/deb/update-nodejs-and-nodered)\nsudo systemctl enable nodered.service\nsudo systemctl start nodered.service\n\`\`\`\n\n**On Windows / macOS:**\n\`\`\`bash\nnpm install -g --unsafe-perm node-red\nnode-red\n\`\`\`\n\n**Install Dashboard:**\n\`\`\`bash\ncd ~/.node-red\nnpm install node-red-dashboard\n\`\`\`\n\nAccess:\n• Editor: \`http://localhost:1880\`\n• Dashboard: \`http://localhost:1880/ui\`\n\nFor cloud hosting, try [FlowForge](https://flowforge.com/) or [Fred](https://fred.sensetecnic.com/).`,
      
      `**Basic Flow: MQTT to Dashboard**\n\nCreate a temperature monitoring dashboard:\n\n**1. Add MQTT Input Node**\n• Drag "mqtt in" node\n• Configure broker: \`mqtt://broker.hivemq.com\`\n• Topic: \`iot/sensor/temperature\`\n\n**2. Add Function Node (Optional)**\n\`\`\`javascript\n// Parse and format data\nvar temp = parseFloat(msg.payload);\nmsg.payload = temp.toFixed(1);\nmsg.topic = "Temperature";\nreturn msg;\n\`\`\`\n\n**3. Add Dashboard Nodes**\n• **Gauge** - Real-time value\n  - Min: 0, Max: 50\n  - Label: "Temperature (°C)"\n  - Color zones: < 20 (blue), 20-35 (green), > 35 (red)\n\n• **Chart** - Historical trend\n  - Type: Line\n  - X-axis: Last hour\n  - Y-axis: Temperature\n\n• **Text** - Current reading\n  - Format: \`{{msg.payload}}°C\`\n\nConnect: MQTT → Function → [Gauge, Chart, Text]\n\nDeploy and visit \`http://localhost:1880/ui\` to see live dashboard!`,
      
      `**Dashboard Widget Library**\n\n**Input Widgets:**\n• **Button** - Trigger actions\n• **Slider** - Numeric input\n• **Switch** - Toggle on/off\n• **Dropdown** - Select options\n• **Text Input** - Free text\n• **Date Picker** - Time selection\n\n**Output Widgets:**\n• **Gauge** - Speedometer display\n• **Chart** - Line, bar, pie charts\n• **Text** - Formatted output\n• **Notification** - Toast messages\n• **LED** - Status indicator\n• **Audio** - Sound alerts\n\n**Layout:**\n• **Group** - Container for widgets\n• **Tab** - Multiple pages\n• **Spacer** - Visual separation\n\nExample layout:\n\`\`\`\nTab: Home\n  Group: Living Room (2x2)\n    [Temperature Gauge] [Humidity Gauge]\n    [Light Switch]      [Status LED]\n  \n  Group: Kitchen (full width)\n    [Temperature Chart - Last 24h]\n\`\`\``,
      
      `**Database Integration**\n\n**InfluxDB (Time-series):**\n\n\`\`\`bash\nnpm install node-red-contrib-influxdb\n\`\`\`\n\nFlow:\n\`\`\`javascript\n// Function node: Format for InfluxDB\nmsg.payload = {\n  measurement: 'temperature',\n  fields: {\n    value: parseFloat(msg.payload)\n  },\n  tags: {\n    sensor: 'living_room',\n    location: 'home'\n  }\n};\nreturn msg;\n\`\`\`\n\nInfluxDB node config:\n• Server: \`localhost:8086\`\n• Database: \`iot_data\`\n• Write point: \`msg.payload\`\n\nQuery historical data:\n\`\`\`sql\nSELECT mean(value) FROM temperature \nWHERE time > now() - 24h \nGROUP BY time(1h)\n\`\`\`\n\nVisualize on Chart widget. Learn more at [InfluxDB docs](https://docs.influxdata.com/).`,
      
      `**REST API Integration**\n\nFetch weather data:\n\n\`\`\`javascript\n// HTTP Request node\nGET https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY\n\n// Function node: Parse response\nvar weather = msg.payload;\nmsg.payload = {\n  temp: weather.main.temp - 273.15, // Kelvin to Celsius\n  humidity: weather.main.humidity,\n  description: weather.weather[0].description\n};\nreturn msg;\n\`\`\`\n\nDisplay with dashboard Text widget:\n\`\`\`html\n<div>\n  <h3>London Weather</h3>\n  <p>Temperature: {{msg.payload.temp}}°C</p>\n  <p>Humidity: {{msg.payload.humidity}}%</p>\n  <p>{{msg.payload.description}}</p>\n</div>\n\`\`\`\n\nFor more APIs, explore [RapidAPI](https://rapidapi.com/hub).`,
      
      `**ESP32 to Node-RED**\n\nComplete example:\n\n**ESP32 Code:**\n\`\`\`cpp\n#include <WiFi.h>\n#include <PubSubClient.h>\n\nWiFiClient espClient;\nPubSubClient client(espClient);\n\nvoid setup() {\n  WiFi.begin("SSID", "PASSWORD");\n  client.setServer("192.168.1.100", 1883); // Node-RED host\n  client.connect("ESP32_Sensor");\n}\n\nvoid loop() {\n  float temp = readTemperature();\n  float humidity = readHumidity();\n  \n  // Publish as JSON\n  String json = "{\\"temp\\":" + String(temp) + ",\\"humidity\\":" + String(humidity) + "}";\n  client.publish("home/sensor/data", json.c_str());\n  \n  delay(60000); // Every minute\n}\n\`\`\`\n\n**Node-RED Flow:**\n1. MQTT In → \`home/sensor/data\`\n2. JSON Parse → \`msg.payload\`\n3. Split:\n   - \`msg.payload.temp\` → Temperature Gauge + Chart\n   - \`msg.payload.humidity\` → Humidity Gauge + Chart\n4. Store both to InfluxDB\n\nResult: Real-time dashboard updating every minute!`,
      
      `**Advanced Features**\n\n**Alerting with Telegram:**\n\n\`\`\`bash\nnpm install node-red-contrib-telegrambot\n\`\`\`\n\nFlow:\n\`\`\`javascript\n// Function: Check threshold\nif (msg.payload.temp > 30) {\n  msg.payload = "⚠️ High temperature alert: " + msg.payload.temp + "°C";\n  return msg;\n}\n// Don't send if temp is normal\nreturn null;\n\`\`\`\n\nTelegram node sends alert to your phone.\n\n**Email Notifications:**\n\`\`\`bash\nnpm install node-red-node-email\n\`\`\`\n\nConfigure SMTP and send formatted reports.\n\n**Voice Control with Alexa:**\n\`\`\`bash\nnpm install node-red-contrib-alexa-remote2\n\`\`\`\n\nControl IoT devices via voice commands.`,
      
      `**Production Deployment**\n\n**Security:**\n\`\`\`bash\n# Enable authentication\nnode-red-admin hash-pw\n\`\`\`\n\nEdit \`settings.js\`:\n\`\`\`javascript\nadminAuth: {\n  type: "credentials",\n  users: [{\n    username: "admin",\n    password: "$2b$08$...",\n    permissions: "*"\n  }]\n}\n\`\`\`\n\n**HTTPS:**\n\`\`\`javascript\nhttps: {\n  key: fs.readFileSync('privkey.pem'),\n  cert: fs.readFileSync('cert.pem')\n}\n\`\`\`\n\n**Reverse Proxy (Nginx):**\n\`\`\`nginx\nserver {\n  listen 80;\n  location / {\n    proxy_pass http://localhost:1880;\n    proxy_http_version 1.1;\n    proxy_set_header Upgrade $http_upgrade;\n    proxy_set_header Connection "upgrade";\n  }\n}\n\`\`\`\n\nFor cloud deployment, see [AWS IoT guide](https://aws.amazon.com/iot/).`,
      
      `**Key Takeaways**\n\n✓ Node-RED simplifies IoT dashboard creation\n✓ No coding needed for basic flows\n✓ Native MQTT and database support\n✓ Responsive dashboard works on mobile\n✓ 4000+ community nodes available\n✓ Perfect for rapid prototyping\n✓ Production-ready with proper security\n✓ Runs on Raspberry Pi or cloud\n✓ Visual programming saves development time\n✓ Great for non-programmers\n\nNode-RED democratizes IoT development. In hours, not days, you can build professional dashboards that monitor sensors, control devices, and alert you to problems—all with drag-and-drop simplicity.`
    ],
  },

  "esp32-usb-driver": {
    title: "ESP32/ESP8266 USB Driver Installation: Fix Port Detection Issues",
    date: "2025-10-27",
    readTime: "5 min read",
    category: "Troubleshooting",
    seo: {
      metaTitle: "ESP32/ESP8266 USB Driver Fix | Solve Port Detection Issues",
      metaDescription: "Fix ESP32/ESP8266 COM port not detected. Install CP2102, CH340, FTDI drivers on Windows, Mac, Linux. Complete troubleshooting guide for Arduino IDE.",
      keywords: ["ESP32 driver", "ESP8266 USB driver", "CP2102 driver", "CH340 driver", "COM port not detected", "Arduino IDE port issue", "ESP32 troubleshooting"],
      featuredImage: "/blog/esp32-usb-driver.jpg",
    },
    content: [
      `If you've ever connected your ESP32 or ESP8266 board to your computer only to find no COM port detected, you're not alone. This is one of the most common issues faced by IoT beginners and developers. The problem usually stems from missing or incompatible USB drivers, especially on Windows systems. Without proper drivers, your system can't communicate with the microcontroller, halting all uploads and serial monitoring.`,

      `In this guide, you'll learn how to correctly install the USB-to-serial drivers (CP2102, CH340, or FTDI) for your ESP boards, fix port detection errors, and ensure seamless uploads in [Arduino IDE](https://www.arduino.cc/en/software) or [PlatformIO](https://platformio.org/). By the end, you'll have your ESP device fully functional — ready to upload code and start building.`,

      `**Understanding ESP32/ESP8266 USB Drivers**\n\nEvery ESP board, whether ESP32 or ESP8266, uses a USB-to-Serial converter chip to communicate with your computer. These chips act as a bridge between your PC's USB port and the microcontroller's UART interface.\n\nThe most common USB-to-UART chips are:\n• **CP2102** – found in many ESP32 DevKit boards (by Silicon Labs)\n• **CH340/CH341** – used in cheaper ESP8266 NodeMCU boards\n• **FTDI FT232RL** – older but reliable option\n\nWithout the correct driver, your computer won't recognize the device, leading to "No COM Port Found" or "Device not detected" messages.`,

      `**Official Documentation Links:**\n• [ESP32 Getting Started Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/) – Espressif Docs\n• [Silicon Labs CP210x Drivers](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers) – Official CP2102 driver\n• [WCH CH340 Driver Download](http://www.wch-ic.com/downloads/CH341SER_EXE.html) – Official CH340 driver\n• [FTDI Drivers](https://ftdichip.com/drivers/vcp-drivers/) – FTDI official drivers`,

      `**Installing USB Drivers**\n\n**Step-by-Step for Windows:**\n\n1. **Identify your USB chip** — check your board marking (CH340, CP2102, or FTDI)\n2. **Download the correct driver:**\n   • [CP210x (Silicon Labs)](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers)\n   • [CH340/CH341 (WCH)](http://www.wch-ic.com/downloads/CH341SER_EXE.html)\n   • [FTDI Drivers](https://ftdichip.com/drivers/vcp-drivers/)\n3. Run the installer and restart your PC\n4. Connect your ESP board\n5. Open Device Manager → Ports (COM & LPT) to verify detection`,

      `**Step-by-Step for macOS/Linux:**\n\n**macOS:** CP2102 and CH340 require manual installation. Restart after install.\n\n**Linux:** Usually pre-installed. If not, use terminal:\n\`\`\`bash\nsudo apt-get install cp210x-dkms\nsudo modprobe cp210x\n\`\`\`\n\n**Related GitHub Resources:**\n• [CH340 Linux Support](https://github.com/juliagoda/CH341SER) – Community driver\n• [CP210x Driver Source](https://github.com/torvalds/linux/tree/master/drivers/usb/serial) – Linux kernel source`,

      `**Fixing Port Detection Issues**\n\nEven with the correct drivers, you may face missing port or upload failure issues. Here's how to fix them:\n\n1. **Check Cable Quality:** Some USB cables only supply power — use a data cable\n2. **Try a Different Port:** Avoid USB 3.0 ports; use USB 2.0 when possible\n3. **Board Not in Boot Mode:** Press and hold the BOOT button during upload (for ESP32)\n4. **Reinstall Driver:** Sometimes corrupted drivers block recognition. Uninstall and reinstall\n5. **Check Permissions (Linux/Mac):**\n\`\`\`bash\nsudo usermod -a -G dialout $USER\n\`\`\`\n6. **Manually Assign Port:** In Arduino IDE, go to Tools → Port and select the correct COM port`,

      `**Useful Troubleshooting Resources:**\n• [Random Nerd Tutorials – ESP32 Troubleshooting](https://randomnerdtutorials.com/esp32-troubleshooting-guide/) – Comprehensive guide\n• [Arduino Forum: Port Issues](https://forum.arduino.cc/c/hardware/12) – Community help`,

      `**Uploading Code After Fix**\n\nOnce your ESP board appears under a COM port, you can test it with a simple Blink sketch.\n\n**Example for ESP32 in Arduino IDE:**\n\`\`\`cpp\n#define LED_BUILTIN 2\n\nvoid setup() {\n  pinMode(LED_BUILTIN, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED_BUILTIN, HIGH);\n  delay(1000);\n  digitalWrite(LED_BUILTIN, LOW);\n  delay(1000);\n}\n\`\`\`\n\nSelect your board and correct port from the Tools menu, then upload.`,

      `If it compiles and flashes successfully, you'll see your onboard LED blinking — confirming both driver installation and serial communication are working properly.\n\n**Development Tool Links:**\n• [Arduino IDE Download](https://www.arduino.cc/en/software) – Official IDE\n• [PlatformIO IDE](https://platformio.org/) – Advanced development environment\n• [ESP32 Arduino Core](https://github.com/espressif/arduino-esp32) – ESP32 board support`,

      `**Advanced Debugging Tips**\n\nIf your ESP device still isn't recognized:\n\n• **Use Serial Monitor Tools** like [PuTTY](https://www.putty.org/) or [CoolTerm](https://freeware.the-meiers.org/) to test connectivity\n• **Check Board Power:** ESP32 may draw more current; use a powered USB hub\n• **Update Firmware:** Use [esptool.py](https://github.com/espressif/esptool) to erase and reflash firmware:\n\`\`\`bash\nesptool.py erase_flash\nesptool.py write_flash 0x1000 firmware.bin\n\`\`\`\n• **Change USB cable or adapter:** Cheap cables often lack data lines\n• **Try different PCs:** Helps isolate hardware vs. software issues`,

      `**Community Resources:**\n• [ESP32 Forum – Espressif](https://www.esp32.com/) – Official support forum\n• [Stack Overflow: ESP8266 Port Detection](https://stackoverflow.com/questions/tagged/esp8266) – Q&A community\n• [Reddit r/esp32](https://www.reddit.com/r/esp32/) – Active ESP32 community\n• [GitHub ESP32 Issues](https://github.com/espressif/arduino-esp32/issues) – Report and track bugs`,

      `**Key Takeaways**\n\n✓ Identify your USB chip (CP2102, CH340, or FTDI)\n✓ Install the official driver for your OS\n✓ Verify COM port in Device Manager\n✓ Use quality data cables\n✓ Fix permissions on Linux/macOS\n✓ Always restart after driver installation\n✓ Press BOOT button during upload if needed\n✓ Test with simple Blink sketch\n✓ Check community forums for specific issues\n\nInstalling the correct USB driver is the first step to making your ESP32 or ESP8266 project come alive. From missing ports to upload errors, most issues trace back to incompatible or missing drivers. Once installed properly, your microcontroller can communicate seamlessly with your IDE, enabling you to build, test, and deploy IoT projects without frustration.\n\n**Next Steps:**\n• [How to Program ESP32 with Arduino IDE](https://randomnerdtutorials.com/getting-started-with-esp32/) – Getting started tutorial\n• [ESP32 Pinout Reference Guide](https://randomnerdtutorials.com/esp32-pinout-reference-gpios/) – Complete pinout diagram\n• [ESP32 Troubleshooting: Common Errors Explained](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/fatal-errors.html) – Official error guide`
    ],
  },
};

const BlogPost = () => {
```
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const path = slug || "power-consumption";
  const post = articles[path as keyof typeof articles];
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Article Not Found</h1>
            <p className="text-muted-foreground">
              The article "{path}" doesn't exist.
            </p>
            <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post.title;
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {post.seo && (
        <SEO
          title={post.seo.metaTitle}
          description={post.seo.metaDescription}
          keywords={post.seo.keywords}
          image={post.seo.featuredImage}
          type="article"
          publishedTime={post.date}
          category={post.category}
        />
      )}
      <Navigation />

      {/* Progress Indicator */}
      <div className="fixed bottom-8 right-8 z-50 hidden md:block">
        <div className="relative w-28 h-28 group cursor-pointer">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-purple-600 blur-2xl opacity-60 animate-pulse"></div>
          <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-full shadow-2xl border-4 border-white dark:border-gray-800"></div>
          <svg className="absolute inset-0 w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
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
              className="transition-all duration-500"
              style={{ filter: "drop-shadow(0 0 12px rgba(0, 154, 217, 0.8))" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#009AD9" />
                <stop offset="100%" stopColor="#9333EA" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl font-black bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
              {Math.round(scrollProgress)}%
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <article className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <Button onClick={() => navigate("/blog")} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
                <Button onClick={() => navigate("/blog")} variant="outline" size="icon">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <header className="mb-12">
                <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-full">{post.category}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t flex items-center gap-3">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share:
                  </span>
                  <div className="flex gap-2">
                    <Button onClick={() => handleShare("twitter")} variant="outline" size="sm">Twitter</Button>
                    <Button onClick={() => handleShare("linkedin")} variant="outline" size="sm">LinkedIn</Button>
                    <Button onClick={() => handleShare("whatsapp")} variant="outline" size="sm">WhatsApp</Button>
                    <Button onClick={() => handleShare("facebook")} variant="outline" size="sm">Facebook</Button>
                  </div>
                </div>
              </header>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                {post.content.map((paragraph, index) => (
                  <div key={index} className="mb-6">
                    {paragraph.split("\n").map((line, lineIdx) => {
                      if (line.startsWith("```")) {
                        return null;
                      }
                      return (
                        <p key={lineIdx} className={line.startsWith("•") ? "pl-6 my-1" : "mb-2"}>
                          {parseContent(line)}
                        </p>
                      );
                    })}
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
