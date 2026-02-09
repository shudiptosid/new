-- Insert All 16 Blog Articles into Database
-- Run this in Supabase SQL Editor after running BLOG_SYSTEM_SCHEMA.sql

INSERT INTO blogs (slug, title, excerpt, content, category, read_time, featured, view_count) VALUES

-- Article 1
('power-consumption', 
'Optimizing Power Consumption in IoT Devices',
'Master power optimization techniques to extend battery life 10-50x. Learn sleep modes, DVFS, low-power protocols, and energy harvesting for sustainable IoT devices.',
'# Optimizing Power Consumption in IoT Devices

Power optimization is crucial for IoT devices, especially battery-powered ones. This comprehensive guide covers techniques to extend battery life by 10-50x.

## Sleep Modes and Low Power States

Most microcontrollers offer multiple sleep modes. Understanding when and how to use them is key:

**Deep Sleep Mode**: Can reduce power consumption from 80mA to less than 10μA. Use when the device doesn''t need to respond immediately.

**Light Sleep**: Maintains RAM and some peripherals. Wake-up time is faster (microseconds vs milliseconds).

## Dynamic Voltage and Frequency Scaling (DVFS)

Reduce clock frequency when high performance isn''t needed. **Lower frequency = Lower power consumption**.

Example: ESP32 running at 80MHz instead of 240MHz can save 30-40% power.

## Low-Power Communication Protocols

Choose your protocol wisely:
- **LoRaWAN**: Long range, ultra-low power
- **BLE**: Short range, very low power  
- **WiFi**: High power, use sparingly

## Energy Harvesting

Combine with solar panels, piezoelectric generators, or thermal energy harvesters for truly sustainable IoT devices.

**Practical Implementation**:
- Use interrupts instead of polling
- Turn off unused peripherals
- Minimize transmission frequency
- Use efficient data formats (binary over JSON)

Power optimization isn''t just about battery life—it''s about building sustainable, cost-effective IoT solutions.',
'Power Management',
'14 min read',
true,
0),

-- Article 2
('rtos',
'Real-Time Operating Systems (RTOS) for IoT: Complete Guide',
'Master RTOS for IoT with FreeRTOS & Zephyr. Learn task scheduling, inter-task communication, code examples, and build production-ready embedded systems.',
'# Real-Time Operating Systems for IoT

RTOS brings multitasking capabilities to embedded systems. Learn when and how to use FreeRTOS and Zephyr in your IoT projects.

## What is an RTOS?

A Real-Time Operating System provides **deterministic task scheduling**—tasks execute within guaranteed time constraints.

## When to Use RTOS

Use RTOS when you need:
- Multiple concurrent tasks
- Deterministic timing
- Complex state machines
- Resource management

## FreeRTOS Fundamentals

**Task Creation**:
```c
xTaskCreate(TaskFunction, "TaskName", StackSize, NULL, Priority, &TaskHandle);
```

**Task Priorities**: Higher number = higher priority. Critical tasks get priority 3-5.

## Inter-Task Communication

**Queues**: Pass data between tasks safely
**Semaphores**: Synchronize resource access
**Mutexes**: Prevent race conditions

## Task Scheduling

FreeRTOS uses **preemptive scheduling**—higher priority tasks interrupt lower ones.

## Memory Management

Static vs Dynamic allocation—choose based on your constraints. *Static is safer but less flexible*.

## Zephyr OS

More modern alternative with better hardware abstraction and built-in networking stack.

## Best Practices

- Keep tasks short and focused
- Use appropriate synchronization
- Monitor stack usage
- Handle task deletion properly

RTOS transforms complex embedded systems into manageable, maintainable code.',
'RTOS',
'16 min read',
true,
0),

