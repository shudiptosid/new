const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sensorDir = path.join(__dirname, "src", "assets", "Sensor");
const outputDir = path.join(__dirname, "src", "assets", "Sensor", "optimized");

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all PNG files in sensor directory
const files = fs
  .readdirSync(sensorDir)
  .filter(
    (file) =>
      file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg")
  );

console.log(`Found ${files.length} images to optimize...`);

// Optimize each image
Promise.all(
  files.map(async (file) => {
    const inputPath = path.join(sensorDir, file);
    const outputPath = path.join(outputDir, file);

    try {
      const stats = fs.statSync(inputPath);
      const originalSize = (stats.size / 1024).toFixed(2);

      await sharp(inputPath)
        .resize(800, 800, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .png({ quality: 80, compressionLevel: 9 })
        .toFile(outputPath);

      const newStats = fs.statSync(outputPath);
      const newSize = (newStats.size / 1024).toFixed(2);
      const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

      console.log(
        `✓ ${file}: ${originalSize}KB → ${newSize}KB (${savings}% smaller)`
      );
    } catch (error) {
      console.error(`✗ Error optimizing ${file}:`, error.message);
    }
  })
)
  .then(() => {
    console.log("\n✅ All images optimized successfully!");
    console.log(`📁 Optimized images saved to: ${outputDir}`);
  })
  .catch((error) => {
    console.error("Error during optimization:", error);
  });
