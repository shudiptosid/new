import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  X,
  ArrowLeft,
  Share2,
  ExternalLink,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
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
      metaDescription:
        "Master power optimization techniques to extend battery life 10-50x. Learn sleep modes, DVFS, low-power protocols, and energy harvesting for sustainable IoT devices.",
      keywords: [
        "IoT power optimization",
        "battery life",
        "sleep modes",
        "low power design",
        "ESP32 deep sleep",
        "Arduino power saving",
        "STM32 low power",
        "energy harvesting",
        "DVFS",
        "duty cycling",
        "power profiling",
        "solar IoT",
        "LoRaWAN",
        "BLE low power",
        "modem sleep",
      ],
      featuredImage: "/blog/power-optimization.jpg",
    },
    content: [
      `Introduction\n\nIoT devices are everywhere — from smart sensors to environmental monitors — but one issue limits them all: battery life. Imagine deploying 1000 sensors only to find yourself changing batteries every few days. The problem? Inefficient power management.\n\nThis article teaches you how to extend battery life 10–50× using practical, real-world techniques: deep sleep, dynamic voltage and frequency scaling (DVFS), low-power connectivity, and energy harvesting. You'll learn official methods from Espressif and Arduino, use open-source GitHub examples, and discover tools that help measure and reduce power draw — all to make your IoT devices truly sustainable.`,

      `Use Sleep Modes & Duty Cycling\n\nThe most effective way to save power is to keep your device asleep most of the time. Both ESP32 and ESP8266 include several sleep modes (light, deep, and hibernation). In deep-sleep, the current draw drops from ~80 mA active to under 10 µA idle!\n\n\`\`\`cpp\nesp_sleep_enable_timer_wakeup(10 * 60 * 1000000); // wake every 10 minutes\nSerial.println("Going to sleep now");\nesp_deep_sleep_start();\n\`\`\`\n\nWhen the timer triggers, the chip wakes, transmits data, and sleeps again — ideal for battery-powered sensors.\n\nReferences:\n• [ESP32 Deep Sleep API Guide – Espressif Docs](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/sleep_modes.html) (Official)\n• [Arduino Low Power Library](https://www.arduino.cc/reference/en/libraries/arduino-low-power/) (Official)\n• [Random Nerd Tutorials: ESP32 Deep Sleep with Wake-Up Sources](https://randomnerdtutorials.com/esp32-deep-sleep-arduino-ide-wake-up-sources/) (Tutorial)\n• [GitHub: ESP32 Deep Sleep Example Code](https://github.com/espressif/arduino-esp32/tree/master/libraries/ESP32/examples/DeepSleep) (GitHub)\n\nBy scheduling wake intervals smartly (called duty cycling), you can achieve 10×–100× improvement in operating life.`,

      `Apply DVFS & Clock Gating\n\nEven when active, your MCU doesn't always need full power. That's where Dynamic Voltage and Frequency Scaling (DVFS) comes in. It allows your device to lower CPU frequency and voltage during low workloads.\n\n\`\`\`cpp\nsetCpuFrequencyMhz(80); // reduce from 240 MHz\nWiFi.disconnect(true);\nbtStop();               // disable Bluetooth\n\`\`\`\n\nReducing CPU frequency cuts current proportionally. Similarly, clock gating turns off peripherals (like ADC, SPI) when idle.\n\nReferences:\n• [ESP-IDF Power Management API – Espressif Docs](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/power_management.html) (Official)\n• [Low Power Design Techniques – Fiveable IoT Systems Guide](https://library.fiveable.me/key-terms/iot-systems/low-power-design-techniques) (Tutorial)\n• [GitHub: ESP32 Power Management Example](https://github.com/espressif/esp-idf/tree/master/examples/system/deep_sleep) (GitHub)\n\nCombined with deep sleep, these techniques can extend battery life by up to 20× for periodic sensor networks.`,

      `Choose Low-Power Communication Protocols\n\nWireless communication is the biggest battery drainer in IoT devices. Choosing efficient protocols makes a massive difference.\n\nFor short-range, use Bluetooth Low Energy (BLE); for long-range, LoRa or NB-IoT; and if using Wi-Fi (ESP32), enable modem-sleep to turn off the radio between packets.\n\n\`\`\`cpp\nWiFi.mode(WIFI_MODEM_SLEEP);\nWiFi.setSleep(true);\n\`\`\`\n\nThis reduces idle current from 70 mA to about 5 mA during standby.\n\nReferences:\n• [Low Power Wi-Fi Guidelines – Espressif Docs](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/wifi.html#wi-fi-sleep) (Official)\n• [LoRaWAN Overview – The Things Network Docs](https://www.thethingsnetwork.org/docs/lorawan/) (Official)\n• [Random Nerd Tutorials: ESP32 WiFi Modem Sleep](https://randomnerdtutorials.com/esp32-wifi-modes-sleep-mode/) (Tutorial)\n• [GitHub: LoRa Low Power Node Example](https://github.com/matthijskooijman/arduino-lmic) (GitHub)\n\nBy sending fewer, compressed packets and using event-driven wakeups, your device can conserve even more energy.`,

      `Energy Harvesting & Smart Power Management\n\nTo go beyond optimization and reach energy autonomy, use energy harvesting — converting solar, vibration, or RF energy into power. Pair that with intelligent power management to recharge batteries or supercapacitors.\n\nA simple solar IoT circuit can power a node indefinitely:\n• A 5 V mini solar panel\n• TP4056 charge controller\n• 18650 Li-ion battery\n• Low-dropout regulator for stable 3.3 V\n\nReferences:\n• [Energy Harvesting Overview – Wikipedia](https://en.wikipedia.org/wiki/Energy_harvesting) (Community)\n• [Maximum Power Point Tracking (MPPT)](https://en.wikipedia.org/wiki/Maximum_power_point_tracking) (Community)\n• [ResearchGate: Machine Learning for Power Optimization in IoT](https://www.researchgate.net/publication/350586439_Machine_Learning_for_Power_Optimization_in_IoT) (Research)\n• [GitHub: Solar ESP32 IoT Node Example](https://github.com/G6EJD/ESP32-Solar-Powered-Weather-Station) (GitHub)\n\nWith proper sleep scheduling and solar charging, many IoT sensors can operate for years without maintenance.`,

      `Tools for Measuring & Tuning Power\n\nBefore optimizing, you need to measure. Tools like uCurrent Gold, Nordic Power Profiler Kit II, and Monsoon Power Monitor give microamp-level precision.\n\nYou can also use open-source monitoring libraries to measure runtime power usage directly from your board.\n\n\`\`\`cpp\n#include <ArduinoLowPower.h>\nLowPower.deepSleep(5000);\n\`\`\`\n\nReferences:\n• [Arduino LowPower Library Documentation](https://www.arduino.cc/reference/en/libraries/arduino-low-power/) (Official)\n• [PlatformIO Power Profiling Tools](https://docs.platformio.org/en/latest/plus/debugging.html) (Official)\n• [uCurrent Gold Product Page](https://www.eevblog.com/product/ucurrent/) (Tool)\n• [GitHub: Power Profiler Tool Scripts](https://github.com/NordicSemiconductor/pc-nrfconnect-ppk)\n\nUsing these tools, you can identify power spikes, compare sleep durations, and systematically refine your firmware for efficiency.`,

      `Conclusion\n\nPower optimization in IoT is about efficiency and longevity — getting maximum data per milliamp. Whether you're building environmental sensors or industrial nodes, applying these techniques ensures your devices stay online longer and require less maintenance.\n\nKey Takeaways:\n• Use deep sleep and duty cycling\n• Apply DVFS and clock gating\n• Choose low-power communication protocols\n• Explore energy harvesting for self-sustainability\n• Measure and refine using power profiling tools\n\nCall to Action:\nStart by testing deep sleep on your ESP32 today. Track your battery performance for a week — you'll be amazed at the difference!\n\nRelated Reads:\n• ESP32 Deep Sleep Guide\n• Designing Solar-Powered IoT Devices`,
    ],
  },

  rtos: {
    title: "Real-Time Operating Systems (RTOS) for IoT",
    date: "2025-10-08",
    readTime: "7 min read",
    category: "RTOS",
    seo: {
      metaTitle: "RTOS for IoT: FreeRTOS & Zephyr Complete Guide",
      metaDescription:
        "Master Real-Time Operating Systems for IoT. Learn FreeRTOS, Zephyr, task scheduling, inter-task communication, and build production-ready embedded systems with predictable timing.",
      keywords: [
        "RTOS",
        "FreeRTOS",
        "Zephyr",
        "embedded systems",
        "task scheduling",
        "real-time OS",
        "IoT operating system",
        "inter-task communication",
        "queues",
        "semaphores",
        "mutexes",
        "ESP32 RTOS",
        "STM32 RTOS",
        "Arduino FreeRTOS",
        "multitasking",
      ],
      featuredImage: "/blog/rtos.jpg",
    },
    content: [
      `## Introduction\n\nIoT devices are no longer just simple sensors — they're smart, connected systems managing multiple operations in real time. From autonomous drones to industrial robots, these devices must handle concurrent tasks, precise timing, and reliable communication.\n\nThat's where an RTOS (Real-Time Operating System) comes in. It ensures tasks run predictably, even under heavy load.\n\nIn this complete guide, you'll learn how RTOS works, explore FreeRTOS and Zephyr OS, understand task scheduling, inter-task communication, and build efficient, production-grade IoT firmware. We'll use official documentation, GitHub examples, and real embedded code — all designed for platforms like ESP32, STM32, and Arduino boards.\n\nBy the end, you'll know exactly how to structure multitasking IoT systems that are reliable, fast, and scalable.`,

      `## What Is an RTOS and Why Use It?\n\nA Real-Time Operating System (RTOS) is a lightweight OS designed to handle multiple concurrent tasks with predictable timing. It ensures that high-priority tasks always execute within defined deadlines — a must for real-time IoT applications.\n\nUnlike traditional firmware (where the code runs sequentially in a loop), RTOS allows true multitasking, breaking functionality into independent threads (tasks) with individual priorities.\n\nFor example, in a smart home system:\n• Task 1: Read temperature every second\n• Task 2: Send data to server every minute\n• Task 3: Handle user commands instantly\n\nWithout an RTOS, these might block each other. With it, they run concurrently — reliably and efficiently.\n\n**References:**\n• [FreeRTOS Official Overview](https://www.freertos.org/RTOS.html) (Official)\n• [Zephyr Project Documentation](https://docs.zephyrproject.org/latest/) (Official)\n• [Wikipedia: Real-Time Operating System](https://en.wikipedia.org/wiki/Real-time_operating_system) (Community)\n• [GitHub: FreeRTOS Kernel Source](https://github.com/FreeRTOS/FreeRTOS-Kernel) (GitHub)\n\nRTOS makes IoT firmware modular, responsive, and production-grade — ideal for complex devices.`,

      `## Core RTOS Concepts: Tasks, Scheduling & Priority\n\nRTOS revolves around tasks — independent functions running under a scheduler. Each task is assigned a priority level. The scheduler decides which task executes next, ensuring that higher-priority tasks preempt lower ones.\n\n**FreeRTOS Example: Creating Tasks**\n\n\`\`\`cpp\n#include <Arduino_FreeRTOS.h>\n\nvoid TaskSensor(void *pvParameters) {\n  while(1) {\n    int val = analogRead(A0);\n    Serial.println(val);\n    vTaskDelay(1000 / portTICK_PERIOD_MS);\n  }\n}\n\nvoid TaskLED(void *pvParameters) {\n  while(1) {\n    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));\n    vTaskDelay(500 / portTICK_PERIOD_MS);\n  }\n}\n\nvoid setup() {\n  xTaskCreate(TaskSensor, "Sensor", 128, NULL, 1, NULL);\n  xTaskCreate(TaskLED, "LED", 128, NULL, 2, NULL);\n}\n\`\`\`\n\nHere, both tasks run concurrently — the LED blinks while the sensor reads periodically.\n\n**References:**\n• [FreeRTOS Task Management API](https://www.freertos.org/a00019.html) (Official)\n• [Zephyr Thread Scheduling Guide](https://docs.zephyrproject.org/latest/kernel/services/scheduling/index.html) (Official)\n• [GitHub: Arduino FreeRTOS Library](https://github.com/feilipu/Arduino_FreeRTOS_Library) (GitHub)\n\nThis modular design improves responsiveness and makes debugging simpler.`,

      `**Inter-Task Communication (Queues, Semaphores, Mutexes)**\n\nWhen multiple tasks run, they need to share data safely. RTOS provides inter-task communication mechanisms such as:\n• **Queues:** Pass data between tasks (FIFO order)\n• **Semaphores:** Control shared resources\n• **Mutexes:** Prevent concurrent access to critical sections\n\n**FreeRTOS Example – Using Queues:**\n\n\`\`\`cpp\nQueueHandle_t sensorQueue;\n\nvoid TaskSensor(void *pvParameters) {\n  int value;\n  while(1) {\n    value = analogRead(A0);\n    xQueueSend(sensorQueue, &value, portMAX_DELAY);\n    vTaskDelay(1000 / portTICK_PERIOD_MS);\n  }\n}\n\nvoid TaskDisplay(void *pvParameters) {\n  int received;\n  while(1) {\n    if (xQueueReceive(sensorQueue, &received, portMAX_DELAY))\n      Serial.println(received);\n  }\n}\n\`\`\`\n\n**References:**\n• [FreeRTOS Queues Documentation](https://www.freertos.org/a00018.html) (Official)\n• [Zephyr IPC (Inter-Process Communication)](https://docs.zephyrproject.org/latest/kernel/services/data_passing/index.html) (Official)\n• [GitHub: FreeRTOS Example Projects](https://github.com/FreeRTOS/FreeRTOS/tree/main/FreeRTOS/Demo) (GitHub)\n• [Random Nerd Tutorials: ESP32 FreeRTOS Queues](https://randomnerdtutorials.com/esp32-dual-core-arduino-ide/) (Tutorial)\n\nThese tools prevent conflicts and ensure data integrity across concurrent tasks.`,

      `**Memory Management & Timing in RTOS**\n\nMemory control and precise timing are crucial in IoT systems. RTOSes use deterministic memory allocation and tick-based timers to maintain predictability.\n\nFor example, FreeRTOS uses \`vTaskDelay()\` and \`xTimerCreate()\` for event scheduling. Zephyr goes further with \`k_timer\` and workqueue APIs.\n\n**FreeRTOS Timer Example:**\n\n\`\`\`cpp\nTimerHandle_t sensorTimer;\n\nvoid vTimerCallback(TimerHandle_t xTimer) {\n  Serial.println("Sensor read event triggered!");\n}\n\nvoid setup() {\n  sensorTimer = xTimerCreate("Timer", pdMS_TO_TICKS(5000), pdTRUE, 0, vTimerCallback);\n  xTimerStart(sensorTimer, 0);\n}\n\`\`\`\n\n**References:**\n• [FreeRTOS Software Timers API](https://www.freertos.org/FreeRTOS-Software-Timer-API-Functions.html) (Official)\n• [Zephyr Timing Subsystem](https://docs.zephyrproject.org/latest/kernel/services/timing/clocks.html) (Official)\n• [GitHub: Zephyr RTOS Source Code](https://github.com/zephyrproject-rtos/zephyr) (GitHub)\n• [Tutorial: FreeRTOS Timing and Scheduling](https://www.digikey.com/en/maker/projects/introduction-to-rtos-solution-to-part-4-memory-management/6d4dfcaa1ff84f57a2098da8e6401d9c) (Tutorial)\n\nThese APIs make your IoT system's timing deterministic, which is key for robotics, automation, and industrial IoT.`,

      `## Debugging, Tools & RTOS Integration in IoT\n\nDeveloping for RTOS means debugging concurrency and timing — tools are your best friend.\n\nUse PlatformIO, Segger SystemView, or FreeRTOS Tracealyzer to visualize task execution and CPU load. With Zephyr, use the west command-line tool for build and debug automation.\n\n**References:**\n• [PlatformIO RTOS Integration Docs](https://docs.platformio.org/en/latest/frameworks/index.html) (Official)\n• [Tracealyzer for FreeRTOS](https://percepio.com/tracealyzer/) (Tool)\n• [Segger SystemView Tool](https://www.segger.com/products/development-tools/systemview/) (Tool)\n• [Zephyr West Build System Docs](https://docs.zephyrproject.org/latest/develop/west/index.html) (Official)\n\n**Community Links:**\n• [FreeRTOS Community Forum](https://forums.freertos.org/) (Community)\n• [Zephyr Discourse Community](https://github.com/zephyrproject-rtos/zephyr/discussions) (Community)\n\nWith the right tools and IDE integration, you can debug complex RTOS projects just as easily as single-threaded firmware.`,

      `## Conclusion\n\nRTOS is the backbone of modern IoT firmware — enabling multitasking, real-time responsiveness, and robust performance.\n\n**Key Takeaways:**\n• RTOS enables concurrent task execution\n• Use FreeRTOS or Zephyr for reliable IoT systems\n• Implement queues, semaphores, and timers for communication\n• Optimize priority scheduling for real-time performance\n• Use debugging tools like Tracealyzer and SystemView\n\n**Call to Action:**\nStart small — run a FreeRTOS blink + sensor task example on your ESP32 today. Once comfortable, move to Zephyr and explore more advanced schedulers and IPC mechanisms.\n\n**Related Reads:**\n• [ESP32 FreeRTOS Multitasking Guide](https://randomnerdtutorials.com/esp32-dual-core-arduino-ide/)\n• [Zephyr RTOS on ESP32: Getting Started](https://docs.zephyrproject.org/latest/boards/xtensa/esp32/doc/index.html)`,
    ],
  },

  "lorawan-networks": {
    title: "Building Resilient LoRaWAN Networks",
    date: "2025-09-25",
    readTime: "7 min read",
    category: "Networking",
    seo: {
      metaTitle: "LoRaWAN Network Design | Best Practices for Remote IoT",
      metaDescription:
        "Best practices for designing and deploying reliable long-range wireless sensor networks in challenging environments and remote locations with LoRaWAN technology.",
      keywords: [
        "LoRaWAN",
        "LoRa gateway",
        "long-range IoT",
        "LPWAN",
        "remote sensors",
        "IoT connectivity",
        "adaptive data rate",
        "ADR",
        "network redundancy",
        "LoRa security",
        "gateway placement",
        "antenna optimization",
        "ChirpStack",
        "The Things Network",
        "LoRa monitoring",
      ],
      featuredImage: "/blog/lorawan.jpg",
    },
    content: [
      `## Introduction\n\nLoRaWAN (Long Range Wide Area Network) has become a game-changer for IoT deployments in rural and industrial settings. It enables low-power devices to communicate over kilometers — ideal for agriculture, environmental monitoring, and smart cities.\n\nHowever, designing a resilient LoRaWAN network isn't as simple as dropping a few gateways and nodes. In remote or noisy environments, signal fading, packet loss, and interference can disrupt communication and reduce reliability.\n\nThis article walks you through the best practices for building strong, self-healing, and scalable LoRaWAN networks. You'll learn about adaptive data rate (ADR), redundant gateways, antenna optimization, security measures, and real-world deployment tips. By the end, you'll be ready to design professional-grade, fault-tolerant LoRaWAN networks that work even in the harshest terrains.`,

      `## Understanding LoRaWAN Architecture\n\nBefore you can optimize for reliability, you need to understand the LoRaWAN architecture. It has three main components:\n\n• **End Devices (Nodes):** Sensors or actuators that send small packets.\n• **Gateways:** Collect radio messages from nodes and forward them to a network server via IP.\n• **Network & Application Servers:** Handle device registration, message deduplication, and data forwarding to cloud apps.\n\nLoRaWAN uses a star-of-stars topology, where nodes talk directly to multiple gateways simultaneously. This redundancy enhances reliability — if one gateway fails, another can still receive data.\n\n**References:**\n• [LoRa Alliance – What Is LoRaWAN](https://lora-alliance.org/about-lorawan/) (Official)\n• [The Things Network LoRaWAN Architecture Docs](https://www.thethingsnetwork.org/docs/lorawan/) (Official)\n• [GitHub: LoRaWAN Specification Repository](https://github.com/Lora-net/LoRaMac-node) (GitHub)\n• [Wikipedia: LoRaWAN Overview](https://en.wikipedia.org/wiki/LoRa) (Community)\n\nThis redundancy-first architecture is the foundation of a resilient IoT system.`,

      `## Adaptive Data Rate (ADR) & Link Optimization\n\nA key to reliability in LoRaWAN is Adaptive Data Rate (ADR) — a mechanism that dynamically adjusts data rate and transmit power based on network conditions. When a node is close to a gateway, ADR lowers its spreading factor, reducing time-on-air and power consumption.\n\n**Example (Arduino/ESP32 LoRa Node):**\n\n\`\`\`cpp\n#include <lmic.h>\n#include <hal/hal.h>\n\nvoid setup() {\n  os_init();\n  LMIC_setAdrMode(1);   // Enable Adaptive Data Rate\n}\n\`\`\`\n\nEnabling ADR helps balance network load and minimizes packet collisions in dense networks. However, for mobile or rapidly changing environments, disable ADR and manage the spreading factor manually.\n\n**References:**\n• [LoRa Alliance ADR Specification](https://lora-alliance.org/wp-content/uploads/2020/11/lorawan_regional_parameters_v1.0.3reva_0.pdf) (Official)\n• [The Things Network ADR Docs](https://www.thethingsnetwork.org/docs/lorawan/adaptive-data-rate/) (Official)\n• [GitHub: Arduino LMIC Library](https://github.com/mcci-catena/arduino-lmic) (GitHub)\n• [Tutorial: LoRa ADR Explained – RNT](https://randomnerdtutorials.com/esp32-lora-rfm95-transceiver-arduino-ide/) (Tutorial)\n\nADR optimizes range, battery life, and network throughput — critical for resilient IoT networks.`,

      `## Redundancy, Gateways, and Network Planning\n\nResilience depends on redundancy and proper network planning. Always deploy at least two overlapping gateways for each coverage zone. That ensures no single point of failure.\n\nWhen planning gateway placement:\n• Use tools like RadioPlanner or Helium Coverage Mapper for range prediction.\n• Choose high-gain antennas (5–8 dBi) for gateways.\n• Mount gateways above obstacles (≥15 m for rural, ≥10 m for urban).\n\nIn case of packet loss, LoRaWAN Class B or C devices can use downlink acknowledgments to confirm message delivery.\n\n**References:**\n• [Semtech LoRa Network Planning Guide](https://www.semtech.com/uploads/documents/an1200.22.pdf) (Official)\n• [The Things Stack Gateway Setup Guide](https://www.thethingsindustries.com/docs/gateways/) (Official)\n• [GitHub: TTN Gateway Firmware](https://github.com/TheThingsNetwork/gateway-conf) (GitHub)\n• [Tool: RadioPlanner Coverage Tool](https://www.radioplanner.com/) (Tool)\n\nRedundancy ensures your network survives interference, hardware failure, or power loss.`,

      `## Antenna Design & Environmental Factors\n\nEven the best network fails if RF propagation isn't optimized. A proper antenna setup can improve coverage by over 50%.\n\n**Key guidelines:**\n• Match antenna gain to environment (urban < 5 dBi, rural > 8 dBi).\n• Use low-loss coaxial cables (LMR400) for long connections.\n• Protect antennas using lightning arrestors and waterproof enclosures.\n• Always maintain line-of-sight between node and gateway.\n\nIn dense forests or cities, use repeater nodes or higher spreading factors for better signal penetration.\n\n**References:**\n• [Semtech Antenna Design Guidelines](https://www.semtech.com/uploads/documents/an1200.13.pdf) (Official)\n• [LoRaWAN RF Best Practices – The Things Network](https://www.thethingsnetwork.org/docs/lorawan/rf-planning/) (Official)\n• [GitHub: LoRa Antenna Tuning Example](https://github.com/sandeepmistry/arduino-LoRa) (GitHub)\n• [Community: TTN Forum – Antenna Installations](https://www.thethingsnetwork.org/forum/c/gateways) (Community)\n\nBy combining optimized antennas with smart placement, you can overcome range and interference challenges effectively.`,

      `## Security, Firmware & Network Reliability\n\nA resilient network must also be secure and maintainable. LoRaWAN supports AES-128 encryption for both payload and network layers. Always use unique AppKeys and DevEUIs to prevent replay or cloning attacks.\n\nFor firmware resilience:\n• Implement Over-the-Air Updates (FOTA) using platforms like The Things Stack or AWS IoT Core for LoRaWAN.\n• Store firmware version metadata for rollback in case of update failure.\n\n**Code Snippet – Secure Key Setup (Arduino):**\n\n\`\`\`cpp\nstatic const u1_t PROGMEM APPEUI[8] = { 0x12,0x34,0x56,0x78,0x9A,0xBC,0xDE,0xF0 };\nstatic const u1_t PROGMEM DEVEUI[8] = { 0x01,0x23,0x45,0x67,0x89,0xAB,0xCD,0xEF };\nstatic const u1_t PROGMEM APPKEY[16] = { 0xAB,0xCD,0xEF,0x12,0x34,0x56,0x78,0x90,0x9A,0xBC,0xDE,0xF0,0x11,0x22,0x33,0x44 };\n\`\`\`\n\n**References:**\n• [LoRaWAN Security Specification](https://lora-alliance.org/resource_hub/lorawan-security-whitepaper/) (Official)\n• [AWS IoT Core for LoRaWAN](https://aws.amazon.com/iot-core/lorawan/) (Official)\n• [The Things Stack FOTA Guide](https://www.thethingsindustries.com/docs/integrations/cloud-integrations/aws-iot/) (Official)\n• [GitHub: LoRaWAN Security Examples](https://github.com/TheThingsNetwork/lorawan-stack) (GitHub)\n\nSecurity and maintainability are vital to long-term network resilience.`,

      `## Monitoring, Scaling & Maintenance\n\nOnce deployed, networks must be monitored and scaled intelligently. Use platforms like The Things Stack Console, ChirpStack, or Helium Network Explorer to view live data, RSSI, SNR, and node status.\n\nAutomate alerts for low signal or node inactivity. For large-scale systems, consider network slicing and load balancing gateways.\n\n**References:**\n• [ChirpStack LoRaWAN Server Docs](https://www.chirpstack.io/docs/) (Official)\n• [The Things Stack Console](https://www.thethingsindustries.com/stack/) (Official)\n• [GitHub: ChirpStack Source Code](https://github.com/chirpstack/chirpstack) (GitHub)\n• [Tool: Helium Network Explorer](https://explorer.helium.com/) (Tool)\n\nA well-monitored LoRaWAN deployment helps detect failures early — improving uptime and reliability dramatically.`,

      `## Conclusion\n\nBuilding resilient LoRaWAN networks requires a balance between coverage, redundancy, power, and security. By applying best practices from this guide, you can design IoT systems that operate reliably across cities, forests, or remote farms for years.\n\n**Key Takeaways:**\n• Understand LoRaWAN architecture before scaling\n• Use ADR to balance performance and reliability\n• Add redundant gateways and optimize antenna design\n• Implement AES-128 encryption for security\n• Continuously monitor and maintain network health\n\n**Call to Action:**\nTry deploying two gateways in overlapping zones and enable ADR on your LoRa nodes — measure reliability improvements over a week.\n\n**Related Reads:**\n• [How to Build a LoRa Gateway with ESP32 and RAK Module](https://randomnerdtutorials.com/esp32-lora-rfm95-transceiver-arduino-ide/)\n• [Designing Solar-Powered IoT Networks](https://www.instructables.com/Solar-Powered-WiFi-Weather-Station-V20/)`,
    ],
  },

  "debugging-embedded": {
    title: "Debugging Embedded Systems: Complete Guide",
    date: "2025-10-12",
    readTime: "7 min read",
    category: "Development",
    seo: {
      metaTitle: "Embedded Systems Debugging Guide | Arduino, ESP32, STM32",
      metaDescription:
        "Master essential debugging strategies, tools, and methodologies for Arduino, ESP32, and STM32 projects. Learn UART logging, IDE debugging, and hardware troubleshooting.",
      keywords: [
        "embedded debugging",
        "Arduino debugging",
        "ESP32 debug",
        "STM32 debugging",
        "JTAG",
        "SWD",
        "hardware debugging",
        "UART logging",
        "OpenOCD",
        "logic analyzer",
        "oscilloscope",
        "FreeRTOS debugging",
        "exception handling",
      ],
      featuredImage: "/blog/debugging.jpg",
    },
    content: [
      `## **Introduction**\n\nEvery embedded developer faces it: the dreaded "Why isn't this working?" moment. Whether it's a frozen microcontroller, failed upload, or sensor giving wrong data — debugging is an art that separates amateurs from professionals.\n\nIn this guide, you'll master the core techniques for debugging embedded systems used in Arduino, ESP32, and STM32 projects. We'll explore UART logging, step-through debugging in IDEs, logic analyzers, and hardware-level troubleshooting.\n\nYou'll also learn how to interpret stack traces, inspect registers, and use powerful tools like OpenOCD and JTAG for live debugging.\n\nBy the end, you'll have a complete toolkit for diagnosing and fixing issues fast — ensuring your embedded projects run smoothly and reliably in production environments.`,

      `## **Understanding Embedded Debugging Fundamentals**\n\nDebugging embedded systems differs from debugging regular software because of limited resources, real-time constraints, and hardware dependency. Unlike desktop applications, you often can't just "print and see" what's wrong — your code runs inside a chip.\n\nEmbedded debugging focuses on three levels:\n• **Software-Level Debugging** – logic errors, variable states, crashes.\n• **Hardware-Level Debugging** – voltage, signal timing, faulty wiring.\n• **System-Level Debugging** – communication issues (UART, I²C, SPI, etc.).\n\nThe right debugging approach depends on your MCU (Arduino, ESP32, STM32) and available interfaces. Most boards support UART logs for serial output and JTAG/SWD interfaces for hardware stepping.\n\n**References:**\n• [Arduino Troubleshooting Guide](https://support.arduino.cc/hc/en-us/sections/360003414740-Troubleshooting) (Official)\n• [Espressif Debugging Overview](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/tools/idf-monitor.html) (Official)\n• [STM32CubeIDE Debugging Manual](https://www.st.com/resource/en/user_manual/um2609-stm32cubeide-user-guide-stmicroelectronics.pdf) (Official)\n• [Wikipedia: Debugging in Embedded Systems](https://en.wikipedia.org/wiki/Debugging) (Community)\n\nUnderstanding these fundamentals lays the foundation for all effective debugging strategies.`,

      `## Serial & UART Debugging\n\nThe simplest and most universal debugging tool is UART serial logging. By printing variable values and system states, you can trace program flow and detect issues.\n\n**Example (Arduino Serial Debugging):**\n\n\`\`\`cpp\nvoid setup() {\n  Serial.begin(115200);\n  Serial.println("System starting...");\n}\n\nvoid loop() {\n  int sensor = analogRead(A0);\n  Serial.print("Sensor value: ");\n  Serial.println(sensor);\n  delay(1000);\n}\n\`\`\`\n\n**Tips for effective serial debugging:**\n• Always include timestamps in logs.\n• Use log levels (INFO, WARN, ERROR).\n• Avoid excessive printing — it slows real-time systems.\n• For ESP32, use \`esp_log_level_set()\` to manage verbosity.\n\n**References:**\n• [Arduino Serial Reference](https://www.arduino.cc/reference/en/language/functions/communication/serial/) (Official)\n• [ESP-IDF Logging Library](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/log.html) (Official)\n• [GitHub: ESP32 Logging Examples](https://github.com/espressif/esp-idf/tree/master/examples/system/console) (GitHub)\n• [Random Nerd Tutorials: ESP32 Serial Monitor Guide](https://randomnerdtutorials.com/esp32-esp8266-serial-monitor-tutorial/) (Tutorial)\n\nSerial debugging helps pinpoint logical errors and sensor failures without special hardware.`,

      `## Using IDE Debuggers (Step-by-Step Debugging)\n\nModern IDEs like PlatformIO, Arduino IDE 2.0, and STM32CubeIDE include built-in debuggers that let you pause code, inspect variables, and step through functions.\n\n**Example – ESP32 Debugging via PlatformIO & OpenOCD:**\n\n1. Connect an ESP-Prog or FT2232 JTAG adapter.\n2. Configure your \`platformio.ini\`:\n\n\`\`\`ini\ndebug_tool = esp-prog\ndebug_init_break = tbreak setup\n\`\`\`\n\n3. Start debugging from VS Code → "Run & Debug."\n\nYou can set breakpoints, view registers, and even monitor FreeRTOS tasks live.\n\n**References:**\n• [PlatformIO Debugging Docs](https://docs.platformio.org/en/latest/plus/debugging.html) (Official)\n• [Arduino IDE 2.0 Debug Feature](https://docs.arduino.cc/software/ide-v2/tutorials/ide-v2-debugger/) (Official)\n• [STM32CubeIDE Debugging Guide](https://www.st.com/resource/en/user_manual/dm00629856-stm32cubeide-debugging-guide-stmicroelectronics.pdf) (Official)\n• [GitHub: OpenOCD for ESP32](https://github.com/espressif/openocd-esp32) (GitHub)\n\nStep-through debugging saves time by showing exactly where your code fails, instead of guessing from logs.`,

      `## **Hardware Debugging with JTAG, Logic Analyzers & Oscilloscopes**\n\nWhen software seems fine but hardware misbehaves, it's time to go deeper.\n\n**JTAG/SWD** (Joint Test Action Group) allows you to halt the MCU, inspect registers, and flash firmware directly. Tools like ST-Link, J-Link, and ESP-Prog provide professional-level access.\n\nUse **logic analyzers** (like Saleae or OpenLogicSniffer) to monitor protocols such as SPI or I²C, checking timing and logic levels. Pair it with **oscilloscopes** to detect analog noise, voltage drops, or clock issues.\n\n**References:**\n• [Segger J-Link Debug Probe](https://www.segger.com/products/debug-probes/j-link/) (Tool)\n• [ST-Link Debug Interface](https://www.st.com/en/development-tools/st-link-v2.html) (Official)\n• [Espressif ESP-Prog Tool](https://docs.espressif.com/projects/espressif-esp-iot-solution/en/latest/hw-reference/ESP-Prog_guide.html) (Official)\n• [Saleae Logic Analyzer](https://www.saleae.com/) (Tool)\n\nHardware-level debugging reveals signal glitches, faulty components, and timing mismatches invisible in code.`,

      `## Advanced Debugging Techniques (RTOS, Exceptions & Crash Analysis)\n\nFor advanced IoT and RTOS-based systems, debugging requires multitask-level insight.\n\nWith FreeRTOS on ESP32 or STM32, use built-in trace features to monitor task execution and detect deadlocks or stack overflows.\n\n**Example – FreeRTOS Stack Monitoring (ESP-IDF):**\n\n\`\`\`cpp\nTaskHandle_t task;\nUBaseType_t watermark = uxTaskGetStackHighWaterMark(task);\nprintf("Remaining stack: %d words\\n", watermark);\n\`\`\`\n\nYou can also decode exception dumps (Guru Meditation errors on ESP32) using \`xtensa-addr2line\` to trace crash origins.\n\n**References:**\n• [FreeRTOS Debugging and Trace Support](https://www.freertos.org/FreeRTOS-Plus-Trace.html) (Official)\n• [Espressif Exception Decoder Tool](https://github.com/me-no-dev/EspExceptionDecoder) (GitHub)\n• [Zephyr RTOS Debugging Docs](https://docs.zephyrproject.org/latest/develop/debugging/index.html) (Official)\n• [Tutorial: Debugging FreeRTOS on ESP32](https://www.digikey.com/en/maker/projects/introduction-to-rtos-solution-to-part-9-hardware-interrupts/3ae7a68462584e1eb408e1638002e9ed) (Tutorial)\n\nThese tools let you uncover deep issues in multitasking or interrupt-driven systems.`,

      `## **Common Debugging Mistakes & Best Practices**\n\nEven seasoned developers make debugging mistakes. Avoid these pitfalls:\n• **Not isolating the problem:** Always test in modules.\n• **Ignoring hardware symptoms:** LEDs, heat, or noise may reveal more than logs.\n• **Skipping schematic checks:** Wiring errors cause 70% of failures.\n• **Not using asserts or watchdogs:** Add runtime safety checks.\n\n**Best Practices:**\n• Always keep schematic + firmware versions synchronized.\n• Document every test and fix.\n• Use Git for version tracking and rollback.\n\n**References:**\n• [ESP-IDF Watchdog Timer Docs](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/wdts.html) (Official)\n• [Arduino Assert Library](https://www.arduino.cc/reference/en/language/structure/control-structure/assert/) (Official)\n• [GitHub: Hardware Debugging Reference Designs](https://github.com/esp32-open-mac/esp32-open-mac) (GitHub)\n\nBy following a structured debugging workflow, you'll reduce downtime and increase code reliability.`,

      `## **Conclusion**\n\nDebugging is more than fixing errors — it's about understanding your system deeply. Whether you're working on a simple Arduino prototype or a complex STM32 industrial controller, a methodical debugging approach ensures stability and scalability.\n\n**Key Takeaways:**\n• Start with UART logs, then move to IDE and JTAG debugging.\n• Use logic analyzers and oscilloscopes for hardware-level insight.\n• Decode exceptions to identify root causes in RTOS systems.\n• Adopt structured debugging practices and use watchdogs/asserts.\n\n**Call to Action:**\nPick one debugging method — like adding UART logs or using PlatformIO's debugger — and integrate it into your next project. You'll immediately see smoother development cycles.\n\n**Related Reads:**\n• RTOS for IoT: Complete Guide\n• Optimizing Power Consumption in IoT Devices`,
    ],
  },

  "edge-ai": {
    title: "Edge AI on Microcontrollers: TensorFlow Lite Micro Guide",
    date: "2025-09-22",
    readTime: "8 min read",
    category: "AI/ML",
    seo: {
      metaTitle:
        "Edge AI Guide | TensorFlow Lite Micro on ESP32, Arduino, STM32",
      metaDescription:
        "Run machine learning on ESP32, Arduino & STM32. Master TensorFlow Lite Micro, quantization, model optimization, and deploy AI at the edge with complete examples.",
      keywords: [
        "edge AI",
        "TensorFlow Lite Micro",
        "embedded machine learning",
        "ESP32 AI",
        "Arduino AI",
        "STM32 AI",
        "model quantization",
        "on-device AI",
        "TinyML",
        "neural networks",
        "gesture recognition",
        "keyword spotting",
        "anomaly detection",
        "CMSIS-NN",
        "ESP-NN",
      ],
      featuredImage: "/blog/edge-ai.jpg",
    },
    content: [
      `## Introduction\n\nUntil recently, running AI models on microcontrollers seemed impossible — too little RAM, no GPU, limited clock speeds. But with TensorFlow Lite Micro (TFLM), it's now possible to execute real-time AI inference on boards like ESP32, Arduino Nano 33 BLE Sense, and STM32.\n\nThis guide walks you through everything you need to know to bring Edge AI to life: how TensorFlow Lite Micro works, how to train and quantize a model, convert it for embedded use, and deploy it on real hardware.\n\nBy the end, you'll be able to build smart, self-contained IoT devices — from gesture detectors and anomaly sensors to keyword spotters — without the cloud.`,

      `## What Is TensorFlow Lite Micro and Why Edge AI Matters\n\nTensorFlow Lite Micro (TFLM) is a lightweight inference engine designed to run machine learning models on devices with < 256 KB RAM. Unlike regular TensorFlow Lite, it doesn't require an OS or dynamic memory allocation — perfect for bare-metal MCUs.\n\n**Key benefits:**\n• Offline AI: Works without cloud connectivity\n• Ultra-low power: Enables inference in battery-powered IoT devices\n• Low latency: Decisions happen on-device, in milliseconds\n\n**Example applications:**\n• Keyword spotting ("Hey ESP!")\n• Motion classification using IMU sensors\n• Vibration anomaly detection for machines\n\n**References:**\n• [TensorFlow Lite Micro Official Guide](https://www.tensorflow.org/lite/microcontrollers) (Official)\n• [TensorFlow Lite for Microcontrollers GitHub](https://github.com/tensorflow/tflite-micro) (GitHub)\n• [Arduino TensorFlow Lite Library](https://github.com/tensorflow/tflite-micro-arduino-examples) (GitHub)\n• [Edge Impulse Docs: Deploying TensorFlow Lite Micro](https://docs.edgeimpulse.com/docs/deployment/running-your-impulse-locally) (Tutorial)\n\nEdge AI gives embedded developers the power to embed intelligence directly into sensors — eliminating latency, cost, and privacy issues of cloud AI.`,

      `## Model Creation & Quantization\n\nTo run efficiently on microcontrollers, ML models must be small and quantized (weights & activations → 8-bit integers).\n\n**Typical workflow:**\n1. Train a model in TensorFlow or Keras\n2. Convert it to TensorFlow Lite format:\n\n\`\`\`python\nconverter = tf.lite.TFLiteConverter.from_saved_model('model')\ntflite_model = converter.convert()\nopen('model.tflite','wb').write(tflite_model)\n\`\`\`\n\n3. Apply post-training quantization:\n\n\`\`\`python\nconverter.optimizations = [tf.lite.Optimize.DEFAULT]\n\`\`\`\n\n4. Test accuracy to ensure performance is acceptable\n\nQuantization reduces model size by 4× and speeds up inference on CPUs without floating-point units.\n\n**References:**\n• [TensorFlow Model Optimization Toolkit](https://www.tensorflow.org/model_optimization) (Official)\n• [TensorFlow Lite Converter Docs](https://www.tensorflow.org/lite/models/convert) (Official)\n• [GitHub: Quantization Examples](https://github.com/tensorflow/tensorflow/tree/master/tensorflow/lite/g3doc/performance) (GitHub)\n• [Tutorial: Edge Impulse Quantization Guide](https://docs.edgeimpulse.com/docs/edge-ai-hardware/cpu/optimization) (Tutorial)\n\nProper quantization is the bridge that makes desktop-trained AI models fit into 32 KB flash MCUs.`,

      `## Deploying TensorFlow Lite Micro on ESP32, Arduino & STM32\n\nAfter quantization, the model must be compiled into your firmware.\n\n**Example (Arduino TensorFlow Lite):**\n\`\`\`cpp\n#include <TensorFlowLite.h>\n#include "model.h"\n#include "tensorflow/lite/micro/all_ops_resolver.h"\n#include "tensorflow/lite/micro/micro_interpreter.h"\n\nconst tflite::Model* model = tflite::GetModel(model_tflite);\ntflite::MicroInterpreter interpreter(model, resolver, tensor_arena, arena_size);\n\`\`\`\n\nEach platform requires its own build configuration:\n• **Arduino:** Install TensorFlow Lite for Microcontrollers library\n• **ESP32:** Use the TFLite-Micro ESP32 port for optimized kernels\n• **STM32:** Use STM32Cube.AI to auto-convert and integrate models\n\n**References:**\n• [Arduino TensorFlow Lite Library Docs](https://www.arduino.cc/reference/en/libraries/tensorflow-lite/) (Official)\n• [Espressif ESP-NN Library](https://github.com/espressif/esp-nn) (GitHub)\n• [STMicroelectronics X-CUBE-AI User Guide](https://www.st.com/en/embedded-software/x-cube-ai.html) (Official)\n• [PlatformIO TensorFlow Lite Integration](https://registry.platformio.org/libraries/tensorflow/TensorFlowLite_ESP32) (Official)\n\nDeploying TFLM on MCUs lets you run classification and prediction fully offline, enabling AI-driven IoT nodes.`,

      `## Optimizing Performance on Microcontrollers\n\nMicrocontrollers have tight resource budgets, so model optimization is crucial.\n\n**Strategies:**\n• Use int8 quantization and reduce input dimensions\n• Enable CMSIS-NN (for ARM MCUs) or ESP-NN (for ESP32) to accelerate matrix math\n• Allocate a static tensor_arena buffer of exact size to avoid fragmentation\n• Profile execution time with millis() or micros() timers\n\n**Example Performance Measurement Code:**\n\`\`\`cpp\nunsigned long start = micros();\ninterpreter.Invoke();\nSerial.println(micros() - start);\n\`\`\`\n\n**References:**\n• [CMSIS-NN API Reference](https://www.keil.com/pack/doc/CMSIS/NN/html/index.html) (Official)\n• [Espressif ESP-NN Optimization Library](https://github.com/espressif/esp-nn) (GitHub)\n• [TensorFlow Lite Micro Performance Tuning Guide](https://www.tensorflow.org/lite/performance/best_practices) (Official)\n• [Tutorial: Optimizing TensorFlow Lite for STM32](https://www.st.com/resource/en/application_note/an5225-getting-started-with-xcubeai-expansion-package-for-artificial-intelligence-ai-stmicroelectronics.pdf) (Tutorial)\n\nOptimizing AI inference can yield 5–10× speedups without changing accuracy.`,

      `## Complete Example: Gesture Recognition\n\nLet's build a real Edge AI example — gesture detection using an IMU sensor.\n\n**Hardware:** Arduino Nano 33 BLE Sense (IMU + nRF52840)\n\n**Workflow:**\n1. Record motion data (Left/Right/Up/Down)\n2. Train a TinyML model in TensorFlow\n3. Quantize and convert to .tflite\n4. Deploy with TensorFlow Lite Micro\n\n**Snippet:**\n\`\`\`cpp\nif (output->data.f[0] > 0.8) Serial.println("Swipe Left");\nelse if (output->data.f[1] > 0.8) Serial.println("Swipe Right");\n\`\`\`\n\n**References:**\n• [Arduino TinyML Gesture Recognition Tutorial](https://blog.arduino.cc/2019/10/15/get-started-with-machine-learning-on-arduino/) (Official)\n• [GitHub: TinyML Gesture Model](https://github.com/arduino/ArduinoTensorFlowLiteTutorials) (GitHub)\n• [Edge Impulse Gesture Project Example](https://docs.edgeimpulse.com/docs/tutorials/continuous-motion-recognition) (Community)\n• [TensorFlow Lite Micro Magic Wand Demo](https://github.com/tensorflow/tflite-micro/tree/main/tensorflow/lite/micro/examples/magic_wand) (Official)\n\nThis project demonstrates the entire pipeline — data capture, training, quantization, deployment — on a single microcontroller.`,

      `## Debugging & Profiling AI at the Edge\n\nDebugging AI on MCUs requires inspecting inference outputs and memory usage.\n\n**Tips:**\n• Use Serial.println() to print intermediate tensor values\n• Enable TensorFlow Lite Micro's built-in profiling API for layer-by-layer timing\n• Monitor heap usage with ESP.getFreeHeap() (ESP32) or xPortGetFreeHeapSize() (FreeRTOS)\n\n**References:**\n• [TensorFlow Lite Micro Profiling API](https://github.com/tensorflow/tflite-micro/blob/main/tensorflow/lite/micro/docs/profiling.md) (Official)\n• [FreeRTOS Memory API](https://www.freertos.org/a00111.html) (Official)\n• [Arduino Serial Monitor Docs](https://docs.arduino.cc/software/ide-v2/tutorials/ide-v2-serial-monitor) (Official)\n• [GitHub: ESP32 Heap Monitoring Example](https://github.com/espressif/arduino-esp32/tree/master/libraries/ESP32/examples/ChipID) (GitHub)\n\nProfiling helps you find bottlenecks and fit larger models without running out of RAM.`,

      `## Conclusion\n\nEdge AI with TensorFlow Lite Micro is revolutionizing embedded systems. It brings machine learning to tiny devices — no cloud, no latency, no subscription.\n\n**Key Takeaways:**\n• Use quantization to fit models in microcontrollers\n• Deploy TFLM on Arduino, ESP32, STM32\n• Optimize inference with ESP-NN or CMSIS-NN\n• Profile AI performance to save RAM & CPU cycles\n• Build practical projects like gesture recognition or voice detection\n\n**Call to Action:**\nTry the official "Hello World" TFLM example on your board today — then replace the model with your own trained data to create custom Edge AI solutions.\n\n**Related Reads:**\n• [Optimizing Power Consumption in IoT Devices](#power-consumption)\n• [Real-Time Operating Systems for IoT](#rtos)`,
    ],
  },

  "mqtt-protocol": {
    title: "MQTT Protocol Deep Dive for IoT Developers",
    date: "2025-10-05",
    readTime: "7 min read",
    category: "Protocols",
    seo: {
      metaTitle: "MQTT Protocol Guide | Complete IoT Messaging Tutorial",
      metaDescription:
        "Master MQTT for IoT projects. Learn QoS levels, retained messages, Last Will Testament, broker setup, and build production ESP32 applications.",
      keywords: [
        "MQTT",
        "IoT messaging",
        "MQTT broker",
        "Mosquitto",
        "ESP32 MQTT",
        "publish subscribe",
        "QoS levels",
      ],
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

      `**Key Takeaways**\n\n✓ MQTT is the standard for IoT messaging\n✓ Choose appropriate QoS level per use case\n✓ Use retained messages for device status\n✓ Implement Last Will Testament for offline detection\n✓ Design hierarchical topic structure\n✓ Always use TLS in production\n✓ Monitor broker performance\n✓ Consider cloud-hosted brokers for scale\n\nMQTT enables scalable, real-time IoT communication with minimal overhead. Master it, and you'll build robust connected systems that work reliably at any scale.`,
    ],
  },

  "iot-security": {
    title: "IoT Security Best Practices for Production",
    date: "2025-10-18",
    readTime: "8 min read",
    category: "Security",
    seo: {
      metaTitle: "IoT Security Guide | Protect Embedded Devices from Attacks",
      metaDescription:
        "Secure IoT devices for production. Learn secure boot, encryption, OTA updates, hardware security, authentication, and protect against common vulnerabilities.",
      keywords: [
        "IoT security",
        "embedded security",
        "secure boot",
        "TLS encryption",
        "hardware security module",
        "secure OTA updates",
      ],
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

      `**Key Takeaways**\n\n✓ Implement secure boot on all devices\n✓ Encrypt all network traffic with TLS\n✓ Sign and verify OTA firmware updates\n✓ Use hardware security modules for keys\n✓ Never hardcode credentials\n✓ Validate all inputs rigorously\n✓ Disable debug ports in production\n✓ Keep firmware updated regularly\n✓ Follow OWASP IoT Top 10\n✓ Test security before deployment\n\nSecurity isn't optional—it's essential. One compromised device can expose entire networks. Build security in from day one, not as an afterthought.`,
    ],
  },

  "ble-basics": {
    title:
      "BLE (Bluetooth Low Energy) Basics: Complete Guide for IoT Developers",
    date: "2025-10-02",
    readTime: "7 min read",
    category: "Connectivity",
    seo: {
      metaTitle: "BLE Guide | Bluetooth Low Energy for IoT Projects",
      metaDescription:
        "Master BLE for IoT. Learn GATT services, characteristics, ESP32 BLE implementation, security, power optimization, and build wireless devices.",
      keywords: [
        "BLE",
        "Bluetooth Low Energy",
        "GATT services",
        "ESP32 BLE",
        "Arduino BLE",
        "STM32 BLE",
        "IoT wireless",
        "BLE beacons",
        "BLE security",
        "BLE advertising",
        "Nordic nRF",
        "ArduinoBLE",
        "BLE pairing",
        "power optimization",
        "nRF Connect",
      ],
      featuredImage: "/blog/ble.jpg",
    },
    content: [
      `Introduction\n\nBluetooth Low Energy (BLE) has transformed how IoT devices connect, communicate, and conserve power. Unlike classic Bluetooth, BLE is optimized for low-power, intermittent communication, making it ideal for wearables, smart sensors, beacons, and medical devices.\n\nIn this guide, you'll master the fundamentals of BLE communication — including architecture, advertising, pairing, services, and GATT profiles — and explore how to use BLE with ESP32, Arduino, and STM32.\n\nYou'll also learn key design principles for building secure, efficient, and scalable BLE-based IoT systems, including power optimization, real-world code examples, and development tool references.\n\nBy the end, you'll have a complete understanding of how BLE works, how to implement it, and how to troubleshoot real IoT connectivity issues effectively.`,

      `What Is BLE and How It Works\n\nBLE is a wireless communication protocol built on the Bluetooth 4.0+ standard, designed for low energy consumption while maintaining short-range connectivity (up to 100 m). The protocol revolves around key concepts: Advertiser (Peripheral) broadcasts data and waits for connections, Scanner (Central) searches for nearby BLE devices and initiates connections, GATT (Generic Attribute Profile) defines how data is exchanged once connected, and UUIDs serve as unique identifiers for services and characteristics.\n\nBLE operates on the 2.4 GHz ISM band using frequency hopping across 40 channels to avoid interference — a key factor in maintaining stable IoT networks.\n\nReferences:\n• [Bluetooth SIG Official BLE Overview](https://www.bluetooth.com/learn-about-bluetooth/tech-overview/) (Official)\n• [Nordic Semiconductor BLE Fundamentals](https://www.nordicsemi.com/Products/Bluetooth-Low-Energy) (Official)\n• [ESP-IDF Bluetooth Low Energy API](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/bluetooth/index.html) (Official)`,

      `BLE Architecture & Communication Model\n\nA BLE network is built around a client-server model where one device acts as a Central (Client) and others as Peripherals (Servers). The architecture includes GAP (Generic Access Profile) for advertising, discovery, and connection management, GATT (Generic Attribute Profile) for structured data exchange between devices, and Services & Characteristics where services group related data and characteristics define the actual data fields.\n\nExample: A heart rate monitor exposes a Heart Rate Service (UUID 0x180D) with a Heart Rate Measurement Characteristic (UUID 0x2A37).\n\n\`\`\`cpp\n#include <BLEDevice.h>\n#include <BLEServer.h>\n\nvoid setup() {\n  BLEDevice::init("BLE_Device");\n  BLEServer *server = BLEDevice::createServer();\n}\n\`\`\`\n\nReferences:\n• [Bluetooth GATT Specification](https://www.bluetooth.com/specifications/specs/gatt-specification-supplement/) (Official)\n• [ArduinoBLE Library Reference](https://www.arduino.cc/reference/en/libraries/arduinoble/) (Official)\n• [STM32Cube BLE Stack Overview](https://www.st.com/en/embedded-software/stm32cubewb.html) (Official)`,

      `BLE Advertising and Scanning\n\nBLE devices communicate primarily through advertising packets — small bursts of data (max 31 bytes) that broadcast information to nearby devices. Three advertising modes exist: Connectable Advertising allows central devices to initiate a connection, Non-connectable Advertising is used for beacons and broadcast sensors, and Directed Advertising enables targeted communication to a specific device address.\n\nExample for ESP32 using Arduino framework:\n\n\`\`\`cpp\nBLEAdvertising *advertising = BLEDevice::getAdvertising();\nadvertising->start();\n\`\`\`\n\nScanning is handled by central devices, which listen for these advertisements and decide which device to connect to based on signal strength (RSSI) or payload data.\n\nReferences:\n• [Bluetooth Core Specification v5.4 – Advertising](https://www.bluetooth.com/specifications/specs/core-specification-5-4/) (Official)\n• [Espressif ESP32 BLE Advertising API](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/bluetooth/esp_gap_ble.html) (Official)\n• [Nordic nRF Sniffer Tool](https://www.nordicsemi.com/Products/Development-tools/nrf-sniffer-for-bluetooth-le) (Tool)`,

      `BLE Security: Pairing, Bonding & Encryption\n\nSecurity is critical in IoT systems. BLE supports pairing (temporary trust) and bonding (permanent trust via stored keys). Three security levels exist: Just Works provides no authentication (used for low-risk data), Passkey Entry requires the user to enter or confirm a 6-digit code, and Numeric Comparison / OOB offers enhanced methods for higher security.\n\nBLE uses AES-128 encryption at the link layer and LE Secure Connections (Elliptic Curve Diffie-Hellman) for key exchange in Bluetooth 4.2+.\n\n\`\`\`cpp\nBLEDevice::setSecurityAuth(true, true, true);\nBLEDevice::setEncryptionLevel(ESP_BLE_SEC_ENCRYPT_MITM);\n\`\`\`\n\nReferences:\n• [Bluetooth Security Overview – SIG](https://www.bluetooth.com/learn-about-bluetooth/key-attributes/bluetooth-security/) (Official)\n• [Espressif BLE Security Example](https://github.com/espressif/esp-idf/tree/master/examples/bluetooth/bluedroid/ble/gatt_security_server) (GitHub)\n• [STMicroelectronics BLE Security Guide](https://www.st.com/resource/en/application_note/an5289-building-wireless-applications-with-stm32wb-series-microcontrollers-stmicroelectronics.pdf) (Official)`,

      `Developing BLE Applications on ESP32, Arduino & STM32\n\nBLE development differs slightly by platform but follows the same architecture. ESP32 supports both Classic Bluetooth and BLE using ESP-IDF or Arduino-ESP32 framework. Arduino Nano 33 BLE Sense has built-in nRF52840 MCU with BLE stack using the ArduinoBLE library. STM32WB Series features dual-core MCU with integrated BLE 5.3 support using STM32CubeMX + X-CUBE-BLE stack.\n\nExample BLE Client Scan on ESP32:\n\n\`\`\`cpp\nBLEScan* scan = BLEDevice::getScan();\nscan->setActiveScan(true);\nBLEScanResults results = scan->start(5);\n\`\`\`\n\nReferences:\n• [ESP-IDF BLE API Reference](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/bluetooth/index.html) (Official)\n• [Arduino Nano 33 BLE Guide](https://docs.arduino.cc/hardware/nano-33-ble) (Official)\n• [STM32CubeWB BLE Getting Started](https://www.st.com/en/embedded-software/stm32cubewb.html) (Official)`,

      `Power Optimization in BLE Devices\n\nBLE's greatest advantage is its ultra-low power consumption, making it perfect for battery-powered IoT nodes. Key optimization strategies include using longer advertising intervals (e.g., 1–2 s), disabling scanning or advertising when not needed, implementing deep-sleep modes on MCUs, and minimizing payload size and transmission frequency.\n\nExample ESP32 Deep Sleep between Advertisements:\n\n\`\`\`cpp\nesp_sleep_enable_timer_wakeup(10 * 1000000);\nesp_deep_sleep_start();\n\`\`\`\n\nReferences:\n• [Bluetooth LE Power Control Specification](https://www.bluetooth.com/specifications/specs/core-specification-5-4/) (Official)\n• [Espressif Power Management Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/power_management.html) (Official)\n• [Nordic Power Optimization Techniques](https://infocenter.nordicsemi.com/index.jsp?topic=%2Fcom.nordic.infocenter.nrf52832.ps.v1.1%2Fpower.html) (Official)\n\nEfficient power management extends battery life from weeks to months or even years.`,

      `Testing & Debugging BLE Applications\n\nDebugging BLE connections requires monitoring advertisements, GATT transactions, and signal strength. Essential tools include nRF Connect (Mobile & Desktop) to inspect services, UUIDs, and live data, Wireshark + nRF Sniffer to capture and decode BLE packets, and Serial Monitor / ESP-Logs to print connection status and received data.\n\nExample Serial Debug Output:\n\n\`\`\`cpp\nSerial.print("Connected to: ");\nSerial.println(device->getAddress().toString().c_str());\n\`\`\`\n\nReferences:\n• [Nordic nRF Connect Desktop Tool](https://www.nordicsemi.com/Products/Development-tools/nrf-connect-for-desktop) (Tool)\n• [Wireshark BLE Packet Analysis](https://www.wireshark.org/) (Tool)\n• [ESP-IDF Logging Framework](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/log.html) (Official)\n\nProper debugging ensures reliable communication and performance in real deployments.`,

      `Conclusion\n\nBluetooth Low Energy has become the foundation of modern IoT connectivity — bridging sensors, wearables, and mobile devices efficiently.\n\nKey Takeaways:\n• BLE enables low-power, short-range communication for smart devices\n• Understand GAP, GATT, and UUIDs to design robust architectures\n• Prioritize security, pairing, and encryption for safe IoT data exchange\n• Optimize advertising intervals and use sleep modes for long battery life\n• Use debugging tools like nRF Connect and Wireshark to validate your setup\n\nCall to Action:\nBuild your first BLE IoT project — connect an ESP32 to your smartphone, exchange sensor data, and watch real-time updates. Once you master the basics, expand to mesh or multi-device BLE networks.`,
    ],
  },

  "ota-updates": {
    title: "Secure OTA Firmware Updates for IoT",
    date: "2025-10-09",
    readTime: "7 min read",
    category: "Development",
    seo: {
      metaTitle:
        "OTA Updates Guide | Secure Firmware Updates for ESP32, Arduino, STM32",
      metaDescription:
        "Implement secure Over-The-Air firmware updates. Learn version management, rollback protection, delta updates, signing, and deploy safely.",
      keywords: [
        "OTA updates",
        "firmware updates",
        "ESP32 OTA",
        "secure OTA",
        "remote firmware update",
        "delta updates",
        "rollback protection",
      ],
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

      `**Key Takeaways**\n\n✓ OTA updates are essential for IoT maintenance\n✓ Always use HTTPS and signature verification\n✓ Implement dual-partition for safety\n✓ Track versions with semantic versioning\n✓ Use delta updates to save bandwidth\n✓ Test rollback scenarios thoroughly\n✓ Monitor update success rates\n✓ Start with staged rollouts\n✓ Never skip security measures\n\nOTA updates transform IoT devices from static appliances into evolvable platforms. Implement securely, test thoroughly, and you'll be able to support devices for years with confidence.`,
    ],
  },

  "node-red-dashboards": {
    title: "Building IoT Dashboards with Node-RED",
    date: "2025-10-01",
    readTime: "8 min read",
    category: "Visualization",
    seo: {
      metaTitle: "Node-RED Dashboard Guide | Build Real-Time IoT Monitoring",
      metaDescription:
        "Master Node-RED for IoT dashboards. Learn flow-based programming, MQTT integration, dashboard widgets, database storage, and build production monitoring systems.",
      keywords: [
        "Node-RED",
        "IoT dashboard",
        "flow-based programming",
        "MQTT Node-RED",
        "real-time monitoring",
        "IoT visualization",
        "Node-RED dashboard",
      ],
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

      `**Key Takeaways**\n\n✓ Node-RED simplifies IoT dashboard creation\n✓ No coding needed for basic flows\n✓ Native MQTT and database support\n✓ Responsive dashboard works on mobile\n✓ 4000+ community nodes available\n✓ Perfect for rapid prototyping\n✓ Production-ready with proper security\n✓ Runs on Raspberry Pi or cloud\n✓ Visual programming saves development time\n✓ Great for non-programmers\n\nNode-RED democratizes IoT development. In hours, not days, you can build professional dashboards that monitor sensors, control devices, and alert you to problems—all with drag-and-drop simplicity.`,
    ],
  },

  "esp32-usb-driver": {
    title: "ESP32/ESP8266 USB Driver Installation: Fix Port Detection Issues",
    date: "2025-10-27",
    readTime: "5 min read",
    category: "Troubleshooting",
    seo: {
      metaTitle:
        "ESP32/ESP8266 USB Driver Installation Guide | Fix COM Port Issues",
      metaDescription:
        "Complete guide to install CP2102, CH340, FTDI drivers for ESP32/ESP8266. Fix 'no COM port detected' errors on Windows, Mac, Linux. Step-by-step troubleshooting.",
      keywords: [
        "ESP32 USB driver",
        "ESP8266 driver",
        "CP2102 driver",
        "CH340 driver",
        "COM port not detected",
        "Arduino IDE port",
        "ESP32 troubleshooting",
      ],
      featuredImage: "/blog/esp32-usb-driver.jpg",
    },
    content: [
      `If you've ever connected your ESP32 or ESP8266 board to your computer only to find no COM port detected, you're not alone. This is one of the most common issues faced by IoT beginners and developers. The problem usually stems from missing or incompatible USB drivers, especially on Windows systems. Without proper drivers, your system can't communicate with the microcontroller, halting all uploads and serial monitoring.`,

      `In this guide, you'll learn how to correctly install the USB-to-serial drivers (CP2102, CH340, or FTDI) for your ESP boards, fix port detection errors, and ensure seamless uploads in [Arduino IDE](https://www.arduino.cc/en/software) or [PlatformIO](https://platformio.org/). By the end, you'll have your ESP device fully functional — ready to upload code and start building.`,

      `## Understanding ESP32/ESP8266 USB Drivers\n\nEvery ESP board, whether ESP32 or ESP8266, uses a USB-to-Serial converter chip to communicate with your computer. These chips act as a bridge between your PC's USB port and the microcontroller's UART interface.\n\nThe most common USB-to-UART chips are:\n\n• CP2102 – found in many ESP32 DevKit boards (by Silicon Labs)\n• CH340/CH341 – used in cheaper ESP8266 NodeMCU boards\n• FTDI FT232RL – older but reliable option\n\nWithout the correct driver, your computer won't recognize the device, leading to "No COM Port Found" or "Device not detected" messages.`,

      `### 📚 Official Documentation Links:\n\n• [ESP32 Getting Started Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/) – Espressif Docs\n• [Silicon Labs CP210x Drivers](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers) – Official driver download\n• [WCH CH340 Driver Download](http://www.wch-ic.com/downloads/CH341SER_EXE.html) – Official CH340/CH341 driver`,

      `## Installing USB Drivers\n\n### Step-by-Step for Windows\n\n1. Identify your USB chip – check your board marking (CH340, CP2102, or FTDI)\n\n2. Download the correct driver:\n\n• [CP210x (Silicon Labs)](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers)\n• [CH340/CH341 (WCH)](http://www.wch-ic.com/downloads/CH341SER_EXE.html)\n• [FTDI Drivers](https://ftdichip.com/drivers/vcp-drivers/)\n\n3. Run the installer and restart your PC\n\n4. Connect your ESP board\n\n5. Open Device Manager → Ports (COM & LPT) to verify detection`,

      `### Step-by-Step for macOS/Linux\n\n• macOS: CP2102 and CH340 require manual installation. Restart after install\n\n• Linux: Usually pre-installed. If not, use terminal:\n\n\`\`\`bash\nsudo apt-get install cp210x-dkms\nsudo modprobe cp210x\n\`\`\`\n\n### 📦 Related GitHub Links:\n\n• [CH340 Linux Support](https://github.com/juliagoda/CH341SER) – Community driver\n• [CP210x Driver Source](https://github.com/torvalds/linux/tree/master/drivers/usb/serial) – Linux kernel source`,

      `## Fixing Port Detection Issues\n\nEven with the correct drivers, you may face missing port or upload failure issues. Here's how to fix them:\n\n1. Check Cable Quality: Some USB cables only supply power – use a data cable\n\n2. Try a Different Port: Avoid USB 3.0 ports; use USB 2.0 when possible\n\n3. Board Not in Boot Mode: Press and hold the BOOT button during upload (for ESP32)\n\n4. Reinstall Driver: Sometimes corrupted drivers block recognition. Uninstall and reinstall\n\n5. Check Permissions (Linux/Mac):\n\n\`\`\`bash\nsudo usermod -a -G dialout $USER\n\`\`\`\n\n6. Manually Assign Port: In Arduino IDE, go to Tools → Port and select the correct COM port`,

      `### 🔧 Useful Tutorials:\n\n• [Random Nerd Tutorials – ESP32 Troubleshooting](https://randomnerdtutorials.com/esp32-troubleshooting-guide/) – Comprehensive guide\n• [Arduino Forum: Port Issues](https://forum.arduino.cc/c/hardware/12) – Community support`,

      `## Uploading Code After Fix\n\nOnce your ESP board appears under a COM port, you can test it with a simple Blink sketch.\n\nExample for ESP32 in Arduino IDE:\n\n\`\`\`cpp\n#define LED_BUILTIN 2\n\nvoid setup() {\n  pinMode(LED_BUILTIN, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED_BUILTIN, HIGH);\n  delay(1000);\n  digitalWrite(LED_BUILTIN, LOW);\n  delay(1000);\n}\n\`\`\`\n\nSelect your board and correct port from the Tools menu, then upload.\n\nIf it compiles and flashes successfully, you'll see your onboard LED blinking — confirming both driver installation and serial communication are working properly.`,

      `### 🛠️ Tool Links:\n\n• [Arduino IDE Download](https://www.arduino.cc/en/software) – Official IDE\n• [PlatformIO IDE](https://platformio.org/) – Advanced development platform`,

      `## Advanced Debugging Tips\n\nIf your ESP device still isn't recognized:\n\n• Use Serial Monitor Tools like [PuTTY](https://www.putty.org/) or [CoolTerm](https://freeware.the-meiers.org/) to test connectivity\n\n• Check Board Power: ESP32 may draw more current; use a powered USB hub\n\n• Update Firmware: Use [esptool.py](https://github.com/espressif/esptool) to erase and reflash firmware:\n\n\`\`\`bash\nesptool.py erase_flash\nesptool.py write_flash 0x1000 firmware.bin\n\`\`\`\n\n• Change USB cable or adapter: Cheap cables often lack data lines\n\n• Try different PCs: Helps isolate hardware vs. software issues`,

      `### 💬 Community Resources:\n\n• [ESP32 Forum – Espressif](https://www.esp32.com/) – Official support forum\n• [Stack Overflow: ESP8266 Port Detection](https://stackoverflow.com/questions/tagged/esp8266) – Q&A community`,

      `## Conclusion\n\nInstalling the correct USB driver is the first step to making your ESP32 or ESP8266 project come alive. From missing ports to upload errors, most issues trace back to incompatible or missing drivers. Once installed properly, your microcontroller can communicate seamlessly with your IDE, enabling you to build, test, and deploy IoT projects without frustration.\n\n### Key Takeaways:\n\n• Identify your USB chip (CP2102, CH340, or FTDI)\n• Install the official driver for your OS\n• Verify COM port in Device Manager\n• Use quality data cables\n• Fix permissions on Linux/macOS\n• Always restart after driver installation`,

      `### 📖 Next Read:\n\n• [How to Upload Code to ESP32/ESP8266 in Arduino IDE](https://randomnerdtutorials.com/getting-started-with-esp32/) – Getting started guide\n• [ESP32 Troubleshooting: Common Errors Explained](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/fatal-errors.html) – Official error documentation`,
    ],
  },

  "esp32-getting-started": {
    title: "ESP32 Getting Started Guide: Your First IoT Project in 30 Minutes",
    date: "2025-11-24",
    readTime: "10 min read",
    category: "Tutorials",
    seo: {
      metaTitle:
        "ESP32 Getting Started Guide: Build Your First IoT Project in 30 Minutes",
      metaDescription:
        "Complete beginner-friendly ESP32 tutorial. Learn setup, installation, first code upload, WiFi connection, and sensor integration in 30 minutes. Perfect for IoT beginners.",
      keywords: [
        "ESP32 tutorial",
        "ESP32 for beginners",
        "ESP32 Arduino IDE",
        "ESP32 WiFi",
        "ESP32 first project",
        "ESP32 setup",
        "IoT tutorial",
        "ESP32 sensors",
      ],
      featuredImage: "/blog/esp32-getting-started.jpg",
    },
    content: [
      `## Introduction\n\nThe ESP32 is one of the most powerful and versatile microcontrollers for IoT development. With built-in WiFi, Bluetooth, dual-core processor, and numerous GPIO pins, it's perfect for beginners and professionals alike. Whether you want to build a smart home system, weather station, or robotics project, ESP32 is your ideal starting point.\n\nIn this tutorial, you'll learn how to set up your ESP32, install the Arduino IDE, upload your first code, connect to WiFi, and integrate sensors — all in just 30 minutes!\n\n### What You'll Need:\n\n• ESP32 DevKit board ([Buy on Amazon](https://www.amazon.com/ESP32-Development-Board/s?k=ESP32+Development+Board))\n• Micro-USB cable (data capable)\n• Computer (Windows/Mac/Linux)\n• Optional: [DHT11 Temperature Sensor](/resources#dht11) or [Ultrasonic Sensor HC-SR04](/resources#ultrasonic)`,

      `## Step 1: Install Arduino IDE\n\nThe Arduino IDE is the easiest way to program ESP32. Download and install it from the [official Arduino website](https://www.arduino.cc/en/software).\n\n### Add ESP32 Board Support:\n\n1. Open Arduino IDE\n2. Go to **File → Preferences**\n3. Add this URL to "Additional Board Manager URLs":\n\n\`\`\`\nhttps://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json\n\`\`\`\n\n4. Click **OK**\n5. Go to **Tools → Board → Boards Manager**\n6. Search for "ESP32" and install "ESP32 by Espressif Systems"\n7. Select your board: **Tools → Board → ESP32 Dev Module**\n\n**Official Documentation:**\n• [ESP32 Arduino Core](https://docs.espressif.com/projects/arduino-esp32/en/latest/) – Official guide\n• [Arduino IDE Setup](https://www.arduino.cc/en/Guide) – Arduino docs`,

      `## Step 2: Upload Your First Code (Blink LED)\n\nLet's start with the classic "Hello World" for hardware — blinking the built-in LED!\n\n\`\`\`cpp\n#define LED_PIN 2  // Built-in LED on ESP32\n\nvoid setup() {\n  pinMode(LED_PIN, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED_PIN, HIGH);   // Turn LED on\n  delay(1000);                   // Wait 1 second\n  digitalWrite(LED_PIN, LOW);    // Turn LED off\n  delay(1000);                   // Wait 1 second\n}\n\`\`\`\n\n### Upload Steps:\n\n1. Connect ESP32 via USB\n2. Select correct **Port** under Tools menu\n3. Click **Upload** button (right arrow icon)\n4. Watch the LED blink!\n\n**Troubleshooting:**\n\n• **No port detected?** Install [CP2102 or CH340 USB driver](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers)\n• **Upload failed?** Hold the **BOOT** button during upload\n• **Cable issues?** Use a data-capable USB cable, not just a charging cable\n\n**References:**\n• [Random Nerd Tutorials: ESP32 Blink](https://randomnerdtutorials.com/getting-started-with-esp32/) – Detailed tutorial\n• [GitHub: ESP32 Arduino Examples](https://github.com/espressif/arduino-esp32/tree/master/libraries/ESP32/examples) – Official code examples`,

      `## Step 3: Connect ESP32 to WiFi\n\nOne of ESP32's superpowers is built-in WiFi. Let's connect it to your home network!\n\n\`\`\`cpp\n#include <WiFi.h>\n\nconst char* ssid = "YourWiFiName";\nconst char* password = "YourPassword";\n\nvoid setup() {\n  Serial.begin(115200);\n  \n  WiFi.begin(ssid, password);\n  Serial.print("Connecting to WiFi");\n  \n  while (WiFi.status() != WL_CONNECTED) {\n    delay(500);\n    Serial.print(".");\n  }\n  \n  Serial.println("\\nConnected!");\n  Serial.print("IP Address: ");\n  Serial.println(WiFi.localIP());\n}\n\nvoid loop() {\n  // Your code here\n}\n\`\`\`\n\n### Output:\n\n\`\`\`\nConnecting to WiFi....\nConnected!\nIP Address: 192.168.1.45\n\`\`\`\n\nYour ESP32 is now online! You can use this for IoT cloud platforms, web servers, or MQTT communication.\n\n**Official WiFi Documentation:**\n• [ESP32 WiFi Library](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/wifi.html) – Complete WiFi API reference`,

      `## Step 4: Read Temperature with DHT11 Sensor\n\nLet's make it more interesting by adding a [DHT11 temperature and humidity sensor](/resources#dht11)!\n\n### Wiring:\n\n• **VCC** → 3.3V\n• **DATA** → GPIO 4\n• **GND** → GND\n\n**[View DHT11 Datasheet](https://www.mouser.com/datasheet/2/758/DHT11-Technical-Data-Sheet-Translated-Version-1143054.pdf)**\n\n### Install DHT Library:\n\n1. Go to **Sketch → Include Library → Manage Libraries**\n2. Search for "DHT sensor library" by Adafruit\n3. Install it (also install "Adafruit Unified Sensor")\n\n### Code:\n\n\`\`\`cpp\n#include <DHT.h>\n\n#define DHTPIN 4\n#define DHTTYPE DHT11\n\nDHT dht(DHTPIN, DHTTYPE);\n\nvoid setup() {\n  Serial.begin(115200);\n  dht.begin();\n}\n\nvoid loop() {\n  float temperature = dht.readTemperature();\n  float humidity = dht.readHumidity();\n  \n  Serial.print("Temperature: ");\n  Serial.print(temperature);\n  Serial.print("°C | Humidity: ");\n  Serial.print(humidity);\n  Serial.println("%");\n  \n  delay(2000);  // Read every 2 seconds\n}\n\`\`\`\n\n**Output:**\n\n\`\`\`\nTemperature: 24.5°C | Humidity: 60%\nTemperature: 24.6°C | Humidity: 59%\n\`\`\`\n\nYou now have a functional IoT temperature monitor! You can extend this by:\n\n• Sending data to [ThingSpeak](https://thingspeak.com/) or [Blynk](https://blynk.io/)\n• Creating a web dashboard\n• Logging data to SD card\n\n**Sensor Resources:**\n• [Circuit Crafters Sensor Guide](/resources) – Explore more sensors like [HC-SR04 Ultrasonic](/resources#ultrasonic), [Soil Moisture](/resources#soil-moisture), and [PIR Motion](/resources#pir)\n• [DHT11 Datasheet](https://www.mouser.com/datasheet/2/758/DHT11-Technical-Data-Sheet-Translated-Version-1143054.pdf) – Official specifications`,

      `## Step 5: Build a Distance Sensor with HC-SR04\n\nLet's add an [HC-SR04 ultrasonic sensor](/resources#ultrasonic) to measure distance — perfect for robotics and object detection!\n\n### Wiring:\n\n• **VCC** → 5V\n• **Trig** → GPIO 5\n• **Echo** → GPIO 18\n• **GND** → GND\n\n**[View HC-SR04 Datasheet](https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf)**\n\n### Code:\n\n\`\`\`cpp\n#define TRIG_PIN 5\n#define ECHO_PIN 18\n\nvoid setup() {\n  Serial.begin(115200);\n  pinMode(TRIG_PIN, OUTPUT);\n  pinMode(ECHO_PIN, INPUT);\n}\n\nvoid loop() {\n  // Send ultrasonic pulse\n  digitalWrite(TRIG_PIN, LOW);\n  delayMicroseconds(2);\n  digitalWrite(TRIG_PIN, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG_PIN, LOW);\n  \n  // Measure echo duration\n  long duration = pulseIn(ECHO_PIN, HIGH);\n  \n  // Calculate distance in cm\n  float distance = duration * 0.034 / 2;\n  \n  Serial.print("Distance: ");\n  Serial.print(distance);\n  Serial.println(" cm");\n  \n  delay(500);\n}\n\`\`\`\n\n**Output:**\n\n\`\`\`\nDistance: 15.2 cm\nDistance: 18.5 cm\nDistance: 12.0 cm\n\`\`\`\n\nGreat for:\n\n• Robot obstacle avoidance\n• Parking sensors\n• Water level monitoring\n• Automatic door opener\n\n**More Sensor Projects:**\n• Explore [Gas Sensors](/resources#gas), [GPS Modules](/resources#gps), and [Heart Rate Monitors](/resources#heartrate) in our [Resources section](/resources)`,

      `## Bonus: Send Sensor Data to Cloud (ThingSpeak)\n\nLet's make your ESP32 IoT-enabled by sending data to the cloud!\n\n### Setup ThingSpeak:\n\n1. Create free account at [ThingSpeak.com](https://thingspeak.com/)\n2. Create a new channel with 2 fields (Temperature, Humidity)\n3. Copy your **Write API Key**\n\n### Code:\n\n\`\`\`cpp\n#include <WiFi.h>\n#include <HTTPClient.h>\n#include <DHT.h>\n\nconst char* ssid = "YourWiFi";\nconst char* password = "YourPassword";\nString apiKey = "YOUR_THINGSPEAK_API_KEY";\nconst char* server = "http://api.thingspeak.com/update";\n\n#define DHTPIN 4\n#define DHTTYPE DHT11\nDHT dht(DHTPIN, DHTTYPE);\n\nvoid setup() {\n  Serial.begin(115200);\n  WiFi.begin(ssid, password);\n  while (WiFi.status() != WL_CONNECTED) delay(500);\n  dht.begin();\n}\n\nvoid loop() {\n  float temp = dht.readTemperature();\n  float humidity = dht.readHumidity();\n  \n  if (WiFi.status() == WL_CONNECTED) {\n    HTTPClient http;\n    String url = String(server) + "?api_key=" + apiKey + \n                 "&field1=" + String(temp) + \n                 "&field2=" + String(humidity);\n    \n    http.begin(url);\n    int httpCode = http.GET();\n    http.end();\n    \n    Serial.println("Data sent to cloud!");\n  }\n  \n  delay(15000);  // Update every 15 seconds\n}\n\`\`\`\n\nNow you can access your sensor data from anywhere in the world via ThingSpeak dashboard!\n\n**Cloud Platform Resources:**\n• [ThingSpeak Documentation](https://www.mathworks.com/help/thingspeak/) – Official guide\n• [Blynk IoT Platform](https://blynk.io/) – Mobile app for IoT control\n• [AWS IoT Core](https://aws.amazon.com/iot-core/) – Enterprise-grade IoT cloud`,

      `## Conclusion\n\nCongratulations! 🎉 You've successfully:\n\n✅ Set up ESP32 and Arduino IDE\n✅ Uploaded your first program\n✅ Connected ESP32 to WiFi\n✅ Read data from DHT11 temperature sensor\n✅ Measured distance with HC-SR04 ultrasonic sensor\n✅ Sent data to the cloud\n\nYou now have the foundation to build amazing IoT projects!\n\n### Next Steps:\n\n• **Explore More Sensors:** Check our [Resources page](/resources) for [PIR Motion](/resources#pir), [Soil Moisture](/resources#soil-moisture), [Gas](/resources#gas), and [Touch sensors](/resources#touch)\n• **Build Real Projects:** Try our [Smart Greenhouse Guide](/blog/smart-greenhouse-diy) or [Crop Monitoring System](/projects)\n• **Learn Advanced Topics:** Read our [WiFi Troubleshooting Guide](/blog/wifi-troubleshooting) or [Arduino vs ESP32](/blog/arduino-vs-esp32)\n\n**Official Resources:**\n• [Espressif ESP32 Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/) – Complete ESP32 reference\n• [Random Nerd Tutorials](https://randomnerdtutorials.com/projects-esp32/) – Tons of ESP32 projects\n• [GitHub: ESP32 Examples](https://github.com/espressif/arduino-esp32/tree/master/libraries) – Official code library\n\n**Community Support:**\n• [ESP32 Forum](https://www.esp32.com/) – Official community\n• [r/esp32 Reddit](https://www.reddit.com/r/esp32/) – Active community discussions\n\nHappy building! 🚀`,
    ],
  },

  "smart-greenhouse-diy": {
    title: "Build Your Own Smart Greenhouse: Complete Step-by-Step Guide",
    date: "2025-11-22",
    readTime: "20 min read",
    category: "Projects",
    seo: {
      metaTitle:
        "DIY Smart Greenhouse with ESP32/Arduino: Complete Build Guide",
      metaDescription:
        "Build an automated smart greenhouse with temperature, humidity, soil moisture control. Complete tutorial with code, wiring, sensor integration, and cloud monitoring.",
      keywords: [
        "smart greenhouse",
        "DIY greenhouse",
        "ESP32 greenhouse",
        "Arduino greenhouse",
        "automated irrigation",
        "greenhouse sensors",
        "IoT agriculture",
      ],
      featuredImage: "/blog/smart-greenhouse.jpg",
    },
    content: [
      `## Introduction\n\nImagine a greenhouse that automatically waters plants, controls temperature, monitors soil moisture, and adjusts lighting — all while you're away. With ESP32 and some affordable sensors, you can build a professional-grade smart greenhouse for under $50!\n\nThis complete guide walks you through:\n\n• Hardware selection and sensor integration\n• Automatic watering based on soil moisture\n• Temperature and humidity control\n• Light intensity monitoring\n• Cloud data logging and remote monitoring\n• Mobile app integration\n\nPerfect for home gardeners, agriculture enthusiasts, and IoT learners!\n\n**Featured Project:** Check out our [Automatic Greenhouse Ambience Control](/projects) – a real-world implementation of this system.`,

      `## Components You'll Need\n\n### Microcontroller:\n\n• **ESP32 DevKit** – WiFi-enabled for cloud connectivity ([Setup Guide](/blog/esp32-getting-started))\n• Alternative: Arduino Uno + WiFi module\n\n### Sensors (with datasheets):\n\n• **[DHT11/DHT22](/resources#dht11)** – Temperature & Humidity ([Datasheet](https://www.mouser.com/datasheet/2/758/DHT11-Technical-Data-Sheet-Translated-Version-1143054.pdf))\n• **[Soil Moisture Sensor](/resources#soil-moisture)** – Capacitive or resistive type ([Datasheet](https://www.dfrobot.com/product-1385.html))\n• **[LDR (Light Sensor)](/resources#ldr)** – Ambient light detection ([Datasheet](https://www.farnell.com/datasheets/1498852.pdf))\n• **[Water Pump](/resources#pump)** – 5V/12V submersible pump\n• **Relay Module** – 5V single/dual channel for pump control\n• **Optional:** [CO₂ Gas Sensor MQ-135](/resources#gas), [pH Sensor](/resources#ph)\n\n### Power & Connectivity:\n\n• 5V/12V power adapter\n• Breadboard and jumper wires\n• Water-resistant enclosure\n\n**Component Guide:** Visit our [Resources page](/resources) for detailed sensor specifications, pinouts, and datasheets.`,

      `## System Architecture\n\nOur smart greenhouse uses a multi-sensor feedback loop:\n\n**Input Sensors:**\n• DHT11 → Measures air temperature & humidity\n• Soil Moisture → Detects when plants need water\n• LDR → Monitors sunlight levels\n\n**Control Outputs:**\n• Water Pump → Automatic irrigation via relay\n• Fan (optional) → Temperature regulation\n• LED Grow Lights (optional) → Supplemental lighting\n\n**Data Flow:**\n\`\`\`\nSensors → ESP32 → Decision Logic → Actuators\n                ↓\n         Cloud Dashboard (ThingSpeak/Blynk)\n\`\`\`\n\nThe ESP32 reads sensors every 30 seconds, makes intelligent decisions, and logs data to the cloud for remote monitoring.`,

      `## Wiring Diagram\n\n### DHT11 Temperature & Humidity Sensor:\n\n• **VCC** → 3.3V\n• **DATA** → GPIO 4\n• **GND** → GND\n\n**[View DHT11 Datasheet](https://www.mouser.com/datasheet/2/758/DHT11-Technical-Data-Sheet-Translated-Version-1143054.pdf)**\n\n### Soil Moisture Sensor:\n\n• **VCC** → 3.3V\n• **A0** → GPIO 34 (ADC pin)\n• **GND** → GND\n\n**[Learn more about Soil Moisture Sensors](/resources#soil-moisture)**\n\n### LDR Light Sensor:\n\n• **One end** → 3.3V\n• **Other end** → GPIO 35 (via 10kΩ resistor to GND)\n\n**[View LDR Guide](/resources#ldr)**\n\n### Relay Module (Water Pump Control):\n\n• **VCC** → 5V\n• **IN** → GPIO 5\n• **GND** → GND\n• **COM** → Pump positive\n• **NO** → Power supply positive\n\n**Safety:** Use optocoupler-based relay for electrical isolation!`,

      `## Complete Code\n\n\`\`\`cpp\n#include <WiFi.h>\n#include <DHT.h>\n#include <HTTPClient.h>\n\n// WiFi credentials\nconst char* ssid = "YourWiFi";\nconst char* password = "YourPassword";\n\n// ThingSpeak API\nString apiKey = "YOUR_THINGSPEAK_API_KEY";\nconst char* server = "http://api.thingspeak.com/update";\n\n// Pin definitions\n#define DHT_PIN 4\n#define SOIL_PIN 34\n#define LDR_PIN 35\n#define PUMP_PIN 5\n\n#define DHT_TYPE DHT11\nDHT dht(DHT_PIN, DHT_TYPE);\n\n// Thresholds\nconst int SOIL_DRY_THRESHOLD = 30;  // % moisture\nconst int LOW_LIGHT_THRESHOLD = 500;\n\nvoid setup() {\n  Serial.begin(115200);\n  \n  // Initialize sensors\n  dht.begin();\n  pinMode(SOIL_PIN, INPUT);\n  pinMode(LDR_PIN, INPUT);\n  pinMode(PUMP_PIN, OUTPUT);\n  digitalWrite(PUMP_PIN, LOW);\n  \n  // Connect to WiFi\n  WiFi.begin(ssid, password);\n  while (WiFi.status() != WL_CONNECTED) {\n    delay(500);\n    Serial.print(".");\n  }\n  Serial.println("\\nWiFi Connected!");\n}\n\nvoid loop() {\n  // Read all sensors\n  float temperature = dht.readTemperature();\n  float humidity = dht.readHumidity();\n  \n  int soilRaw = analogRead(SOIL_PIN);\n  int soilMoisture = map(soilRaw, 4095, 0, 0, 100);  // Convert to %\n  \n  int lightLevel = analogRead(LDR_PIN);\n  \n  // Display readings\n  Serial.println("=== Greenhouse Status ===\");\n  Serial.printf(\"Temperature: %.1f°C\\n\", temperature);\n  Serial.printf(\"Humidity: %.1f%%\\n\", humidity);\n  Serial.printf(\"Soil Moisture: %d%%\\n\", soilMoisture);\n  Serial.printf(\"Light Level: %d\\n\", lightLevel);\n  \n  // Automatic watering logic\n  if (soilMoisture < SOIL_DRY_THRESHOLD) {\n    Serial.println(\"🚰 Soil is dry! Watering plants...\");\n    digitalWrite(PUMP_PIN, HIGH);  // Turn on pump\n    delay(5000);                   // Water for 5 seconds\n    digitalWrite(PUMP_PIN, LOW);   // Turn off pump\n    Serial.println(\"✅ Watering complete!\");\n  }\n  \n  // Alert if temperature is too high\n  if (temperature > 35) {\n    Serial.println(\"⚠️ High temperature! Consider ventilation.\");\n  }\n  \n  // Send data to cloud\n  sendToThingSpeak(temperature, humidity, soilMoisture, lightLevel);\n  \n  delay(30000);  // Check every 30 seconds\n}\n\nvoid sendToThingSpeak(float temp, float humid, int soil, int light) {\n  if (WiFi.status() == WL_CONNECTED) {\n    HTTPClient http;\n    String url = String(server) + \"?api_key=\" + apiKey +\n                 \"&field1=\" + String(temp) +\n                 \"&field2=\" + String(humid) +\n                 \"&field3=\" + String(soil) +\n                 \"&field4=\" + String(light);\n    \n    http.begin(url);\n    int httpCode = http.GET();\n    \n    if (httpCode > 0) {\n      Serial.println(\"📡 Data sent to cloud!\");\n    } else {\n      Serial.println(\"❌ Failed to send data\");\n    }\n    \n    http.end();\n  }\n}\n\`\`\`\n\n**Code Features:**\n\n• Reads DHT11, soil moisture, and light sensors\n• Automatic watering when soil is dry\n• Cloud data logging to ThingSpeak\n• Serial monitor for debugging\n• Configurable thresholds`,

      `## Setting Up Cloud Monitoring\n\n### ThingSpeak Dashboard:\n\n1. Create account at [ThingSpeak.com](https://thingspeak.com/)\n2. Create new channel with 4 fields:\n   - Field 1: Temperature (°C)\n   - Field 2: Humidity (%)\n   - Field 3: Soil Moisture (%)\n   - Field 4: Light Level\n3. Copy your **Write API Key** and paste into code\n4. Upload code and watch real-time graphs!\n\n**Alternative:** Use [Blynk IoT](https://blynk.io/) for mobile app control\n\n### Mobile App Features:\n\n• Real-time sensor readings\n• Manual pump control\n• Historical data graphs\n• Push notifications for alerts\n• Remote greenhouse monitoring\n\n**Official Resources:**\n• [ThingSpeak Documentation](https://www.mathworks.com/help/thingspeak/) – Complete API reference\n• [Blynk ESP32 Guide](https://docs.blynk.io/en/blynk.apps/device-management/get-device-from-code) – Mobile app setup`,

      `## Advanced Features\n\n### 1. Temperature Control with Exhaust Fan\n\nAdd a second relay and 12V fan:\n\n\`\`\`cpp\n#define FAN_PIN 18\nconst float TEMP_HIGH_THRESHOLD = 32.0;\n\nif (temperature > TEMP_HIGH_THRESHOLD) {\n  digitalWrite(FAN_PIN, HIGH);  // Turn on fan\n  Serial.println(\"💨 Cooling greenhouse...\");\n} else {\n  digitalWrite(FAN_PIN, LOW);\n}\n\`\`\`\n\n### 2. Grow Light Automation\n\nControl LED grow lights based on natural sunlight:\n\n\`\`\`cpp\n#define GROW_LIGHT_PIN 19\n\nif (lightLevel < LOW_LIGHT_THRESHOLD) {\n  digitalWrite(GROW_LIGHT_PIN, HIGH);  // Turn on grow lights\n  Serial.println(\"💡 Grow lights ON\");\n} else {\n  digitalWrite(GROW_LIGHT_PIN, LOW);\n}\n\`\`\`\n\n### 3. Add CO₂ Monitoring\n\nUse [MQ-135 Gas Sensor](/resources#gas) to optimize photosynthesis:\n\n**[View MQ-135 Datasheet](https://www.winsen-sensor.com/d/files/PDF/Semiconductor%20Gas%20Sensor/MQ135%20(Ver1.4)%20-%20Manual.pdf)**\n\n\`\`\`cpp\n#define MQ135_PIN 36\nint co2Level = analogRead(MQ135_PIN);\nSerial.printf(\"CO₂ Level: %d\\n\", co2Level);\n\`\`\`\n\n**More Advanced Sensors:**\n• [pH Sensor](/resources#ph) – Soil acidity monitoring\n• [GPS Module](/resources#gps) – Location tracking for outdoor farms\n• [Water Flow Sensor](/resources#flow) – Precise irrigation measurement`,

      `## Troubleshooting\n\n### Pump Not Working:\n\n• Check relay wiring (COM, NO, NC)\n• Verify power supply voltage (5V/12V)\n• Test pump separately with battery\n• Ensure relay module LED lights up\n\n### Sensor Reading Errors:\n\n• **DHT11 returns NaN:** Check wiring, add 10kΩ pull-up resistor\n• **Soil sensor always wet/dry:** Calibrate using air (dry) and water (wet)\n• **LDR unstable:** Add 10kΩ resistor, shield from EMI\n\n### WiFi Connection Issues:\n\nRead our [WiFi Troubleshooting Guide](/blog/wifi-troubleshooting) for ESP32/ESP8266 connection problems.\n\n**Community Support:**\n• [ESP32 Forum](https://www.esp32.com/) – Official help\n• [r/esp32 Reddit](https://www.reddit.com/r/esp32/) – Community discussions`,

      `## Conclusion\n\nCongratulations! 🎉 You've built a fully automated smart greenhouse that:\n\n✅ Monitors temperature, humidity, soil moisture, and light\n✅ Automatically waters plants when soil is dry\n✅ Logs data to cloud for remote monitoring\n✅ Sends alerts for critical conditions\n✅ Can be expanded with fans, lights, and CO₂ sensors\n\nThis project demonstrates real-world IoT application in agriculture and can be scaled for commercial farming!\n\n### Next Steps:\n\n• **Add More Sensors:** Explore [Touch](/resources#touch), [Proximity](/resources#proximity), [Pressure](/resources#pressure) sensors\n• **Build Similar Projects:** Check our [Crop Shade Automation](/projects) and [Health Monitoring System](/projects)\n• **Learn More:** Read [Top 10 IoT Sensors Guide](/blog/iot-sensors-guide) and [Arduino vs ESP32](/blog/arduino-vs-esp32)\n\n**Official Resources:**\n• [Greenhouse Automation Research](https://www.researchgate.net/publication/Smart_Greenhouse_Automation) – Scientific papers\n• [FAO Smart Agriculture](http://www.fao.org/e-agriculture/blog/smart-agriculture-future-farming) – Industry insights\n• [Circuit Crafters Projects](/projects) – More IoT project ideas\n\nHappy growing! 🌱🚀`,
    ],
  },

  "iot-sensors-guide": {
    title: "Top 10 IoT Sensors Every Developer Must Know (With Datasheets)",
    date: "2025-11-18",
    readTime: "15 min read",
    category: "Sensors",
    seo: {
      metaTitle: "Top 10 IoT Sensors Guide: Types, Datasheets & Applications",
      metaDescription:
        "Complete guide to essential IoT sensors: DHT11, HC-SR04, PIR, Soil Moisture, Gas, GPS, and more. Includes datasheets, wiring, code examples, and real-world applications.",
      keywords: [
        "IoT sensors",
        "sensor types",
        "DHT11",
        "HC-SR04",
        "PIR sensor",
        "soil moisture",
        "gas sensor",
        "temperature sensor",
        "sensor datasheets",
      ],
      featuredImage: "/blog/iot-sensors.jpg",
    },
    content: [
      `## Introduction\n\nSensors are the eyes and ears of IoT devices. They convert physical phenomena — temperature, motion, distance, light — into electrical signals that microcontrollers can process. Whether you're building a smart home, weather station, robotics project, or industrial monitoring system, choosing the right sensors is critical.\n\nThis comprehensive guide covers the **Top 10 IoT Sensors** every developer should know, complete with:\n\n• Technical specifications and datasheets\n• Wiring diagrams and pinouts\n• Arduino/ESP32 code examples\n• Real-world applications\n• Links to detailed sensor guides\n\nLet's explore the sensors that power modern IoT!`,

      `## 1. **DHT11/DHT22** – Temperature & Humidity Sensor\n\n**What it does:** Measures ambient temperature (0-50°C) and relative humidity (20-90%)\n\n**Why it's essential:** Most IoT projects need environmental monitoring — weather stations, greenhouses, HVAC systems, and smart homes all rely on temperature/humidity data.\n\n### Technical Specs:\n\n• **Interface:** Single-wire digital (proprietary protocol)\n• **Voltage:** 3.3V - 5V\n• **Accuracy:** ±2°C (temp), ±5% RH (humidity)\n• **Sampling Rate:** 1 Hz (1 reading/second)\n\n**[View DHT11 Datasheet](https://www.mouser.com/datasheet/2/758/DHT11-Technical-Data-Sheet-Translated-Version-1143054.pdf)**\n\n**[Complete DHT11 Guide with Pinout & Code](/resources#dht11)**\n\n### Wiring:\n\n\`\`\`\nDHT11    ESP32/Arduino\nVCC   →  3.3V/5V\nDATA  →  GPIO 4\nGND   →  GND\n\`\`\`\n\n### Arduino Code:\n\n\`\`\`cpp\n#include <DHT.h>\n\n#define DHTPIN 4\n#define DHTTYPE DHT11\n\nDHT dht(DHTPIN, DHTTYPE);\n\nvoid setup() {\n  Serial.begin(9600);\n  dht.begin();\n}\n\nvoid loop() {\n  float temp = dht.readTemperature();\n  float humidity = dht.readHumidity();\n  \n  Serial.print(\"Temp: \");\n  Serial.print(temp);\n  Serial.print(\"°C | Humidity: \");\n  Serial.print(humidity);\n  Serial.println(\"%\");\n  \n  delay(2000);\n}\n\`\`\`\n\n**Applications:**\n• Weather stations\n• Smart greenhouses ([Build Guide](/blog/smart-greenhouse-diy))\n• HVAC control systems\n• Incubators and humidifiers\n\n**Library:** [Adafruit DHT Sensor Library](https://github.com/adafruit/DHT-sensor-library)`,

      `## 2. **HC-SR04** – Ultrasonic Distance Sensor\n\n**What it does:** Measures distance using ultrasonic sound waves (2cm - 400cm range)\n\n**Why it's essential:** Perfect for robotics obstacle avoidance, parking systems, water level monitoring, and automation.\n\n### Technical Specs:\n\n• **Range:** 2cm to 400cm\n• **Voltage:** 5V\n• **Accuracy:** ±3mm\n• **Frequency:** 40 kHz ultrasonic\n\n**[View HC-SR04 Datasheet](https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf)**\n\n**[Complete HC-SR04 Guide with Pinout](/resources#ultrasonic)**\n\n### Wiring:\n\n\`\`\`\nHC-SR04   ESP32/Arduino\nVCC    →  5V\nTrig   →  GPIO 5\nEcho   →  GPIO 18\nGND    →  GND\n\`\`\`\n\n### Code:\n\n\`\`\`cpp\n#define TRIG 5\n#define ECHO 18\n\nvoid setup() {\n  Serial.begin(9600);\n  pinMode(TRIG, OUTPUT);\n  pinMode(ECHO, INPUT);\n}\n\nvoid loop() {\n  digitalWrite(TRIG, LOW);\n  delayMicroseconds(2);\n  digitalWrite(TRIG, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG, LOW);\n  \n  long duration = pulseIn(ECHO, HIGH);\n  float distance = duration * 0.034 / 2;  // Speed of sound = 340 m/s\n  \n  Serial.print(\"Distance: \");\n  Serial.print(distance);\n  Serial.println(\" cm\");\n  \n  delay(500);\n}\n\`\`\`\n\n**Applications:**\n• Robot obstacle avoidance\n• Parking sensors\n• Water tank level monitoring\n• Automatic hand sanitizer dispensers\n\n**Pro Tip:** For better accuracy, take multiple readings and average them!`,

      `## 3. **PIR Motion Sensor** – Passive Infrared\n\n**What it does:** Detects motion by sensing infrared radiation from moving objects (humans, animals)\n\n**Why it's essential:** Security systems, automatic lighting, occupancy detection, and energy-saving applications.\n\n### Technical Specs:\n\n• **Detection Range:** Up to 7 meters\n• **Detection Angle:** 120°\n• **Voltage:** 5V - 12V\n• **Output:** Digital HIGH when motion detected\n\n**[View PIR Sensor Guide](/resources#pir)**\n\n### Wiring:\n\n\`\`\`\nPIR Sensor   ESP32/Arduino\nVCC       →  5V\nOUT       →  GPIO 13\nGND       →  GND\n\`\`\`\n\n### Code:\n\n\`\`\`cpp\n#define PIR_PIN 13\n\nvoid setup() {\n  Serial.begin(9600);\n  pinMode(PIR_PIN, INPUT);\n}\n\nvoid loop() {\n  int motionState = digitalRead(PIR_PIN);\n  \n  if (motionState == HIGH) {\n    Serial.println(\"🚨 Motion detected!\");\n  } else {\n    Serial.println(\"No motion\");\n  }\n  \n  delay(500);\n}\n\`\`\`\n\n**Applications:**\n• Security alarm systems\n• Automatic lights\n• Smart doorbells\n• Occupancy-based HVAC control\n\n**Explore More Motion Sensors:** [Proximity Sensors](/resources#proximity), [Touch Sensors](/resources#touch)`,

      `## 4. **Soil Moisture Sensor** – Capacitive/Resistive\n\n**What it does:** Measures moisture content in soil (analog output)\n\n**Why it's essential:** Essential for smart irrigation, greenhouse automation, and agriculture IoT.\n\n### Technical Specs:\n\n• **Type:** Capacitive (preferred) or Resistive\n• **Voltage:** 3.3V - 5V\n• **Output:** Analog (0-4095 on ESP32)\n• **Corrosion:** Capacitive type is corrosion-resistant\n\n**[View Soil Moisture Sensor Guide](/resources#soil-moisture)**\n\n### Wiring:\n\n\`\`\`\nSoil Sensor   ESP32\nVCC        →  3.3V\nA0         →  GPIO 34 (ADC pin)\nGND        →  GND\n\`\`\`\n\n### Code:\n\n\`\`\`cpp\n#define SOIL_PIN 34\n\nvoid setup() {\n  Serial.begin(9600);\n  pinMode(SOIL_PIN, INPUT);\n}\n\nvoid loop() {\n  int soilRaw = analogRead(SOIL_PIN);\n  int soilMoisture = map(soilRaw, 4095, 0, 0, 100);  // Convert to %\n  \n  Serial.print(\"Soil Moisture: \");\n  Serial.print(soilMoisture);\n  Serial.println(\"%\");\n  \n  if (soilMoisture < 30) {\n    Serial.println(\"🚰 Soil is dry! Water the plants.\");\n  }\n  \n  delay(2000);\n}\n\`\`\`\n\n**Applications:**\n• Automatic plant watering ([Smart Greenhouse Project](/blog/smart-greenhouse-diy))\n• Agriculture monitoring\n• Garden automation\n• Research and farming analytics\n\n**Calibration Tip:** Measure sensor value in air (dry) and in water (wet) to calibrate your range!`,

      `## 5. **MQ Series Gas Sensors** (MQ-2, MQ-135, MQ-7)\n\n**What they do:** Detect various gases — smoke, CO₂, CO, methane, alcohol, ammonia\n\n**Why they're essential:** Air quality monitoring, gas leak detection, industrial safety, and environmental sensing.\n\n### Common MQ Sensors:\n\n• **MQ-2:** Smoke, LPG, propane, methane\n• **MQ-135:** Air quality, CO₂, ammonia, benzene\n• **MQ-7:** Carbon monoxide (CO)\n• **MQ-9:** CO, methane, LPG\n\n**[View Gas Sensor Guide](/resources#gas)**\n\n**[MQ-135 Datasheet](https://www.winsen-sensor.com/d/files/PDF/Semiconductor%20Gas%20Sensor/MQ135%20(Ver1.4)%20-%20Manual.pdf)**\n\n### Wiring (MQ-135 example):\n\n\`\`\`\nMQ-135    ESP32/Arduino\nVCC    →  5V\nA0     →  GPIO 35\nGND    →  GND\n\`\`\`\n\n### Code:\n\n\`\`\`cpp\n#define GAS_PIN 35\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int gasLevel = analogRead(GAS_PIN);\n  \n  Serial.print(\"Gas Level: \");\n  Serial.println(gasLevel);\n  \n  if (gasLevel > 1500) {\n    Serial.println(\"⚠️ High gas concentration detected!\");\n  }\n  \n  delay(1000);\n}\n\`\`\`\n\n**Applications:**\n• Indoor air quality monitors\n• Gas leak detectors\n• Industrial safety systems\n• Greenhouse CO₂ optimization\n\n**Preheat Time:** MQ sensors require 24-48 hours of preheat for accurate readings!`,

      `## 6. **GPS Module** (NEO-6M, NEO-7M)\n\n**What it does:** Receives satellite signals to determine precise geographic location, speed, and time\n\n**Why it's essential:** Vehicle tracking, navigation systems, outdoor IoT devices, and asset monitoring.\n\n### Technical Specs:\n\n• **Accuracy:** 2.5 meters\n• **Update Rate:** 1 Hz to 10 Hz\n• **Voltage:** 3.3V - 5V\n• **Interface:** UART (Serial)\n\n**[View GPS Module Guide](/resources#gps)**\n\n### Wiring:\n\n\`\`\`\nNEO-6M    ESP32\nVCC    →  3.3V\nTX     →  GPIO 16 (RX2)\nRX     →  GPIO 17 (TX2)\nGND    →  GND\n\`\`\`\n\n### Code:\n\n\`\`\`cpp\n#include <TinyGPS++.h>\n#include <HardwareSerial.h>\n\nTinyGPSPlus gps;\nHardwareSerial GPS_Serial(2);  // Use Serial2 on ESP32\n\nvoid setup() {\n  Serial.begin(9600);\n  GPS_Serial.begin(9600, SERIAL_8N1, 16, 17);  // RX=16, TX=17\n}\n\nvoid loop() {\n  while (GPS_Serial.available() > 0) {\n    gps.encode(GPS_Serial.read());\n    \n    if (gps.location.isUpdated()) {\n      Serial.print(\"Latitude: \");\n      Serial.println(gps.location.lat(), 6);\n      Serial.print(\"Longitude: \");\n      Serial.println(gps.location.lng(), 6);\n      Serial.print(\"Speed: \");\n      Serial.print(gps.speed.kmph());\n      Serial.println(\" km/h\");\n    }\n  }\n}\n\`\`\`\n\n**Applications:**\n• Vehicle tracking systems\n• Outdoor weather stations\n• Asset tracking (containers, livestock)\n• Delivery fleet management\n\n**Library:** [TinyGPS++ Library](https://github.com/mikalhart/TinyGPSPlus)\n\n**Pro Tip:** GPS needs clear sky view. It won't work indoors!`,

      `## 7. **LDR** – Light Dependent Resistor\n\n**What it does:** Resistance changes based on ambient light intensity\n\n**Why it's essential:** Automatic lighting control, solar panel optimization, and light-sensitive automation.\n\n### Technical Specs:\n\n• **Resistance:** 1MΩ (dark) to 10kΩ (bright)\n• **Voltage:** Works with voltage divider circuit\n• **Response Time:** ~100ms\n\n**[View LDR Complete Guide](/resources#ldr)**\n\n**[LDR Datasheet](https://www.farnell.com/datasheets/1498852.pdf)**\n\n### Wiring (Voltage Divider):\n\n\`\`\`\nLDR + 10kΩ Resistor Circuit:\n3.3V → LDR → GPIO 35 (ADC) → 10kΩ → GND\n\`\`\`\n\n### Code:\n\n\`\`\`cpp\n#define LDR_PIN 35\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int lightLevel = analogRead(LDR_PIN);\n  \n  Serial.print(\"Light Level: \");\n  Serial.println(lightLevel);\n  \n  if (lightLevel < 500) {\n    Serial.println(\"💡 It's dark! Turn on lights.\");\n  } else {\n    Serial.println(\"☀️ Bright! Lights off.\");\n  }\n  \n  delay(1000);\n}\n\`\`\`\n\n**Applications:**\n• Street light automation\n• Greenhouse grow light control\n• Solar panel angle optimization\n• Camera auto-brightness\n\n**Related:** [Image Sensors](/resources#image), [Infrared Sensors](/resources#infrared)`,

      `## 8. **MAX30102** – Heart Rate & SpO₂ Sensor\n\n**What it does:** Measures heart rate (BPM) and blood oxygen saturation (SpO₂) using photoplethysmography (PPG)\n\n**Why it's essential:** Health monitoring wearables, fitness trackers, and medical IoT devices.\n\n### Technical Specs:\n\n• **Interface:** I²C\n• **Voltage:** 3.3V\n• **LEDs:** Red + Infrared for pulse detection\n• **Accuracy:** Clinical-grade when calibrated\n\n**[View Heart Rate Sensor Guide](/resources#heartrate)**\n\n### Wiring:\n\n\`\`\`\nMAX30102   ESP32\nVIN     →  3.3V\nSDA     →  GPIO 21\nSCL     →  GPIO 22\nGND     →  GND\n\`\`\`\n\n### Code:\n\n\`\`\`cpp\n#include <Wire.h>\n#include \"MAX30105.h\"\n#include \"heartRate.h\"\n\nMAX30105 particleSensor;\n\nvoid setup() {\n  Serial.begin(9600);\n  particleSensor.begin(Wire, I2C_SPEED_FAST);\n  particleSensor.setup();\n}\n\nvoid loop() {\n  long irValue = particleSensor.getIR();\n  \n  if (irValue > 50000) {  // Finger detected\n    int heartRate = particleSensor.getHeartRate();\n    int spO2 = particleSensor.getSpO2();\n    \n    Serial.print(\"❤️ Heart Rate: \");\n    Serial.print(heartRate);\n    Serial.print(\" BPM | SpO₂: \");\n    Serial.print(spO2);\n    Serial.println(\"%\");\n  } else {\n    Serial.println(\"Place finger on sensor\");\n  }\n  \n  delay(1000);\n}\n\`\`\`\n\n**Applications:**\n• Fitness bands and smartwatches\n• Remote patient monitoring ([Health Monitoring Project](/projects))\n• Sleep apnea detection\n• Stress level tracking\n\n**Library:** [SparkFun MAX3010x Library](https://github.com/sparkfun/SparkFun_MAX3010x_Sensor_Library)`,

      `## 9. **Pressure Sensors** (BMP180, BMP280)\n\n**What they do:** Measure atmospheric pressure and altitude\n\n**Why they're essential:** Weather stations, altimeters, drone navigation, and environmental monitoring.\n\n### Technical Specs:\n\n• **Interface:** I²C\n• **Voltage:** 3.3V\n• **Range:** 300-1100 hPa\n• **Accuracy:** ±1 hPa (±8m altitude)\n\n**[View Pressure Sensor Guide](/resources#pressure)**\n\n### Wiring:\n\n\`\`\`\nBMP280    ESP32\nVIN    →  3.3V\nSDA    →  GPIO 21\nSCL    →  GPIO 22\nGND    →  GND\n\`\`\`\n\n### Code:\n\n\`\`\`cpp\n#include <Wire.h>\n#include <Adafruit_BMP280.h>\n\nAdafruit_BMP280 bmp;\n\nvoid setup() {\n  Serial.begin(9600);\n  bmp.begin(0x76);  // I²C address\n}\n\nvoid loop() {\n  float pressure = bmp.readPressure() / 100.0;  // Convert to hPa\n  float altitude = bmp.readAltitude(1013.25);   // Sea level pressure\n  float temperature = bmp.readTemperature();\n  \n  Serial.print(\"Pressure: \");\n  Serial.print(pressure);\n  Serial.print(\" hPa | Altitude: \");\n  Serial.print(altitude);\n  Serial.print(\" m | Temp: \");\n  Serial.print(temperature);\n  Serial.println(\"°C\");\n  \n  delay(2000);\n}\n\`\`\`\n\n**Applications:**\n• Weather forecasting\n• Drone altitude control\n• Hiking altimeters\n• Indoor navigation (floor detection)\n\n**Library:** [Adafruit BMP280 Library](https://github.com/adafruit/Adafruit_BMP280_Library)`,

      `## 10. **Touch Sensors** – Capacitive Touch\n\n**What they do:** Detect human touch using capacitance changes\n\n**Why they're essential:** Touchless switches, user interfaces, and interactive projects.\n\n### Technical Specs:\n\n• **Interface:** Digital or capacitive touch pins (ESP32 has built-in)\n• **Voltage:** 3.3V - 5V\n• **Sensitivity:** Adjustable via threshold\n\n**[View Touch Sensor Guide](/resources#touch)**\n\n### ESP32 Built-in Touch Pins:\n\nESP32 has 10 capacitive touch GPIO pins: T0-T9 (GPIO 4, 0, 2, 15, 13, 12, 14, 27, 33, 32)\n\n### Code (ESP32 Touch Pin):\n\n\`\`\`cpp\n#define TOUCH_PIN T0  // GPIO 4\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int touchValue = touchRead(TOUCH_PIN);\n  \n  Serial.print(\"Touch Value: \");\n  Serial.println(touchValue);\n  \n  if (touchValue < 40) {  // Threshold (adjust based on testing)\n    Serial.println(\"👆 Touch detected!\");\n  }\n  \n  delay(500);\n}\n\`\`\`\n\n**Applications:**\n• Touchless light switches\n• Interactive art installations\n• Custom keyboards and controllers\n• Proximity-based automation\n\n**Pro Tip:** ESP32's touch pins eliminate the need for external modules!`,

      `## Bonus: Sensor Selection Guide\n\n### By Application:\n\n**Smart Home:**\n• Temperature: [DHT11](/resources#dht11)\n• Motion: [PIR](/resources#pir)\n• Light: [LDR](/resources#ldr)\n• Gas: [MQ-2](/resources#gas)\n\n**Agriculture IoT:**\n• Soil: [Soil Moisture](/resources#soil-moisture)\n• Weather: [DHT22](/resources#dht11), [BMP280](/resources#pressure)\n• Irrigation: [Water Flow](/resources#flow)\n\n**Robotics:**\n• Distance: [HC-SR04](/resources#ultrasonic)\n• Touch: [Capacitive Touch](/resources#touch)\n• Position: [GPS](/resources#gps)\n\n**Health Monitoring:**\n• Vitals: [MAX30102](/resources#heartrate)\n• Temperature: [MLX90614 IR](/resources#infrared)\n• Blood Pressure: [Pressure](/resources#blood-pressure)\n\n**[Explore All Sensors in Resources](/resources)**`,

      `## Conclusion\n\nYou now know the **Top 10 IoT Sensors** that power modern connected devices! Each sensor serves a unique purpose, and combining them creates powerful IoT systems.\n\n### Quick Recap:\n\n✅ **DHT11/DHT22** – Temperature & Humidity\n✅ **HC-SR04** – Ultrasonic Distance\n✅ **PIR** – Motion Detection\n✅ **Soil Moisture** – Agriculture & Irrigation\n✅ **MQ Gas Sensors** – Air Quality & Safety\n✅ **GPS** – Location Tracking\n✅ **LDR** – Light Intensity\n✅ **MAX30102** – Heart Rate & SpO₂\n✅ **BMP280** – Pressure & Altitude\n✅ **Touch Sensors** – Capacitive Interfaces\n\n### Next Steps:\n\n• **Build Projects:** Try our [Smart Greenhouse](/blog/smart-greenhouse-diy) or [ESP32 Getting Started](/blog/esp32-getting-started)\n• **Explore More Sensors:** Visit [Resources Page](/resources) for [Image](/resources#image), [Sound](/resources#sound), [pH](/resources#ph), and more\n• **Compare Hardware:** Read [Arduino vs ESP32](/blog/arduino-vs-esp32) guide\n\n**Official Resources:**\n• [Circuit Crafters Sensor Library](/resources) – Complete sensor database with datasheets\n• [Adafruit Sensor Guide](https://learn.adafruit.com/category/sensors) – Tutorials and libraries\n• [SparkFun Sensor Kits](https://www.sparkfun.com/categories/23) – Hardware options\n\nHappy sensing! 🚀`,
    ],
  },

  "arduino-vs-esp32": {
    title: "Arduino vs ESP32: Which Microcontroller Should You Choose?",
    date: "2025-11-20",
    readTime: "12 min read",
    category: "Hardware",
    seo: {
      metaTitle: "Arduino vs ESP32: Complete Comparison Guide for IoT Projects",
      metaDescription:
        "Compare Arduino Uno and ESP32: performance, WiFi, price, GPIO pins, power consumption. Detailed guide to help you choose the right microcontroller for your IoT project.",
      keywords: [
        "Arduino vs ESP32",
        "ESP32 vs Arduino",
        "microcontroller comparison",
        "IoT board selection",
        "Arduino Uno",
        "ESP32 DevKit",
        "ESP8266",
      ],
      featuredImage: "/blog/arduino-vs-esp32.jpg",
    },
    content: [
      `## Introduction\n\nChoosing between Arduino and ESP32 is one of the first decisions every IoT developer faces. Both are powerful, beginner-friendly, and widely supported — but they serve different purposes.\n\n**Quick Answer:**\n\n• **Arduino Uno:** Best for learning electronics basics, offline projects, and when you don't need WiFi\n• **ESP32:** Best for IoT projects requiring WiFi/Bluetooth, high performance, and advanced features\n\nThis guide compares Arduino Uno and ESP32 across 10 critical factors to help you make the right choice for your project.\n\n**New to ESP32?** Read our [ESP32 Getting Started Guide](/blog/esp32-getting-started)`,

      `## Head-to-Head Comparison\n\n| Feature | Arduino Uno | ESP32 DevKit |\n|---------|------------|---------------|\n| **Microcontroller** | ATmega328P | Dual-core Xtensa LX6 |\n| **Clock Speed** | 16 MHz | 240 MHz (15x faster!) |\n| **Flash Memory** | 32 KB | 4 MB (125x more!) |\n| **SRAM** | 2 KB | 520 KB |\n| **GPIO Pins** | 14 digital, 6 analog | 34 digital, 18 analog |\n| **WiFi** | ❌ No | ✅ Built-in 802.11 b/g/n |\n| **Bluetooth** | ❌ No | ✅ BLE 4.2 |\n| **Operating Voltage** | 5V | 3.3V |\n| **Price** | ~$25 | ~$6 |\n| **Power Consumption** | ~50 mA | 80-240 mA (active), <1 mA (deep sleep) |\n| **Programming** | Arduino IDE | Arduino IDE, ESP-IDF, MicroPython |\n| **USB Interface** | Built-in | Via USB-to-UART chip (CP2102/CH340) |\n| **ADC Resolution** | 10-bit (0-1023) | 12-bit (0-4095) |\n| **Touch Pins** | ❌ No | ✅ 10 capacitive touch pins |\n| **Best For** | Beginners, offline projects | IoT, WiFi projects, advanced features |`,

      `## 1. Performance: ESP32 Dominates\n\n### Processing Power:\n\n• **Arduino Uno:** 8-bit ATmega328P @ 16 MHz\n• **ESP32:** 32-bit dual-core Xtensa @ 240 MHz\n\n**Winner:** ESP32 (15x faster clock speed!)\n\n### Memory:\n\n• **Arduino Uno:** 32 KB Flash, 2 KB SRAM\n• **ESP32:** 4 MB Flash, 520 KB SRAM\n\n**Winner:** ESP32 (125x more storage!)\n\n**What this means:**\n\n• Arduino struggles with complex code, image processing, or large datasets\n• ESP32 can handle web servers, image recognition, and multitasking\n\n**Example:** Running a web server with sensor data:\n\n• **Arduino:** Requires Ethernet shield, slow response\n• **ESP32:** Built-in WiFi, handles 10+ concurrent connections easily`,

      `## 2. Connectivity: ESP32's Killer Feature\n\n### WiFi:\n\n• **Arduino Uno:** ❌ No WiFi (requires external shield ~$30)\n• **ESP32:** ✅ Built-in 802.11 b/g/n WiFi\n\n### Bluetooth:\n\n• **Arduino Uno:** ❌ No Bluetooth\n• **ESP32:** ✅ Bluetooth Classic + BLE 4.2\n\n**Winner:** ESP32 (no contest!)\n\n**IoT Applications:**\n\n• **Smart Home:** ESP32 connects to WiFi, Arduino needs expensive shields\n• **Cloud Logging:** ESP32 sends data to [ThingSpeak](https://thingspeak.com/), [AWS IoT](https://aws.amazon.com/iot/), or [Blynk](https://blynk.io/)\n• **Mobile Apps:** ESP32 uses Bluetooth to communicate with smartphones\n\n**Troubleshooting WiFi?** Read our [WiFi Connection Guide](/blog/wifi-troubleshooting)\n\n**Real-World Example:**\n\nBuilding a [Smart Greenhouse](/blog/smart-greenhouse-diy):\n\n• **Arduino:** Needs WiFi shield ($30), complex wiring, limited memory\n• **ESP32:** Built-in WiFi, simple setup, cloud monitoring ready`,

      `## 3. GPIO Pins & Peripherals\n\n### Digital/Analog Pins:\n\n• **Arduino Uno:** 14 digital, 6 analog (10-bit ADC)\n• **ESP32:** 34 digital, 18 analog (12-bit ADC)\n\n**Winner:** ESP32 (more pins + higher ADC resolution)\n\n### Special Features:\n\n**ESP32 Exclusive:**\n\n• 10 capacitive touch pins (built-in [touch sensors](/resources#touch))\n• 16 PWM channels (vs 6 on Arduino)\n• 2x UART, 2x I²C, 4x SPI\n• DAC (Digital-to-Analog Converter)\n\n**Arduino Advantage:**\n\n• 5V logic (compatible with more legacy sensors)\n• Simpler pin configuration\n\n**Sensor Compatibility:**\n\n• **5V Sensors ([DHT11](/resources#dht11), [HC-SR04](/resources#ultrasonic)):** Work directly with Arduino, need level shifters for ESP32\n• **3.3V Sensors:** Work with both\n• **I²C Sensors ([BMP280](/resources#pressure), [MAX30102](/resources#heartrate)):** Work with both\n\n**Pro Tip:** Most modern sensors support 3.3V-5V, so ESP32's 3.3V logic is rarely an issue!`,

      `## 4. Power Consumption\n\n### Active Mode:\n\n• **Arduino Uno:** ~50 mA\n• **ESP32:** 80-240 mA (varies with WiFi usage)\n\n**Winner:** Arduino (lower power in simple mode)\n\n### Sleep Mode:\n\n• **Arduino:** ~15 mA (sleep mode)\n• **ESP32:** 0.8 mA (light sleep), 10 μA (deep sleep!)\n\n**Winner:** ESP32 (incredible deep sleep efficiency!)\n\n**Battery-Powered Projects:**\n\n• **Short bursts + long sleep:** ESP32 wins (deep sleep = months on battery)\n• **Continuous operation:** Arduino uses less power\n\n**Example - Weather Station:**\n\n• **ESP32:** Wake every 15 minutes, read sensors, send to cloud, deep sleep → Runs 6+ months on 18650 battery\n• **Arduino:** Constantly powered → Needs wall adapter or frequent battery changes\n\n**Code Example (ESP32 Deep Sleep):**\n\n\`\`\`cpp\n#include <esp_sleep.h>\n\nvoid setup() {\n  // Read sensors, send data\n  esp_sleep_enable_timer_wakeup(15 * 60 * 1000000);  // Wake in 15 min\n  esp_deep_sleep_start();\n}\n\nvoid loop() {\n  // Never executes\n}\n\`\`\``,

      `## 5. Price: ESP32 Wins!\n\n• **Arduino Uno:** ~$25 (official), ~$10 (clone)\n• **ESP32 DevKit:** ~$6 (official), ~$4 (clone)\n\n**Winner:** ESP32 (50% cheaper with MORE features!)\n\n**Cost Analysis for Smart Home Project:**\n\n| Component | Arduino Uno | ESP32 |\n|-----------|------------|-------|\n| Board | $25 | $6 |\n| WiFi Module | $30 | Built-in |\n| Bluetooth | $15 | Built-in |\n| **Total** | **$70** | **$6** |\n\n**Sensor Compatibility:**\n\nBoth support the same sensors:\n\n• [DHT11 Temperature](/resources#dht11)\n• [HC-SR04 Ultrasonic](/resources#ultrasonic)\n• [PIR Motion](/resources#pir)\n• [Soil Moisture](/resources#soil-moisture)\n• [Gas Sensors](/resources#gas)\n\n**Where to Buy:**\n\n• [Arduino Official Store](https://store.arduino.cc/)\n• [ESP32 on Amazon](https://www.amazon.com/s?k=ESP32+DevKit)\n• [AliExpress](https://www.aliexpress.com/) – Cheapest option`,

      `## 6. Ease of Use: Arduino for Beginners\n\n### Learning Curve:\n\n• **Arduino Uno:** Easier for absolute beginners\n  - Simple 5V logic\n  - Fewer configuration options\n  - Plug-and-play USB\n  - Extensive beginner tutorials\n\n• **ESP32:** Slightly steeper learning curve\n  - 3.3V logic (requires caution with 5V sensors)\n  - More advanced features to understand\n  - May need USB driver installation ([CP2102](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers))\n  - WiFi/Bluetooth configuration\n\n**Winner:** Arduino Uno (for first-time learners)\n\n### Programming:\n\nBoth use **Arduino IDE**, so code is very similar!\n\n**Blink LED (Arduino):**\n\n\`\`\`cpp\nvoid setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}\n\`\`\`\n\n**Blink LED (ESP32):**\n\n\`\`\`cpp\nvoid setup() {\n  pinMode(2, OUTPUT);  // Different pin number\n}\n\nvoid loop() {\n  digitalWrite(2, HIGH);\n  delay(1000);\n  digitalWrite(2, LOW);\n  delay(1000);\n}\n\`\`\`\n\n**99% of code is identical!**\n\n**Official Guides:**\n\n• [Arduino Getting Started](https://www.arduino.cc/en/Guide)\n• [ESP32 Arduino Core](https://docs.espressif.com/projects/arduino-esp32/en/latest/)`,

      `## 7. Community & Support\n\n### Arduino:\n\n• **Established:** 15+ years of community support\n• **Resources:** Thousands of tutorials, books, courses\n• **Forums:** [Arduino Forum](https://forum.arduino.cc/)\n• **Libraries:** 5000+ libraries in Arduino Library Manager\n\n### ESP32:\n\n• **Growing:** Rapidly expanding community\n• **Resources:** Excellent documentation, modern tutorials\n• **Forums:** [ESP32 Forum](https://www.esp32.com/), [r/esp32](https://www.reddit.com/r/esp32/)\n• **Libraries:** Most Arduino libraries work on ESP32!\n\n**Winner:** Tie (both have excellent support)\n\n**Popular Tutorials:**\n\n• [Random Nerd Tutorials](https://randomnerdtutorials.com/) – Best ESP32 resource\n• [Adafruit Learn](https://learn.adafruit.com/) – Arduino and ESP32\n• [Circuit Crafters Guides](/resources) – Sensor integration tutorials`,

      `## 8. Real-World Use Cases\n\n### Choose Arduino Uno When:\n\n✅ You're a complete beginner learning electronics\n✅ Project doesn't need WiFi/Bluetooth\n✅ You need 5V logic for legacy sensors\n✅ Power consumption must be minimal (no WiFi)\n✅ Building simple robots or basic automation\n\n**Example Projects:**\n\n• LED animations and displays\n• Basic robot car\n• Offline sensor logging to SD card\n• Motor control systems\n• Arduino learning kits\n\n### Choose ESP32 When:\n\n✅ You need WiFi or Bluetooth connectivity\n✅ Building IoT projects with cloud integration\n✅ You want better performance and more memory\n✅ Need touch sensors, DAC, or multiple peripherals\n✅ Battery-powered with deep sleep requirements\n\n**Example Projects:**\n\n• [Smart Greenhouse with Cloud Monitoring](/blog/smart-greenhouse-diy)\n• Weather stations with online dashboards\n• Home automation systems\n• Security cameras with WiFi streaming\n• Wearable health monitors ([MAX30102](/resources#heartrate))\n• Sensor networks with [MQTT](https://mqtt.org/)\n\n**Explore Projects:** Visit our [Projects Page](/projects) for real-world examples!`,

      `## Conclusion\n\nBoth Arduino Uno and ESP32 are excellent choices, but ESP32 offers more features at a lower price — especially for IoT applications.\n\n### Summary:\n\n**Arduino Uno:**\n✅ Best for learning\n✅ Simple 5V logic\n✅ Extensive beginner resources\n❌ No WiFi/Bluetooth\n❌ Limited memory and speed\n\n**ESP32:**\n✅ Built-in WiFi + Bluetooth\n✅ 15x faster, 125x more memory\n✅ Cheaper ($6 vs $25)\n✅ Deep sleep for battery projects\n✅ Advanced features (touch, DAC, dual-core)\n❌ Slightly steeper learning curve\n\n**Our Recommendation:** Start learning with Arduino Uno tutorials, but buy ESP32 for your actual projects!\n\n### Next Steps:\n\n• **Get Started with ESP32:** [ESP32 Beginner Tutorial](/blog/esp32-getting-started)\n• **Build IoT Projects:** [Smart Greenhouse Guide](/blog/smart-greenhouse-diy)\n• **Explore Sensors:** [Top 10 IoT Sensors](/blog/iot-sensors-guide)\n• **Troubleshooting:** [WiFi Connection Issues](/blog/wifi-troubleshooting)\n\n**Official Resources:**\n\n• [Arduino Official Documentation](https://www.arduino.cc/reference/en/)\n• [ESP32 Official Docs](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)\n• [Circuit Crafters Resources](/resources) – Sensor guides and datasheets\n\nHappy building! 🚀`,
    ],
  },

  "wifi-troubleshooting": {
    title:
      "WiFi Connection Issues on ESP32/ESP8266: Complete Troubleshooting Guide",
    date: "2025-11-15",
    readTime: "13 min read",
    category: "Tutorials",
    seo: {
      metaTitle:
        "Fix ESP32/ESP8266 WiFi Issues: Complete Troubleshooting Guide",
      metaDescription:
        "Solve ESP32 and ESP8266 WiFi connection problems: authentication failed, SSID not found, weak signal, disconnections. Includes code fixes and network configuration.",
      keywords: [
        "ESP32 WiFi issues",
        "ESP8266 WiFi problems",
        "WiFi connection failed",
        "ESP32 troubleshooting",
        "SSID not found",
        "WiFi authentication error",
      ],
      featuredImage: "/blog/wifi-troubleshooting.jpg",
    },
    content: [
      `## Introduction\n\nWiFi connectivity is the backbone of IoT projects, but ESP32 and ESP8266 WiFi issues can be frustrating! Common problems include:\n\n• "Connecting to WiFi..." stuck forever\n• Authentication failed errors\n• SSID not found\n• Frequent disconnections\n• Weak signal strength\n• Can't connect to 5 GHz WiFi\n\nThis comprehensive guide diagnoses and fixes **every common ESP32/ESP8266 WiFi problem** with working code examples.\n\n**New to ESP32?** Start with our [ESP32 Getting Started Guide](/blog/esp32-getting-started)`,

      `## Problem 1: SSID Not Found (WL_NO_SSID_AVAIL)\n\n### Symptoms:\n\n\`\`\`\nERROR: SSID not found! Check network name.\nStatus Code: 1\n\`\`\`\n\n### Causes:\n\n1. **5 GHz WiFi network** – ESP32/ESP8266 only support **2.4 GHz**!\n2. Typo in SSID (case-sensitive!)\n3. Router has 2.4 GHz disabled\n4. Hidden SSID network\n5. ESP32 too far from router\n\n### Solution: Scan Available Networks\n\nUse this diagnostic code to see all visible WiFi networks:\n\n\`\`\`cpp\n#include <WiFi.h>\n\nvoid setup() {\n  Serial.begin(115200);\n  delay(1000);\n  \n  Serial.println(\"Scanning WiFi networks...\");\n  \n  int n = WiFi.scanNetworks();\n  \n  if (n == 0) {\n    Serial.println(\"❌ No networks found!\");\n  } else {\n    Serial.printf(\"✅ Found %d networks:\\n\", n);\n    \n    for (int i = 0; i < n; i++) {\n      Serial.printf(\"%d: %s (%d dBm) %s\\n\",\n        i + 1,\n        WiFi.SSID(i).c_str(),\n        WiFi.RSSI(i),\n        WiFi.encryptionType(i) == WIFI_AUTH_OPEN ? \"Open\" : \"Encrypted\"\n      );\n    }\n  }\n}\n\nvoid loop() {}\n\`\`\`\n\n**Router Configuration:** Enable 2.4 GHz WiFi and set to WPA2 encryption`,

      `## Problem 2: Frequent Disconnections\n\n### Solution: Auto-Reconnect Logic\n\n\`\`\`cpp\n#include <WiFi.h>\n\nconst char* ssid = "YourWiFi";\nconst char* password = "YourPassword";\n\nvoid setup() {\n  Serial.begin(115200);\n  connectWiFi();\n}\n\nvoid loop() {\n  if (WiFi.status() != WL_CONNECTED) {\n    Serial.println(\"⚠️ WiFi disconnected! Reconnecting...\");\n    connectWiFi();\n  }\n  delay(10000);\n}\n\nvoid connectWiFi() {\n  WiFi.mode(WIFI_STA);\n  WiFi.begin(ssid, password);\n  \n  int timeout = 20;\n  int attempts = 0;\n  \n  while (WiFi.status() != WL_CONNECTED && attempts < timeout) {\n    delay(1000);\n    Serial.print(".");\n    attempts++;\n  }\n  \n  if (WiFi.status() == WL_CONNECTED) {\n    Serial.println(\"\\n✅ WiFi Connected!\");\n    Serial.print(\"RSSI: \");\n    Serial.print(WiFi.RSSI());\n    Serial.println(\" dBm\");\n  }\n}\n\`\`\``,

      `## Conclusion\n\nYou now have a complete toolkit to diagnose and fix ESP32/ESP8266 WiFi issues!\n\n### Key Takeaways:\n\n✅ Always use 2.4 GHz WiFi (not 5 GHz)\n✅ Add timeout logic\n✅ Implement auto-reconnect\n✅ Use proper power supply\n✅ Check signal strength (RSSI > -70 dBm)\n\n### Next Steps:\n\n• **Build IoT Projects:** [Smart Greenhouse Tutorial](/blog/smart-greenhouse-diy)\n• **Learn ESP32:** [ESP32 Getting Started Guide](/blog/esp32-getting-started)\n• **Add Sensors:** [Top 10 IoT Sensors](/blog/iot-sensors-guide)\n• **Compare Boards:** [Arduino vs ESP32](/blog/arduino-vs-esp32)\n\nHappy debugging! 🔧🚀`,
    ],
  },
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const path = slug || "power-consumption";
  const post = articles[path as keyof typeof articles];
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastUpdateRef = useRef(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const now = Date.now();
        // Throttle updates to max 15fps (every 66ms) for smooth performance
        if (now - lastUpdateRef.current < 66) return;

        lastUpdateRef.current = now;
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        setScrollProgress(progress);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
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

  const handleShare = useCallback(
    (platform: string) => {
      const url = window.location.href;
      const title = post.title;
      const shareUrls: Record<string, string> = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(
          title + " " + url
        )}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`,
      };
      if (shareUrls[platform]) {
        window.open(shareUrls[platform], "_blank", "width=600,height=400");
      }
    },
    [post.title]
  );

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
          <svg
            className="absolute inset-0 w-28 h-28 transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${
                2 * Math.PI * 40 * (1 - scrollProgress / 100)
              }`}
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
                <Button
                  onClick={() => navigate("/blog")}
                  variant="outline"
                  size="icon"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <header className="mb-12">
                <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-full">
                    {post.category}
                  </span>
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
                    <Button
                      onClick={() => handleShare("twitter")}
                      variant="outline"
                      size="sm"
                    >
                      Twitter
                    </Button>
                    <Button
                      onClick={() => handleShare("linkedin")}
                      variant="outline"
                      size="sm"
                    >
                      LinkedIn
                    </Button>
                    <Button
                      onClick={() => handleShare("whatsapp")}
                      variant="outline"
                      size="sm"
                    >
                      WhatsApp
                    </Button>
                    <Button
                      onClick={() => handleShare("facebook")}
                      variant="outline"
                      size="sm"
                    >
                      Facebook
                    </Button>
                  </div>
                </div>
              </header>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                {post.content.map((paragraph, index) => {
                  // Check if paragraph contains code block
                  const codeBlockMatch = paragraph.match(
                    /```(\w+)?\n([\s\S]*?)```/
                  );

                  if (codeBlockMatch) {
                    const language = codeBlockMatch[1] || "text";
                    const code = codeBlockMatch[2];
                    const beforeCode = paragraph.substring(
                      0,
                      codeBlockMatch.index
                    );
                    const afterCode = paragraph.substring(
                      codeBlockMatch.index! + codeBlockMatch[0].length
                    );

                    return (
                      <div key={index} className="mb-6">
                        {beforeCode && (
                          <div className="mb-4">
                            {beforeCode.split("\n").map((line, lineIdx) => (
                              <p
                                key={lineIdx}
                                className={
                                  line.startsWith("•") ? "pl-6 my-1" : "mb-2"
                                }
                              >
                                {parseContent(line)}
                              </p>
                            ))}
                          </div>
                        )}
                        <div className="my-6 rounded-lg overflow-hidden border border-gray-700 shadow-2xl">
                          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 flex items-center justify-between border-b border-gray-700">
                            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                              {language}
                            </span>
                            <div className="flex gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                          </div>
                          <pre className="bg-[#1e1e1e] p-6 overflow-x-auto">
                            <code
                              className="text-sm font-mono leading-relaxed"
                              style={{
                                color: "#d4d4d4",
                                display: "block",
                                whiteSpace: "pre",
                              }}
                            >
                              {code.split("\n").map((line, i) => (
                                <div
                                  key={i}
                                  className="hover:bg-gray-800/50 px-2 -mx-2 rounded"
                                >
                                  <span className="text-gray-600 select-none mr-4 inline-block w-8 text-right">
                                    {i + 1}
                                  </span>
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: line
                                        .replace(
                                          /\b(void|int|float|char|const|return|if|else|for|while|#define|#include)\b/g,
                                          '<span style="color: #569cd6">$1</span>'
                                        )
                                        .replace(
                                          /\b(setup|loop|pinMode|digitalWrite|delay|Serial|begin|print|println)\b/g,
                                          '<span style="color: #dcdcaa">$1</span>'
                                        )
                                        .replace(
                                          /\b(\d+)\b/g,
                                          '<span style="color: #b5cea8">$1</span>'
                                        )
                                        .replace(
                                          /(["'])(.*?)\1/g,
                                          '<span style="color: #ce9178">$1$2$1</span>'
                                        )
                                        .replace(
                                          /\/\/(.*)/g,
                                          '<span style="color: #6a9955">//$1</span>'
                                        )
                                        .replace(
                                          /\b(LED_BUILTIN|HIGH|LOW|OUTPUT|INPUT)\b/g,
                                          '<span style="color: #4ec9b0">$1</span>'
                                        )
                                        .replace(
                                          /\b(sudo|apt-get|install|modprobe|esptool\.py|bash)\b/g,
                                          '<span style="color: #569cd6">$1</span>'
                                        ),
                                    }}
                                  />
                                </div>
                              ))}
                            </code>
                          </pre>
                        </div>
                        {afterCode && (
                          <div className="mt-4">
                            {afterCode.split("\n").map((line, lineIdx) => (
                              <p
                                key={lineIdx}
                                className={
                                  line.startsWith("•") ? "pl-6 my-1" : "mb-2"
                                }
                              >
                                {parseContent(line)}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Regular paragraph without code block
                  return (
                    <div key={index} className="mb-6">
                      {paragraph.split("\n").map((line, lineIdx) => {
                        if (line.startsWith("```")) {
                          return null;
                        }

                        // Check if this is the first line (section title/heading)
                        if (lineIdx === 0 && !line.startsWith("•")) {
                          return (
                            <div
                              key={lineIdx}
                              className="bg-gradient-to-r from-accent/10 to-purple-600/10 border-l-4 border-accent px-6 py-4 rounded-lg mb-4 shadow-md"
                            >
                              <h3 className="text-2xl font-bold text-accent">
                                {line}
                              </h3>
                            </div>
                          );
                        }

                        // Check if line starts with "References:" or "Key Takeaways:" or "Call to Action:"
                        if (
                          line.startsWith("References:") ||
                          line.startsWith("Key Takeaways:") ||
                          line.startsWith("Call to Action:")
                        ) {
                          return (
                            <div
                              key={lineIdx}
                              className="bg-gradient-to-r from-purple-600/10 to-accent/10 border border-accent/30 px-5 py-3 rounded-lg mt-6 mb-2 shadow-sm"
                            >
                              <h4 className="text-lg font-semibold text-purple-600">
                                {line}
                              </h4>
                            </div>
                          );
                        }

                        return (
                          <p
                            key={lineIdx}
                            className={
                              line.startsWith("•") ? "pl-6 my-1" : "mb-2"
                            }
                          >
                            {parseContent(line)}
                          </p>
                        );
                      })}
                    </div>
                  );
                })}
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