-- Article 3
('lorawan-networks',
'Building Resilient LoRaWAN Networks',
'Best practices for designing and deploying reliable long-range wireless sensor networks in challenging environments and remote locations.',
'# Building Resilient LoRaWAN Networks

LoRaWAN enables long-range, low-power wireless communication. Learn to build reliable networks that work in challenging environments.

## LoRaWAN Architecture

Three components:
- **End Devices**: Your sensors
- **Gateways**: Forward data to server
- **Network Server**: Manages the network

## Spreading Factor Selection

Higher SF = longer range but slower data rate. **SF7** for short range, **SF12** for maximum range (up to 15km in rural areas).

## Gateway Placement

Position gateways for maximum coverage:
- High elevation helps
- Avoid dense obstacles
- Consider Fresnel zone clearance

## Network Capacity Planning

Each gateway handles 500-1000 devices. Plan for growth and redundancy.

## Adaptive Data Rate (ADR)

Let the network optimize SF and transmit power automatically. **Reduces power consumption by 40-60%** for stationary devices.

## Downlink Strategy

LoRaWAN is primarily uplink. Schedule downlinks carefully:
- Use Class C for frequent downlinks
- Stick with Class A for battery devices

## Security

LoRaWAN has **built-in encryption** (AES-128). Use unique device keys.

## Troubleshooting

Common issues:
- **Packet loss**: Check SF, reduce distance
- **Gateway overload**: Add more gateways
- **Interference**: Change channels

Building resilient LoRaWAN networks requires understanding the tradeoffs between range, battery life, and data rate.',
'Networking',
'12 min read',
true,
0),

-- Article 4
('debugging-embedded',
'Debugging Embedded Systems: A Complete Guide',
'Master essential debugging strategies, tools, and methodologies for Arduino, ESP32, and STM32 projects. Learn UART logging, IDE debugging, and hardware troubleshooting.',
'# Debugging Embedded Systems: A Complete Guide

Debugging embedded systems requires different techniques than traditional software. Master these essential strategies.

## Serial Debug Logging

**UART logging** is your best friend:
```c
Serial.println("Sensor value: " + String(sensorValue));
```

Use meaningful messages with timestamps and severity levels.

## IDE Debugging

Modern IDEs support breakpoints and step-through debugging:
- **PlatformIO**: Excellent debugging support
- **Arduino IDE 2.0**: Basic debugging features
- **STM32CubeIDE**: Professional debugging

## Logic Analyzers

When software debugging isn''t enough, capture actual signals:
- Verify I2C/SPI communication
- Check timing issues
- Identify protocol violations

## Oscilloscopes

Essential for:
- Analog signal debugging
- Power supply issues
- High-speed signal integrity

## Common Issues and Solutions

**Device Not Responding**:
- Check power supply voltage
- Verify connections
- Test with minimal code

**I2C Failures**:
- Add pull-up resistors (4.7kΩ)
- Check address conflicts
- Verify voltage levels (3.3V vs 5V)

**Watchdog Resets**:
- Identify blocking code
- Reduce loop execution time
- Add watchdog feeds

## Debugging Best Practices

- **Isolate the problem**: Simplify code until it works
- **Use version control**: Git helps track when bugs appeared
- **Document solutions**: Build your knowledge base

**Hardware debugging** requires patience and systematic approach. Start simple, add complexity gradually.',
'Development',
'15 min read',
true,
0),

-- Article 5
('edge-ai',
'Edge AI on Microcontrollers: TensorFlow Lite Micro Guide',
'Run machine learning on ESP32, Arduino, STM32. Master TensorFlow Lite Micro, quantization, model optimization, and deploy AI at the edge with complete examples.',
'# Edge AI on Microcontrollers

Run machine learning models directly on microcontrollers. Learn TensorFlow Lite Micro and deploy AI at the edge.

## Why Edge AI?

**Benefits**:
- No cloud dependency
- Low latency responses
- Privacy-preserving
- Reduced bandwidth

## TensorFlow Lite Micro

Optimized ML framework for embedded systems. Works on devices with just **16KB RAM**.

## Model Optimization

**Quantization** reduces model size by 4x:
- Convert float32 to int8
- Minimal accuracy loss
- 4x faster inference

## Supported Platforms

- ESP32 (recommended)
- Arduino Nano 33 BLE Sense
- STM32 series
- Raspberry Pi Pico

## Typical Workflow

1. Train model in TensorFlow/Keras
2. Convert to TensorFlow Lite
3. Quantize for embedded deployment
4. Test on target hardware

## Example Applications

**Keyword Spotting**: Voice commands on ESP32
**Gesture Recognition**: Using accelerometer data
**Anomaly Detection**: Industrial sensor monitoring

## Model Constraints

Keep models small:
- **<100KB** for most microcontrollers
- Simple architectures work best
- Focus on inference, not training

## Power Consumption

ML inference is power-hungry. Use:
- Intermittent inference
- Wake-on-sensor triggers
- Low-power modes between inferences

**Edge AI** brings intelligence to IoT devices without cloud dependency. Start with simple models and iterate.',
'AI/ML',
'18 min read',
true,
0),

