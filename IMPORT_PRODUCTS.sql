-- ======================================================
-- IMPORT 71 PRODUCTS TO SUPABASE
-- Copy & paste this entire script into Supabase SQL Editor
-- ======================================================

-- Insert all products with simplified categories
INSERT INTO component_prices (product_id, serial_no, name, category, price, description, image_url, is_active) VALUES
-- Sensors (Serial 1-37)
('SEN-01', 1, 'Ultra Sonic (HC-SR04)', 'Sensor', 65.00, 'Non-contact distance measurement sensor using sonar; range 2cm-400cm.', '/src/assets/Sensor/HC-SR04.png', true),
('SEN-11', 2, 'Temperature & Humidity Sensor (DHT11)', 'Sensor', 80.00, 'Basic digital sensor for measuring temperature (0-50°C) and humidity (20-90% RH).', '/src/assets/Sensor/DHT11.png', true),
('SEN-02', 3, 'PIR Motion Sensor (HC-SR501)', 'Sensor', 55.00, 'Passive Infrared sensor to detect motion of humans or animals; adjustable sensitivity.', '/src/assets/Sensor/PIR.png', true),
('SEN-18', 4, 'LDR (Light Dependent Resistor)', 'Sensor', 15.00, 'Photoresistor whose resistance decreases with increasing light intensity.', '/src/assets/Sensor/LDR.png', true),
('SEN-03', 5, 'Accelerometer Gyroscope (MPU-6050)', 'Sensor', 150.00, '6-DoF IMU combining a 3-axis accelerometer and 3-axis gyroscope for orientation sensing.', '/src/assets/Sensor/Accelerometer.png', true),
('SEN-31', 6, 'IR Proximity Sensor (Sharp GP2Y0A21YK0F)', 'Sensor', 400.00, 'Analog IR distance sensor using triangulation for 10-80cm range; non-linear output.', '/src/assets/Sensor/Proximity-Sensor.png', true),
('SEN-04', 7, 'Magnetometer (HMC5883L/QMC5883L)', 'Sensor', 150.00, '3-axis digital compass for measuring magnetic fields to determine absolute heading.', '/src/assets/Sensor/magnetometer.png', true),
('SEN-12', 8, 'Barometer (BMP180)', 'Sensor', 100.00, 'Digital sensor for measuring absolute barometric pressure and temperature; used for altimetry.', '/src/assets/Sensor/Barometer.png', true),
('SEN-19', 9, 'IR Sensor Module', 'Sensor', 27.00, 'Digital IR proximity sensor for short-range (2-30cm) object detection and line following.', '/src/assets/Sensor/IR.png', true),
('SEN-13', 10, 'Pressure Sensor (MPX5700AP)', 'Sensor', 2400.00, 'High-precision industrial absolute pressure sensor with analog output (15-700 kPa).', '/src/assets/Sensor/Pressure-Sensor.png', true),
('SEN-05', 11, 'GPS Module (NEO-6M)', 'Sensor', 250.00, 'Complete GPS receiver module for acquiring satellite-based location data (lat, lon, alt).', '/src/assets/Sensor/GPS.png', true),
('SEN-26', 12, 'Heart Rate Sensor (MAX30100)', 'Sensor', 110.00, 'Integrated pulse oximetry and heart rate sensor using PPG for wearable health monitoring.', '/src/assets/Sensor/Heart-Rate.png', true),
('SEN-27', 13, 'Blood Pressure Sensor Module', 'Sensor', 2500.00, 'Complete oscillometric system with cuff, pump, and sensor for non-invasive blood pressure measurement.', '/src/assets/Sensor/Blood-Pressure.png', true),
('SEN-28', 14, 'Capacitive Touch Sensor (TTP223B Module)', 'Sensor', 25.00, 'Capacitive touch sensor module that acts as a digital replacement for a mechanical button.', '/src/assets/Sensor/Touch-.png', true),
('SEN-21', 15, 'Sound Detection Sensor (LM393 Module)', 'Sensor', 45.00, 'Detects sound levels exceeding a set threshold and provides a digital output signal.', '/src/assets/Sensor/Sound-Sensor.png', true),
('SEN-14', 16, 'Gas Sensor (MQ-2)', 'Sensor', 85.00, 'Semiconductor sensor for detecting combustible gases like LPG, propane, and smoke.', '/src/assets/Sensor/gas.png', true),
('SEN-34', 17, 'Image Sensor (OV7670 Module)', 'Sensor', 150.00, 'VGA (640x480) resolution CMOS camera module for capturing images and video.', '/src/assets/Sensor/Image.png', true),
('SEN-35', 18, 'Colour Sensor (TCS3200)', 'Sensor', 450.00, 'Converts light color to frequency, allowing a microcontroller to measure RGB color values.', '/src/assets/Sensor/Color.png', true),
('SEN-15', 19, 'Smoke/Air Quality Sensor (MQ-135)', 'Sensor', 110.00, 'General air quality sensor sensitive to Benzene, smoke, NH3, NOx, and other gases.', '/src/assets/Sensor/Smoke.png', true),
('SEN-22', 20, 'Soil Moisture Sensor (Resistive)', 'Sensor', 42.00, 'Measures soil moisture by sensing electrical resistance between two probes; prone to corrosion.', '/src/assets/Sensor/Soil-Moisture.png', true),
('SEN-06', 21, 'Vibration Sensor (SW-420 Module)', 'Sensor', 50.00, 'Digital shock and vibration detection module using a normally closed switch.', '/src/assets/Sensor/Vibration.png', true),
('SEN-07', 22, 'Tilt Sensor Switch Module', 'Sensor', 30.00, 'Simple digital switch that detects inclination using an internal rolling ball mechanism.', '/src/assets/Sensor/Tilt.png', true),
('SEN-32', 23, 'Load Cell (5kg)', 'Sensor', 150.00, 'Strain gauge transducer for measuring weight up to 5kg; requires an HX711 amplifier.', '/src/assets/Sensor/Weight.png', true),
('SEN-33', 24, 'Force Sensing Resistor (FSR 402)', 'Sensor', 250.00, 'Resistor that changes its value based on applied force; used for pressure-sensitive interfaces.', '/src/assets/Sensor/Force.png', true),
('SEN-23', 25, 'Soil Moisture Sensor (Capacitive)', 'Sensor', 80.00, 'Measures soil moisture via changes in capacitance; corrosion-resistant for long-term use.', '/src/assets/Sensor/Moisture.png', true),
('SEN-08', 26, 'Hall Effect Sensor (A3144 Module)', 'Sensor', 25.00, 'Digital switch that activates in the presence of a magnetic field.', '/src/assets/Sensor/Hall-Effect.png', true),
('SEN-29', 27, 'Biometric Fingerprint Sensor (R307)', 'Sensor', 850.00, 'Optical fingerprint reader module with onboard storage for up to 1000 fingerprints.', '/src/assets/Sensor/Biometric.png', true),
('SEN-30', 28, 'Facial Recognition Module (ESP32-CAM)', 'Sensor', 550.00, 'Integrated ESP32 microcontroller and camera for WiFi video streaming and face recognition.', '/src/assets/Sensor/Face-Recognition-Sensor.png', true),
('SEN-16', 29, 'Oxygen Sensor (Electrochemical)', 'Sensor', 5000.00, 'Measures atmospheric oxygen concentration (0-25% Vol) using an electrochemical cell.', '/src/assets/Sensor/Oxygen.png', true),
('SEN-17', 30, 'Carbon Dioxide Sensor (NDIR)', 'Sensor', 6000.00, 'High-accuracy Non-Dispersive Infrared (NDIR) sensor for measuring CO2 concentration.', '/src/assets/Sensor/CO-.png', true),
('SEN-25', 31, 'Radiation Sensor (Geiger Counter Module)', 'Sensor', 3200.00, 'Detects ionizing radiation (alpha, beta, gamma) using a Geiger-Müller tube.', '/src/assets/Sensor/Radiation.png', true),
('SEN-24', 32, 'Flame Sensor Module', 'Sensor', 30.00, 'Detects flames by sensing infrared radiation in the 760-1100 nm wavelength range.', '/src/assets/Sensor/Flame.png', true),
('SEN-04-MAG', 33, 'Magnetic Field Sensor', 'Sensor', 150.00, '3-axis digital compass for measuring magnetic fields to determine absolute heading.', '/src/assets/Sensor/Magnetic-Field.png', true),
('SEN-20', 34, 'Ambient Light Sensor (BH1750)', 'Sensor', 100.00, 'Digital I2C sensor that measures ambient light intensity directly in lux.', '/src/assets/Sensor/Ambient-Light.png', true),
('SEN-23-CAP', 35, 'Soil Moisture Sensor (Capacitive)', 'Sensor', 80.00, 'Measures soil moisture via changes in capacitance; corrosion-resistant for long-term use.', '/src/assets/Sensor/Soil-Moisture.png', true),
('SEN-09', 36, 'Gesture Sensor (APDS-9960)', 'Sensor', 150.00, 'Multi-function I2C sensor for gesture, proximity, ambient light, and RGB color sensing.', '/src/assets/Sensor/Gesture.png', true),
('SEN-10', 37, 'Lidar Sensor (TF-Luna)', 'Sensor', 2200.00, 'Time-of-Flight (ToF) LiDAR sensor for fast and accurate distance measurement up to 8m.', '/src/assets/Sensor/Lidar.png', true),

