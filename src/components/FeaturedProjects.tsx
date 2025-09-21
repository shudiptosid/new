import { Card } from "@/components/ui/card";
// Expandable card for Remote Heart Rate and SPO2 monitor
const HeartRateCard = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="p-6 flex flex-col items-center text-center shadow-lg h-full">
      <img
        src={industrialImage}
        alt="Remote Heart Rate and SPO2 monitor"
        className="h-32 w-full object-cover rounded mb-4"
      />
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
import iotSensorImage from "@/assets/Project A.jpg";
import smartHomeImage from "@/assets/Project B.jpg";
import industrialImage from "@/assets/Project C.jpg";

import React, { useState } from "react";

// Expandable card for Smart Crop Shade Automation System
const CropShadeCard = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="p-6 flex flex-col items-center text-center shadow-lg h-full">
      <img
        src={iotSensorImage}
        alt="Smart Crop Shade Automation System"
        className="h-32 w-full object-cover rounded mb-4"
      />
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

// Expandable card for Automatic Green House Ambience Control
const GreenHouseCard = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="p-6 flex flex-col items-center text-center shadow-lg h-full">
      <img
        src={smartHomeImage}
        alt="Automatic Green House Ambience Control"
        className="h-32 w-full object-cover rounded mb-4"
      />
      <h3 className="text-xl font-bold mb-2">
        Automatic Green House Ambience Control
      </h3>
      <p className="text-muted-foreground mb-2">
        “A smart greenhouse system that automatically balances soil, humidity,
        temperature, and light for healthier plant growth.”
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

// Expandable card for Remote Heart Rate and SPO2 monitor
// ...existing code...

// ...existing code...

const FeaturedProjects = () => {
  // Only show your project description in quotes, no photo
  const myProjectDescription = "Your project description goes here.";

  return (
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

        {/* Static 2x3 grid for top projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {/* Row 1 */}
          <CropShadeCard />
          <GreenHouseCard />
          <HeartRateCard />
        </div>

        {/* Space for a video */}
        <div className="flex justify-center items-center mb-8 md:mb-12 min-h-[180px] md:min-h-[240px] bg-muted rounded-lg">
          {/* Replace the div below with your video embed or player */}
          <span className="text-muted-foreground text-base md:text-lg">
            Video coming soon...
          </span>
        </div>

        {/* Space for a video */}
        <div className="flex justify-center items-center mb-8 md:mb-12 min-h-[180px] md:min-h-[240px] bg-muted rounded-lg">
          {/* Replace the div below with your video embed or player */}
          <span className="text-muted-foreground text-base md:text-lg">
            Video coming soon...
          </span>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
