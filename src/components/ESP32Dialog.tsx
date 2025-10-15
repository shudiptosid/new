import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import esp32Img from "@/assets/KYB/esp32.png";

export function ESP32Dialog() {
  return (
    <Dialog>
      <DialogTrigger className="font-bold text-emerald-600 hover:text-emerald-500 transition">
        ESP32
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Everything You Need to Know About ESP32 (Pinout + Hardware Overview)
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={esp32Img}
              alt="ESP32 Pinout Diagram"
              className="rounded-lg object-contain w-full"
            />
          </div>

          <section>
            <h3 className="text-xl font-semibold mb-3">Hardware Overview</h3>
            <p className="text-muted-foreground">
              The ESP32 is a highly integrated Wi-Fi + Bluetooth microcontroller
              SoC (System on Chip) designed by Espressif Systems. It is an
              advanced successor to the ESP8266, with dual-core processing
              power, larger memory, low-power modes, and a wide range of
              peripherals.
            </p>
            <p className="text-muted-foreground mt-2">
              The ESP32 is widely used in IoT devices, robotics, automation, and
              edge computing projects. Its built-in wireless capabilities
              eliminate the need for extra modules, making it a cost-effective
              and compact solution for connected applications.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Pin & Block Diagram Components
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Microcontroller (ESP32 SoC)</h4>
                <p className="text-sm text-muted-foreground">
                  Dual-core Xtensa® LX6 processor; runs user code, handles
                  wireless stacks.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Power Supply Section</h4>
                <p className="text-sm text-muted-foreground">
                  3.3V pin, GND, EN, Vin (or 5V). Accepts power from USB,
                  battery, or external supply. Regulates voltage for stable
                  operation.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">GPIO Pins (0–39)</h4>
                <p className="text-sm text-muted-foreground">
                  Configurable as input/output, can be mapped for ADC, PWM, I²C,
                  SPI, UART.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Analog Features</h4>
                <p className="text-sm text-muted-foreground">
                  ADC1 (pins 32–39), ADC2 (pins 0,2,4,12–15,25–27) for analog
                  readings. DAC on pins 25 & 26 for true analog voltage output.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Communication Interfaces
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>UART: 3 hardware UART ports available</li>
              <li>
                I²C: Configurable on almost any GPIO (commonly pins 21 = SDA, 22
                = SCL)
              </li>
              <li>SPI: HSPI & VSPI available for displays, SD cards, etc.</li>
              <li>PWM: Available on any GPIO (except input-only pins)</li>
              <li>Capacitive Touch: T0 – T9 pins for touch sensors</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Electrical Characteristics & Limits
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="space-y-1">
                <span className="font-medium">Operating voltage:</span>
                <span className="block text-muted-foreground">
                  3.3V (all GPIO work at 3.3V logic)
                </span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Recommended input voltage:</span>
                <span className="block text-muted-foreground">
                  5V (regulated to 3.3V onboard)
                </span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Clock speed:</span>
                <span className="block text-muted-foreground">
                  Up to 240 MHz
                </span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Flash memory:</span>
                <span className="block text-muted-foreground">
                  4 MB (common for DevKit v1 boards)
                </span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">SRAM:</span>
                <span className="block text-muted-foreground">520 KB</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">ADC resolution:</span>
                <span className="block text-muted-foreground">
                  12-bit (0–4095 steps)
                </span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Max current per GPIO:</span>
                <span className="block text-muted-foreground">
                  ~12 mA (safe), up to 40 mA (absolute max)
                </span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Deep Sleep current:</span>
                <span className="block text-muted-foreground">
                  &lt;10 µA (ideal for battery-powered projects)
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Practical Examples</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Controlling an LED with PWM on GPIO2</li>
              <li>Reading temperature from an analog sensor on GPIO34</li>
              <li>Sending data to the cloud via Wi-Fi</li>
              <li>Using Bluetooth Low Energy (BLE) for wireless control</li>
            </ul>
          </section>

          {/* Datasheet Link */}
          <section className="pt-4 border-t border-border">
            <h3 className="text-xl font-semibold mb-3">📄 Datasheet</h3>
            <a
              href="https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors duration-200 font-medium"
            >
              View Datasheet
            </a>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