-- MCU / Development Boards (Serial 38-43)
('MCU-01', 38, 'Arduino Uno', 'MCU', 450.00, 'Popular ATmega328P-based microcontroller board with 14 digital I/O pins and 6 analog inputs.', '/src/assets/icon/arduino-uno.png', true),
('MCU-02', 39, 'Arduino Nano', 'MCU', 350.00, 'Compact Arduino board based on ATmega328P; breadboard-friendly with mini-USB.', '/src/assets/icon/arduino-nano.png', true),
('MCU-03', 40, 'ESP32', 'MCU', 550.00, 'Powerful WiFi & Bluetooth enabled microcontroller with dual-core processor and rich peripherals.', '/src/assets/icon/esp32.png', true),
('MCU-04', 41, 'ESP8266', 'MCU', 300.00, 'WiFi-enabled development board based on ESP8266 with built-in USB and Lua firmware support.', '/src/assets/icon/esp8266.png', true),
('MCU-05', 42, 'Raspberry Pi Pico', 'MCU', 400.00, 'Low-cost microcontroller board with RP2040 chip, dual-core ARM Cortex M0+ processor.', '/src/assets/icon/raspberry-pi-pico.png', true),
('MCU-06', 43, 'STM32 Blue Pill', 'MCU', 550.00, 'ARM Cortex-M3 development board with 72MHz clock, 64KB flash, ideal for advanced projects.', '/src/assets/icon/stm32.png', true),

