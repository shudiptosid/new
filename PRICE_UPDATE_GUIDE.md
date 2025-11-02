# 💰 Cost Estimator - Price Update Guide

## 📋 Overview

Your Cost Estimator uses a simple JSON file for product data. You now have **2 methods** to update prices:

- **🎨 Price Manager Dashboard** (NEW! - Visual, Easy, Recommended)
- **📝 Direct JSON Edit** (Manual, Advanced)

---

## 🆕 Method 1: Price Manager Dashboard (RECOMMENDED)

### ✨ Features

- Visual interface with search and filters
- Edit prices with instant preview
- Bulk update all products (+5%, +10%, +20%, -10%, -20%)
- Safety features (undo, confirmation dialogs)
- Auto-download updated JSON file

### 🚀 Quick Start

**Step 1: Access the Dashboard**

```
1. Navigate to: http://localhost:3001/admin
2. Find the orange "Price Manager" card
3. Click to open the dashboard
```

**Step 2: Update Prices**

**For Single Product:**

```
1. Search for product name (e.g., "HC-SR04")
2. Click Edit button (✏️)
3. Type new price
4. Press Enter
```

**For All Products (Bulk):**

```
1. Click a bulk action button (+10%, +20%, etc.)
2. Confirm the dialog
3. All prices updated instantly
```

**Step 3: Save Changes**

```
1. Click "Save to JSON" button
2. File downloads to your Downloads folder
3. Replace src/data/productsData.json with downloaded file
4. Refresh browser (F5)
5. Done! ✅
```

### 🎯 Visual Guide

```
Admin Panel Dashboard
├── Component Inventory (MCU, Sensors, Power, etc.)
├── Statistics Cards
│   └── 🟠 Price Manager ← Click here!
└── Service Requests (Tabs)

Price Manager Dashboard
├── 🔍 Search Bar (name, ID, category)
├── 📊 Category Filter (All, MCU, Sensors, etc.)
├── ⚡ Quick Actions (+5%, +10%, +20%, -10%, -20%)
└── 📋 Products Table
    ├── ID | Name | Category | Old Price | New Price | Actions
    └── [Edit ✏️] [Reset 🔄]
```

### � Pro Tips

- **Before editing**: Orange card shows unsaved changes count
- **Modified products**: Highlighted in orange background
- **Old prices**: Shown with strike-through
- **Safety**: "Discard Changes" button resets everything
- **Search**: Filter by name, ID, or category
- **Bulk**: Apply percentage changes to all 72 products at once

---

## 📝 Method 2: Direct JSON Edit (Manual)

1. **Open the file**: `src/data/productsData.json`

2. **Find the product** by searching for its name or ID:

   ```json
   {
     "id": "SEN-01",
     "serialNo": 1,
     "name": "Ultra Sonic (HC-SR04)",
     "price": 65, // ← Edit this number
     "description": "...",
     "category": "Distance Sensor",
     "imageUrl": "/src/assets/Sensor/HC-SR04.png"
   }
   ```

3. **Change the price** value (just the number)

4. **Save the file**

5. **Deploy**:

   ```bash
   git add src/data/productsData.json
   git commit -m "Update prices for week of [DATE]"
   git push
   ```

6. **Done!** Vercel will auto-deploy in ~1 minute.

---

### Method 2: Bulk Update with Find & Replace

If you need to increase all prices by a percentage:

1. Open `src/data/productsData.json`
2. Use VS Code's Find & Replace (Ctrl+H)
3. Enable "Regex" mode (Alt+R)
4. Example: Increase all prices by 10%
   - Not recommended for JSON - calculate individually

**Better approach**: Export to Excel, calculate, re-import

---

## ✅ Validation Checklist

After updating prices:

- [ ] Check JSON syntax is valid (no missing commas)
- [ ] Run `npm run type-check` to verify
- [ ] Test locally: `npm run dev` and visit `/cost-estimator`
- [ ] Verify cart calculations are correct
- [ ] Push to production

---

## 📝 Price Update Log Template

Keep track of your updates:

```
## Week of [DATE]
- SEN-01: 65 → 70 (Supplier increase)
- SEN-03: 150 → 145 (Bulk discount applied)
- Total products updated: 2
```

---

## 🚨 Common Mistakes to Avoid

1. **Don't remove commas** between objects
2. **Don't use trailing commas** after the last item
3. **Don't edit ID fields** (breaks cart references)
4. **Don't change image URLs** unless files moved

---

## 🎯 Quick Reference

**File location**: `src/data/productsData.json`  
**Total products**: 37 sensors  
**Price format**: Numbers only (no ₹ symbol)  
**Deploy time**: ~1-2 minutes after push

---

## 🔮 Future Enhancements

When you want more automation, consider:

- **CSV → JSON converter script** (update in Excel, auto-convert)
- **Admin panel** (already built for components, can extend)
- **Price history tracking** (log all changes automatically)

For now, Option 1 is the fastest and most reliable! 🚀