-- Article 6
('mqtt-protocol',
'MQTT Protocol Deep Dive: Complete Guide for IoT Developers',
'Master MQTT messaging protocol for IoT. Learn QoS levels, retained messages, Last Will Testament, broker setup (Mosquitto, HiveMQ), and build production-ready ESP32 applications.',
'# MQTT Protocol Deep Dive

MQTT is the standard messaging protocol for IoT. Master it to build scalable, reliable IoT applications.

## MQTT Basics

Publish-Subscribe messaging pattern. **Devices publish to topics, subscribers receive messages**.

## Quality of Service (QoS)

Three levels:
- **QoS 0**: Fire and forget (fastest, least reliable)
- **QoS 1**: At least once delivery (acknowledged)
- **QoS 2**: Exactly once (slowest, most reliable)

Choose based on your use case. *Most applications use QoS 1*.

## Topics and Wildcards

Hierarchical topic structure:
```
home/livingroom/temperature
home/bedroom/humidity
```

Wildcards:
- **+**: Single level wildcard
- **#**: Multi-level wildcard

## Retained Messages

Broker stores last message. **New subscribers get it immediately**—perfect for status updates.

## Last Will and Testament (LWT)

Automatic notification when client disconnects unexpectedly. Critical for monitoring device health.

## Broker Selection

**Mosquitto**: Open-source, lightweight
**HiveMQ**: Enterprise-grade, scalable
**AWS IoT Core**: Cloud-managed

## Security

Always use **TLS encryption** for production:
- Encrypt data in transit
- Use username/password authentication
- Implement certificate-based auth for critical systems

## ESP32 MQTT Example

```cpp
client.setServer(mqtt_server, 1883);
client.publish("sensors/temperature", String(temp).c_str());
```

## Best Practices

- Keep payloads small (JSON or binary)
- Use meaningful topic hierarchies
- Implement reconnection logic
- Monitor connection quality

MQTT makes IoT device communication simple, scalable, and reliable.',
'Protocols',
'16 min read',
true,
0),

-- Article 7
('iot-security',
'IoT Security Best Practices: Complete Guide for Embedded Systems',
'Master IoT security for production devices. Learn secure boot, TLS encryption, secure OTA updates, hardware security modules, authentication, and protect against common vulnerabilities.',
'# IoT Security Best Practices

Security must be built-in from day one. Learn essential practices to protect your IoT devices.

## Secure Boot

Verify firmware integrity before execution. **Prevents malicious code injection**.

ESP32 supports secure boot—enable it for production devices.

## Encryption

**Data at Rest**: Encrypt sensitive data in flash
**Data in Transit**: Always use TLS/SSL

Never transmit credentials in plaintext.

## Authentication

Strong device authentication:
- Unique device certificates
- Hardware security modules (HSM)
- Secure key storage

## Secure OTA Updates

Critical requirements:
- **Signed firmware** to prevent tampering
- Encrypted transmission
- Rollback protection
- Atomic updates (all or nothing)

## Common Vulnerabilities

**Default Passwords**: Always change them
**Unencrypted Communication**: Use TLS
**Hardcoded Credentials**: Use secure storage
**No Update Mechanism**: Plan for patches

## Network Security

- Isolate IoT devices on separate VLAN
- Use firewall rules
- Disable unnecessary services
- Regular security audits

## Physical Security

Don''t overlook physical access:
- Tamper detection
- Debug port protection
- Encrypted storage

## Security Testing

Regular penetration testing:
- Firmware analysis
- Network scanning
- Authentication testing

## Compliance

Consider regulations:
- **GDPR** for EU deployments
- **HIPAA** for healthcare
- Industry-specific standards

**Security isn''t optional**—it''s essential for IoT success. Build it in from the start.',
'Security',
'18 min read',
true,
0),

