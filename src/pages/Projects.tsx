import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, ArrowRight } from "lucide-react";
import { useState } from "react";

// Import project images
import iotSensorImage from "@/assets/Project A.jpg";
import smartHomeImage from "@/assets/Project B.jpg";
import industrialImage from "@/assets/Project C.jpg";
import homeAutomationImage from "@/assets/Project D.jpg";
import servoVideo from "@/assets/Project E.mp4";

// Expandable card for Remote Heart Rate and SPO2 monitor
const HeartRateCard = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="p-6 flex flex-col items-center text-center shadow-lg h-full">
      <div className="w-full h-44 mb-4 overflow-hidden rounded">
        <img
          src={industrialImage}
          alt="Remote Heart Rate and SPO2 monitor"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <h3 className="text-xl font-bold mb-2">
        Remote Heart Rate and SPO₂ Monitor
      </h3>
      <p className="text-muted-foreground mb-2">
        Portable IoT-Based Heart & SpO₂ Monitor – Real-Time Health at Your
        Fingertips
      </p>
      {!expanded ? (
        <button
          className="mt-2 px-4 py-2 bg-accent text-white rounded font-semibold shadow hover:bg-accent/90 transition"
          onClick={() => setExpanded(true)}
        >
          Read More
        </button>
      ) : (
        <div className="w-full text-left mt-4">
          <h4 className="text-lg font-semibold mb-2">Description</h4>
          <p className="italic mb-4">
            This project is a compact, battery-powered health monitoring device
            that measures heart rate and SpO₂ levels using the MAX30102 sensor.
            The ESP32 processes the data, displays it on a 0.96" OLED screen,
            and can transmit it via Wi-Fi for remote health tracking.
          </p>
          <h4 className="text-2xl font-bold mb-2">Components Used</h4>
          <table className="w-full mb-4 border rounded-lg overflow-hidden text-sm">
            <thead>
              <tr className="bg-accent text-white">
                <th className="py-2 px-3 text-left">Component</th>
                <th className="py-2 px-3 text-left">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white even:bg-blue-50 border-b">
                <td className="font-semibold py-2 px-3">ESP32</td>
                <td className="py-2 px-3">Microcontroller with Wi-Fi</td>
              </tr>
              <tr className="bg-blue-50 even:bg-white border-b">
                <td className="font-semibold py-2 px-3">MAX30102</td>
                <td className="py-2 px-3">Heart Rate & SpO₂ Sensor</td>
              </tr>
              <tr className="bg-white even:bg-blue-50 border-b">
                <td className="font-semibold py-2 px-3">
                  0.96" OLED Display (128x64, I²C)
                </td>
                <td className="py-2 px-3">Real-time data display</td>
              </tr>
              <tr className="bg-blue-50 even:bg-white border-b">
                <td className="font-semibold py-2 px-3">
                  380 mAh Li-Po Battery + TP4056
                </td>
                <td className="py-2 px-3">Rechargeable power & charging</td>
              </tr>
              <tr className="bg-white even:bg-blue-50 border-b">
                <td className="font-semibold py-2 px-3">Zero PCB</td>
                <td className="py-2 px-3">Component mounting</td>
              </tr>
            </tbody>
          </table>
          <h4 className="text-2xl font-bold mb-2">Working Principle</h4>
          <ul className="list-disc pl-5 mb-4">
            <li>
              Sensor Measurement – MAX30102 uses infrared and red LEDs to detect
              pulse and blood oxygen level from the fingertip.
            </li>
            <li>
              Signal Processing – ESP32 reads the sensor data via I²C and
              calculates Heart Rate (BPM) & SpO₂ using algorithms.
            </li>
            <li>
              Display Output – Processed values are shown on the 0.96" OLED
              screen in real-time.
            </li>
            <li>
              Wireless Data Transmission (Optional) – ESP32 sends the readings
              over Wi-Fi to a web dashboard or cloud for remote monitoring.
            </li>
            <li>
              Portable Operation – Entire system runs on a rechargeable 380 mAh
              Li-Po battery, making it wearable and mobile.
            </li>
          </ul>
          <h4 className="text-2xl font-bold mb-2">Use Cases</h4>
          <ul className="list-disc pl-5 mb-4">
            <li>
              Personal Health Monitoring – Daily heart rate & oxygen tracking
            </li>
            <li>Remote Patient Monitoring – Doctor can view data online</li>
            <li>Fitness Applications – Real-time feedback during workouts</li>
            <li>
              Emergency Alerts – Abnormal readings can trigger
              buzzer/notification
            </li>
            <li>
              Research & IoT Projects – Perfect for healthcare IoT experiments
            </li>
          </ul>
          <button
            className="mt-2 px-4 py-2 bg-accent text-white rounded font-semibold shadow hover:bg-accent/90 transition"
            onClick={() => setExpanded(false)}
          >
            Show Less
          </button>
        </div>
      )}
    </Card>
  );
};

