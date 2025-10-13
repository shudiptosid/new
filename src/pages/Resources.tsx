import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ContactCTA from "@/components/ContactCTA";
import booksImg from "@/assets/books.png";
import boardImg from "@/assets/board.png";
import { ArduinoUnoDialog } from "@/components/ArduinoUnoDialog";
import { ESP32Dialog } from "@/components/ESP32Dialog";
import { ESP8266Dialog } from "@/components/ESP8266Dialog";
import { ArduinoNanoDialog } from "@/components/ArduinoNanoDialog";
import { STM32Dialog } from "@/components/STM32Dialog";
import { RaspberryPiPicoDialog } from "@/components/RaspberryPiPicoDialog";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SensorDialog } from "@/components/SensorDialog";

// Import Sensor Images
import ultrasonicImg from "@/assets/Sensor/HC-SR04.png";
import dht11Img from "@/assets/Sensor/DHT11.png";
import pirImg from "@/assets/Sensor/PIR.png";
import servoImg from "@/assets/Sensor/Servo.png";
import ldrImg from "@/assets/Sensor/LDR.png";
import accelerometerImg from "@/assets/Sensor/Accelerometer.png";
import gyroscopeImg from "@/assets/Sensor/Gyroscope Sensor.png";
import proximityImg from "@/assets/Sensor/Proximity Sensor.png";
// New Sensor Images (25 more)
import barometerImg from "@/assets/Sensor/Barometer.png";
import biometricImg from "@/assets/Sensor/Biometric.png";
import bloodPressureImg from "@/assets/Sensor/Blood Pressure.png";
import capacitiveImg from "@/assets/Sensor/Capacitive.png";
import coImg from "@/assets/Sensor/CO .png";
import colorImg from "@/assets/Sensor/Color.png";
import faceRecognitionImg from "@/assets/Sensor/Face Recognition Sensor.png";
import forceImg from "@/assets/Sensor/Force.png";
import gasImg from "@/assets/Sensor/gas.png";
import gpsImg from "@/assets/Sensor/GPS.png";
import hallEffectImg from "@/assets/Sensor/Hall Effect.png";
import heartRateImg from "@/assets/Sensor/Heart Rate.png";
import imageImg from "@/assets/Sensor/Image.png";
import irImg from "@/assets/Sensor/IR.png";
import magnetometerImg from "@/assets/Sensor/magnetometer.png";
import moistureImg from "@/assets/Sensor/Moisture.png";
import oxygenImg from "@/assets/Sensor/Oxygen.png";
import pressureSensorImg from "@/assets/Sensor/Pressure Sensor.png";
import radiationImg from "@/assets/Sensor/Radiation.png";
import smokeImg from "@/assets/Sensor/Smoke.png";
import soundSensorImg from "@/assets/Sensor/Sound Sensor.png";
import tiltImg from "@/assets/Sensor/Tilt.png";
import touchImg from "@/assets/Sensor/Touch .png";
import vibrationImg from "@/assets/Sensor/Vibration.png";
import weightImg from "@/assets/Sensor/Weight.png";
import flameImg from "@/assets/Sensor/Flame.png";
import magneticFieldImg from "@/assets/Sensor/Magnetic Field.png";
import ambientLightImg from "@/assets/Sensor/Ambient Light.png";
import soilMoistureImg from "@/assets/Sensor/Soil Moisture.png";
import gestureImg from "@/assets/Sensor/Gesture.png";
import lidarImg from "@/assets/Sensor/Lidar.png";

const studyMaterials = [
  {
    title: "Reference Books and Article",
    description: "A detailed PDF about a featured project.",
    link: "/resources/sample-project.pdf",
  },
  // Add more study materials as needed
];