-- Article 8
('ble-basics',
'BLE (Bluetooth Low Energy) Basics: Complete Guide for IoT Developers',
'Master Bluetooth Low Energy for IoT projects. Learn BLE fundamentals, GATT services, ESP32 implementation, beacons, mobile app integration, and build wireless connected devices.',
'# BLE Basics: Complete Guide

Bluetooth Low Energy enables short-range wireless communication with minimal power consumption.

## BLE Architecture

**GAP (Generic Access Profile)**: Device discovery and connection
**GATT (Generic Attribute Profile)**: Data exchange structure

## Services and Characteristics

Think of **services** as categories, **characteristics** as data fields:
```
Heart Rate Service
  └─ Heart Rate Measurement (notify)
  └─ Body Sensor Location (read)
```

## Advertising

BLE devices **broadcast their presence**. Advertising interval affects power consumption.

## Connection Parameters

Balance power and responsiveness:
- **Connection Interval**: 7.5ms to 4s
- **Slave Latency**: Skip connection events
- **Supervision Timeout**: Detect disconnection

## ESP32 BLE

ESP32 has excellent BLE support:
```cpp
BLEDevice::init("ESP32");
BLEServer *pServer = BLEDevice::createServer();
```

## BLE Beacons

Broadcast-only mode. Perfect for:
- Indoor positioning
- Proximity marketing
- Asset tracking

**iBeacon** and **Eddystone** are popular formats.

## Mobile App Integration

Build companion apps using:
- React Native BLE
- Flutter Blue
- Native iOS/Android BLE APIs

## Security

BLE supports **pairing and encryption**. Use it for sensitive data.

## Range and Power

- Typical range: 10-30 meters
- Power consumption: 10-50mA active, <1μA sleeping
- Mesh networking extends range

## BLE vs Classic Bluetooth

BLE is **10x more power efficient** but with lower data rates. Choose BLE for IoT.

BLE makes wireless IoT devices practical and power-efficient.',
'Connectivity',
'16 min read',
true,
0),

-- Article 9  
('ota-updates',
'OTA Firmware Updates: Secure Over-the-Air Updates for IoT Devices',
'Master secure OTA firmware updates for ESP32, Arduino, STM32. Learn version management, rollback protection, delta updates, firmware signing, and deploy updates safely to production.',
'# OTA Firmware Updates

Over-the-Air updates are essential for maintaining IoT devices in the field. Learn to implement them securely.

## Why OTA Updates?

**Benefits**:
- Fix bugs remotely
- Add new features
- Security patches
- No physical access needed

## OTA Architecture

Three components:
1. **Update Server**: Hosts firmware files
2. **Device**: Downloads and installs
3. **Rollback Mechanism**: Safety net

## Version Management

Use **semantic versioning**: MAJOR.MINOR.PATCH

Track versions in firmware:
```cpp
#define FIRMWARE_VERSION "1.2.3"
```

## Secure Updates

**Critical requirements**:
- Firmware signing (verify authenticity)
- Encrypted transmission (TLS/HTTPS)
- Version verification (prevent downgrades)

## ESP32 OTA Implementation

```cpp
#include <ArduinoOTA.h>
ArduinoOTA.begin();
ArduinoOTA.handle();
```

ESP32 supports **dual partition** for atomic updates.

## Rollback Protection

If new firmware crashes:
- Boot from previous partition
- Automatic rollback after failures
- Require user confirmation for stable version

## Delta Updates

Send only **changed bytes** instead of full firmware:
- 10x smaller update files
- Faster downloads
- Less bandwidth

## Update Process

1. Check for updates (HTTP/MQTT)
2. Download firmware
3. Verify signature
4. Flash to update partition
5. Reboot and validate
6. Commit or rollback

## Scheduling Updates

**Best practices**:
- Update during low-usage hours
- Stagger updates across fleet
- Monitor update success rate

## Error Handling

Plan for failures:
- Network interruptions
- Power loss during update
- Corrupted downloads

**OTA updates** keep your devices secure and functional long after deployment.',
'Development',
'17 min read',
true,
0),

