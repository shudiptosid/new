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
};

const BlogPost = () => {
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