// Sensors and Actuators Data with Complete Details
const sensorsData = [
  {
    id: 1,
    name: "Ultrasonic Sensor (HC-SR04)",
    description: "Measures distance using ultrasonic waves, range 2cm-400cm",
    image: ultrasonicImg,
    type: "Distance Sensor",
    shortDescription:
      "The HC-SR04 Ultrasonic Sensor is a popular and affordable distance-measuring module used in robotics and IoT projects. It uses sound waves to measure distance accurately without any physical contact. This sensor is widely used for object detection, obstacle avoidance, and automation systems.",
    workingPrinciple: `
      <p>The HC-SR04 works on the principle of echo — similar to how bats and dolphins navigate.</p>
      <ul class="list-disc ml-6 space-y-1">
        <li>The <strong>Trigger pin</strong> sends an ultrasonic pulse (sound wave) of 40 kHz.</li>
        <li>The wave travels through the air and reflects back when it hits an obstacle.</li>
        <li>The <strong>Echo pin</strong> receives the reflected wave and measures the time duration between sending and receiving.</li>
        <li>Using this time, the distance is calculated using the formula:</li>
      </ul>
      <p class="mt-2 ml-6"><strong>Distance = (Time × Speed of Sound) / 2</strong></p>
      <p class="ml-6">Since the wave travels to the object and back, the time is divided by two.</p>
    `,
    pinDiagram: `
      <p>The HC-SR04 has 4 pins:</p>
      <ul class="list-disc ml-6 space-y-1 mt-2">
        <li><strong>VCC</strong> – Connects to 5V power supply</li>
        <li><strong>Trigger (Trig)</strong> – Sends the ultrasonic pulse</li>
        <li><strong>Echo</strong> – Receives the reflected signal</li>
        <li><strong>GND</strong> – Ground connection</li>
      </ul>
    `,
    useCases: [
      "🤖 Robotics – Obstacle avoidance in autonomous robots",
      "🚗 Vehicle Parking Systems – Distance measurement for safe parking",
      "🏠 Smart Home Automation – Object or motion detection",
      "🌱 IoT Projects – Water level monitoring and smart waste management",
      "🏭 Industrial Automation – Distance sensing in manufacturing systems",
    ],
    metaTitle:
      "HC-SR04 Ultrasonic Sensor: Working, Pinout & Arduino Projects | IoT Folio Spark",
    metaDescription:
      "Learn how HC-SR04 ultrasonic sensor works. Complete guide with pin diagram, working principle, Arduino code examples and real-world applications in robotics and IoT.",
    keywords: [
      "HC-SR04",
      "ultrasonic sensor",
      "distance sensor",
      "Arduino ultrasonic",
      "obstacle avoidance",
      "IoT sensor",
      "robotics sensor",
      "HC-SR04 pinout",
      "ultrasonic distance measurement",
    ],
  },
  {
    id: 2,
    name: "DHT11 Temperature & Humidity Sensor",
    description:
      "Digital sensor for measuring temperature (0-50°C) and humidity",
    image: dht11Img,
    type: "Temperature Sensor",
    shortDescription:
      "The DHT11 Sensor is a low-cost digital sensor used to measure temperature and humidity. It provides accurate and stable readings, making it ideal for IoT projects, weather monitoring systems, and smart home applications. The DHT11 combines a temperature sensor and a humidity sensor on a single chip, communicating data through a single digital pin.",
    workingPrinciple: `
      <p>The DHT11 works by sensing relative humidity and ambient temperature using two separate components:</p>
      <ul class="list-disc ml-6 space-y-1 mt-2">
        <li><strong>Humidity Sensor:</strong> A pair of electrodes with a moisture-holding substrate changes its resistance based on the surrounding humidity level.</li>
        <li><strong>Temperature Sensor:</strong> A thermistor (temperature-dependent resistor) measures ambient temperature.</li>
      </ul>
      <p class="mt-2">The sensor's internal microcontroller converts these analog signals into a digital signal, which can be easily read by microcontrollers like Arduino, ESP32, or Raspberry Pi.</p>
    `,
    pinDiagram: `
      <p>The DHT11 sensor typically has 4 pins (some modules have 3 pins):</p>
      <ul class="list-disc ml-6 space-y-1 mt-2">
        <li><strong>VCC</strong> – Power supply (3.3V to 5V)</li>
        <li><strong>Data</strong> – Serial data output (digital signal)</li>
        <li><strong>NC</strong> – Not connected (sometimes omitted)</li>
        <li><strong>GND</strong> – Ground connection</li>
      </ul>
    `,
    useCases: [
      "🌦️ Weather Monitoring Systems – Real-time temperature and humidity logging",
      "🏠 Smart Home Automation – Environment control for comfort and energy saving",
      "🌱 Greenhouse Monitoring – Maintaining ideal growing conditions",
      "💻 IoT Projects – Data logging with platforms like Blynk, ThingSpeak, or Firebase",
      "🧪 Industrial & Lab Monitoring – Environmental condition tracking",
    ],
    metaTitle:
      "DHT11 Sensor: Temperature & Humidity Measurement Guide | Arduino & ESP32",
    metaDescription:
      "Complete DHT11 sensor guide: pinout, working principle, Arduino interfacing, and IoT applications. Learn to measure temperature and humidity for weather monitoring projects.",
    keywords: [
      "DHT11 sensor",
      "temperature sensor",
      "humidity sensor",
      "DHT11 Arduino",
      "DHT11 ESP32",
      "weather monitoring",
      "IoT temperature sensor",
      "DHT11 pinout",
      "smart home sensor",
    ],
  },
  {
    id: 3,
    name: "PIR Motion Sensor (HC-SR501)",
    description: "Passive Infrared sensor for detecting motion",
    image: pirImg,
    type: "Motion Sensor",
    shortDescription:
      "The PIR (Passive Infrared) Motion Sensor is a popular electronic sensor used to detect motion of humans or animals by measuring changes in infrared radiation. The most common type, HC-SR501, is widely used in security systems, automatic lighting, and smart IoT devices due to its reliability and low power consumption.",
    workingPrinciple: `
      <p>The PIR sensor works on the principle of infrared radiation detection. Every living body emits infrared (IR) energy. The sensor has two slots made of pyroelectric material that can detect these IR changes.</p>
      <p class="mt-2">Here's how it works:</p>
      <ul class="list-disc ml-6 space-y-1 mt-2">
        <li>When there's no motion, both slots receive the same amount of IR energy.</li>
        <li>When a moving object (like a human) passes in front of the sensor, the amount of IR radiation changes rapidly.</li>
        <li>The sensor's internal circuitry detects this change and sends a high signal output.</li>
      </ul>
      <p class="mt-2">This output can then be used to trigger alarms, lights, or other devices.</p>
    `,
    pinDiagram: `
      <p>The HC-SR501 PIR Sensor module typically has 3 pins:</p>
      <ul class="list-disc ml-6 space-y-1 mt-2">
        <li><strong>VCC</strong> – Power supply (usually 5V)</li>
        <li><strong>OUT</strong> – Digital output (High when motion detected)</li>
        <li><strong>GND</strong> – Ground</li>
      </ul>
      <p class="mt-3"><strong>Additional adjustable controls on the module:</strong></p>
      <ul class="list-disc ml-6 space-y-1 mt-1">
        <li><strong>Sensitivity Adjustment</strong> – Changes the detection range (up to ~7 meters)</li>
        <li><strong>Time Delay Adjustment</strong> – Sets how long the output stays high after motion is detected</li>
      </ul>
    `,
    useCases: [
      "🏠 Smart Home Systems – Auto ON/OFF lights or appliances when someone enters or leaves a room",
      "🔒 Security Alarms – Detect unauthorized motion in restricted areas",
      "🚪 Automatic Door Systems – Trigger opening when motion is detected",
      "🌱 Energy Saving Systems – Turn off lights or devices when no motion is detected",
      "🤖 Robotics and IoT – Detect human presence or movement",
    ],
    metaTitle:
      "PIR Motion Sensor (HC-SR501): Working, Applications & Arduino Code",
    metaDescription:
      "Complete PIR sensor tutorial: HC-SR501 pinout, working principle, sensitivity adjustment, and Arduino projects for security systems and smart home automation.",
    keywords: [
      "PIR sensor",
      "HC-SR501",
      "motion sensor",
      "PIR Arduino",
      "motion detection",
      "security sensor",
      "automatic lighting",
      "IoT motion sensor",
      "PIR sensor working",
    ],
  },
  {
    id: 4,
    name: "SG90 Servo Motor",
    description: "180-degree rotation servo motor for precise control",
    image: servoImg,
    type: "Actuator",
    shortDescription:
      "The SG90 Servo Motor is a lightweight, compact, and low-cost rotational actuator widely used in robotics, RC projects, and automation systems. It provides precise angular movement (0° to 180°) based on control signals, making it ideal for projects requiring controlled motion like robotic arms, sensors, and model airplanes.",
    workingPrinciple: `
      <p>The SG90 servo motor operates using the <strong>Pulse Width Modulation (PWM)</strong> principle.</p>
      <ul class="list-disc ml-6 space-y-1 mt-2">
        <li>The motor receives a PWM signal through its control wire.</li>
        <li>The width of the pulse determines the angular position of the motor shaft:
          <ul class="list-circle ml-6 mt-1">
            <li>A <strong>1 ms pulse</strong> moves the motor to <strong>0°</strong>,</li>
            <li>A <strong>1.5 ms pulse</strong> sets it to <strong>90°</strong>,</li>
            <li>A <strong>2 ms pulse</strong> rotates it to <strong>180°</strong>.</li>
          </ul>
        </li>
        <li>The internal feedback control system ensures accurate positioning by comparing the target angle (from PWM signal) with the actual shaft position.</li>
      </ul>
    `,
    pinDiagram: `
      <p>The SG90 servo has 3 pins with distinct color coding:</p>
      <ul class="list-disc ml-6 space-y-1 mt-2">
        <li><strong>Orange (Signal)</strong> – Receives PWM control signal from microcontroller</li>
        <li><strong>Red (VCC)</strong> – Power supply (4.8V to 6V)</li>
        <li><strong>Brown (GND)</strong> – Ground connection</li>
      </ul>
    `,
    useCases: [
      "🤖 Robotics – Controlling arms, joints, and grippers",
      "✈️ RC Aircrafts & Drones – Adjusting flaps and rudders",
      "🏠 Smart Home Automation – Controlling door locks or camera rotation",
      "🧠 IoT Projects – Servo-based automation systems",
      "🎮 Mini Projects – Moving sensors, creating small mechanical systems",
    ],
    metaTitle:
      "SG90 Servo Motor: Complete Guide, Pinout & Arduino Control Tutorial",
    metaDescription:
      "Learn SG90 servo motor interfacing with Arduino. Complete guide on PWM control, pinout, wiring diagram, and robotics applications with example code.",
    keywords: [
      "SG90 servo motor",
      "servo motor Arduino",
      "SG90 pinout",
      "PWM servo control",
      "robotics actuator",
      "servo motor projects",
      "Arduino servo tutorial",
      "180 degree servo",
      "micro servo motor",
    ],
  },
  {
    id: 5,
    name: "LDR (Light Dependent Resistor)",
    description:
      "Photoresistor that changes resistance based on light intensity",
    image: ldrImg,
    type: "Light Sensor",
    shortDescription:
      "The LDR (Light Dependent Resistor), also known as a photoresistor, is an electronic component that changes its resistance based on the intensity of light falling on it. It is widely used in light-sensing circuits, automatic street lights, and IoT-based smart lighting systems due to its simplicity and low cost.",
    workingPrinciple: `
      <p>The LDR works on the principle of <strong>photoconductivity</strong> — a property of certain materials where their electrical resistance decreases as the light intensity increases.</p>
      <ul class="list-disc ml-6 space-y-1 mt-2">
        <li>In <strong>dark conditions</strong>, the LDR has <strong>high resistance</strong> (in megaohms).</li>
        <li>In <strong>bright light</strong>, its resistance drops significantly, allowing more current to flow.</li>
      </ul>
      <p class="mt-2">This variation in resistance can be converted into a voltage signal using a simple voltage divider circuit, making it easy to interface with microcontrollers like Arduino, ESP32, or Raspberry Pi.</p>
    `,
    pinDiagram: `
      <p>Unlike sensors, an LDR has no polarity or fixed pin layout — it simply has two terminals:</p>
      <ul class="list-disc ml-6 space-y-1 mt-2">
        <li><strong>Terminal 1:</strong> Connected to the input voltage or microcontroller circuit</li>
        <li><strong>Terminal 2:</strong> Connected to ground or resistor for voltage division</li>
      </ul>
    `,
    useCases: [
      "🌇 Automatic Street Lights – Turning lights ON/OFF based on ambient brightness",
      "🏠 Smart Home Automation – Adjusting indoor lighting based on sunlight",
      "📸 Camera Light Meters – Detecting optimal lighting for photography",
      "🤖 Robotics – Light-following or avoiding robots",
      "🌱 Solar Tracking Systems – Detecting sunlight direction for panel alignment",
    ],
    metaTitle:
      "LDR Sensor: Working Principle, Circuit & Arduino Projects | Photoresistor Guide",
    metaDescription:
      "Complete LDR (Light Dependent Resistor) tutorial: working principle, Arduino interfacing, voltage divider circuit, and automatic lighting projects.",
    keywords: [
      "LDR sensor",
      "light dependent resistor",
      "photoresistor",
      "LDR Arduino",
      "light sensor",
      "automatic street light",
      "LDR circuit",
      "photoresistor working",
      "light sensing circuit",
    ],
  },
  // ============= NEW SENSORS - Waiting for images and articles =============
  {
    id: 6,
    name: "Accelerometer",
    description: "Measures acceleration and tilt in three axes (X, Y, Z)",
    image: accelerometerImg,
    type: "Motion Sensor",
    shortDescription:
      "An accelerometer is a sensor that measures acceleration forces in three axes. Commonly used in smartphones, gaming controllers, and robotics for motion detection and orientation sensing.",
    workingPrinciple: `<p>Accelerometer measures proper acceleration using micro-electromechanical systems (MEMS). When the sensor moves, internal capacitive plates shift, changing capacitance which is then converted to acceleration values.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, SCL (I2C Clock), SDA (I2C Data), INT (Interrupt)</p>`,
    useCases: [
      "📱 Smartphones – Screen rotation and motion gestures",
      "🎮 Gaming Controllers – Motion sensing",
      "🤖 Robotics – Balance and motion detection",
      "🚗 Vehicle Safety – Airbag deployment systems",
      "⌚ Wearables – Step counting and activity tracking",
    ],
    metaTitle: "Accelerometer Sensor: Working Principle & Arduino Projects",
    metaDescription:
      "Complete accelerometer guide: MEMS technology, 3-axis motion sensing, Arduino interfacing, and robotics applications.",
    keywords: [
      "accelerometer",
      "3-axis sensor",
      "motion sensor",
      "MEMS accelerometer",
      "tilt sensor",
    ],
  },
  {
    id: 7,
    name: "Gyroscope",
    description: "Measures angular velocity and rotation rate",
    image: gyroscopeImg,
    type: "Motion Sensor",
    shortDescription:
      "A gyroscope sensor measures the rate of rotation around three axes. Essential for drones, smartphones, and navigation systems requiring precise orientation tracking.",
    workingPrinciple: `<p>Gyroscope uses the Coriolis effect in MEMS structure. When the sensor rotates, vibrating masses experience Coriolis force, which is measured to determine angular velocity.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, SCL, SDA, INT (similar to accelerometer)</p>`,
    useCases: [
      "🚁 Drones – Flight stabilization",
      "📱 Smartphones – Orientation tracking",
      "🎮 VR/AR Devices – Head tracking",
      "🤖 Robotics – Balance control",
      "✈️ Aviation – Navigation systems",
    ],
    metaTitle: "Gyroscope Sensor: Angular Velocity Measurement & Applications",
    metaDescription:
      "Learn gyroscope working principle, Coriolis effect, Arduino interfacing, and drone stabilization projects.",
    keywords: [
      "gyroscope",
      "angular velocity",
      "rotation sensor",
      "IMU sensor",
      "drone stabilization",
    ],
  },
  {
    id: 8,
    name: "Proximity Sensor",
    description: "Detects presence of nearby objects without physical contact",
    image: proximityImg,
    type: "Distance Sensor",
    shortDescription:
      "Proximity sensors detect the presence or absence of objects within a certain range without physical contact. Used in smartphones, industrial automation, and touchless switches.",
    workingPrinciple: `<p>Works using infrared, ultrasonic, or capacitive methods. IR proximity sensors emit infrared light and detect reflection from nearby objects.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, OUT (digital output)</p>`,
    useCases: [
      "📱 Smartphones – Screen auto-off during calls",
      "🏭 Industrial Automation – Object detection on conveyor belts",
      "🚗 Automotive – Parking assistance",
      "🏠 Smart Home – Touchless switches",
      "📦 Logistics – Package counting",
    ],
    metaTitle: "Proximity Sensor: Types, Working & Industrial Applications",
    metaDescription:
      "Complete proximity sensor guide: IR, ultrasonic, capacitive types, Arduino interfacing, and automation projects.",
    keywords: [
      "proximity sensor",
      "IR sensor",
      "object detection",
      "touchless sensor",
      "industrial sensor",
    ],
  },
  {
    id: 9,
    name: "Magnetometer",
    description: "Measures magnetic field strength and direction",
    image: magnetometerImg,
    type: "Magnetic Sensor",
    shortDescription:
      "A magnetometer measures the strength and direction of magnetic fields. Used in compasses, metal detectors, and navigation systems.",
    workingPrinciple: `<p>Uses Hall effect or magneto-resistive technology to detect magnetic fields. Changes in magnetic field alter electrical resistance or voltage output.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, SCL, SDA (I2C communication)</p>`,
    useCases: [
      "🧭 Digital Compass – Navigation and direction finding",
      "🔍 Metal Detectors – Security and treasure hunting",
      "🚁 Drones – Heading control",
      "📱 Smartphones – Location services",
      "🔬 Scientific Research – Magnetic field measurement",
    ],
    metaTitle: "Magnetometer Sensor: Digital Compass & Navigation Guide",
    metaDescription:
      "Learn magnetometer working, Hall effect, Arduino compass projects, and magnetic field measurement techniques.",
    keywords: [
      "magnetometer",
      "digital compass",
      "magnetic field sensor",
      "Hall effect sensor",
      "navigation sensor",
    ],
  },
  {
    id: 10,
    name: "Barometer",
    description: "Measures atmospheric pressure",
    image: barometerImg,
    type: "Pressure Sensor",
    shortDescription:
      "A barometer measures atmospheric pressure, used for weather prediction, altitude measurement, and environmental monitoring.",
    workingPrinciple: `<p>Uses piezo-resistive or capacitive MEMS technology. Changes in atmospheric pressure cause deflection in sensor membrane, changing electrical output.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, SCL, SDA (I2C)</p>`,
    useCases: [
      "🌦️ Weather Stations – Pressure monitoring and forecasting",
      "✈️ Aviation – Altitude measurement",
      "⌚ Smartwatches – Elevation tracking",
      "🏔️ Outdoor Activities – Weather prediction",
      "🌱 Agriculture – Environmental monitoring",
    ],
    metaTitle: "Barometer Sensor: Atmospheric Pressure & Altitude Measurement",
    metaDescription:
      "Complete barometer guide: pressure measurement, altitude calculation, weather forecasting, and Arduino projects.",
    keywords: [
      "barometer",
      "pressure sensor",
      "atmospheric pressure",
      "altitude sensor",
      "weather station",
    ],
  },
  {
    id: 11,
    name: "Infrared (IR) Sensor",
    description:
      "Detects infrared radiation for object detection and temperature",
    image: irImg,
    type: "Optical Sensor",
    shortDescription:
      "Infrared sensors detect infrared radiation emitted by objects. Used in remote controls, night vision, temperature measurement, and motion detection.",
    workingPrinciple: `<p>IR sensors contain photodiode or phototransistor that responds to infrared wavelengths (700nm-1mm). Can be active (emit IR) or passive (detect ambient IR).</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, OUT (analog or digital)</p>`,
    useCases: [
      "📺 Remote Controls – TV and appliance control",
      "🤖 Robotics – Obstacle detection and line following",
      "🌡️ Temperature Measurement – Non-contact thermometers",
      "🔒 Security Systems – Motion detection",
      "🏭 Industrial – Proximity sensing",
    ],
    metaTitle:
      "IR Sensor: Infrared Detection, Remote Control & Arduino Projects",
    metaDescription:
      "Learn IR sensor working, active vs passive types, Arduino interfacing, and robotics obstacle avoidance projects.",
    keywords: [
      "IR sensor",
      "infrared sensor",
      "remote control",
      "obstacle detection",
      "line follower robot",
    ],
  },
  {
    id: 12,
    name: "Pressure Sensor",
    description: "Measures force per unit area in gases or liquids",
    image: pressureSensorImg,
    type: "Pressure Sensor",
    shortDescription:
      "Pressure sensors measure the force exerted by gases or liquids. Used in automotive, medical devices, industrial control, and weather monitoring.",
    workingPrinciple: `<p>Uses piezo-resistive, capacitive, or strain gauge technology. Applied pressure causes mechanical deformation, changing electrical properties.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, VOUT (analog output), or I2C/SPI interface</p>`,
    useCases: [
      "🚗 Automotive – Tire pressure monitoring, engine control",
      "🏥 Medical – Blood pressure monitors, ventilators",
      "🏭 Industrial – Process control and monitoring",
      "✈️ Aviation – Altitude and airspeed measurement",
      "🌊 Marine – Depth measurement",
    ],
    metaTitle: "Pressure Sensor: Types, Working & Industrial Applications",
    metaDescription:
      "Complete pressure sensor guide: piezo-resistive, capacitive types, Arduino interfacing, and industrial automation.",
    keywords: [
      "pressure sensor",
      "force sensor",
      "piezo sensor",
      "tire pressure",
      "industrial sensor",
    ],
  },
  {
    id: 13,
    name: "GPS Sensor",
    description: "Determines geographic location using satellite signals",
    image: gpsImg,
    type: "Location Sensor",
    shortDescription:
      "GPS (Global Positioning System) sensors receive signals from satellites to determine precise geographic location, velocity, and time. Essential for navigation and tracking.",
    workingPrinciple: `<p>Receives signals from multiple GPS satellites. By calculating signal travel time from at least 4 satellites, it triangulates position with latitude, longitude, and altitude.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, TX (UART transmit), RX (UART receive), PPS (pulse per second)</p>`,
    useCases: [
      "📱 Navigation Apps – Google Maps, vehicle navigation",
      "📦 Asset Tracking – Fleet management, shipping",
      "🚁 Drones – Autonomous flight and waypoint navigation",
      "⌚ Fitness Trackers – Route mapping",
      "🚜 Agriculture – Precision farming",
    ],
    metaTitle: "GPS Sensor: Location Tracking, Navigation & Arduino Projects",
    metaDescription:
      "Learn GPS working principle, satellite triangulation, Arduino interfacing, and vehicle tracking projects.",
    keywords: [
      "GPS sensor",
      "location sensor",
      "navigation",
      "GPS module",
      "satellite tracking",
    ],
  },
  {
    id: 14,
    name: "Heart Rate Sensor",
    description: "Measures heart beat rate using optical or electrical methods",
    image: heartRateImg,
    type: "Biometric Sensor",
    shortDescription:
      "Heart rate sensors measure pulse rate using photoplethysmography (PPG) or electrocardiography (ECG). Used in fitness trackers, medical devices, and health monitoring.",
    workingPrinciple: `<p>PPG method: LED shines light through skin, photodetector measures blood volume changes with each heartbeat. ECG method: measures electrical activity of the heart.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, OUT (analog signal)</p>`,
    useCases: [
      "⌚ Fitness Trackers – Continuous heart rate monitoring",
      "🏥 Medical Devices – Patient monitoring",
      "💪 Gym Equipment – Workout intensity tracking",
      "📱 Health Apps – Wellness monitoring",
      "🧘 Stress Management – Relaxation tracking",
    ],
    metaTitle: "Heart Rate Sensor: PPG Technology & Fitness Monitoring",
    metaDescription:
      "Complete heart rate sensor guide: PPG vs ECG, Arduino interfacing, and health monitoring projects.",
    keywords: [
      "heart rate sensor",
      "pulse sensor",
      "PPG sensor",
      "fitness tracker",
      "biometric sensor",
    ],
  },
  {
    id: 15,
    name: "Blood Pressure Sensor",
    description: "Measures blood pressure using oscillometric method",
    image: bloodPressureImg,
    type: "Medical Sensor",
    shortDescription:
      "Blood pressure sensors measure systolic and diastolic blood pressure. Used in medical devices, health monitoring systems, and telemedicine applications.",
    workingPrinciple: `<p>Oscillometric method: inflatable cuff compresses artery, pressure sensor detects oscillations in arterial wall as cuff deflates to determine systolic and diastolic pressure.</p>`,
    pinDiagram: `<p>Complex system with pressure transducer, pump, valve, and microcontroller</p>`,
    useCases: [
      "🏥 Medical Devices – Digital blood pressure monitors",
      "📱 Telehealth – Remote patient monitoring",
      "🏠 Home Healthcare – Personal health tracking",
      "⌚ Smartwatches – Continuous BP monitoring",
      "🧪 Clinical Research – Health studies",
    ],
    metaTitle:
      "Blood Pressure Sensor: Oscillometric Method & Medical Applications",
    metaDescription:
      "Learn blood pressure measurement, oscillometric method, sensor technology, and healthcare monitoring.",
    keywords: [
      "blood pressure sensor",
      "oscillometric sensor",
      "medical sensor",
      "health monitoring",
      "BP monitor",
    ],
  },
  {
    id: 16,
    name: "Touch Sensor",
    description: "Detects touch or proximity using capacitive technology",
    image: touchImg,
    type: "Input Sensor",
    shortDescription:
      "Touch sensors detect physical touch or proximity using capacitive, resistive, or piezoelectric technology. Used in smartphones, appliances, and interactive displays.",
    workingPrinciple: `<p>Capacitive touch: human body acts as conductor, touching sensor changes capacitance. Controller detects this change and registers touch event.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, OUT (digital output when touched)</p>`,
    useCases: [
      "📱 Smartphones – Touchscreen displays",
      "🏠 Smart Home – Touch switches and dimmers",
      "🍳 Kitchen Appliances – Touch controls",
      "💻 Laptops – Touchpads",
      "🎨 Interactive Displays – Kiosks and exhibits",
    ],
    metaTitle: "Touch Sensor: Capacitive Technology & Interactive Applications",
    metaDescription:
      "Complete touch sensor guide: capacitive vs resistive, Arduino interfacing, and touchscreen projects.",
    keywords: [
      "touch sensor",
      "capacitive sensor",
      "touchscreen",
      "touch switch",
      "interactive sensor",
    ],
  },
  {
    id: 17,
    name: "Sound Sensor",
    description: "Detects sound waves and measures sound intensity",
    image: soundSensorImg,
    type: "Audio Sensor",
    shortDescription:
      "Sound sensors detect sound waves and convert them to electrical signals. Used in voice recognition, noise monitoring, and sound-activated systems.",
    workingPrinciple: `<p>Microphone (electret or MEMS) converts sound pressure waves into electrical signals. Amplifier circuit strengthens signal for processing by microcontroller.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, AO (analog output), DO (digital output with threshold)</p>`,
    useCases: [
      "🎤 Voice Recognition – Smart assistants",
      "👏 Sound Activation – Clap switches",
      "🏭 Noise Monitoring – Industrial safety",
      "🎵 Music Reactive – LED displays",
      "🔒 Security – Glass break detection",
    ],
    metaTitle: "Sound Sensor: Audio Detection & Voice Recognition Projects",
    metaDescription:
      "Learn sound sensor working, microphone types, Arduino interfacing, and voice-controlled projects.",
    keywords: [
      "sound sensor",
      "microphone sensor",
      "audio sensor",
      "voice recognition",
      "clap switch",
    ],
  },
  {
    id: 18,
    name: "Gas Sensor",
    description: "Detects various gases like CO, CO2, methane, smoke",
    image: gasImg,
    type: "Chemical Sensor",
    shortDescription:
      "Gas sensors detect the presence and concentration of various gases in the air. Used in safety systems, air quality monitoring, and industrial applications.",
    workingPrinciple: `<p>Metal oxide semiconductor (MOS) changes resistance when exposed to target gases. Different materials detect different gases (SnO2 for CO, CH4).</p>`,
    pinDiagram: `<p>Typical pins: VCC (heater), GND, VCC (circuit), AO (analog output), DO (digital output)</p>`,
    useCases: [
      "🏠 Home Safety – Gas leak detection",
      "🏭 Industrial – Hazardous gas monitoring",
      "🌍 Air Quality – Pollution monitoring",
      "🔥 Fire Safety – Smoke and CO detection",
      "🚗 Automotive – Exhaust gas analysis",
    ],
    metaTitle: "Gas Sensor: MQ Series, CO/CO2 Detection & Safety Applications",
    metaDescription:
      "Complete gas sensor guide: MQ-2, MQ-135, working principle, Arduino interfacing, and air quality monitoring.",
    keywords: [
      "gas sensor",
      "MQ sensor",
      "CO sensor",
      "air quality",
      "smoke detector",
    ],
  },
  {
    id: 19,
    name: "Image Sensor",
    description: "Captures visual images using CCD or CMOS technology",
    image: imageImg,
    type: "Vision Sensor",
    shortDescription:
      "Image sensors convert optical images into electronic signals. Used in cameras, smartphones, security systems, and machine vision applications.",
    workingPrinciple: `<p>CMOS or CCD sensors contain millions of light-sensitive pixels. Each pixel converts photons to electrons, creating digital image data.</p>`,
    pinDiagram: `<p>Complex interface: Power pins, I2C/SPI for control, parallel or MIPI CSI for data</p>`,
    useCases: [
      "📷 Digital Cameras – Photography",
      "📱 Smartphones – Mobile photography",
      "🔒 Security – CCTV and surveillance",
      "🤖 Robotics – Computer vision",
      "🚗 Automotive – Backup cameras, ADAS",
    ],
    metaTitle: "Image Sensor: CMOS vs CCD Technology & Camera Applications",
    metaDescription:
      "Learn image sensor technology, CMOS vs CCD comparison, megapixels, and camera interfacing.",
    keywords: [
      "image sensor",
      "CMOS sensor",
      "CCD sensor",
      "camera sensor",
      "computer vision",
    ],
  },
  {
    id: 20,
    name: "Color Sensor",
    description: "Detects and identifies colors using RGB values",
    image: colorImg,
    type: "Optical Sensor",
    shortDescription:
      "Color sensors detect and differentiate colors by measuring reflected light intensity in RGB wavelengths. Used in sorting, quality control, and robotics.",
    workingPrinciple: `<p>White LED illuminates object, photodiodes with RGB filters measure reflected light intensity at different wavelengths to determine color.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, SCL, SDA (I2C), LED control</p>`,
    useCases: [
      "🏭 Manufacturing – Product sorting and quality control",
      "🤖 Robotics – Color-based navigation",
      "🎨 Color Matching – Paint and textile industry",
      "📦 Packaging – Label verification",
      "🔬 Lab Equipment – Chemical analysis",
    ],
    metaTitle: "Color Sensor: RGB Detection & Sorting Applications",
    metaDescription:
      "Complete color sensor guide: TCS3200, RGB detection, Arduino interfacing, and color sorting projects.",
    keywords: [
      "color sensor",
      "RGB sensor",
      "TCS3200",
      "color detection",
      "sorting sensor",
    ],
  },
  {
    id: 21,
    name: "Smoke Sensor",
    description: "Detects smoke particles for fire safety systems",
    image: smokeImg,
    type: "Safety Sensor",
    shortDescription:
      "Smoke sensors detect smoke particles in the air using optical or ionization methods. Critical component in fire alarm systems and safety equipment.",
    workingPrinciple: `<p>Optical smoke detector: LED beam in sensing chamber. Smoke particles scatter light to photodetector, triggering alarm when threshold exceeded.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, DOUT (digital alarm output), AOUT (analog smoke level)</p>`,
    useCases: [
      "🏠 Home Safety – Fire alarm systems",
      "🏢 Commercial Buildings – Fire detection",
      "🏭 Industrial – Process safety",
      "🚗 Vehicles – Engine compartment monitoring",
      "🏨 Hotels – Room safety systems",
    ],
    metaTitle: "Smoke Sensor: Fire Detection & Safety Alarm Systems",
    metaDescription:
      "Learn smoke detector working, optical vs ionization types, Arduino fire alarm projects.",
    keywords: [
      "smoke sensor",
      "fire detector",
      "smoke alarm",
      "fire safety",
      "optical smoke detector",
    ],
  },
  {
    id: 22,
    name: "Moisture Sensor",
    description: "Measures moisture content in soil or materials",
    image: moistureImg,
    type: "Environmental Sensor",
    shortDescription:
      "Moisture sensors measure water content in soil, wood, or other materials. Used in agriculture, gardening, and building maintenance.",
    workingPrinciple: `<p>Resistive or capacitive method: measures electrical resistance/capacitance between probes which varies with moisture content.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, AO (analog moisture level), DO (digital threshold)</p>`,
    useCases: [
      "🌱 Smart Gardening – Automated irrigation",
      "🚜 Agriculture – Precision farming",
      "🏠 Building Maintenance – Leak detection",
      "🌾 Greenhouse – Environment control",
      "💧 Water Management – Irrigation optimization",
    ],
    metaTitle: "Soil Moisture Sensor: Arduino Smart Irrigation & Gardening",
    metaDescription:
      "Complete moisture sensor guide: resistive vs capacitive, Arduino interfacing, automatic watering projects.",
    keywords: [
      "moisture sensor",
      "soil sensor",
      "humidity sensor",
      "irrigation sensor",
      "plant monitoring",
    ],
  },
  {
    id: 23,
    name: "Vibration Sensor",
    description: "Detects vibration, shock, and mechanical movement",
    image: vibrationImg,
    type: "Motion Sensor",
    shortDescription:
      "Vibration sensors detect mechanical vibrations, shocks, and oscillations. Used in machinery monitoring, security systems, and structural health monitoring.",
    workingPrinciple: `<p>Piezoelectric element generates voltage when subjected to mechanical stress/vibration. Accelerometer-based sensors measure acceleration in multiple axes.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, OUT (digital pulse or analog signal)</p>`,
    useCases: [
      "🏭 Predictive Maintenance – Machine condition monitoring",
      "🔒 Security – Vibration alarms",
      "🏗️ Structural Health – Building and bridge monitoring",
      "🚂 Transportation – Rail condition monitoring",
      "🏢 Earthquake Detection – Seismic monitoring",
    ],
    metaTitle: "Vibration Sensor: Piezoelectric Detection & Monitoring",
    metaDescription:
      "Learn vibration sensor working, piezoelectric technology, Arduino interfacing, and machine monitoring.",
    keywords: [
      "vibration sensor",
      "shock sensor",
      "piezo sensor",
      "machinery monitoring",
      "earthquake sensor",
    ],
  },
  {
    id: 24,
    name: "Tilt Sensor",
    description: "Detects orientation and angular position changes",
    image: tiltImg,
    type: "Position Sensor",
    shortDescription:
      "Tilt sensors detect orientation changes and angular position. Used in gaming, robotics, leveling systems, and safety devices.",
    workingPrinciple: `<p>Ball-type: conductive ball moves with tilt, making/breaking electrical contact. MEMS-type: uses accelerometer to measure gravity direction.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, OUT (digital state change)</p>`,
    useCases: [
      "🏗️ Construction – Digital levels and inclinometers",
      "🤖 Robotics – Balance and orientation",
      "🎮 Gaming – Motion controllers",
      "🚗 Automotive – Rollover detection",
      "📱 Smartphones – Screen rotation",
    ],
    metaTitle: "Tilt Sensor: Angular Position Detection & Applications",
    metaDescription:
      "Complete tilt sensor guide: ball-type vs MEMS, Arduino interfacing, and orientation detection projects.",
    keywords: [
      "tilt sensor",
      "inclinometer",
      "angle sensor",
      "orientation sensor",
      "digital level",
    ],
  },
  {
    id: 25,
    name: "Weight Sensor (Load Cell)",
    description: "Measures weight and force using strain gauge technology",
    image: weightImg,
    type: "Force Sensor",
    shortDescription:
      "Weight sensors (load cells) measure weight and force using strain gauge technology. Used in scales, industrial weighing, and force measurement applications.",
    workingPrinciple: `<p>Strain gauges attached to metal beam change resistance when deformed by applied load. Wheatstone bridge circuit converts resistance change to voltage proportional to weight.</p>`,
    pinDiagram: `<p>4 wires: E+ (excitation+), E- (excitation-), S+ (signal+), S- (signal-). Requires HX711 or similar amplifier.</p>`,
    useCases: [
      "⚖️ Digital Scales – Kitchen, bathroom, industrial scales",
      "🏭 Industrial – Material weighing and batching",
      "🚛 Transportation – Truck weight stations",
      "🏥 Medical – Patient weighing",
      "🤖 Robotics – Gripper force sensing",
    ],
    metaTitle: "Load Cell Sensor: Weight Measurement & HX711 Arduino Guide",
    metaDescription:
      "Learn load cell working, strain gauge technology, HX711 amplifier interfacing, and digital scale projects.",
    keywords: [
      "load cell",
      "weight sensor",
      "strain gauge",
      "HX711",
      "force sensor",
    ],
  },
  {
    id: 26,
    name: "Force Sensor (FSR)",
    description: "Measures applied force and pressure",
    image: forceImg,
    type: "Pressure Sensor",
    shortDescription:
      "Force Sensitive Resistors (FSR) change resistance based on applied force. Used in touch interfaces, robotics, and pressure-sensitive applications.",
    workingPrinciple: `<p>Polymer thick film device with resistance that decreases when force is applied. Contains conductive particles that make better contact under pressure.</p>`,
    pinDiagram: `<p>2 terminals (resistor-like), typically connected in voltage divider circuit</p>`,
    useCases: [
      "🤖 Robotics – Gripper force feedback",
      "🎮 Gaming – Pressure-sensitive controllers",
      "🎹 Musical Instruments – Electronic drums",
      "🏥 Medical – Pressure mapping",
      "👟 Wearables – Footstep detection",
    ],
    metaTitle: "FSR Force Sensor: Pressure Detection & Robotics Applications",
    metaDescription:
      "Complete FSR guide: force-sensitive resistor working, Arduino interfacing, and touch pressure projects.",
    keywords: [
      "FSR",
      "force sensor",
      "pressure sensor",
      "force sensitive resistor",
      "touch sensor",
    ],
  },
  {
    id: 27,
    name: "Capacitive Sensor",
    description: "Detects changes in capacitance for proximity and touch",
    image: capacitiveImg,
    type: "Proximity Sensor",
    shortDescription:
      "Capacitive sensors detect changes in electrical capacitance caused by proximity or touch. Used in touchscreens, proximity detection, and liquid level sensing.",
    workingPrinciple: `<p>Measures capacitance of sensor electrode. When conductive object (like finger) approaches, capacitance increases. Controller detects this change.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, OUT (digital or analog), electrode connection</p>`,
    useCases: [
      "📱 Touchscreens – Capacitive touch displays",
      "🏠 Smart Home – Touch switches and dimmers",
      "🍼 Liquid Level – Non-contact level sensing",
      "🏭 Industrial – Proximity detection",
      "🎨 Interactive Art – Touch-sensitive installations",
    ],
    metaTitle: "Capacitive Sensor: Touch & Proximity Detection Technology",
    metaDescription:
      "Learn capacitive sensing, touch detection, Arduino interfacing, and touchscreen technology.",
    keywords: [
      "capacitive sensor",
      "touch sensor",
      "proximity sensor",
      "capacitive touch",
      "liquid level sensor",
    ],
  },
  {
    id: 28,
    name: "Hall Effect Sensor",
    description: "Detects magnetic fields for position and speed sensing",
    image: hallEffectImg,
    type: "Magnetic Sensor",
    shortDescription:
      "Hall effect sensors detect the presence and strength of magnetic fields. Used in position sensing, speed measurement, and current sensing applications.",
    workingPrinciple: `<p>Based on Hall effect: voltage generated perpendicular to current flow when placed in magnetic field. Output voltage proportional to field strength.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, OUT (analog voltage or digital switch)</p>`,
    useCases: [
      "🚗 Automotive – Speed sensors, position sensors",
      "🏭 Industrial – Proximity switches",
      "💾 Electronics – DC motor speed control",
      "🔌 Power Systems – Current sensing",
      "🚪 Security – Door/window sensors",
    ],
    metaTitle: "Hall Effect Sensor: Magnetic Field Detection & Speed Sensing",
    metaDescription:
      "Complete Hall sensor guide: Hall effect principle, Arduino interfacing, and magnetic sensing projects.",
    keywords: [
      "Hall effect sensor",
      "magnetic sensor",
      "speed sensor",
      "position sensor",
      "current sensor",
    ],
  },
  {
    id: 29,
    name: "Biometric Sensor",
    description: "Identifies individuals using biological characteristics",
    image: biometricImg,
    type: "Security Sensor",
    shortDescription:
      "Biometric sensors identify individuals based on unique biological characteristics like fingerprints, iris, face, or voice. Used in security and authentication systems.",
    workingPrinciple: `<p>Captures biological data (fingerprint ridge patterns, facial features, iris patterns), converts to digital template, compares with stored templates for authentication.</p>`,
    pinDiagram: `<p>Complex modules with UART, SPI, or USB communication. Power, ground, data pins.</p>`,
    useCases: [
      "🔒 Access Control – Building and device security",
      "📱 Smartphones – Device unlock",
      "🏦 Banking – ATM authentication",
      "✈️ Border Control – Passport verification",
      "⏱️ Time Attendance – Employee tracking",
    ],
    metaTitle: "Biometric Sensor: Fingerprint, Face & Iris Recognition",
    metaDescription:
      "Learn biometric authentication, fingerprint sensors, face recognition, Arduino interfacing, and security systems.",
    keywords: [
      "biometric sensor",
      "fingerprint sensor",
      "face recognition",
      "iris scanner",
      "authentication",
    ],
  },
  {
    id: 30,
    name: "Facial Recognition Sensor",
    description: "Identifies individuals by analyzing facial features",
    image: faceRecognitionImg,
    type: "Vision Sensor",
    shortDescription:
      "Facial recognition sensors use AI and image processing to identify individuals based on facial features. Used in security, attendance, and personalized services.",
    workingPrinciple: `<p>Camera captures face image, AI algorithms extract facial landmarks, create unique face template, compare with database for identification.</p>`,
    pinDiagram: `<p>Typically camera module with USB, Ethernet, or UART interface</p>`,
    useCases: [
      "🔒 Security – Access control systems",
      "📱 Smartphones – Face unlock",
      "⏱️ Attendance – Touchless check-in",
      "🏪 Retail – Customer recognition",
      "🚔 Law Enforcement – Suspect identification",
    ],
    metaTitle: "Facial Recognition: AI Face Detection & Security Systems",
    metaDescription:
      "Complete facial recognition guide: AI algorithms, camera modules, security applications, and privacy considerations.",
    keywords: [
      "facial recognition",
      "face detection",
      "AI vision",
      "biometric authentication",
      "face ID",
    ],
  },
  {
    id: 32,
    name: "Oxygen Sensor",
    description: "Measures oxygen concentration in gases or liquids",
    image: oxygenImg,
    type: "Chemical Sensor",
    shortDescription:
      "Oxygen sensors measure O2 concentration in air, exhaust gases, or liquids. Used in medical devices, automotive, and environmental monitoring.",
    workingPrinciple: `<p>Electrochemical or optical method. Electrochemical: oxygen reacts at cathode producing current proportional to O2 concentration.</p>`,
    pinDiagram: `<p>Typical pins: Power, Ground, analog output (voltage/current)</p>`,
    useCases: [
      "🚗 Automotive – Engine air-fuel ratio control",
      "🏥 Medical – Pulse oximeters, ventilators",
      "🏭 Industrial – Process control",
      "🌍 Environmental – Air quality monitoring",
      "🐠 Aquariums – Dissolved oxygen measurement",
    ],
    metaTitle: "Oxygen Sensor: O2 Measurement for Automotive & Medical",
    metaDescription:
      "Complete O2 sensor guide: electrochemical principles, lambda sensors, medical applications, and Arduino interfacing.",
    keywords: [
      "oxygen sensor",
      "O2 sensor",
      "lambda sensor",
      "air fuel ratio",
      "pulse oximeter",
    ],
  },
  {
    id: 33,
    name: "Carbon Monoxide (CO) Sensor",
    description: "Detects deadly carbon monoxide gas",
    image: coImg,
    type: "Safety Sensor",
    shortDescription:
      "CO sensors detect carbon monoxide, a colorless, odorless toxic gas. Critical safety device for homes, vehicles, and industrial spaces.",
    workingPrinciple: `<p>Electrochemical or metal oxide semiconductor. Electrochemical: CO oxidizes at electrode, producing current proportional to CO concentration.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, AOUT (CO level), DOUT (alarm threshold)</p>`,
    useCases: [
      "🏠 Home Safety – CO detectors",
      "🚗 Vehicles – Cabin air quality",
      "🏭 Industrial – Worker safety",
      "🚒 Fire Safety – Firefighter equipment",
      "🔥 Heating Systems – Furnace monitoring",
    ],
    metaTitle: "CO Sensor: Carbon Monoxide Detection & Safety Alarms",
    metaDescription:
      "Learn CO sensor working, electrochemical detection, Arduino gas alarm projects, and home safety systems.",
    keywords: [
      "carbon monoxide sensor",
      "CO sensor",
      "CO detector",
      "gas sensor",
      "safety alarm",
    ],
  },
  {
    id: 34,
    name: "Radiation Sensor (Geiger Counter)",
    description: "Detects ionizing radiation",
    image: radiationImg,
    type: "Safety Sensor",
    shortDescription:
      "Radiation sensors detect alpha, beta, gamma, and X-ray radiation. Used in nuclear safety, medical imaging, and environmental monitoring.",
    workingPrinciple: `<p>Geiger-Müller tube: radiation ionizes gas inside tube, creating electrical pulse. Pulse count indicates radiation level.</p>`,
    pinDiagram: `<p>High voltage supply (400V+), pulse output, requires special handling</p>`,
    useCases: [
      "☢️ Nuclear Safety – Radiation monitoring",
      "🏥 Medical – Radiation therapy monitoring",
      "🌍 Environmental – Background radiation measurement",
      "🔬 Research Labs – Isotope detection",
      "🏭 Industrial – Non-destructive testing",
    ],
    metaTitle: "Geiger Counter: Radiation Detection & Nuclear Safety",
    metaDescription:
      "Learn Geiger-Müller tube working, radiation types, safety monitoring, and DIY radiation detector projects.",
    keywords: [
      "radiation sensor",
      "Geiger counter",
      "radiation detector",
      "nuclear sensor",
      "ionizing radiation",
    ],
  },
  {
    id: 35,
    name: "Flame Sensor",
    description: "Detects presence of fire using IR radiation",
    image: flameImg,
    type: "Safety Sensor",
    shortDescription:
      "Flame sensors detect infrared radiation emitted by flames. Used in fire detection, safety systems, and firefighting robots.",
    workingPrinciple: `<p>IR phototransistor detects infrared radiation (wavelength 760-1100nm) emitted by flames. Output goes high when flame detected within range.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, DO (digital flame detected), AO (analog flame intensity)</p>`,
    useCases: [
      "🔥 Fire Detection – Early warning systems",
      "🤖 Firefighting Robots – Autonomous fire detection",
      "🏭 Industrial – Burner monitoring",
      "🏠 Home Safety – Fire alarms",
      "⛽ Petrochemical – Flame monitoring",
    ],
    metaTitle: "Flame Sensor: IR Fire Detection & Safety Systems",
    metaDescription:
      "Complete flame sensor guide: IR detection, Arduino fire alarm projects, and firefighting robot applications.",
    keywords: [
      "flame sensor",
      "fire sensor",
      "IR flame detector",
      "fire alarm",
      "firefighting robot",
    ],
  },
  {
    id: 37,
    name: "Magnetic Field Sensor",
    description: "Detects and measures magnetic field intensity",
    image: magneticFieldImg,
    type: "Magnetic Sensor",
    shortDescription:
      "Magnetic field sensors measure magnetic flux density. Used in compasses, metal detection, current sensing, and position measurement.",
    workingPrinciple: `<p>Hall effect or magneto-resistive technology. Magnetic field causes voltage change (Hall) or resistance change (AMR/GMR) proportional to field strength.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, VOUT (analog field strength) or I2C interface</p>`,
    useCases: [
      "🧭 Navigation – Digital compass",
      "🔍 Metal Detection – Security screening",
      "🔌 Current Sensing – Power monitoring",
      "🏭 Industrial – Position detection",
      "🔬 Research – Magnetic field mapping",
    ],
    metaTitle: "Magnetic Field Sensor: Gauss Meter & Magnetometer Guide",
    metaDescription:
      "Complete magnetic sensor guide: Hall effect, magnetoresistive technology, Arduino compass projects.",
    keywords: [
      "magnetic field sensor",
      "magnetometer",
      "gauss meter",
      "Hall sensor",
      "flux density",
    ],
  },
  {
    id: 38,
    name: "Ambient Light Sensor",
    description: "Measures surrounding light intensity",
    image: ambientLightImg,
    type: "Optical Sensor",
    shortDescription:
      "Ambient light sensors measure visible light intensity in lux. Used in smartphones, displays, and smart lighting for automatic brightness adjustment.",
    workingPrinciple: `<p>Photodiode with human eye response filter measures light intensity. Output current or voltage proportional to illuminance in lux.</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, SCL, SDA (I2C), or analog output</p>`,
    useCases: [
      "📱 Smartphones – Auto brightness control",
      "💻 Laptops – Display dimming",
      "🏠 Smart Lighting – Adaptive lighting",
      "⌚ Smartwatches – Screen optimization",
      "🏢 Building Automation – Energy saving",
    ],
    metaTitle: "Ambient Light Sensor: Lux Measurement & Auto Brightness",
    metaDescription:
      "Learn ambient light sensing, lux measurement, BH1750 sensor, Arduino interfacing, and smart lighting projects.",
    keywords: [
      "ambient light sensor",
      "lux sensor",
      "light intensity",
      "BH1750",
      "auto brightness",
    ],
  },
  {
    id: 40,
    name: "Soil Moisture Sensor",
    description: "Measures water content in soil for irrigation",
    image: soilMoistureImg,
    type: "Agricultural Sensor",
    shortDescription:
      "Soil moisture sensors measure volumetric water content in soil. Essential for smart irrigation, precision agriculture, and plant care.",
    workingPrinciple: `<p>Resistive: measures resistance between probes (high moisture = low resistance). Capacitive: measures dielectric constant of soil (better for long-term use).</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, AOUT (moisture level 0-100%), DOUT (threshold)</p>`,
    useCases: [
      "🌱 Smart Gardening – Automatic watering systems",
      "🚜 Precision Agriculture – Irrigation optimization",
      "🌾 Greenhouse – Climate control",
      "🏡 Landscaping – Water conservation",
      "🔬 Research – Soil science studies",
    ],
    metaTitle: "Soil Moisture Sensor: Smart Irrigation & Arduino Gardening",
    metaDescription:
      "Complete soil sensor guide: capacitive vs resistive, Arduino automatic watering system, and smart agriculture.",
    keywords: [
      "soil moisture sensor",
      "irrigation sensor",
      "capacitive soil sensor",
      "smart gardening",
      "plant monitoring",
    ],
  },
  {
    id: 41,
    name: "Gesture Sensor",
    description: "Detects hand gestures for touchless control",
    image: gestureImg,
    type: "Motion Sensor",
    shortDescription:
      "Gesture sensors detect hand movements and gestures in 3D space using IR or ToF technology. Enables touchless control interfaces.",
    workingPrinciple: `<p>IR emitters and detectors in multiple directions detect reflected light patterns. Algorithm interprets patterns as gestures (swipe, rotation, proximity).</p>`,
    pinDiagram: `<p>Typical pins: VCC, GND, SCL, SDA (I2C), INT (interrupt)</p>`,
    useCases: [
      "🏠 Smart Home – Touchless light control",
      "🚗 Automotive – Dashboard controls",
      "🎮 Gaming – Motion controllers",
      "💻 Computers – Touchless interfaces",
      "🤖 Robotics – Human-robot interaction",
    ],
    metaTitle: "Gesture Sensor: APDS-9960 Touchless Control & Arduino",
    metaDescription:
      "Learn gesture recognition, APDS-9960 sensor, Arduino touchless control projects, and gesture-based interfaces.",
    keywords: [
      "gesture sensor",
      "APDS-9960",
      "touchless control",
      "hand gesture",
      "motion detection",
    ],
  },
  {
    id: 42,
    name: "LiDAR Sensor",
    description: "Creates 3D maps using laser scanning",
    image: lidarImg,
    type: "Distance Sensor",
    shortDescription:
      "LiDAR (Light Detection and Ranging) sensors use laser pulses to create detailed 3D maps. Used in autonomous vehicles, drones, and robotics.",
    workingPrinciple: `<p>Rotating laser emits pulses, measures time-of-flight for reflected light. Combines distance measurements with angular position to create 3D point cloud.</p>`,
    pinDiagram: `<p>Complex interface: Power, serial/USB/Ethernet communication, motor control</p>`,
    useCases: [
      "🚗 Autonomous Vehicles – Environment mapping",
      "🚁 Drones – 3D mapping and terrain scanning",
      "🤖 Robotics – SLAM navigation",
      "🏗️ Construction – Site surveying",
      "🌳 Forestry – Tree measurement",
    ],
    metaTitle: "LiDAR Sensor: 3D Mapping, SLAM & Autonomous Navigation",
    metaDescription:
      "Complete LiDAR guide: time-of-flight technology, 3D point clouds, ROS integration, and autonomous robot projects.",
    keywords: [
      "LiDAR",
      "laser scanner",
      "3D mapping",
      "SLAM",
      "autonomous vehicle",
    ],
  },
  // Add more sensors and actuators as needed
];