-- Article 10
('node-red-dashboards',
'Node-RED IoT Dashboards: Build Real-Time Data Visualization',
'Master Node-RED for IoT dashboards. Learn flow-based programming, MQTT integration, dashboard widgets, database storage, ESP32 connectivity, and build production-ready monitoring systems.',
'# Node-RED IoT Dashboards

Node-RED provides visual programming for IoT data flows. Build powerful dashboards without writing code.

## What is Node-RED?

**Flow-based programming** environment. Drag and drop nodes to create data pipelines.

## Installation

```bash
npm install -g --unsafe-perm node-red
node-red
```

Access at `http://localhost:1880`

## MQTT Integration

Connect to your MQTT broker:
1. Drag **mqtt in** node
2. Configure broker settings
3. Subscribe to topics

## Dashboard Widgets

**node-red-dashboard** provides:
- Gauges and charts
- Buttons and sliders
- Text displays
- Notifications

Install: `npm install node-red-dashboard`

## Database Storage

Store time-series data:
- **InfluxDB**: Time-series database
- **MongoDB**: Document storage
- **SQLite**: Lightweight option

## ESP32 Integration

ESP32 publishes to MQTT → Node-RED subscribes → Display on dashboard

**Real-time visualization** of sensor data.

## Function Nodes

Add JavaScript processing:
```javascript
msg.payload = msg.payload * 1.8 + 32; // C to F
return msg;
```

## Alerts and Notifications

Trigger actions based on conditions:
- Email alerts
- SMS notifications
- HTTP webhooks

## Dashboard Layout

Organize with **groups** and **tabs**:
- Sensors tab
- Controls tab
- Analytics tab

## Best Practices

- **Name your nodes** for clarity
- Use **link nodes** to organize flows
- Add **comment nodes** for documentation
- Export flows for version control

Node-RED makes building IoT dashboards **fast and flexible**.',
'Visualization',
'15 min read',
true,
0),

-- Article 11
('esp32-usb-driver',
'ESP32/ESP8266 USB Driver Installation: Fix Port Detection Issues',
'Fix ESP32/ESP8266 COM port not detected. Install CP2102, CH340, FTDI drivers on Windows, Mac, Linux. Complete troubleshooting guide with all backlinks.',
'# ESP32/ESP8266 USB Driver Installation

Can''t see your ESP32 COM port? This guide covers driver installation and troubleshooting.

## Identify Your USB Chip

Check your board:
- **CP2102/CP2104**: Silicon Labs
- **CH340/CH341**: WCH (common on cheap boards)
- **FTDI**: Genuine or clone

## Windows Installation

**CP2102 Drivers**:
1. Download from Silicon Labs website
2. Run installer
3. Restart computer
4. Check Device Manager

**CH340 Drivers**:
Download and install CH340 driver package.

## Mac Installation

macOS may need security permission:
1. System Preferences → Security
2. Allow driver from identified developer
3. Restart

## Linux Installation

Usually no drivers needed! Check permissions:
```bash
sudo usermod -a -G dialout $USER
```

Log out and back in.

## Troubleshooting

**Port Not Appearing**:
- Try different USB cable (data cable, not charging-only)
- Test different USB port
- Check Device Manager for unknown devices

**Driver Conflict**:
Uninstall conflicting drivers in Device Manager.

**Permission Denied**:
Linux users need dialout group membership.

## Verification

Upload blink sketch. If it works, drivers are correct!

**Driver issues** are the most common ESP32/ESP8266 problem—solve them first.',
'Troubleshooting',
'5 min read',
true,
0),

-- Article 12
('esp32-getting-started',
'ESP32 Getting Started Guide: Your First IoT Project in 30 Minutes',
'Complete beginner-friendly ESP32 tutorial. Learn setup, installation, first code upload, WiFi connection, and sensor integration in 30 minutes. Perfect for IoT beginners.',
'# ESP32 Getting Started Guide

Get your ESP32 up and running in 30 minutes. This beginner-friendly guide covers everything you need.

## What You Need

- ESP32 development board
- USB cable (data cable)
- Computer (Windows/Mac/Linux)

## Install Arduino IDE

1. Download from arduino.cc
2. Install for your OS
3. Launch Arduino IDE

## Add ESP32 Board Support

**In Arduino IDE**:
1. File → Preferences
2. Add URL to Additional Boards Manager URLs:
```
https://dl.espressif.com/dl/package_esp32_index.json
```
3. Tools → Board → Boards Manager
4. Search "ESP32" and install

## Install USB Drivers

See our **ESP32 USB Driver Guide** for detailed instructions.

## Select Your Board

Tools → Board → ESP32 Dev Module

Select correct COM port in Tools → Port.

## First Sketch: Blink LED

```cpp
void setup() {
  pinMode(2, OUTPUT); // Built-in LED
}

void loop() {
  digitalWrite(2, HIGH);
  delay(1000);
  digitalWrite(2, LOW);
  delay(1000);
}
```

Upload and watch it blink!

## WiFi Connection

```cpp
#include <WiFi.h>

const char* ssid = "YourSSID";
const char* password = "YourPassword";

void setup() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}
```

## Read Sensor Data

Example with DHT22:
```cpp
#include <DHT.h>
DHT dht(4, DHT22);
float temp = dht.readTemperature();
```

## Next Steps

- Try MQTT communication
- Build a web server
- Connect sensors
- Create IoT projects

**Welcome to ESP32**—you''re ready to build amazing IoT projects!',
'Tutorials',
'10 min read',
true,
0),

