import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ESP8266Dialog() {
  return (
    <Dialog>
      <DialogTrigger className="font-bold text-purple-600 hover:text-purple-500 transition">
        ESP8266
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            ESP8266 — WiFi Microcontroller
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-3">Overview</h3>
            <p className="text-muted-foreground">
              The ESP8266 is a low-cost Wi-Fi microchip with full TCP/IP stack
              and microcontroller capability. This small module allows
              microcontrollers to connect to a Wi-Fi network and make simple
              TCP/IP connections.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Key Features</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>32-bit RISC CPU: Tensilica Xtensa LX106 running at 80 MHz</li>
              <li>64 KB of instruction RAM, 96 KB of data RAM</li>
              <li>External QSPI flash - 512 KB to 4 MB</li>
              <li>IEEE 802.11 b/g/n Wi-Fi</li>
              <li>16 GPIO pins</li>
              <li>SPI, I2C, I2S, UART, 10-bit ADC</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">GPIO Functions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Digital I/O Pins</h4>
                <p className="text-sm text-muted-foreground">
                  16 GPIO pins that can be configured as inputs or outputs, with
                  internal pull-up/pull-down resistors.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Special Function Pins</h4>
                <p className="text-sm text-muted-foreground">
                  UART, I2C, I2S interfaces for connecting various sensors and
                  peripherals.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Wireless Capabilities
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                Integrated TR switch, balun, LNA, power amplifier and matching
                network
              </li>
              <li>WEP or WPA/WPA2 authentication, or open networks</li>
              <li>802.11 b/g/n support</li>
              <li>Wi-Fi Direct (P2P), soft-AP</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Technical Specifications
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="space-y-1">
                <span className="font-medium">Operating Voltage:</span>
                <span className="block text-muted-foreground">3.0-3.6V</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Operating Current:</span>
                <span className="block text-muted-foreground">
                  Average 80mA
                </span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Flash Memory:</span>
                <span className="block text-muted-foreground">Up to 4MB</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Processor:</span>
                <span className="block text-muted-foreground">
                  80MHz (default) / 160MHz
                </span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">GPIO Count:</span>
                <span className="block text-muted-foreground">16 pins</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">ADC:</span>
                <span className="block text-muted-foreground">
                  1 input with 10-bit resolution
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Common Applications</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>IoT devices and home automation</li>
              <li>Wi-Fi enabled sensors</li>
              <li>Smart home devices</li>
              <li>Remote monitoring systems</li>
              <li>Wireless data logging</li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