const knowYourBoard = [
  {
    title: "Arduino Uno Reference",
    description: "Datasheet and pinout for Arduino Uno.",
    link: "/resources/arduino-uno.pdf",
  },
  // Add more board resources as needed
];

// Sensors and Actuators Section Component
const SensorsAndActuatorsSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSensor, setSelectedSensor] = useState<
    (typeof sensorsData)[0] | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredSensors = sensorsData.filter(
    (sensor) =>
      sensor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sensor.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sensor.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSensorClick = (sensor: (typeof sensorsData)[0]) => {
    setSelectedSensor(sensor);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="mt-8 mb-8 flex flex-col items-center px-2 sm:px-4">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
          Sensors and Actuators
        </h3>
        <div className="max-w-4xl w-full bg-white/90 rounded-xl shadow-lg border-2 border-accent/20 p-3 sm:p-4 md:p-6 hover:bg-white/95 transition-colors duration-300">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search sensors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base w-full border-2 border-accent/30 focus:border-accent rounded-lg"
            />
          </div>

          {/* Scrollable Sensors Grid */}
          <div className="max-h-[400px] sm:max-h-[500px] md:max-h-[600px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
              {filteredSensors.length > 0 ? (
                filteredSensors.map((sensor) => (
                  <Card
                    key={sensor.id}
                    className="p-3 sm:p-4 hover:shadow-xl transition-all duration-300 border-2 border-accent/20 hover:border-accent/60 group cursor-pointer"
                    onClick={() => handleSensorClick(sensor)}
                  >
                    <div className="flex gap-3 sm:gap-4">
                      {/* Sensor Image */}
                      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-lg border-2 border-accent/20 group-hover:border-accent/40 transition overflow-hidden flex items-center justify-center p-1 sm:p-2">
                        <img
                          src={sensor.image}
                          alt={sensor.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {/* Sensor Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base md:text-lg font-bold text-foreground mb-1 group-hover:text-accent transition truncate">
                          {sensor.name}
                        </h4>
                        <p className="text-xs text-accent/80 font-semibold mb-1 sm:mb-2">
                          {sensor.type}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                          {sensor.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  No sensors found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Detail Dialog */}
      {selectedSensor && (
        <SensorDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          sensor={selectedSensor}
        />
      )}
    </>
  );
};

const Resources = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col relative">
      <SEO
        title="IoT Sensors & Electronics Resources - Complete Learning Guide"
        description="Comprehensive guide to IoT sensors, actuators, Arduino boards, and electronics resources. Learn about ultrasonic sensors, DHT11, PIR motion detectors, and more with detailed tutorials, pinout diagrams, and real-world applications."
        keywords={[
          "IoT sensors",
          "Arduino sensors",
          "electronics resources",
          "sensor tutorials",
          "ultrasonic sensor HC-SR04",
          "DHT11 temperature sensor",
          "PIR motion sensor",
          "Arduino boards",
          "ESP32",
          "Raspberry Pi",
          "sensor pinout diagrams",
          "IoT projects",
          "embedded systems",
          "electronics learning",
          "sensor interfacing",
          "actuators guide",
          "microcontroller tutorials",
          "Arduino programming",
          "sensor applications",
          "robotics sensors",
        ]}
        image="/resources-og-image.jpg"
        type="website"
        category="Electronics, IoT, Education"
      />
      <Navigation />
      <main className="flex-grow relative z-20">
        <section className="relative py-16 min-h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 overflow-hidden">
          {/* Decorative background shapes */}
          <div
            className="absolute top-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-2xl -z-10 animate-pulse"
            style={{ filter: "blur(80px)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-2xl -z-10 animate-pulse"
            style={{ filter: "blur(100px)" }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <div className="mx-auto mb-12 max-w-2xl rounded-2xl bg-white/90 shadow-xl border-2 border-accent/30 p-6 flex flex-col items-center backdrop-blur-md hover:bg-white/95 transition-colors duration-300">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center drop-shadow-lg bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent animate-pulse px-4">
                Study Materials & Resources
              </h2>
              <span className="block mx-auto mt-2 w-16 sm:w-20 md:w-24 h-1 rounded-full bg-gradient-to-r from-accent via-primary to-accent opacity-80 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-8 sm:mb-10 md:mb-12 px-2 sm:px-4">
            {/* Study Material Section */}
            <div className="flex flex-col items-center h-full">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4 mt-0 w-full max-w-2xl text-center mx-auto">
                Study Material
              </h3>
              <div className="flex-1 flex flex-col justify-center w-full max-w-2xl h-full">
                {studyMaterials.map((res, idx) => (
                  <Card
                    key={idx}
                    className="p-4 sm:p-5 md:p-6 flex flex-col justify-center min-h-[280px] sm:h-[300px] md:h-[320px] w-full shadow-lg border-2 border-accent/20 hover:border-accent/60 hover:bg-white/95 transition-all duration-300 group bg-white/90 backdrop-blur-md relative overflow-hidden"
                  >
                    {/* Decorative accent shape in card */}
                    <div className="absolute -top-8 -right-8 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition -z-10" />
                    <div className="flex flex-col items-center">
                      {res.title === "Reference Books and Article" && (
                        <img
                          src={booksImg}
                          alt="Book Reference"
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mb-2 sm:mb-3 object-contain"
                        />
                      )}
                      <h4 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-accent transition text-center">
                        {res.title}
                      </h4>
                      <p className="text-muted-foreground mb-0 text-center">
                        {res.description}
                      </p>
                      <div className="w-full max-w-sm mx-auto mt-3">
                        <Select
                          onValueChange={(value) => {
                            if (value === "ece") {
                              navigate("/resources/ece");
                            }
                          }}
                        >
                          <SelectTrigger className="w-full text-xl font-semibold bg-accent/5 border-2 border-accent/30 hover:border-accent/60 transition-colors h-14 px-6">
                            <SelectValue
                              placeholder="Choose your Stream"
                              className="text-accent text-xl"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ece">ECE</SelectItem>
                            <SelectItem value="cse">CSE</SelectItem>
                            <SelectItem value="mechatronics">
                              Mechatronics
                            </SelectItem>
                            <SelectItem value="mec">MEC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            {/* Know Your Board Section */}
            <div className="flex flex-col h-full">
              <h3 className="text-2xl font-bold text-foreground mb-4 mt-0 w-full max-w-2xl text-center mx-auto">
                Know Your Board
              </h3>
              <div className="flex-1 flex flex-col justify-stretch w-full max-w-2xl mx-auto">
                <Card className="p-6 flex flex-col justify-between h-auto min-h-[320px] w-full shadow-lg border-2 border-accent/20 hover:border-accent/60 hover:bg-white/95 transition-all duration-300 group bg-white/90 backdrop-blur-md relative overflow-hidden">
                  {/* Decorative accent shape in card */}
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition -z-10" />
                  <div className="flex flex-col items-center">
                    <img
                      src={boardImg}
                      alt="Board Reference"
                      className="w-14 h-14 mb-3 object-contain"
                    />
                    <h4 className="text-xl font-bold mb-4 group-hover:text-accent transition">
                      Know Your Board
                    </h4>
                    <div className="flex flex-col items-center space-y-6 w-full">
                      <div className="flex justify-between w-full max-w-md mx-auto gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-accent">•</span>
                            <ArduinoUnoDialog />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-accent">•</span>
                            <ESP32Dialog />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-accent">•</span>
                            <ArduinoNanoDialog />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-accent">•</span>
                            <ESP8266Dialog />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-accent">•</span>
                            <STM32Dialog />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-accent">•</span>
                            <RaspberryPiPicoDialog />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Sensors and Actuators Section */}
          <SensorsAndActuatorsSection />

          {/* Sort Question Section at the bottom */}
          <div className="mt-8 flex flex-col items-center px-4">
            <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
              Sort Question
            </h3>
            <div className="max-w-2xl w-full bg-white/90 rounded-xl shadow-lg border-2 border-accent/20 p-6 flex flex-col items-center hover:bg-white/95 transition-colors duration-300">
              <p className="text-muted-foreground text-center mb-2">
                Here you can find a collection of important sort questions for
                your studies and board preparation.
              </p>
              <ul className="list-none pl-6 text-left w-full space-y-4">
                <li className="border-b border-accent/10 pb-3 hover:bg-accent/5 p-2 rounded-lg transition-colors">
                  <strong className="text-primary">
                    Q1: What is Arduino Uno?
                  </strong>
                  <br />
                  <span className="text-muted-foreground">
                    A: Arduino Uno is an open-source microcontroller board based
                    on the ATmega328P chip.
                  </span>
                </li>
                <li>
                  <strong>
                    Q2: How many digital I/O pins does Arduino Uno have?
                  </strong>
                  <br />
                  <span>
                    A: 14 digital I/O pins (of which 6 can be used as PWM
                    outputs).
                  </span>
                </li>
                <li>
                  <strong>
                    Q3: How many analog input pins are there on Arduino Uno?
                  </strong>
                  <br />
                  <span>A: 6 analog input pins (A0–A5).</span>
                </li>
                <li>
                  <strong>
                    Q4: What is the operating voltage of Arduino Uno?
                  </strong>
                  <br />
                  <span>A: 5V.</span>
                </li>
                <li>
                  <strong>Q5: Which USB connector does Arduino Uno use?</strong>
                  <br />
                  <span>A: USB Type-B connector.</span>
                </li>
                <li>
                  <strong>Q6: What is the clock speed of Arduino Uno?</strong>
                  <br />
                  <span>A: 16 MHz.</span>
                </li>
                <li>
                  <strong>Q7: How is Arduino Uno programmed?</strong>
                  <br />
                  <span>A: Using the Arduino IDE with a USB cable.</span>
                </li>
                <li>
                  <strong>
                    Q8: What is the flash memory size of Arduino Uno?
                  </strong>
                  <br />
                  <span>A: 32 KB (0.5 KB used by bootloader).</span>
                </li>
                <li>
                  <strong>
                    Q9: Which communication protocols does Arduino Uno support?
                  </strong>
                  <br />
                  <span>A: UART (Serial), I2C, and SPI.</span>
                </li>
                <li>
                  <strong>
                    Q10: Can Arduino Uno run without being connected to a PC?
                  </strong>
                  <br />
                  <span>
                    A: Yes, it can run from an external 7–12V power supply.
                  </span>
                </li>
              </ul>
            </div>
            {/* Next Button for pagination */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => navigate("/resources/questions/2")}
                className="px-8 py-3 bg-accent text-white rounded-lg font-bold shadow-lg hover:bg-accent/90 hover:transform hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center gap-2"
              >
                Next
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
