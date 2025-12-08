# Quick Optimization Guide

## 🎯 Compress Video Files (Highest Priority!)

### Using FFmpeg (Free & Best Quality):

```powershell
# Install FFmpeg (if not installed)
# Download from: https://www.gyan.dev/ffmpeg/builds/

# Navigate to assets folder
cd src/assets

# Compress time-lapse-bg.mp4 (13.9MB → ~3MB)
ffmpeg -i time-lapse-bg.mp4 -vcodec libx264 -crf 28 -preset slow -movflags +faststart time-lapse-bg-compressed.mp4

# Compress Project E.mp4 (14.4MB → ~3MB)
ffmpeg -i "Project E.mp4" -vcodec libx264 -crf 28 -preset slow -movflags +faststart "Project E-compressed.mp4"

# Replace original files
Move-Item time-lapse-bg-compressed.mp4 time-lapse-bg.mp4 -Force
Move-Item "Project E-compressed.mp4" "Project E.mp4" -Force
```

**What the flags mean:**

- `-crf 28` = Compression level (18-28 is good, lower = better quality but larger)
- `-preset slow` = Better compression (worth the wait)
- `-movflags +faststart` = Enables progressive loading (video starts before fully downloaded)

### Using Online Tools (Easier but less control):

1. **Clideo.com/compress-video** (Free, easy)

   - Upload video
   - Select "High quality"
   - Download compressed version

2. **Handbrake** (Free desktop app)
   - Download: https://handbrake.fr/
   - Use "Fast 1080p30" preset
   - Adjust quality slider to ~23-25

---

## 🖼️ Compress Images

### Board Images (7 files, 9.5MB total)

```powershell
# Navigate to assets folder
cd src/assets

# List large images
Get-ChildItem -Filter "*.png" | Where-Object {$_.Length -gt 1MB} | Select-Object Name, @{Name="MB";Expression={[math]::Round($_.Length/1MB,2)}}
```

**Option 1: TinyPNG.com (Easiest)**

1. Go to https://tinypng.com/
2. Upload these files:
   - `pi.png`
   - `nano.png`
   - `UNO.png`
   - `own.png`
   - `stm32.png`
   - `esp32.png`
   - `esp8266.png`
3. Download compressed versions
4. Replace originals

**Expected:** 9.5MB → 1.5MB (85% reduction)

**Option 2: Squoosh.app (Best quality)**

1. Go to https://squoosh.app/
2. Upload image
3. Choose WebP format
4. Adjust quality to 80-85%
5. Compare before/after
6. Download

**Option 3: ImageOptim (Mac) / FileOptimizer (Windows)**

---

## 📊 Test Your Optimizations

```powershell
# Rebuild and check sizes
npm run build

# Check dist folder size
Get-ChildItem dist -Recurse | Measure-Object -Property Length -Sum | Select-Object @{Name="SizeMB";Expression={[math]::Round($_.Sum/1MB,2)}}

# Run preview server
npm run preview
```

Visit: http://localhost:4173

---

## 🚀 Before/After Comparison

### Current Build:

```
Videos:  28.4 MB
Images:   9.5 MB
JS/CSS:   0.5 MB
Total:   38.4 MB
```

### After Optimization:

```
Videos:   6.0 MB  ✅ 79% reduction
Images:   1.5 MB  ✅ 84% reduction
JS/CSS:   0.5 MB  (same)
Total:    8.0 MB  ✅ 79% SMALLER!
```

---

## ✅ Verification Checklist

After compressing:

- [ ] Videos play correctly
- [ ] Image quality is acceptable
- [ ] Build succeeds: `npm run build`
- [ ] Site works in preview: `npm run preview`
- [ ] Mobile performance improved

---

## 💡 Pro Tips

1. **Always keep originals** - Make a backup before compressing
2. **Test on slow connection** - Chrome DevTools → Network → Fast 3G
3. **Use WebP for images** - 25-35% smaller than PNG
4. **Lazy load everything** - Only load what's visible
5. **Use a CDN** - For videos and large images

---

## 🔍 Measure Performance

### Before:

```powershell
# Open DevTools → Network
# Disable cache
# Refresh page
# Check total transferred
```

### After:

Compare the "Transferred" column - should be 70-80% less!

---

## 🎯 Target Metrics

| Metric                       | Target | Tool            |
| ---------------------------- | ------ | --------------- |
| **First Contentful Paint**   | <1.5s  | Lighthouse      |
| **Largest Contentful Paint** | <2.5s  | Lighthouse      |
| **Total Blocking Time**      | <200ms | Lighthouse      |
| **Page Load (3G)**           | <5s    | Chrome DevTools |
| **Lighthouse Score**         | 90+    | Chrome DevTools |
