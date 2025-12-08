// Article metadata - lightweight file for routing
export interface ArticleMetadata {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  available: boolean;
}

export const articlesList: ArticleMetadata[] = [
  {
    slug: "power-consumption",
    title: "Optimizing Power Consumption in IoT Devices",
    category: "Power Management",
    date: "2025-10-15",
    readTime: "14 min read",
    available: true,
  },
  {
    slug: "rtos",
    title: "Real-Time Operating Systems (RTOS) for IoT: Complete Guide",
    category: "RTOS",
    date: "2025-10-08",
    readTime: "16 min read",
    available: true,
  },
  {
    slug: "lorawan-networks",
    title: "Building Resilient LoRaWAN Networks",
    category: "Networking",
    date: "2025-09-25",
    readTime: "12 min read",
    available: true,
  },
  {
    slug: "debugging-embedded",
    title: "Debugging Embedded Systems: A Complete Guide",
    category: "Development",
    date: "2025-10-12",
    readTime: "15 min read",
    available: true,
  },
  {
    slug: "edge-ai",
    title: "Edge AI on Microcontrollers: TensorFlow Lite Micro Guide",
    category: "AI/ML",
    date: "2025-09-22",
    readTime: "18 min read",
    available: true,
  },
  {
    slug: "mqtt-protocol",
    title: "MQTT Protocol Deep Dive: Complete Guide for IoT Developers",
    category: "Protocols",
    date: "2025-10-05",
    readTime: "16 min read",
    available: true,
  },
  {
    slug: "iot-security",
    title: "IoT Security Best Practices: Complete Guide for Embedded Systems",
    category: "Security",
    date: "2025-10-18",
    readTime: "18 min read",
    available: true,
  },
  {
    slug: "ble-basics",
    title:
      "BLE (Bluetooth Low Energy) Basics: Complete Guide for IoT Developers",
    category: "Connectivity",
    date: "2025-10-02",
    readTime: "16 min read",
    available: true,
  },
  {
    slug: "ota-updates",
    title:
      "OTA (Over-The-Air) Updates for IoT Devices: Complete Implementation Guide",
    category: "Development",
    date: "2025-10-09",
    readTime: "17 min read",
    available: true,
  },
  {
    slug: "node-red-dashboards",
    title: "Building IoT Dashboards with Node-RED: Complete Guide",
    category: "Visualization",
    date: "2025-10-01",
    readTime: "19 min read",
    available: true,
  },
  {
    slug: "esp32-getting-started",
    title: "ESP32 Getting Started Guide: Your First IoT Project in 30 Minutes",
    category: "Tutorials",
    date: "2025-11-24",
    readTime: "10 min read",
    available: true,
  },
  {
    slug: "smart-greenhouse-diy",
    title: "Build Your Own Smart Greenhouse: Complete Step-by-Step Guide",
    category: "Projects",
    date: "2025-11-22",
    readTime: "20 min read",
    available: true,
  },
  {
    slug: "iot-sensors-guide",
    title: "Top 10 IoT Sensors Every Developer Must Know (With Datasheets)",
    category: "Sensors",
    date: "2025-11-18",
    readTime: "15 min read",
    available: true,
  },
  {
    slug: "arduino-vs-esp32",
    title: "Arduino vs ESP32: Which Microcontroller Should You Choose in 2025?",
    category: "Hardware",
    date: "2025-11-20",
    readTime: "12 min read",
    available: true,
  },
  {
    slug: "wifi-troubleshooting",
    title:
      "WiFi Connection Issues in ESP32/ESP8266: Complete Troubleshooting Guide",
    category: "Troubleshooting",
    date: "2025-11-05",
    readTime: "13 min read",
    available: true,
  },
];
