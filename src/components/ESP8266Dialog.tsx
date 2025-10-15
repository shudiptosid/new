import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import esp8266Img from "@/assets/KYB/esp8266.png";

export function ESP8266Dialog() {
  return (
    <Dialog>
      <DialogTrigger className="font-bold text-purple-600 hover:text-purple-500 transition">
        ESP8266
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Everything You Need to Know About ESP8266 (Pinout + Hardware
            Overview)
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={esp8266Img}
              alt="ESP8266 Pinout Diagram"
              className="rounded-lg object-contain w-full"
            />
          </div>

          <section>
            <h3 className="text-xl font-semibold mb-3">Hardware Overview</h3>
            <p className="text-muted-foreground">
              The ESP8266 is a low-cost Wi-Fi-enabled microcontroller developed
              by Espressif Systems. It became very popular for IoT projects
              thanks to its affordability, built-in TCP/IP stack, and ability to
              run user programs directly (without an external microcontroller).
            </p>
            <p className="text-muted-foreground mt-2">
              The ESP8266 is available in several module types (ESP-01, ESP-07,
              ESP-12E/F, NodeMCU boards) but the NodeMCU ESP8266 DevKit is the
              most common for hobbyists and prototyping. It comes with
              USB-to-serial support and preloaded firmware, so you can program
              it easily with the Arduino IDE or Lua.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Pin & Block Diagram Components
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Microcontroller (ESP8266EX)</h4>
                <p className="text-sm text-muted-foreground">
                  32-bit Tensilica L106 processor running at 80/160 MHz; handles
                  user code and Wi-Fi stack.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Power Supply Section</h4>
                <p className="text-sm text-muted-foreground">
                  Vin (5V), 3V3, GND. Accepts USB 5V input or external supply;
                  onboard regulator outputs 3.3V.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">GPIO Pins (0–16)</h4>
                <p className="text-sm text-muted-foreground">
                  D0–D8 on NodeMCU Board. Used for digital input/output.
                  Multiplexed for I²C, SPI, UART, PWM.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Analog Input (ADC)</h4>
                <p className="text-sm text-muted-foreground">
                  A0 pin reads 0–1V analog voltage (NodeMCU boards have a
                  resistor divider to allow 0–3.3V input).
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Communication Interfaces
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>UART: Used for programming/debugging</li>
              <li>I²C & SPI: Software-based, configurable on any GPIO</li>
              <li>
                PWM Output: D0–D8 (Software PWM) for dimming LEDs, controlling
                motors
              </li>
              <li>Wi-Fi: Built-in 2.4 GHz Wi-Fi connectivity (802.11 b/g/n)</li>
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
                <span className="font-medium">Recommended input voltage:</span>
                <span className="block text-muted-foreground">
                  4.5–9V (through Vin, regulated to 3.3V)
                </span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Clock speed:</span>
                <span className="block text-muted-foreground">
                  80 MHz (default), up to 160 MHz
                </span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Flash memory:</span>
                <span className="block text-muted-foreground">
                  512 KB – 4 MB (depends on module version)
                </span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">SRAM:</span>
                <span className="block text-muted-foreground">
                  ~50 KB usable
                </span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">ADC resolution:</span>
                <span className="block text-muted-foreground">
                  10-bit (0–1023 range)
                </span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Max current per GPIO:</span>
                <span className="block text-muted-foreground">
                  ~12 mA (safe), up to 20 mA (absolute max)
                </span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Sleep current:</span>
                <span className="block text-muted-foreground">
                  &lt;20 µA in deep sleep
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Practical Examples</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Control an LED on GPIO2 (D4)</li>
              <li>Read analog sensor (A0)</li>
              <li>Send data to a cloud server using Wi-Fi</li>
              <li>
                Create a simple web server to control devices from a browser
              </li>
            </ul>
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-800">
                <strong>Note:</strong> ESP8266 operates at 3.3V logic - don't
                connect 5V signals directly. GPIO0, GPIO2, GPIO15 are "boot
                mode" pins and must be in correct state during reset.
              </p>
            </div>
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

          {/* Datasheet Link */}
          <section className="pt-4 border-t border-border">
            <h3 className="text-xl font-semibold mb-3">📄 Datasheet</h3>
            <a
              href="https://www.espressif.com/sites/default/files/documentation/0a-esp8266ex_datasheet_en.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors duration-200 font-medium"
            >
              View Datasheet
            </a>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
