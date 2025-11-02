# 💰 Price Management Dashboard - Complete Guide

## 🎯 Overview

The **Price Management Dashboard** is a powerful admin tool that allows you to update component prices in real-time and automatically sync changes with your `productsData.json` file.

---

## ✨ Features

### 🔍 **Smart Search & Filter**

- **Global Search**: Search by product name, ID, or category
- **Category Filter**: Filter products by specific categories (MCU, Sensors, Power, etc.)
- **Real-time Results**: Instant filtering as you type

### ✏️ **Inline Price Editing**

- Click the **Edit** button (✏️) to modify any product price
- Click on the price field to start editing
- Press **Enter** or click outside to save
- Modified prices are highlighted in **orange**

### 📊 **Bulk Price Updates**

Quick bulk actions to adjust all prices at once:

- **+5%** - Increase all prices by 5%
- **+10%** - Increase all prices by 10%
- **+20%** - Increase all prices by 20%
- **-10%** - Decrease all prices by 10%
- **-20%** - Decrease all prices by 20%

### 💾 **Save to JSON**

- All changes are tracked in real-time
- Modified products are highlighted with orange background
- **Save to JSON** button downloads the updated `productsData.json` file
- **Discard Changes** button resets all modifications

### 🎨 **Visual Indicators**

- **Orange highlight**: Modified products
- **Strike-through**: Old prices
- **Modified badge**: Shows which products have been changed
- **Unsaved changes counter**: Displays number of pending modifications

---

## 🚀 How to Use

### **Step 1: Access Price Manager**

1. Navigate to **Admin Panel** (`/admin`)
2. Click the **Price Manager** card (orange) in the statistics section
3. The Price Management Dashboard will appear

### **Step 2: Find Products**

**Option A - Search:**

```
Type in search bar: "HC-SR04" or "Arduino" or "Sensor"
```

**Option B - Filter by Category:**

```
Select from dropdown: "Distance Sensor", "Development Board", etc.
```

**Option C - Browse All:**

```
Leave filters empty to see all 72 products
```

### **Step 3: Update Prices**

**Method 1: Individual Price Edit**

1. Find the product you want to update
2. Click the **Edit** button (✏️) in the Actions column
3. Enter the new price in Indian Rupees (₹)
4. Press **Enter** or click outside to confirm

**Method 2: Bulk Price Update**

1. Click any of the bulk action buttons (+5%, +10%, +20%, -10%, -20%)
2. Confirm the bulk update in the popup dialog
3. All products will be updated with the percentage change

### **Step 4: Review Changes**

- Modified products will be highlighted with **orange background**
- Old prices will be shown with **strike-through**
- New prices will be displayed in **orange color**
- A **"Modified"** badge appears next to changed prices
- **Unsaved changes counter** shows total modifications

### **Step 5: Save or Discard**

**To Save Changes:**

1. Click the **"Save to JSON"** button (green)
2. The updated `productsData.json` file will download automatically
3. Replace the old file at: `src/data/productsData.json`
4. Refresh your application to see the new prices

**To Discard Changes:**

1. Click the **"Discard Changes"** button
2. Confirm the action
3. All modifications will be reset

---

## 📂 File Management

### **Where is the JSON file?**

```
📁 src/
  └── 📁 data/
      └── 📄 productsData.json  ← Your price database
```

### **How to Update the JSON File**

**Automatic Method (Recommended):**

1. Click **"Save to JSON"** in Price Manager
2. The file `productsData.json` will download to your Downloads folder
3. Copy/move it to `src/data/productsData.json` (replace the old file)
4. Hot reload will automatically update your app

**Manual Method:**

1. Open `src/data/productsData.json` in VS Code
2. Find the product by `id` (e.g., `"SEN-01"`)
3. Update the `price` field manually
4. Save the file (Ctrl+S)

---

## 🎨 Price Manager UI Guide

### **Dashboard Layout**

