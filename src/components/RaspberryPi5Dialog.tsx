import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import pi5 from "@/assets/KYB/pi 5.png";

export function RaspberryPi5Dialog() {
  return (
    <Dialog>
      <DialogTrigger className="text-left text-lg font-semibold text-accent hover:text-accent/80 transition cursor-pointer">
        Raspberry Pi 5
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Raspberry Pi 5 — With Diagrams & Pin-Out Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={pi5}
              alt="Raspberry Pi 5 Pinout Diagram"
              className="rounded-lg object-contain w-full"
            />
          </div>

          <section>
            <h3 className="text-xl font-semibold mb-3">Hardware Overview</h3>
            <p className="text-muted-foreground">
              The Raspberry Pi 5 is the latest generation of the Raspberry Pi series. It features a 
              64-bit quad-core Arm Cortex-A76 processor clocked at 2.4GHz, double the performance 
              of the Pi 4. It includes 2GB, 4GB, or 8GB of LPDDR4X-4267 SDRAM, gigabit Ethernet, 
              dual-band 802.11ac Wi-Fi 6, and Bluetooth 5.0. It also introduces PCIe support and 
              a new power-over-Ethernet (PoE+) connector.
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
                  64-bit quad-core Arm Cortex-A76 @ 2.4GHz
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Memory</h4>
                <p className="text-sm text-muted-foreground">
                  2GB, 4GB, or 8GB LPDDR4X-4267 SDRAM
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Connectivity</h4>
                <p className="text-sm text-muted-foreground">
                  Gigabit Ethernet, dual-band 802.11ac Wi-Fi 6, Bluetooth 5.0
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Video Output</h4>
                <p className="text-sm text-muted-foreground">
                  2 × micro-HDMI ports supporting up to 4Kp60
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Enhanced Features
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>PCIe support for high-speed expansion</li>
              <li>Power-over-Ethernet (PoE+) connector</li>
              <li>Improved GPIO controller with configurable peripherals</li>
              <li>Hardware accelerated graphics and video processing</li>
              <li>USB 3.0 support with improved power delivery</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Electrical Characteristics & Limits
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="space-y-1">
                <span className="font-medium">Power supply:</span>
                <span className="block text-muted-foreground">5V DC via USB-C</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Power consumption:</span>
                <span className="block text-muted-foreground">6W (typical)</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Storage:</span>
                <span className="block text-muted-foreground">MicroSD card</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Operating temperature:</span>
                <span className="block text-muted-foreground">-40°C to +85°C</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Dimensions:</span>
                <span className="block text-muted-foreground">85mm x 56mm x 17mm</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Weight:</span>
                <span className="block text-muted-foreground">44g</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Datasheet Link */}
        <div className="pt-4 border-t border-border">
          <h3 className="text-xl font-semibold mb-3">📄 Datasheet</h3>
          <a
            href="https://datasheets.raspberrypi.com/rpi5/hardware-specifications.pdf"
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