-- Displays (Serial 44-49)
('DISP-01', 44, '16x2 LCD Display', 'Display', 120.00, 'Character LCD with 16 columns x 2 rows, blue backlight, parallel interface, 5V.', '/src/assets/icon/16x2-lcd.png', true),
('DISP-02', 45, '0.96" OLED Display', 'Display', 180.00, 'Small OLED display with I2C interface, high contrast, wide viewing angle, 128x64 resolution.', '/src/assets/icon/oled-096.png', true),
('DISP-03', 46, '1.3" OLED Display', 'Display', 250.00, 'Larger OLED display with SPI interface, white or blue color, 128x64 resolution, 3.3-5V compatible.', '/src/assets/icon/oled-13.png', true),
('DISP-04', 47, 'Nokia 5110 LCD', 'Display', 150.00, 'Monochrome graphic LCD with 84x48 resolution, SPI interface, low power consumption.', '/src/assets/icon/nokia5110.png', true),
('DISP-05', 48, 'TFT 1.8" Color Display', 'Display', 350.00, 'Small color TFT display with 128x160 resolution, SPI interface, ST7735 driver.', '/src/assets/icon/tft-18.png', true),
('DISP-06', 49, 'TFT 2.4" Touchscreen', 'Display', 650.00, 'Color TFT display with resistive touch, 240x320 resolution, SPI interface, ILI9341 driver.', '/src/assets/icon/tft-24.png', true),

-- Power (Serial 50-56)
('PWR-01', 50, '5V Power Adapter', 'Power', 80.00, 'AC to DC power adapter with micro-USB connector, 5V 2A output, ideal for Arduino and Raspberry Pi.', '/src/assets/icon/power-adapter.png', true),
('PWR-02', 51, '9V Battery', 'Power', 30.00, 'Standard 9V alkaline battery for low-power electronics and sensors.', '/src/assets/icon/9v-battery.png', true),
('PWR-03', 52, '18650 Battery', 'Power', 50.00, 'Rechargeable lithium-ion battery, 3.7V, 2200-3500mAh capacity, ideal for portable projects.', '/src/assets/icon/18650-battery.png', true),
('PWR-04', 53, '18650 Battery Holder (Single)', 'Power', 40.00, 'Battery holder for single 18650 cell with wire leads and protective circuit.', '/src/assets/icon/battery-holder-1.png', true),
('PWR-05', 54, '18650 Battery Holder (Double)', 'Power', 60.00, 'Battery holder for two 18650 cells in series (7.4V) with wire leads.', '/src/assets/icon/battery-holder-2.png', true),
('PWR-06', 55, '18650 Battery Holder (Triple)', 'Power', 80.00, 'Battery holder for three 18650 cells in series (11.1V) with wire leads.', '/src/assets/icon/battery-holder-3.png', true),
('PWR-07', 56, 'USB Cable', 'Cable', 25.00, 'USB Type-A to Micro-USB cable for Arduino and other microcontroller boards, 1 meter length.', '/src/assets/icon/usb-cable.png', true),

