import { useEffect, useRef } from "react";

interface CircuitNode {
  x: number;
  y: number;
  connections: number[];
}

interface BinaryChar {
  x: number;
  y: number;
  char: string;
  speed: number;
  opacity: number;
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<CircuitNode[]>([]);
  const binaryCharsRef = useRef<BinaryChar[]>([]);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeNodes();
      initializeBinary();
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create circuit board nodes
    const initializeNodes = () => {
      const nodes: CircuitNode[] = [];
      const cols = Math.floor(canvas.width / 150);
      const rows = Math.floor(canvas.height / 150);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * 150 + 75 + (Math.random() - 0.5) * 40;
          const y = row * 150 + 75 + (Math.random() - 0.5) * 40;
          nodes.push({
            x,
            y,
            connections: [],
          });
        }
      }

      // Create connections between nearby nodes
      nodes.forEach((node, i) => {
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 180 && node.connections.length < 3) {
              node.connections.push(j);
            }
          }
        });
      });

      nodesRef.current = nodes;
    };

    // Create binary rain effect
    const initializeBinary = () => {
      const chars: BinaryChar[] = [];
      const columns = Math.floor(canvas.width / 20);

      for (let i = 0; i < columns; i++) {
        chars.push({
          x: i * 20,
          y: Math.random() * canvas.height,
          char: Math.random() > 0.5 ? "1" : "0",
          speed: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.3,
        });
      }

      binaryCharsRef.current = chars;
    };

    initializeNodes();
    initializeBinary();

    // Animation loop
    const animate = () => {
      timeRef.current += 0.02;

      // Clear canvas with slight fade
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw circuit board connections
      const nodes = nodesRef.current;
      nodes.forEach((node, i) => {
        node.connections.forEach((connIndex) => {
          const targetNode = nodes[connIndex];
          if (targetNode) {
            // Animated circuit lines
            const pulse = Math.sin(timeRef.current * 2 + i * 0.5) * 0.5 + 0.5;

            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            ctx.strokeStyle = `rgba(0, 200, 255, ${0.2 + pulse * 0.3})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Draw animated pulse along the line
            const progress = (timeRef.current * 0.5 + i * 0.3) % 1;
            const pulseX = node.x + (targetNode.x - node.x) * progress;
            const pulseY = node.y + (targetNode.y - node.y) * progress;

            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 255, ${pulse * 0.8})`;
            ctx.fill();
          }
        });

        // Draw circuit nodes
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 255, 0.8)`;
        ctx.fill();

        // Node glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 255, 0.2)`;
        ctx.fill();
      });

      // Draw binary rain
      const binaryChars = binaryCharsRef.current;
      ctx.font = "14px monospace";

      binaryChars.forEach((char) => {
        ctx.fillStyle = `rgba(0, 255, 100, ${char.opacity})`;
        ctx.fillText(char.char, char.x, char.y);

        // Move character down
        char.y += char.speed;

        // Reset when off screen
        if (char.y > canvas.height) {
          char.y = -20;
          char.char = Math.random() > 0.5 ? "1" : "0";
          char.opacity = Math.random() * 0.5 + 0.3;
        }
      });

      // Draw grid lines (subtle tech background)
      ctx.strokeStyle = "rgba(0, 200, 255, 0.03)";
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};

export default AnimatedBackground;
