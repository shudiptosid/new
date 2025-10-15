# Adding Datasheet Links to Sensors

## ✅ Feature Added Successfully!

The sensor dialog now supports datasheet links. When you add a `datasheet` field to any sensor, it will automatically appear at the bottom of the sensor article with a clickable "View Datasheet" button.

---

## 📝 How to Add Datasheet Links

### Step 1: Find the sensor in `src/pages/Resources.tsx`

Locate the `sensorsData` array (starts around line 79).

### Step 2: Add the `datasheet` field

Add a `datasheet` property to any sensor object with the URL to the datasheet PDF/link.

---

## 📋 Example: DHT11 Sensor with Datasheet

**Before:**

```typescript
{
  id: 2,
  name: "DHT11 Temperature & Humidity Sensor",
  description: "Digital sensor for measuring temperature (0-50°C) and humidity",
  image: dht11Img,
  type: "Temperature Sensor",
  shortDescription: "...",
  workingPrinciple: `...`,
  pinDiagram: `...`,
  useCases: [...],
  metaTitle: "...",
  metaDescription: "...",
  keywords: [...],
},
```

**After (with datasheet):**

```typescript
{
  id: 2,
  name: "DHT11 Temperature & Humidity Sensor",
  description: "Digital sensor for measuring temperature (0-50°C) and humidity",
  image: dht11Img,
  type: "Temperature Sensor",
  shortDescription: "...",
  workingPrinciple: `...`,
  pinDiagram: `...`,
  useCases: [...],
  metaTitle: "...",
  metaDescription: "...",
  keywords: [...],
  datasheet: "https://www.mouser.com/datasheet/2/758/DHT11-Technical-Data-Sheet-Translated-Version-1143054.pdf", // ✅ Add this line
},
```

---

## 🎯 Quick Copy-Paste Examples

### HC-SR04 Ultrasonic Sensor

```typescript
datasheet: "https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf",
```

### DHT11 Temperature & Humidity

```typescript
datasheet: "https://www.mouser.com/datasheet/2/758/DHT11-Technical-Data-Sheet-Translated-Version-1143054.pdf",
```

### PIR Motion Sensor (HC-SR501)

```typescript
datasheet: "https://www.epitran.it/ebayDrive/datasheet/44.pdf",
```

### LDR (Light Dependent Resistor)

```typescript
datasheet: "https://components101.com/sites/default/files/component_datasheet/LDR%20Datasheet.pdf",
```

### MQ-2 Gas Sensor

```typescript
datasheet: "https://www.pololu.com/file/0J309/MQ2.pdf",
```

### MPU6050 Gyroscope/Accelerometer

```typescript
datasheet: "https://invensense.tdk.com/wp-content/uploads/2015/02/MPU-6000-Datasheet1.pdf",
```

### Servo Motor (SG90)

```typescript
datasheet: "http://www.ee.ic.ac.uk/pcheung/teaching/DE1_EE/stores/sg90_datasheet.pdf",
```

---

## 🎨 What It Looks Like

When a user clicks on a sensor with a datasheet:

1. **The sensor dialog opens** with all the usual info
2. **At the bottom**, a new section appears:
   ```
   📄 Datasheet
   [View Datasheet] ← clickable button with external link icon
   ```
3. **Clicking the button** opens the datasheet in a new tab

---

## 💡 Pro Tips

1. **Optional Field**: The `datasheet` field is optional — sensors without it work normally
2. **PDF Links**: Use direct PDF links when possible (ending in `.pdf`)
3. **Manufacturer Sites**: Official datasheets from manufacturers are best
4. **Alternative Sources**: If manufacturer link unavailable, use:
   - SparkFun
   - Adafruit
   - Components101
   - Mouser
   - DigiKey

---

## 🚀 Next Steps

1. Find datasheets for your sensors online
2. Add the `datasheet: "URL"` line to each sensor object in `Resources.tsx`
3. Test by clicking the sensor and scrolling to the bottom
4. The "View Datasheet" button will appear automatically!

---

## ❓ Need Help Finding Datasheets?

Just tell me which sensor you need and I'll find the datasheet link for you! Examples:

- "Give me datasheet for DHT11"
- "Find datasheet for HC-SR04"
- "I need datasheets for all sensors"