-- Components (Serial 57-64)
('COMP-01', 57, 'Breadboard 400 Points', 'Component', 45.00, 'Half-size solderless breadboard with 400 tie points for prototyping circuits.', '/src/assets/icon/breadboard-400.png', true),
('COMP-02', 58, 'Breadboard 830 Points', 'Component', 80.00, 'Full-size solderless breadboard with 830 tie points and power rails.', '/src/assets/icon/breadboard-830.png', true),
('COMP-03', 59, 'Jumper Wires (Pack)', 'Component', 30.00, 'Assorted male-to-male jumper wires for breadboard connections, 65 pieces, various lengths.', '/src/assets/icon/jumper-wires.png', true),
('COMP-04', 60, 'LED Pack (10pcs)', 'Component', 20.00, 'Assorted 5mm LEDs in various colors (red, green, blue, yellow, white), 10 pieces.', '/src/assets/icon/led-pack.png', true),
('COMP-05', 61, 'Resistor Kit', 'Component', 50.00, 'Assorted resistor kit with common values from 10Ω to 1MΩ, 1/4W, 600 pieces.', '/src/assets/icon/resistor-kit.png', true),
('COMP-06', 62, 'Push Button (5pcs)', 'Component', 15.00, 'Tactile push button switches, 6x6mm, 4-pin, momentary, 5 pieces.', '/src/assets/icon/push-button.png', true),
('COMP-07', 63, 'Relay Module', 'Component', 60.00, 'Single channel 5V relay module with optocoupler, control high-voltage AC/DC loads up to 10A.', '/src/assets/icon/relay.png', true),
('COMP-08', 64, 'Motor Driver L298N', 'Component', 120.00, 'Dual H-bridge motor driver module, control 2 DC motors or 1 stepper, 5-35V, 2A per channel.', '/src/assets/icon/l298n.png', true),

-- Actuators (Serial 65-71, 95)
('ACT-01', 65, 'DC Motor (Standard)', 'Actuator', 40.00, 'Small DC motor for hobby projects, 3-6V operating voltage, 16500 RPM.', '/src/assets/icon/dc-motor.png', true),
('ACT-02', 66, 'Geared DC Motor', 'Actuator', 80.00, 'DC motor with gearbox for higher torque and lower speed, 6V, 200 RPM.', '/src/assets/icon/geared-motor.png', true),
('ACT-03', 67, '9g Servo Motor', 'Actuator', 90.00, 'Micro servo motor with 180° rotation, 4.8-6V operating voltage, torque 1.8kg/cm.', '/src/assets/icon/sg90-servo.png', true),
('ACT-04', 68, 'Tower Pro SG90 Servo', 'Actuator', 120.00, 'Popular micro servo motor with 180° rotation, 4.8-6V, torque 2.5kg/cm.', '/src/assets/icon/sg90-servo.png', true),
('ACT-05', 69, 'MG996R Servo (Metal Gear)', 'Actuator', 350.00, 'High-torque metal gear servo motor, 10kg/cm torque, 180° rotation, 4.8-7.2V.', '/src/assets/icon/mg996r-servo.png', true),
('ACT-06', 70, 'Mini Water Pump', 'Actuator', 140.00, 'Submersible DC water pump for aquariums and plant watering systems, 3-6V, 120L/H flow rate.', '/src/assets/icon/water-pump.png', true),
('ACT-07', 71, 'Submersible Water Pump', 'Actuator', 160.00, 'Larger submersible water pump for fountains and irrigation, 12V, 240L/H flow rate.', '/src/assets/icon/submersible-pump.png', true),
('ACT-08', 95, 'Stepper Motor (28BYJ-48)', 'Actuator', 150.00, '5V stepper motor with ULN2003 driver board, 4096 steps per revolution, low noise.', '/src/assets/icon/stepper-motor.png', true);

-- ======================================================
-- VERIFICATION QUERY
-- Run this after import to verify all products imported
-- ======================================================
-- SELECT category, COUNT(*) as count FROM component_prices GROUP BY category ORDER BY category;
-- Should show:
-- Actuator   | 8
-- Component  | 8
-- Display    | 6
-- MCU        | 6
-- Power      | 6
-- Cable      | 1
-- Sensor     | 37
-- TOTAL: 71 products
