# Cost Estimator - Price Update Guide

## 📋 Overview

Your Cost Estimator uses a simple JSON file for product data. Updating prices is straightforward and takes just 1-2 minutes.

## 🔄 How to Update Prices (Weekly)

### Method 1: Direct JSON Edit (Simplest)

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