-- Article 13
('smart-greenhouse-diy',
'Build Your Own Smart Greenhouse: Complete Step-by-Step Guide',
'Build an automated smart greenhouse with temperature, humidity, soil moisture control. Complete tutorial with code, wiring, sensor integration, and cloud monitoring.',
'# Build Your Own Smart Greenhouse

Create an automated greenhouse that monitors and controls growing conditions. Complete project tutorial.

## Project Overview

**What You''ll Build**:
- Temperature and humidity monitoring
- Soil moisture sensing
- Automatic watering system
- Light control
- Cloud dashboard

## Components Needed

**Electronics**:
- ESP32 (WiFi connectivity)
- DHT22 (temperature/humidity)
- Soil moisture sensor
- Relay module (2-channel)
- Water pump
- Grow lights

**Greenhouse Structure**:
- Frame and covering (DIY or kit)
- Pots and soil
- Water reservoir

## Wiring Diagram

```
ESP32 Pins:
- GPIO 4: DHT22
- GPIO 34: Soil Moisture (analog)
- GPIO 25: Water Pump Relay
- GPIO 26: Light Relay
```

## Code Structure

**Setup**:
```cpp
#include <WiFi.h>
#include <DHT.h>

DHT dht(4, DHT22);
const int soilPin = 34;
```

**Main Logic**:
- Read sensors every 5 minutes
- If soil dry → activate pump
- If temperature high → alert
- If dark → turn on lights

## Automation Rules

**Watering**:
If soil moisture < 30% → pump ON for 10 seconds

**Lighting**:
If sunlight < threshold → grow lights ON

**Ventilation**:
If temperature > 30°C → fan ON

## Cloud Integration

Send data to **ThingSpeak** or **Blynk**:
- Real-time monitoring
- Historical data
- Remote control

## Mounting and Weatherproofing

**Protect electronics**:
- Waterproof enclosure
- Elevated mounting
- Cable management

## Power Supply

Options:
- Wall adapter (AC)
- Solar panel + battery (off-grid)
- Power bank (temporary)

## Testing and Calibration

1. Test each sensor individually
2. Calibrate soil moisture (wet vs dry)
3. Verify relay switching
4. Monitor for 24 hours

## Expanding the Project

**Future enhancements**:
- Camera for plant monitoring
- CO2 sensor
- pH monitoring
- Mobile app control

**Your smart greenhouse** provides optimal growing conditions automatically!',
'Projects',
'20 min read',
true,
0),

