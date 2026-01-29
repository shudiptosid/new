import React, { useEffect, useState } from "react";

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

// Define interface for icon objects
interface Icon {
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
  opacity: number;
}

// Props to allow customization between pages
interface FloatingIconsHomeProps {
  // Add any custom props here if needed
  isHomePage?: boolean;
}

const FloatingIconsHome: React.FC<FloatingIconsHomeProps> = ({
  isHomePage = true,
}) => {
  const [icons, setIcons] = useState<Icon[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>(
    window.innerWidth,
  );
  const [containerHeight, setContainerHeight] = useState<number>(
    window.innerHeight * 4,
  ); // Extended height to cover full page including About section

  // Initialize icons
  useEffect(() => {
    // All icon sources
    const iconSources = [
      { src: circuitBoardIcon, alt: "Circuit Board" },
      { src: drivetrainIcon, alt: "Drivetrain" },
      { src: droneIcon, alt: "Drone" },
      { src: icIcon, alt: "IC" },
      { src: acidIcon, alt: "Acid" },
      { src: arduinoIcon, alt: "Arduino" },
      { src: aiIcon, alt: "AI" },
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
      { src: iotIcon, alt: "IoT" },
      { src: ledIcon, alt: "LED" },
      { src: motorIcon, alt: "Motor" },
      { src: physicsIcon, alt: "Physics" },
      { src: processorIcon, alt: "Processor" },
      { src: resistorIcon, alt: "Resistor" },
      { src: robotIcon, alt: "Robot" },
      { src: scifiIcon, alt: "Sci-Fi" },
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

    // Number of icons to create (reduced density as requested)
    const iconCount = isHomePage ? iconSources.length * 2 : iconSources.length;

    // Create icons with much higher density
    const initialIcons = Array.from({ length: iconCount }).map((_, index) => {
      // Use modulo to cycle through available icons
      const iconSource = iconSources[index % iconSources.length];

      // Strategic distribution across the page with more even spacing due to reduced density
      // We'll create 4 groups of icons across the page sections
      const sectionIndex = index % 4; // 0 = hero, 1 = services, 2 = about/why choose me, 3 = bottom/contact
      let positionY;

      // For more even distribution with reduced density
      const spreadFactor = index / iconCount;

      if (sectionIndex === 0) {
        // Top section (hero video)
        positionY =
          (spreadFactor * 0.8 + Math.random() * 0.2) * containerHeight * 0.2;
      } else if (sectionIndex === 1) {
        // Services section
        positionY =
          containerHeight * 0.2 +
          (spreadFactor * 0.8 + Math.random() * 0.2) * (containerHeight * 0.3);
      } else if (sectionIndex === 2) {
        // About/Why Choose Me section
        positionY =
          containerHeight * 0.5 +
          (spreadFactor * 0.8 + Math.random() * 0.2) * (containerHeight * 0.3);
      } else {
        // Bottom/Contact section
        positionY =
          containerHeight * 0.8 +
          (spreadFactor * 0.8 + Math.random() * 0.2) * (containerHeight * 0.2);
      }

      // Create different sizes based on position
      // Customize size based on which section the icon belongs to
      const isTopSection = positionY < containerHeight * 0.2;
      const isAboutSection =
        positionY > containerHeight * 0.5 && positionY < containerHeight * 0.8;
      const isBottomSection = positionY > containerHeight * 0.8;

      // Slightly larger icons to compensate for reduced density
      let sizeRange;
      if (isTopSection) {
        sizeRange = [40, 60]; // Hero section - increased size
      } else if (isAboutSection) {
        sizeRange = [45, 65]; // About/Why Choose Me section - largest icons
      } else if (isBottomSection) {
        sizeRange = [35, 55]; // Bottom section - increased size
      } else {
        sizeRange = [30, 50]; // Middle section (services) - increased size
      }

      const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];

      // Vary opacity based on position
      // Higher opacity in About section for better visibility
      let baseOpacity;
      if (isTopSection) {
        baseOpacity = 0.6; // Hero section - reduced opacity
      } else if (isAboutSection) {
        baseOpacity = 0.7; // About section - higher but still reduced opacity
      } else if (isBottomSection) {
        baseOpacity = 0.6; // Bottom section - reduced opacity
      } else {
        baseOpacity = 0.5; // Middle section - lowest opacity
      }

      const opacityVariance = 0.1;
      const opacity = Math.min(
        0.7,
        Math.max(0.4, baseOpacity + (Math.random() - 0.5) * opacityVariance),
      );

      return {
        id: index,
        src: iconSource.src,
        alt: iconSource.alt,
        size,
        x: Math.random() * containerWidth,
        y: positionY,
        speedX: (Math.random() - 0.5) * 0.9, // Increased speed
        speedY: (Math.random() - 0.5) * 0.9, // Increased speed
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.5,
        opacity,
      };
    });

    setIcons(initialIcons);

    // Handle resize
    const handleResize = () => {
      setContainerWidth(window.innerWidth);
      setContainerHeight(window.innerHeight * 4); // Cover the whole page including About section
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [containerWidth, containerHeight, isHomePage]);

  // Animation loop
  useEffect(() => {
    if (!icons.length) return;

    let animationId: number;

    const animateIcons = () => {
      setIcons((prevIcons) =>
        prevIcons.map((icon) => {
          // Update position
          let newX = icon.x + icon.speedX;
          let newY = icon.y + icon.speedY;

          // Handle horizontal boundaries
          if (newX <= 0 || newX >= containerWidth - icon.size) {
            newX = newX <= 0 ? 0 : containerWidth - icon.size;
            icon.speedX *= -1;
          }

          // Handle vertical looping - ensure icons cycle through the entire page including bottom
          if (newY >= containerHeight) {
            newY = -icon.size;
          } else if (newY <= -icon.size) {
            newY = containerHeight;
          }

          return {
            ...icon,
            x: newX,
            y: newY,
            rotation: (icon.rotation + icon.rotationSpeed) % 360,
          };
        }),
      );
      animationId = requestAnimationFrame(animateIcons);
    };

    animationId = requestAnimationFrame(animateIcons);
    return () => cancelAnimationFrame(animationId);
  }, [icons, containerWidth, containerHeight]);

  return (
    <div className="fixed inset-0 z-10" style={{ height: "400vh" }}>
      {icons.map((icon) => {
        // Customize appearance based on vertical position
        // - Top section (hero with video): higher contrast
        // - Middle section: standard visibility
        // - About section: highest visibility
        // - Bottom section: high contrast
        const isTopSection = icon.y < containerHeight * 0.2;
        const isAboutSection =
          icon.y > containerHeight * 0.5 && icon.y < containerHeight * 0.8;
        const isBottomSection = icon.y > containerHeight * 0.8;

        // Apply special styling for sections where visibility needs enhancement
        let filterValue;
        if (isAboutSection) {
          // Enhanced visibility for About/Why Choose Me section - optimized for bg3.jpg but more subtle
          filterValue =
            "drop-shadow(0 0 8px rgba(255,255,255,0.6)) brightness(1.2) contrast(1.1)";
        } else if (isTopSection || isBottomSection) {
          // Standard enhanced visibility for top and bottom sections - optimized for bg3.jpg but more subtle
          filterValue =
            "drop-shadow(0 0 6px rgba(255,255,255,0.5)) brightness(1.15) contrast(1.05)";
        } else {
          // Default styling for middle section - enhanced for bg3.jpg but more subtle
          filterValue =
            "drop-shadow(0 0 4px rgba(255,255,255,0.4)) brightness(1.05)";
        }

        return (
          <div
            key={icon.id}
            className="absolute transition-all duration-150 hover:opacity-70"
            style={{
              width: `${icon.size}px`,
              height: `${icon.size}px`,
              transform: `translate(${icon.x}px, ${icon.y}px) rotate(${icon.rotation}deg)`,
              transition: "transform 0.2s ease-out, opacity 0.3s ease",
              opacity: icon.opacity,
              filter: filterValue,
              zIndex: isAboutSection ? 60 : isBottomSection ? 50 : 10, // Highest z-index for About section
              willChange: "transform",
            }}
          >
            <img
              src={icon.src}
              alt={icon.alt}
              className="w-full h-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(FloatingIconsHome);
