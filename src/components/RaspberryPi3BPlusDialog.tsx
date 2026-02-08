import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import pi3bplus from "@/assets/KYB/Pi 3B+.png";

export function RaspberryPi3BPlusDialog() {
  return (
    <Dialog>
      <DialogTrigger className="text-left text-lg font-semibold text-accent hover:text-accent/80 transition cursor-pointer">
        Raspberry Pi 3B+
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Raspberry Pi 3 Model B+ — With Diagrams & Pin-Out Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={pi3bplus}
              alt="Raspberry Pi 3B+ Pinout Diagram"
              className="rounded-lg object-contain w-full"
            />
          </div>

          <section>
            <h3 className="text-xl font-semibold mb-3">Hardware Overview</h3>
            <p className="text-muted-foreground">
              The Raspberry Pi 3 Model B+ is the third generation of the Raspberry Pi. It features a 
              1.4GHz 64-bit quad-core ARM Cortex-A53 processor, 1GB LPDDR2 SDRAM, dual-band 2.4GHz 
              and 5GHz IEEE 802.11.b/g/n/ac wireless LAN, and Bluetooth 4.2/BLE. It also includes 
              Gigabit Ethernet and PoE capability via a separate PoE HAT.
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
                  Broadcom BCM2837B0, Cortex-A53 64Bit SoC @ 1.4GHz
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Memory</h4>
                <p className="text-sm text-muted-foreground">
                  1GB LPDDR2 SDRAM
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Connectivity</h4>
                <p className="text-sm text-muted-foreground">
                  Dual-band 2.4GHz and 5GHz IEEE 802.11.b/g/n/ac wireless LAN
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Bluetooth</h4>
                <p className="text-sm text-muted-foreground">
                  Bluetooth 4.2, Bluetooth Low Energy (BLE)
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              GPIO & Peripherals
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>40-pin extended GPIO header</li>
              <li>4 USB 2.0 ports</li>
              <li>4-pole stereo output and composite video port</li>
              <li>Full-size HDMI</li>
              <li>CSI camera port for connecting a Raspberry Pi camera</li>
              <li>DPI display port for connecting flat panel displays</li>
              <li>MicroSD card slot for loading operating system and data storage</li>
              <li>Upgraded switched-mode power supply with improved thermal management</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Electrical Characteristics & Limits
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="space-y-1">
                <span className="font-medium">Power supply:</span>
                <span className="block text-muted-foreground">5V DC via micro USB</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Power consumption:</span>
                <span className="block text-muted-foreground">3.5W (typical)</span>
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
                <span className="block text-muted-foreground">51g</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Datasheet Link */}
        <div className="pt-4 border-t border-border">
          <h3 className="text-xl font-semibold mb-3">📄 Datasheet</h3>
          <a
            href="https://datasheets.raspberrypi.com/rpi3-plus/hardware-specifications.pdf"
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