import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const boardImages = [
  "src/assets/own.png",
  "src/assets/KYB/esp32.png",
  "src/assets/KYB/esp8266.png",
  "src/assets/KYB/nano.png",
  "src/assets/KYB/pi.png",
  "src/assets/KYB/stm32.png",
  "src/assets/KYB/UNO.png",
];

async function optimizeImage(imagePath) {
  const fileName = path.basename(imagePath);
  const backupPath = imagePath.replace(".png", "_original.png");

  try {
    // Get original size
    const originalStats = await fs.stat(imagePath);
    const originalSize = originalStats.size;

    // Create backup
    await fs.copyFile(imagePath, backupPath);

    // Get image metadata
    const metadata = await sharp(imagePath).metadata();

    // Calculate new dimensions (max 800px width)
    let newWidth = metadata.width;
    let newHeight = metadata.height;

    if (metadata.width > 800) {
      newWidth = 800;
      newHeight = Math.round((800 / metadata.width) * metadata.height);
    }

    console.log(`\n📸 Processing: ${fileName}`);
    console.log(
      `   Original: ${metadata.width}x${metadata.height} (${(
        originalSize / 1024
      ).toFixed(0)} KB)`
    );
    console.log(`   Target: ${newWidth}x${newHeight}`);

    // Optimize image
    await sharp(imagePath)
      .resize(newWidth, newHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .png({
        quality: 85,
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true,
      })
      .toFile(imagePath.replace(".png", "_optimized.png"));

    // Replace original with optimized
    await fs.unlink(imagePath);
    await fs.rename(imagePath.replace(".png", "_optimized.png"), imagePath);

    // Get new size
    const newStats = await fs.stat(imagePath);
    const newSize = newStats.size;
    const saved = originalSize - newSize;
    const percent = ((saved / originalSize) * 100).toFixed(1);

    console.log(
      `   ✅ Optimized: ${newWidth}x${newHeight} (${(newSize / 1024).toFixed(
        0
      )} KB)`
    );
    console.log(`   💾 Saved: ${(saved / 1024).toFixed(0)} KB (${percent}%)`);

    return { originalSize, newSize, saved, fileName };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return { originalSize: 0, newSize: 0, saved: 0, fileName, error: true };
  }
}

async function main() {
  console.log("\n🎨 Board Image Optimization Starting...");
  console.log("=".repeat(70));

  let totalOriginal = 0;
  let totalNew = 0;
  let totalSaved = 0;
  let successCount = 0;

  for (const imagePath of boardImages) {
    const result = await optimizeImage(imagePath);
    if (!result.error) {
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
      totalSaved += result.saved;
      successCount++;
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("\n📊 Total Results:");
  console.log(`   Original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Optimized: ${(totalNew / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
  console.log(
    `   Reduction: ${((totalSaved / totalOriginal) * 100).toFixed(1)}%`
  );
  console.log(`   Success: ${successCount}/${boardImages.length} images`);
  console.log(
    '\n✨ Optimization complete! Backups saved with "_original.png" suffix'
  );
}

main().catch(console.error);
