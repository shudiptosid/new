import React, { useEffect, useState } from "react";
import { useCallback } from "react";

// Import all icons from assets/icon folder
import circuitBoardIcon from "@/assets/icon/circuit-board.png";
import drivetrainIcon from "@/assets/icon/drivetrain.png";
import droneIcon from "@/assets/icon/drone.png";
import icIcon from "@/assets/icon/ic.png";
import acidIcon from "@/assets/icon/icons8-acid-on-surface-50.png";
import arduinoIcon from "@/assets/icon/icons8-arduino-50.png";
import aiIcon from "@/assets/icon/icons8-artificial-intelligence-50.png";
import chemistryIcon from "@/assets/icon/icons8-chemistry-50.png";
import creativityIcon from "@/assets/icon/icons8-creativity-50.png";
import thinkingIcon from "@/assets/icon/icons8-critical-thinking-50.png";
import designIcon from "@/assets/icon/icons8-design-50.png";
import diodeIcon from "@/assets/icon/icons8-diode-symbol-50.png";
import discoveryIcon from "@/assets/icon/icons8-discovery-50.png";
import drillIcon from "@/assets/icon/icons8-drill-50.png";
import electricalIcon from "@/assets/icon/icons8-electrical-threshold-50.png";
import ethernetIcon from "@/assets/icon/icons8-ethernet-on-50.png";
import gearIcon from "@/assets/icon/icons8-gear-50.png";
import globeIcon from "@/assets/icon/icons8-globe-50.png";
import hdmiIcon from "@/assets/icon/icons8-hdmi-cable-50.png";
import ideaIcon from "@/assets/icon/icons8-idea-32.png";
import integralIcon from "@/assets/icon/icons8-integral-50.png";
import iotIcon from "@/assets/icon/icons8-internet-of-things-50.png";
import ledIcon from "@/assets/icon/icons8-luminaria-led-50.png";
import motorIcon from "@/assets/icon/icons8-motor-symbol-50.png";
import physicsIcon from "@/assets/icon/icons8-physics-book-50.png";
import processorIcon from "@/assets/icon/icons8-processor-50.png";
import resistorIcon from "@/assets/icon/icons8-resistor-50.png";
import robotIcon from "@/assets/icon/icons8-robot-50.png";
import scifiIcon from "@/assets/icon/icons8-science-fiction-50.png";
import sensorIcon from "@/assets/icon/icons8-sensor-32.png";
import solderingIcon from "@/assets/icon/icons8-soldering-iron-50.png";
import transistorIcon from "@/assets/icon/icons8-transistor-50.png";
import voltmeterIcon from "@/assets/icon/icons8-voltmeter-50.png";
import ledComponentIcon from "@/assets/icon/led.png";
import resistorComponentIcon from "@/assets/icon/resistor.png";
import rocketIcon from "@/assets/icon/rocket.png";
import satelliteIcon from "@/assets/icon/satellite.png";
import satellitesIcon from "@/assets/icon/satellites.png";
import technologyIcon from "@/assets/icon/technology.png";
import ultrasonicIcon from "@/assets/icon/ultrasonic-sensor.png";

// Define the interface for a floating icon
interface FloatingIcon {
  id: number;
  src: string;
  alt: string;
  size: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
}

