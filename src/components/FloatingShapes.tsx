import { useEffect, useState } from "react";
import {
  Cpu,
  Zap,
  WifiHigh,
  Database,
  Code,
  Terminal,
  Microchip,
  Server,
} from "lucide-react";

interface TechIcon {
  id: number;
  Icon: any;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
}

const FloatingShapes = () => {
  const [icons, setIcons] = useState<TechIcon[]>([]);

  useEffect(() => {
    // Tech icons array
    const techIcons = [
      Cpu,
      Zap,
      WifiHigh,
      Database,
      Code,
      Terminal,
      Microchip,
      Server,
    ];

    // Generate random floating tech icons
    const generateIcons = () => {
      const newIcons: TechIcon[] = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        Icon: techIcons[Math.floor(Math.random() * techIcons.length)],
        left: Math.random() * 100,
        size: Math.random() * 30 + 30, // 30-60px
        duration: Math.random() * 15 + 20, // 20-35s
        delay: Math.random() * 5,
        rotation: Math.random() * 360,
      }));

      setIcons(newIcons);
    };

    generateIcons();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
        @keyframes floatUpTech {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-120vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes scanLine {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes glitch {
          0%, 100% {
            transform: translateX(0);
          }
          20% {
            transform: translateX(-2px);
          }
          40% {
            transform: translateX(2px);
          }
          60% {
            transform: translateX(-2px);
          }
          80% {
            transform: translateX(2px);
          }
        }
      `}</style>

      {/* Floating Tech Icons */}
      {icons.map((icon) => {
        const IconComponent = icon.Icon;
        return (
          <div
            key={icon.id}
            style={{
              position: "absolute",
              left: `${icon.left}%`,
              bottom: "-100px",
              animation: `floatUpTech ${icon.duration}s ease-in-out ${icon.delay}s infinite`,
            }}
          >
            <IconComponent
              size={icon.size}
              style={{
                color: "rgba(0, 200, 255, 0.4)",
                filter: "drop-shadow(0 0 8px rgba(0, 200, 255, 0.6))",
                transform: `rotate(${icon.rotation}deg)`,
              }}
            />
          </div>
        );
      })}

      {/* Scanning Line Effect */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, rgba(0, 255, 200, 0.8), transparent)",
          animation: "scanLine 8s linear infinite",
          boxShadow: "0 0 10px rgba(0, 255, 200, 0.5)",
        }}
      />

      {/* Tech Grid Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 200, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 200, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />

      {/* Corner Tech Brackets */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-cyan-500/30" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-cyan-500/30" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-cyan-500/30" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-cyan-500/30" />

      {/* Hexagon Pattern (Tech Background) */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "100px",
          height: "100px",
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          border: "2px solid rgba(0, 200, 255, 0.2)",
          animation: "pulse 3s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "10%",
          width: "80px",
          height: "80px",
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          border: "2px solid rgba(0, 255, 200, 0.2)",
          animation: "pulse 4s ease-in-out infinite 1s",
        }}
      />

      {/* Data Stream Lines */}
      <div
        className="absolute top-0 left-1/4 w-px h-full"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(0, 200, 255, 0.3), transparent)",
          animation: "glitch 3s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-0 right-1/3 w-px h-full"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(0, 255, 200, 0.3), transparent)",
          animation: "glitch 4s ease-in-out infinite 0.5s",
        }}
      />
    </div>
  );
};

export default FloatingShapes;
