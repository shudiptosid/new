# 💰 Price Manager - Quick Reference Card

## 🚀 Access

```
1. Navigate to: http://localhost:3001/admin
2. Find: Orange "Price Manager" card
3. Click: Opens dashboard
```

---

## ✏️ Edit Single Price

```
1. 🔍 Search product name
2. Click ✏️ Edit button
3. Type new price
4. Press Enter
```

---

## ⚡ Bulk Update All Prices

```
1. Click percentage button (+5%, +10%, +20%, -10%, -20%)
2. Confirm dialog
3. All 72 products updated instantly
```

---

## 💾 Save Changes

```
1. Review modifications (orange highlights)
2. Click "Save to JSON" button
3. File downloads to Downloads folder
4. Replace: src/data/productsData.json
5. Refresh browser (F5 or Ctrl+R)
```

---

## 🔄 Undo Changes

```
Individual Product:
  → Click 🔄 Reset button

All Products:
  → Click "Discard Changes"
  → Confirm dialog
```

---

## 🔍 Search & Filter

```
Search:
  → Type in search box
  → Results filter instantly

Category Filter:
  → Select from dropdown
  → "All Categories" to reset
```

---

## 🎨 Visual Indicators

| Color/Style             | Meaning               |
| ----------------------- | --------------------- |
| 🟠 Orange background    | Product modified      |
| ~~Strike-through~~      | Old price             |
| **Orange text**         | New price             |
| Orange badge "Modified" | Change indicator      |
| Orange banner           | Unsaved changes alert |

---

## ⚠️ Important Notes

1. **Changes are NOT auto-saved**

   - Must click "Save to JSON"
   - Manual file replacement required

2. **Always backup first**

   - Copy productsData.json before editing

3. **Test after saving**

   - Verify prices in Cost Estimator

4. **Refresh required**
   - Press F5 after replacing JSON file

---

## 🔢 Bulk Actions Examples

| Button | Example | Result |
| ------ | ------- | ------ |
| +5%    | ₹100 →  | ₹105   |
| +10%   | ₹80 →   | ₹88    |
| +20%   | ₹65 →   | ₹78    |
| -10%   | ₹100 →  | ₹90    |
| -20%   | ₹80 →   | ₹64    |

_All results automatically rounded_

---

## 📊 Product Categories

- **MCU**: 6 products
- **Sensors**: 37 products
- **Power**: 6 products
- **Actuators**: 5 products
- **Displays**: 5 products

**Total**: 72 products  
**Currency**: Indian Rupees (₹)

---

## 🐛 Troubleshooting

**Dashboard won't open?**

- ✅ Make sure you're logged in as admin
- ✅ Click the orange card in statistics section

**Prices not saving?**

- ✅ Click "Save to JSON" button
- ✅ Check Downloads folder
- ✅ Replace src/data/productsData.json

**Changes not showing in Cost Estimator?**

- ✅ Verify file replacement
- ✅ Refresh browser (F5)
- ✅ Clear browser cache if needed

---

## 📁 File Location

```
src/data/productsData.json
```

---

## 📖 Full Documentation

- **Complete Guide**: `PRICE_MANAGER_GUIDE.md`
- **Quick Start**: `PRICE_UPDATE_GUIDE.md`
- **Technical Details**: `PRICE_MANAGER_SUMMARY.md`

---

**Print this card and keep it handy! 📌**

_Last Updated: November 2025_
