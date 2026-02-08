import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import bw16 from "@/assets/KYB/BW16.png";

export function BW16Dialog() {
  return (
    <Dialog>
      <DialogTrigger className="text-left text-lg font-semibold text-accent hover:text-accent/80 transition cursor-pointer">
        BW16
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            BW16 — With Diagrams & Pin-Out Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={bw16}
              alt="BW16 Pinout Diagram"
              className="rounded-lg object-contain w-full"
            />
          </div>

          <section>
            <h3 className="text-xl font-semibold mb-3">Hardware Overview</h3>
            <p className="text-muted-foreground">
              The BW16 is a compact WiFi development board based on the BL602 chip. It is designed 
              for IoT applications and features a RISC-V core processor with integrated WiFi 
              connectivity. The board is compatible with Arduino IDE and supports various IoT 
              frameworks, making it suitable for rapid prototyping and development of smart devices.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Processor</h4>
                <p className="text-sm text-muted-foreground">
                  BL602 RISC-V 32-bit core processor
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Wireless Connectivity</h4>
                <p className="text-sm text-muted-foreground">
                  2.4GHz WiFi 802.11 b/g/n
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Memory</h4>
                <p className="text-sm text-muted-foreground">
                  Built-in Flash memory for program storage
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Peripherals</h4>
                <p className="text-sm text-muted-foreground">
                  Multiple GPIOs, UART, SPI, I2C, ADC, PWM
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Development Support
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Arduino IDE compatibility</li>
              <li>Support for various IoT frameworks</li>
              <li>Compact form factor for space-constrained applications</li>
              <li>Low power consumption design</li>
              <li>Easy programming via USB interface</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Electrical Characteristics & Limits
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="space-y-1">
                <span className="font-medium">Operating voltage:</span>
                <span className="block text-muted-foreground">3.3V</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Input voltage:</span>
                <span className="block text-muted-foreground">3.3V - 5V (regulated)</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Clock speed:</span>
                <span className="block text-muted-foreground">Variable depending on mode</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Operating temperature:</span>
                <span className="block text-muted-foreground">-40°C to +85°C</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Dimensions:</span>
                <span className="block text-muted-foreground">Compact form factor</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Power consumption:</span>
                <span className="block text-muted-foreground">Low power design</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Datasheet Link */}
        <div className="pt-4 border-t border-border">
          <h3 className="text-xl font-semibold mb-3">📄 Datasheet</h3>
          <a
            href="https://wiki.ai-thinker.com/bw16"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors duration-200 font-medium"
          >
            View Datasheet
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}