-- Article 14
('iot-sensors-guide',
'Top 10 IoT Sensors Every Developer Must Know (With Datasheets)',
'Complete guide to essential IoT sensors: DHT11, HC-SR04, PIR, Soil Moisture, Gas, GPS, and more. Includes datasheets, wiring, code examples, and real-world applications.',
'# Top 10 IoT Sensors Every Developer Must Know

Master these essential sensors to build any IoT project. Includes wiring, code, and real-world applications.

## 1. DHT11/DHT22 - Temperature & Humidity

**Applications**: Weather stations, HVAC control, greenhouses

**Wiring**: Single data pin + power
**Code**: `dht.readTemperature()`, `dht.readHumidity()`

DHT22 is more accurate but costs more.

## 2. HC-SR04 - Ultrasonic Distance

**Applications**: Parking sensors, liquid level, obstacle detection

**Range**: 2cm to 400cm
**Accuracy**: ±3mm

Trigger pulse → measure echo time → calculate distance.

## 3. PIR Motion Sensor

**Applications**: Security systems, automatic lighting, occupancy detection

**Detection Range**: 5-7 meters
**Angle**: 120 degrees

Outputs HIGH when motion detected.

## 4. Soil Moisture Sensor

**Applications**: Smart irrigation, plant monitoring

**Types**: Resistive (cheap) vs Capacitive (better)

Capacitive sensors **don''t corrode** like resistive ones.

## 5. MQ-Series Gas Sensors

**Variants**:
- **MQ-2**: Smoke, LPG, CO
- **MQ-135**: Air quality
- **MQ-7**: Carbon monoxide

Require **24-48 hour burn-in** for accurate readings.

## 6. BMP280 - Pressure & Altitude

**Applications**: Weather stations, altitude tracking, drones

**I2C/SPI**: Easy integration
**Accuracy**: ±1 hPa pressure, ±1m altitude

## 7. GPS Module (NEO-6M)

**Applications**: Asset tracking, navigation, geofencing

**UART Communication**: 9600 baud
**Accuracy**: 2.5m CEP

Parse **NMEA sentences** for coordinates.

## 8. Light Sensor (LDR/BH1750)

**Applications**: Automatic lighting, solar tracking

**LDR**: Cheap, analog
**BH1750**: Accurate, digital I2C

Use voltage divider with LDR.

## 9. Accelerometer/Gyroscope (MPU6050)

**Applications**: Gesture control, fall detection, orientation

**6-axis**: 3-axis accelerometer + 3-axis gyroscope
**I2C**: Easy to use

Combine for **motion tracking**.

## 10. Current Sensor (ACS712)

**Applications**: Power monitoring, load detection

**Variants**: 5A, 20A, 30A

Measures AC or DC current via **Hall effect**.

## Choosing the Right Sensor

Consider:
- **Accuracy** requirements
- **Power consumption**
- **Communication** protocol
- **Cost** constraints

**Master these sensors** and you can build 90% of IoT projects!',
'Sensors',
'15 min read',
true,
0),

-- Article 15
('arduino-vs-esp32',
'Arduino vs ESP32: Which Microcontroller Should You Choose?',
'Compare Arduino Uno and ESP32: performance, WiFi, price, GPIO pins, power consumption. Detailed guide to help you choose the right microcontroller for your IoT project.',
'# Arduino vs ESP32: Complete Comparison

Choosing between Arduino Uno and ESP32? This comprehensive comparison helps you decide.

## Processing Power

**Arduino Uno**:
- 8-bit AVR @ 16MHz
- 32KB Flash, 2KB RAM

**ESP32**:
- 32-bit dual-core @ 240MHz
- 4MB Flash, 520KB RAM

**Winner**: ESP32 (15x faster!)

## Connectivity

**Arduino Uno**:
- No built-in WiFi/Bluetooth
- Requires external shields

**ESP32**:
- **Built-in WiFi** (802.11 b/g/n)
- **Bluetooth 4.2** + BLE

**Winner**: ESP32 (essential for IoT)

## GPIO Pins

**Arduino Uno**: 14 digital, 6 analog
**ESP32**: 36 pins (can be digital/analog/PWM)

ESP32 has **more flexibility**.

## Power Consumption

**Arduino Uno**: ~45mA active
**ESP32**: 160-260mA active, <10μA deep sleep

**Winner**: Depends on use case
- Arduino better for always-on
- ESP32 better with sleep modes

## Programming

**Arduino Uno**:
- Arduino IDE (easy)
- C/C++
- Beginner-friendly

**ESP32**:
- Arduino IDE compatible
- ESP-IDF (advanced)
- MicroPython support

**Both are beginner-friendly** now!

## Price

**Arduino Uno**: $20-25 (official)
**ESP32**: $5-10 (dev boards)

**Winner**: ESP32 (much cheaper)

## Voltage

**Arduino Uno**: 5V logic
**ESP32**: 3.3V logic

Consider when connecting sensors!

## Use Cases

**Choose Arduino Uno** for:
- Learning embedded programming
- 5V sensor compatibility
- Stable, proven platform
- No WiFi needed

**Choose ESP32** for:
- IoT projects (WiFi/BLE required)
- High performance needs
- Budget constraints
- Multiple sensors/peripherals

## Community and Libraries

**Both have excellent support**:
- Huge communities
- Thousands of libraries
- Abundant tutorials

## Development Tools

**Arduino Uno**:
- Arduino IDE
- PlatformIO
- Atmel Studio

**ESP32**:
- Arduino IDE
- PlatformIO
- ESP-IDF
- MicroPython

## The Verdict

For **modern IoT projects**, ESP32 is the clear winner:
- Better performance
- Built-in connectivity
- Lower cost
- More features

**Arduino Uno** still excels for:
- Education and learning
- Simple projects
- 5V sensor compatibility

**Most developers** now start with ESP32 for new projects.',
'Hardware',
'12 min read',
true,
0),

