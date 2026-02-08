import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import esp32c6 from "@/assets/KYB/esp32 c6.png";

export function ESP32C6Dialog() {
  return (
    <Dialog>
      <DialogTrigger className="text-left text-lg font-semibold text-accent hover:text-accent/80 transition cursor-pointer">
        ESP32-C6
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            ESP32-C6 — With Diagrams & Pin-Out Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={esp32c6}
              alt="ESP32-C6 Pinout Diagram"
              className="rounded-lg object-contain w-full"
            />
          </div>

          <section>
            <h3 className="text-xl font-semibold mb-3">Hardware Overview</h3>
            <p className="text-muted-foreground">
              The ESP32-C6 is a microcontroller unit (MCU) that integrates a 32-bit RISC-V single-core processor, 
              supporting 2.4 GHz Wi-Fi 6 and IEEE 802.15.4 (Thread and Zigbee). It features a high-performance RF 
              front-end with an integrated power amplifier, offering excellent RF performance and low power consumption.
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
                  32-bit RISC-V single-core processor up to 160 MHz
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Wireless Connectivity</h4>
                <p className="text-sm text-muted-foreground">
                  Wi-Fi 6 (2.4 GHz) and IEEE 802.15.4 (Thread/Zigbee)
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Memory</h4>
                <p className="text-sm text-muted-foreground">
                  Up to 512KB SRAM, 320KB ROM, 8MB PSRAM (external)
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Peripherals</h4>
                <p className="text-sm text-muted-foreground">
                  22 programmable GPIOs, I2C, I2S, SPI, UART, ADC, DAC
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Power Management
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Ultra-low-power design with multiple sleep modes</li>
              <li>Integrated power management unit (PMU)</li>
              <li>Supports 1.8V to 3.6V input voltage range</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Electrical Characteristics & Limits
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="space-y-1">
                <span className="font-medium">Operating voltage:</span>
                <span className="block text-muted-foreground">1.8V - 3.6V</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Clock speed:</span>
                <span className="block text-muted-foreground">Up to 160 MHz</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Flash memory:</span>
                <span className="block text-muted-foreground">Up to 16MB (external)</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Operating temperature:</span>
                <span className="block text-muted-foreground">-40°C to +125°C</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">RF Output Power:</span>
                <span className="block text-muted-foreground">22 dBm</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Sleep Current:</span>
                <span className="block text-muted-foreground">&lt; 5 µA</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Datasheet Link */}
        <div className="pt-4 border-t border-border">
          <h3 className="text-xl font-semibold mb-3">📄 Datasheet</h3>
          <a
            href="https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf"
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