// Expandable card for Smart Crop Shade Automation System
const CropShadeCard = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="p-6 flex flex-col items-center text-center shadow-lg h-full">
      <div className="w-full h-44 mb-4 overflow-hidden rounded">
        <img
          src={iotSensorImage}
          alt="Smart Crop Shade Automation System"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <h3 className="text-xl font-bold mb-2">
        Smart Crop Shade Automation System
      </h3>
      <p className="text-muted-foreground mb-2">
        An automated shading system for crops that protects against excessive
        heat and rain while ensuring optimal soil moisture.
      </p>
      {!expanded ? (
        <button
          className="mt-2 px-4 py-2 bg-accent text-white rounded font-semibold shadow hover:bg-accent/90 transition"
          onClick={() => setExpanded(true)}
        >
          Read More
        </button>
      ) : (
        <div className="w-full text-left mt-4">
          <h4 className="text-lg font-semibold mb-2">Description</h4>
          <p className="italic mb-4">
            This system automates crop protection using sensors and
            microcontroller logic. It minimizes crop damage, improves water
            usage, and displays real-time environmental data for farmers.
          </p>
          <h4 className="text-2xl font-bold mb-2">Components Used</h4>
          <table className="w-full mb-4 border rounded-lg overflow-hidden text-sm">
            <thead>
              <tr className="bg-accent text-white">
                <th className="py-2 px-3 text-left">Component</th>
                <th className="py-2 px-3 text-left">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white even:bg-blue-50 border-b">
                <td className="font-semibold py-2 px-3">Arduino Uno</td>
                <td className="py-2 px-3">
                  Microcontroller for system control
                </td>
              </tr>
              <tr className="bg-blue-50 even:bg-white border-b">
                <td className="font-semibold py-2 px-3">
                  16×2 I2C LCD Display
                </td>
                <td className="py-2 px-3">Real-time status display</td>
              </tr>
              <tr className="bg-white even:bg-blue-50 border-b">
                <td className="font-semibold py-2 px-3">DHT11 Sensor</td>
                <td className="py-2 px-3">Measures temperature and humidity</td>
              </tr>
              <tr className="bg-blue-50 even:bg-white border-b">
                <td className="font-semibold py-2 px-3">
                  Soil Moisture Sensor
                </td>
                <td className="py-2 px-3">Monitors soil moisture levels</td>
              </tr>
              <tr className="bg-white even:bg-blue-50">
                <td className="font-semibold py-2 px-3">
                  Motorized Shade Mechanism
                </td>
                <td className="py-2 px-3">Opens/closes shade as required</td>
              </tr>
            </tbody>
          </table>
          <h4 className="text-2xl font-bold mb-2">Working Principle</h4>
          <ul className="list-disc pl-5 mb-4">
            <li>
              The DHT11 sensor detects excessive heat; the shade automatically
              covers crops to prevent damage.
            </li>
            <li>
              The soil moisture sensor monitors dryness; if rain starts and soil
              is dry, the shade opens to allow natural watering.
            </li>
            <li>
              Once the target soil moisture is achieved, the shade closes to
              prevent overwatering.
            </li>
            <li>All real-time data is displayed on the LCD screen.</li>
          </ul>
          <h4 className="text-2xl font-bold mb-2">Use Cases</h4>
          <ul className="list-disc pl-5 mb-4">
            <li>Smart farming: Protect crops from harsh weather conditions.</li>
            <li>
              Water conservation: Utilize rainfall effectively, reducing
              irrigation needs.
            </li>
            <li>
              Precision agriculture: Automate crop care for better yield and
              efficiency.
            </li>
          </ul>
          <button
            className="mt-2 px-4 py-2 bg-accent text-white rounded font-semibold shadow hover:bg-accent/90 transition"
            onClick={() => setExpanded(false)}
          >
            Show Less
          </button>
        </div>
      )}
    </Card>
  );
};