```
┌─────────────────────────────────────────────────────┐
│  💰 Price Management Dashboard              [X]     │
│  Update component prices and sync with database     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [🔍 Search Products...]  [Filter: All Categories▾] │
│                                                      │
│  ⚠️ 5 products modified                             │
│  [Discard Changes]  [Save to JSON]                  │
│                                                      │
│  Quick Actions:                                      │
│  [+5%] [+10%] [+20%] [-10%] [-20%]                 │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ ID    │ Product Name      │ Category │ ...   │  │
│  ├──────────────────────────────────────────────┤  │
│  │ SEN-01│ Ultra Sonic       │ Distance │ ₹65   │  │
│  │ SEN-11│ DHT11            │ Environ  │ ₹80   │  │
│  │ ...   │ ...              │ ...      │ ...   │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  Showing 72 of 72 products    ⚠️ 5 unsaved changes │
└─────────────────────────────────────────────────────┘
```

### **Table Columns**

| Column                | Description                                 |
| --------------------- | ------------------------------------------- |
| **ID**                | Product unique identifier (e.g., `SEN-01`)  |
| **Product Name**      | Full product name                           |
| **Category**          | Component category badge                    |
| **Current Price (₹)** | Original price (strike-through if modified) |
| **New Price (₹)**     | Updated price (orange if modified)          |
| **Actions**           | Edit (✏️) and Reset (🔄) buttons            |

---

## 🔧 Advanced Features

### **Price Calculation Examples**

**Example 1: +10% Increase**

```
Original: ₹100
After +10%: ₹110
```

**Example 2: -20% Decrease**

```
Original: ₹80
After -20%: ₹64
```

**Example 3: Multiple Edits**

```
Step 1: Edit HC-SR04 from ₹65 to ₹70
Step 2: Apply +5% to all → HC-SR04 becomes ₹74 (rounded)
```

### **Reset Individual Product**

- Click the **🔄 Reset** button next to any modified product
- That product's price will revert to the original value
- Other modifications remain intact

### **Smart Rounding**

- All bulk percentage calculations are automatically rounded to nearest whole number
- Example: 65 × 1.05 = 68.25 → rounds to **₹68**

---

## 📊 Product Categories

The Price Manager supports all 72 products across these categories:

### **MCU (6 products)**

- Development Board

### **Sensors (37 products)**

- Distance Sensor
- Environmental Sensor
- Motion Sensor
- Light Sensor
- Magnetic Sensor
- Navigation Sensor
- Medical Sensor
- Touch Sensor
- Sound Sensor
- Gas Sensor
- Camera Sensor
- Force Sensor
- Biometric Sensor
- Radiation Sensor
- Fire Sensor
- Gesture Sensor

### **Power (6 products)**

- Power Supply
- Battery

### **Actuators (5 products)**

- Motor
- Servo
- Pump

### **Displays (5 products)**

- LCD Display
- OLED Display
- TFT Display

---

## 🛡️ Safety Features

### **1. Confirmation Dialogs**

- Bulk updates require confirmation
- Discard changes requires confirmation
- Prevents accidental modifications

### **2. Visual Warnings**

- Orange banner shows unsaved changes count
- Modified products are clearly highlighted
- Original prices remain visible

### **3. Reversible Actions**

- **Discard Changes** resets all modifications
- **Reset** individual products
- Original data is never overwritten until you save

### **4. Download Instead of Direct Overwrite**

- JSON file is downloaded, not automatically replaced
- You manually control when to update the file
- Prevents accidental data loss

---

## 🐛 Troubleshooting

### **Issue: Price Manager doesn't show**

**Solution:**

- Click the orange **"Price Manager"** card in the statistics section
- Make sure you're logged in as admin

### **Issue: Changes not saving**

**Solution:**

1. Make sure you clicked **"Save to JSON"**
2. Check your Downloads folder for `productsData.json`
3. Copy the file to `src/data/productsData.json`
4. Refresh the page

### **Issue: Prices still showing old values in Cost Estimator**

**Solution:**

1. Make sure you replaced the file at `src/data/productsData.json`
2. Refresh the browser page (Ctrl+R or F5)
3. Check the browser console for any errors

### **Issue: Unsaved changes counter doesn't reset**

**Solution:**

- After saving, click **"Discard Changes"** to clear the tracker
- Or close and reopen the Price Manager
- This is by design to remind you to replace the JSON file

---