-- Article 16
('wifi-troubleshooting',
'WiFi Connection Issues on ESP32/ESP8266: Complete Troubleshooting Guide',
'Solve ESP32 and ESP8266 WiFi connection problems: authentication failed, SSID not found, weak signal, disconnections. Includes code fixes and network configuration.',
'# WiFi Troubleshooting for ESP32/ESP8266

Struggling with WiFi connections? This comprehensive guide solves common ESP32/ESP8266 WiFi issues.

## Common Error: "SSID Not Found"

**Causes**:
- Router not broadcasting SSID
- Wrong WiFi band (ESP32 only supports 2.4GHz)
- Special characters in SSID

**Solution**:
```cpp
WiFi.begin("YourSSID", "password");
```

Ensure SSID is **exactly correct** (case-sensitive).

## Authentication Failed

**Check**:
- Password is correct
- Security type (WPA2 supported, WEP outdated)
- MAC filtering disabled

**Code Fix**:
```cpp
while (WiFi.status() != WL_CONNECTED) {
  delay(500);
  Serial.print(".");
  if (millis() > 10000) break; // Timeout
}
```

## ESP32 Only Supports 2.4GHz

**Most common mistake!**

ESP32 **cannot connect to 5GHz networks**. Check router settings:
- Enable 2.4GHz band
- Use separate SSID for 2.4GHz

## Weak Signal / Disconnections

**Solutions**:
- Move closer to router
- Reduce obstacles
- Check antenna connection
- Use external antenna (if supported)

**Code**: Add reconnection logic
```cpp
if (WiFi.status() != WL_CONNECTED) {
  WiFi.reconnect();
}
```

## Static IP Configuration

DHCP sometimes fails. Try static IP:
```cpp
IPAddress local_IP(192, 168, 1, 100);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

WiFi.config(local_IP, gateway, subnet);
WiFi.begin(ssid, password);
```

## Channel Interference

Too many devices on same channel:
- Use WiFi analyzer app
- Switch to less congested channel (1, 6, or 11)

## Power Supply Issues

**Weak power** causes WiFi problems:
- Use 3.3V, 500mA+ supply
- Add decoupling capacitor (100μF)
- Avoid USB hubs (insufficient current)

## Special Characters in Credentials

Avoid these in SSID/password:
- Quotes: " ''
- Backslashes: \\
- Percent: %

## Hidden Network Connection

```cpp
WiFi.begin(ssid, password, 0, NULL, true); // true = hidden
```

## Reset WiFi Settings

If nothing works:
```cpp
WiFi.disconnect(true); // Clear stored credentials
WiFi.begin(ssid, password);
```

## Debugging WiFi Status

Check connection status:
```cpp
Serial.println(WiFi.status());
// 3 = WL_CONNECTED
// 6 = WL_DISCONNECTED
```

## Router Configuration

**Best settings for ESP32/ESP8266**:
- WPA2-PSK security
- 2.4GHz band enabled
- Channel: 1, 6, or 11
- DHCP enabled OR static IP configured

## Advanced: WiFi Events

Monitor connection state:
```cpp
WiFi.onEvent(WiFiEvent);

void WiFiEvent(WiFiEvent_t event) {
  if (event == SYSTEM_EVENT_STA_DISCONNECTED) {
    WiFi.reconnect();
  }
}
```

**WiFi issues** are usually configuration problems, not hardware. Follow this guide systematically to resolve them.',
'Troubleshooting',
'13 min read',
true,
0);

-- Verify insertion
SELECT slug, title, view_count FROM blogs ORDER BY created_at DESC;