// Expandable card for Smart Home Automation & Appliance Control System
const HomeAutomationCard = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="p-4 pb-6 flex flex-col items-center text-center shadow-lg h-full">
      <div className="w-full h-60 mb-3 overflow-hidden rounded flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5">
        <img
          src={homeAutomationImage}
          alt="Smart Home Automation & Appliance Control System"
          className="max-h-56 object-contain p-1"
          style={{
            maxWidth: "100%",
            filter: "contrast(1.05) brightness(1.02)",
          }}
        />
      </div>
      <h3 className="text-xl font-bold mb-2">
        Smart Home Automation & Appliance Control System
      </h3>
      <p className="text-muted-foreground mb-2">
        An ESP32-powered Wi-Fi system with relay control for lights, fans, and
        appliances — enabling remote switching, real-time monitoring, and energy
        efficiency.
      </p>
      {!expanded ? (
        <button
          className="mt-2 px-4 py-2 bg-accent text-white rounded font-semibold shadow hover:bg-accent/90 transition"
          onClick={() => setExpanded(true)}
        >
          Read More
        </button>
      ) : (
        <div className="w-full text-left mt-4">
          <h4 className="text-lg font-semibold mb-2">Description</h4>
          <p className="italic mb-4">
            This system automates home appliance control using an ESP32
            microcontroller and relay module. It allows users to remotely switch
            ON/OFF lights, fans, and other devices, improving energy efficiency
            and convenience. The system is battery-backed, ensuring
            uninterrupted operation during power cuts.
          </p>
          <h4 className="text-2xl font-bold mb-2">Components Used</h4>
          <table className="w-full mb-4 border rounded-lg overflow-hidden text-sm">
            <thead>
              <tr className="bg-accent text-white">
                <th className="py-2 px-3 text-left">Component</th>
                <th className="py-2 px-3 text-left">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white even:bg-blue-50 border-b">
                <td className="font-semibold py-2 px-3">
                  ESP32 Development Board
                </td>
                <td className="py-2 px-3">
                  Acts as the main controller, providing Wi-Fi connectivity and
                  GPIO control for automation logic.
                </td>
              </tr>
              <tr className="bg-blue-50 even:bg-white border-b">
                <td className="font-semibold py-2 px-3">
                  4-Channel Relay Module
                </td>
                <td className="py-2 px-3">
                  Switches multiple home appliances like lights, fans, or plugs.
                </td>
              </tr>
              <tr className="bg-white even:bg-blue-50 border-b">
                <td className="font-semibold py-2 px-3">
                  GPIO Expansion Board
                </td>
                <td className="py-2 px-3">
                  Utilizes additional pins of ESP32 for more inputs/outputs.
                </td>
              </tr>
              <tr className="bg-blue-50 even:bg-white border-b">
                <td className="font-semibold py-2 px-3">
                  18650 Li-ion Batteries (x2)
                </td>
                <td className="py-2 px-3">
                  Provides backup power during electricity outages.
                </td>
              </tr>
              <tr className="bg-white even:bg-blue-50 border-b">
                <td className="font-semibold py-2 px-3">
                  Battery Charging Module
                </td>
                <td className="py-2 px-3">
                  Charges batteries when mains power is available and switches
                  to backup when needed.
                </td>
              </tr>
              <tr className="bg-blue-50 even:bg-white">
                <td className="font-semibold py-2 px-3">Wiring & Connectors</td>
                <td className="py-2 px-3">
                  Distributes power and connects appliances securely.
                </td>
              </tr>
            </tbody>
          </table>
          <h4 className="text-2xl font-bold mb-2">Working Principle</h4>
          <ul className="list-disc pl-5 mb-4">
            <li>
              The ESP32 connects to Wi-Fi and allows users to control appliances
              via a mobile app, web dashboard, or voice assistant integration.
            </li>
            <li>
              When a user toggles a command, the ESP32 activates the
              corresponding relay channel, switching the appliance ON or OFF.
            </li>
            <li>
              The battery charging module keeps the 18650 batteries charged;
              during a power failure, the system automatically switches to
              battery mode.
            </li>
            <li>
              Real-time status of appliance states (ON/OFF) can be monitored
              remotely, reducing energy wastage.
            </li>
          </ul>
          <h4 className="text-2xl font-bold mb-2">Use Cases</h4>
          <ul className="list-disc pl-5 mb-4">
            <li>
              Smart Home Control: Operate lights, fans, and other appliances
              from anywhere.
            </li>
            <li>
              Energy Efficiency: Schedule device usage and prevent unnecessary
              power consumption.
            </li>
            <li>
              Power Backup Automation: Continue controlling critical appliances
              even during power cuts.
            </li>
            <li>
              Scalability: Expandable design supports more GPIOs and appliances
              as needed.
            </li>
          </ul>
          <button
            className="mt-2 px-4 py-2 bg-accent text-white rounded font-semibold shadow hover:bg-accent/90 transition"
            onClick={() => setExpanded(false)}
          >
            Show Less
          </button>
        </div>
      )}
    </Card>
  );
};

