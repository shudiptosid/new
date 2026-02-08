import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import mega from "@/assets/KYB/arduino mega.png";

export function ArduinoMegaDialog() {
  return (
    <Dialog>
      <DialogTrigger className="text-left text-lg font-semibold text-accent hover:text-accent/80 transition cursor-pointer">
        Arduino Mega 2560
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Arduino Mega 2560 — With Diagrams & Pin-Out Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={mega}
              alt="Arduino Mega 2560 Pinout Diagram"
              className="rounded-lg object-contain w-full"
            />
          </div>

          <section>
            <h3 className="text-xl font-semibold mb-3">Hardware Overview</h3>
            <p className="text-muted-foreground">
              The Arduino Mega 2560 is a powerful microcontroller board made for projects that need lots of pins, memory, and peripherals. It's like a "bigger, stronger Arduino Uno." Perfect for complex robotics, automation, and large sensor systems.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Core Hardware
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Microcontroller</h4>
                <p className="text-sm text-muted-foreground">
                  ATmega2560
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Clock Speed</h4>
                <p className="text-sm text-muted-foreground">
                  16 MHz
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Architecture</h4>
                <p className="text-sm text-muted-foreground">
                  8-bit AVR
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Memory Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Flash Memory</h4>
                <p className="text-sm text-muted-foreground">
                  256 KB (8 KB used by bootloader)
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">SRAM</h4>
                <p className="text-sm text-muted-foreground">
                  8 KB
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">EEPROM</h4>
                <p className="text-sm text-muted-foreground">
                  4 KB
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              I/O Pins (Main Advantage!)
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>54 Digital I/O pins (15 with PWM capability)</li>
              <li>16 Analog input pins</li>
              <li>Multiple communication ports</li>
              <li>4 UART (Serial ports)</li>
              <li>I²C and SPI interfaces</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Power Options
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>USB power</li>
              <li>DC barrel jack (7–12 V recommended)</li>
              <li>VIN pin input</li>
              <li>Logic level: 5 V</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Onboard Features
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Reset button</li>
              <li>Power LED, TX/RX LEDs</li>
              <li>ICSP header</li>
              <li>Large shield compatibility</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Typical Use Cases
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Robotics with many motors/sensors</li>
              <li>3D printers</li>
              <li>CNC machines</li>
              <li>Home automation hubs</li>
              <li>Industrial control systems</li>
              <li>LED cube projects</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Comparison with Arduino Uno
            </h3>
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-accent/10">
                  <th className="border border-border p-2 text-left">Feature</th>
                  <th className="border border-border p-2 text-left">Mega</th>
                  <th className="border border-border p-2 text-left">Uno</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2">Digital Pins</td>
                  <td className="border border-border p-2">54</td>
                  <td className="border border-border p-2">14</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">Analog Pins</td>
                  <td className="border border-border p-2">16</td>
                  <td className="border border-border p-2">6</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">UART Ports</td>
                  <td className="border border-border p-2">4</td>
                  <td className="border border-border p-2">1</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">Flash Memory</td>
                  <td className="border border-border p-2">256 KB</td>
                  <td className="border border-border p-2">32 KB</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Electrical Characteristics & Limits
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="space-y-1">
                <span className="font-medium">Operating voltage:</span>
                <span className="block text-muted-foreground">5V</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Input voltage (recommended):</span>
                <span className="block text-muted-foreground">7-12V</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Clock speed:</span>
                <span className="block text-muted-foreground">16 MHz</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Digital I/O pins:</span>
                <span className="block text-muted-foreground">54 (15 with PWM)</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Analog input pins:</span>
                <span className="block text-muted-foreground">16</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">DC Current per I/O pin:</span>
                <span className="block text-muted-foreground">40 mA</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Datasheet Link */}
        <div className="pt-4 border-t border-border">
          <h3 className="text-xl font-semibold mb-3">📄 Datasheet</h3>
          <a
            href="https://docs.arduino.cc/hardware/mega-2560-rev3"
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