const FloatingIcons: React.FC = () => {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle window resize with useCallback for better performance
  const updateDimensions = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Initialize icons when component mounts
  useEffect(() => {
    // Get container dimensions initially
    updateDimensions();

    // Update dimensions on resize
    window.addEventListener("resize", updateDimensions);

    // All available icons from the assets/icon folder
    const iconSources = [
      { src: circuitBoardIcon, alt: "Circuit Board" },
      { src: drivetrainIcon, alt: "Drivetrain" },
      { src: droneIcon, alt: "Drone" },
      { src: icIcon, alt: "IC" },
      { src: acidIcon, alt: "Acid" },
      { src: arduinoIcon, alt: "Arduino" },
      { src: aiIcon, alt: "Artificial Intelligence" },
      { src: chemistryIcon, alt: "Chemistry" },
      { src: creativityIcon, alt: "Creativity" },
      { src: thinkingIcon, alt: "Critical Thinking" },
      { src: designIcon, alt: "Design" },
      { src: diodeIcon, alt: "Diode" },
      { src: discoveryIcon, alt: "Discovery" },
      { src: drillIcon, alt: "Drill" },
      { src: electricalIcon, alt: "Electrical" },
      { src: ethernetIcon, alt: "Ethernet" },
      { src: gearIcon, alt: "Gear" },
      { src: globeIcon, alt: "Globe" },
      { src: hdmiIcon, alt: "HDMI" },
      { src: ideaIcon, alt: "Idea" },
      { src: integralIcon, alt: "Mathematics" },
      { src: iotIcon, alt: "Internet of Things" },
      { src: ledIcon, alt: "LED" },
      { src: motorIcon, alt: "Motor" },
      { src: physicsIcon, alt: "Physics" },
      { src: processorIcon, alt: "Processor" },
      { src: resistorIcon, alt: "Resistor" },
      { src: robotIcon, alt: "Robot" },
      { src: scifiIcon, alt: "Science Fiction" },
      { src: sensorIcon, alt: "Sensor" },
      { src: solderingIcon, alt: "Soldering Iron" },
      { src: transistorIcon, alt: "Transistor" },
      { src: voltmeterIcon, alt: "Voltmeter" },
      { src: ledComponentIcon, alt: "LED Component" },
      { src: resistorComponentIcon, alt: "Resistor Component" },
      { src: rocketIcon, alt: "Rocket" },
      { src: satelliteIcon, alt: "Satellite" },
      { src: satellitesIcon, alt: "Satellites" },
      { src: technologyIcon, alt: "Technology" },
      { src: ultrasonicIcon, alt: "Ultrasonic Sensor" },
    ];

    // Create initial icons with random positions and speeds
    if (dimensions.width && dimensions.height) {
      // Use all icons for complete coverage
      const newIcons = iconSources.map((icon, index) => ({
        id: index,
        src: icon.src,
        alt: icon.alt,
        size: Math.random() * 20 + 30, // Larger size between 30-50px for visibility
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height * 2, // Distribute across twice the screen height
        speedX: (Math.random() - 0.5) * 0.5, // Increased horizontal speed for more movement
        speedY: (Math.random() - 0.5) * 0.5, // Increased vertical speed for more movement
        rotation: Math.random() * 360, // Random initial rotation
        rotationSpeed: (Math.random() - 0.5) * 0.3, // Increased rotation speed
      }));

      setIcons(newIcons);
    }

    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // Animation loop using requestAnimationFrame
  useEffect(() => {
    if (!icons.length || !dimensions.width || !dimensions.height) return;

    let animationFrameId: number;

    const animate = () => {
      setIcons((prevIcons) =>
        prevIcons.map((icon) => {
          // Update position
          let newX = icon.x + icon.speedX;
          let newY = icon.y + icon.speedY;
          let newSpeedX = icon.speedX;
          let newSpeedY = icon.speedY;

          // Bounce off horizontal edges
          if (newX < 0 || newX > dimensions.width - icon.size) {
            newSpeedX = -icon.speedX;
            newX = newX < 0 ? 0 : dimensions.width - icon.size;
          }

          // For vertical movement, loop from bottom to top when icon goes below screen
          if (newY > dimensions.height * 2) {
            newY = -icon.size;
          } else if (newY < -icon.size) {
            newY = dimensions.height * 2;
          }

          // Update rotation
          const newRotation = (icon.rotation + icon.rotationSpeed) % 360;

          return {
            ...icon,
            x: newX,
            y: newY,
            speedX: newSpeedX,
            speedY: newSpeedY,
            rotation: newRotation,
          };
        })
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [icons, dimensions]);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ height: "200vh" }}
    >
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute opacity-60 transition-all duration-150 hover:opacity-100"
          style={{
            width: `${icon.size}px`,
            height: `${icon.size}px`,
            transform: `translate(${icon.x}px, ${icon.y}px) rotate(${icon.rotation}deg)`,
            transition: "transform 0.3s ease-out",
            filter: "drop-shadow(0 0 3px rgba(255,255,255,0.3))",
          }}
        >
          <img
            src={icon.src}
            alt={icon.alt}
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>
  );
};

export default FloatingIcons;