// Expandable card for Automatic Green House Ambience Control
const GreenHouseCard = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="p-6 flex flex-col items-center text-center shadow-lg h-full">
      <div className="w-full h-44 mb-4 overflow-hidden rounded">
        <img
          src={smartHomeImage}
          alt="Automatic Green House Ambience Control"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <h3 className="text-xl font-bold mb-2">
        Automatic Green House Ambience Control
      </h3>
      <p className="text-muted-foreground mb-2">
        "A smart greenhouse system that automatically balances soil, humidity,
        temperature, and light for healthier plant growth."
      </p>
      {!expanded ? (
        <button
          className="mt-2 px-4 py-2 bg-accent text-white rounded font-semibold shadow hover:bg-accent/90 transition"
          onClick={() => setExpanded(true)}
        >
          Read More
        </button>
      ) : (
        <div className="w-full text-left mt-4">
          <h4 className="text-lg font-semibold mb-2">Description</h4>
          <p className="italic mb-4">
            This project creates a controlled environment inside a greenhouse
            using sensors and actuators managed by an Arduino Uno. It maintains
            ideal soil conditions, humidity, temperature, and lighting for
            plants, ensuring efficient growth while reducing manual
            intervention.
          </p>
          <h4 className="text-2xl font-bold mb-2">Components Used</h4>
          <table className="w-full mb-4 border rounded-lg overflow-hidden text-sm">
            <thead>
              <tr className="bg-accent text-white">
                <th className="py-2 px-3 text-left">Component</th>
                <th className="py-2 px-3 text-left">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white even:bg-blue-50 border-b">
                <td className="font-semibold py-2 px-3">Arduino Uno</td>
                <td className="py-2 px-3">
                  Central microcontroller for automation
                </td>
              </tr>
              <tr className="bg-blue-50 even:bg-white border-b">
                <td className="font-semibold py-2 px-3">pH Sensor</td>
                <td className="py-2 px-3">Monitors soil pH levels</td>
              </tr>
              <tr className="bg-white even:bg-blue-50 border-b">
                <td className="font-semibold py-2 px-3">Humidifier</td>
                <td className="py-2 px-3">
                  Increases humidity when air is dry
                </td>
              </tr>
              <tr className="bg-blue-50 even:bg-white border-b">
                <td className="font-semibold py-2 px-3">
                  Peltier-based Dehumidifier
                </td>
                <td className="py-2 px-3">
                  Reduces humidity when it becomes excessive
                </td>
              </tr>
              <tr className="bg-white even:bg-blue-50 border-b">
                <td className="font-semibold py-2 px-3">
                  Water Pump + Grounded Tank
                </td>
                <td className="py-2 px-3">Supplies water when soil is dry</td>
              </tr>
              <tr className="bg-blue-50 even:bg-white border-b">
                <td className="font-semibold py-2 px-3">BH1750 Light Sensor</td>
                <td className="py-2 px-3">Measures ambient light intensity</td>
              </tr>
              <tr className="bg-white even:bg-blue-50 border-b">
                <td className="font-semibold py-2 px-3">
                  Full Spectrum LED Plant Grow Light
                </td>
                <td className="py-2 px-3">
                  Provides artificial lighting and temperature control
                </td>
              </tr>
              <tr className="bg-blue-50 even:bg-white border-b">
                <td className="font-semibold py-2 px-3">12V Power Supply</td>
                <td className="py-2 px-3">Primary power source</td>
              </tr>
              <tr className="bg-white even:bg-blue-50">
                <td className="font-semibold py-2 px-3">Step-Down Converter</td>
                <td className="py-2 px-3">
                  Regulates voltage for sensors and modules
                </td>
              </tr>
            </tbody>
          </table>
          <h4 className="text-2xl font-bold mb-2">Working Principle</h4>
          <ul className="list-disc pl-5 mb-4">
            <li>
              The pH sensor ensures the soil remains within an optimal range for
              plant health.
            </li>
            <li>
              The humidifier activates when humidity drops below a threshold,
              while the Peltier dehumidifier reduces excess humidity.
            </li>
            <li>
              The soil moisture condition is continuously monitored; if dry, the
              water pump irrigates the soil from the grounded tank.
            </li>
            <li>
              The BH1750 light sensor measures natural light intensity; if
              insufficient, the full-spectrum grow light turns on to provide
              balanced illumination.
            </li>
            <li>
              The step-down converter ensures stable voltage supply to all
              components.
            </li>
          </ul>
          <h4 className="text-2xl font-bold mb-2">Use Cases</h4>
          <ul className="list-disc pl-5 mb-4">
            <li>
              Greenhouse farming: Maintain a controlled plant growth
              environment.
            </li>
            <li>
              Research labs: Conduct plant experiments under consistent
              environmental conditions.
            </li>
            <li>
              Urban farming: Enable efficient plant cultivation in indoor
              setups.
            </li>
            <li>
              Sustainable agriculture: Reduce resource wastage through precise
              control.
            </li>
          </ul>
          <button
            className="mt-2 px-4 py-2 bg-accent text-white rounded font-semibold shadow hover:bg-accent/90 transition"
            onClick={() => setExpanded(false)}
          >
            Show Less
          </button>
        </div>
      )}
    </Card>
  );
};