## 💡 Best Practices

### **1. Before Making Changes**

- ✅ Backup your current `productsData.json` file
- ✅ Check current prices in Cost Estimator
- ✅ Plan your pricing strategy

### **2. While Editing**

- ✅ Use bulk updates for market-wide adjustments
- ✅ Use individual edits for specific products
- ✅ Review all changes before saving

### **3. After Saving**

- ✅ Replace the JSON file immediately
- ✅ Test prices in Cost Estimator
- ✅ Verify calculations are correct

### **4. Regular Maintenance**

- 📅 Review prices monthly
- 📊 Track market rate changes
- 💾 Keep backups of JSON file versions

---

## 🎯 Quick Reference

### **Keyboard Shortcuts**

- **Enter** - Save inline price edit
- **Esc** - Cancel inline editing
- **Ctrl+F** - Focus search box (browser default)

### **Button Guide**

| Button                 | Action                    |
| ---------------------- | ------------------------- |
| ✏️ **Edit**            | Start editing price       |
| 🔄 **Reset**           | Revert individual product |
| ❌ **Discard Changes** | Reset all modifications   |
| 💾 **Save to JSON**    | Download updated file     |
| ✖️ **Close (X)**       | Hide Price Manager        |

### **Color Code**

- 🟠 **Orange** - Modified/Unsaved changes
- 🔴 **Red** - Destructive actions (discard, delete)
- 🟢 **Green** - Save/Confirm actions
- ⚪ **Gray** - Normal state

---

## 🔗 Related Features

### **Cost Estimator Integration**

- Updated prices automatically reflect in Cost Estimator
- Shopping cart uses latest prices from JSON
- Real-time total calculation uses updated rates

### **Component Inventory**

- All 72 products are manageable
- Category counts remain accurate
- Product details stay synchronized

---

## 📝 JSON File Structure

### **Original Format**

```json
[
  {
    "id": "SEN-01",
    "serialNo": 1,
    "name": "Ultra Sonic (HC-SR04)",
    "price": 65,
    "description": "Non-contact distance measurement...",
    "category": "Distance Sensor",
    "imageUrl": "/src/assets/Sensor/HC-SR04.png"
  }
]
```

### **After Price Update**

```json
[
  {
    "id": "SEN-01",
    "serialNo": 1,
    "name": "Ultra Sonic (HC-SR04)",
    "price": 70,  ← Updated!
    "description": "Non-contact distance measurement...",
    "category": "Distance Sensor",
    "imageUrl": "/src/assets/Sensor/HC-SR04.png"
  }
]
```

**Note**: Only the `price` field changes. All other fields remain intact.

---

## 🎓 Examples

### **Example 1: Update Single Product**

```
1. Search: "HC-SR04"
2. Click Edit (✏️)
3. Change ₹65 → ₹70
4. Press Enter
5. Click "Save to JSON"
6. Replace file in src/data/
```

### **Example 2: Bulk Price Increase**

```
1. Click "+10%" button
2. Confirm the dialog
3. All 72 products increase by 10%
4. Review changes in table
5. Click "Save to JSON"
6. Replace file in src/data/
```

### **Example 3: Category-Specific Update**

```
1. Filter: "Distance Sensor"
2. Edit each product individually
3. Only distance sensors are modified
4. Other categories remain unchanged
5. Save and replace file
```

---

## 🏆 Success Checklist

Before closing the Price Manager, make sure:

- [ ] All desired products have been updated
- [ ] Bulk changes have been applied correctly
- [ ] Modified prices are highlighted in orange
- [ ] Unsaved changes counter is accurate
- [ ] You clicked **"Save to JSON"**
- [ ] Downloaded file is in your Downloads folder
- [ ] Old `productsData.json` is backed up
- [ ] New `productsData.json` is copied to `src/data/`
- [ ] Application has been refreshed
- [ ] Prices are correct in Cost Estimator

---

## 📞 Support

If you encounter any issues:

1. Check this guide's **Troubleshooting** section
2. Verify the JSON file structure
3. Check browser console for errors
4. Ensure admin permissions are active

---

**Happy Pricing! 💰✨**

_Last Updated: November 2025_
