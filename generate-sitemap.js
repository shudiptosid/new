import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = "https://yourwebsite.com"; // Replace with your actual domain

// Define all your routes
const routes = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/resources", changefreq: "weekly", priority: 0.9 },
  { url: "/resources/ece", changefreq: "weekly", priority: 0.8 },
  { url: "/projects", changefreq: "weekly", priority: 0.8 },
  { url: "/services", changefreq: "monthly", priority: 0.7 },
  { url: "/blog", changefreq: "weekly", priority: 0.8 },
  { url: "/contact", changefreq: "monthly", priority: 0.6 },
  { url: "/completed-projects", changefreq: "monthly", priority: 0.7 },
];

// Add sensor pages dynamically
const sensors = [
  "ultrasonic-sensor-hc-sr04",
  "pir-motion-sensor",
  "dht11-temperature-humidity",
  "gas-sensor",
  "ir-infrared-sensor",
  "force-sensor",
  "touch-sensor",
  "sound-sensor",
  "accelerometer",
  "gyroscope",
  "gps-sensor",
  "heart-rate-sensor",
  "pressure-sensor",
  "proximity-sensor",
  "color-sensor",
  "moisture-sensor",
  "tilt-sensor",
  "vibration-sensor",
  "smoke-sensor",
  "flame-sensor",
  "magnetometer",
  "hall-effect-sensor",
  "ldr-light-sensor",
  "barometer",
  "oxygen-sensor",
  "co-carbon-monoxide-sensor",
  "radiation-sensor",
  "biometric-sensor",
  "face-recognition-sensor",
  "capacitive-sensor",
  "servo-motor",
  "weight-sensor",
  "blood-pressure-sensor",
  "image-sensor",
  "magnetic-field-sensor",
  "ambient-light-sensor",
  "soil-moisture-sensor",
  "gesture-sensor",
  "lidar-sensor",
];

sensors.forEach((sensor) => {
  routes.push({
    url: `/resources/sensor/${sensor}`,
    changefreq: "monthly",
    priority: 0.7,
  });
});

// Generate sitemap XML
const generateSitemap = () => {
  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  routes.forEach((route) => {
    xml += `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
  });

  xml += `</urlset>`;

  return xml;
};

// Write sitemap to public folder
const sitemap = generateSitemap();
const outputPath = path.join(__dirname, "public", "sitemap.xml");

fs.writeFileSync(outputPath, sitemap, "utf8");
console.log("✅ Sitemap generated successfully!");
console.log(`📁 Saved to: ${outputPath}`);
console.log(`🔗 Total URLs: ${routes.length}`);