const Projects = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-surface-elevated mb-6">
              Project
              <span className="text-accent"> Portfolio</span>
            </h1>
            <p className="text-xl text-surface-elevated/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Explore a collection of innovative embedded systems and IoT
              solutions I've developed across various industries and
              applications.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
              Featured Projects
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how I've helped companies bring innovative embedded
              solutions to life, from proof of concept to market-ready products.
            </p>
          </div>

          {/* Responsive grid with video box */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            <CropShadeCard />
            <HeartRateCard />
            <GreenHouseCard />
            <HomeAutomationCard />
            <div className="lg:col-span-2 h-full rounded-lg overflow-hidden shadow-lg relative">
              <video
                className="w-full h-full object-cover min-h-[320px]"
                autoPlay
                loop
                muted
                playsInline
                src={servoVideo}
              >
                Your browser does not support the video tag.
              </video>
              <div className="absolute top-0 left-0 p-4">
                <div className="bg-black/50 p-3 rounded-br-lg inline-block">
                  <h3 className="text-xl font-bold mb-1 text-white">
                    Servo Tinkering
                  </h3>
                  <p className="text-white/90">
                    To Know Servo Arm Angle Value 0-1024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Have a Project in Mind?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss how I can help bring your embedded system ideas to
            life.
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 px-8 py-4 text-lg"
          >
            Start Your Project
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Projects;
