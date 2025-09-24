import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import nanoImg from "@/assets/KYB/nano.png";

export function ArduinoNanoDialog() {
  return (
    <Dialog>
      <DialogTrigger className="font-bold text-purple-600 hover:text-purple-500 transition">
        Arduino Nano
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Everything You Need to Know About Arduino Nano (Pinout + Hardware
            Overview)
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={nanoImg}
              alt="Arduino Nano Pinout Diagram"
              className="rounded-lg object-contain w-full"
            />
          </div>

          <section>
            <h3 className="text-xl font-semibold mb-3">Hardware Overview</h3>
            <p className="text-muted-foreground">
              The Arduino Nano is a compact, breadboard-friendly microcontroller
              board based on the ATmega328P (for Nano classic) or ATmega4809
              (for Nano Every). It is a smaller alternative to the Arduino Uno
              but provides nearly the same functionality with a smaller form
              factor.
            </p>
            <p className="text-muted-foreground mt-2">
              It is widely used in DIY electronics, IoT prototypes, automation,
              robotics, and educational projects. Its small size makes it ideal
              for embedding in compact systems and wearable devices.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Pin & Block Diagram Components
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Microcontroller (ATmega328P)</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>8-bit AVR microcontroller</li>
                  <li>16 MHz clock speed</li>
                  <li>32 KB flash memory (0.5 KB used by bootloader)</li>
                  <li>2 KB SRAM, 1 KB EEPROM</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Power Supply Section</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                Vin Pin – Input voltage (7–12V recommended) when not using USB
              </li>
              <li>USB Port – Powers board via 5V from computer/adapter</li>
              <li>5V Pin – Regulated 5V output from the board</li>
              <li>3.3V Pin – Regulated 3.3V output (max 50 mA)</li>
              <li>GND Pins – Multiple ground connections</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              GPIO Pins (0–13 Digital, A0–A7 Analog)
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                Digital I/O: 14 pins (D0–D13), each configurable as input or
                output
              </li>
              <li>
                PWM: Pins D3, D5, D6, D9, D10, D11 support hardware PWM
                (analogWrite)
              </li>
              <li>
                Analog Inputs: 8 pins (A0–A7) with 10-bit ADC (0–1023 steps)
              </li>
              <li>
                Pin Current Limit: 40 mA per I/O pin (recommended safe limit ≤
                20 mA)
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Communication Interfaces
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>UART: D0 (RX) and D1 (TX) for serial communication</li>
              <li>I²C: A4 (SDA) and A5 (SCL) for sensors/displays</li>
              <li>
                SPI: D10 (SS), D11 (MOSI), D12 (MISO), D13 (SCK) for peripherals
                like SD cards, displays, etc.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Timers</h3>
            <p className="text-muted-foreground">
              3 timers available (Timer0, Timer1, Timer2) for PWM, delay, and
              timing functions
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Electrical Characteristics & Limits
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="space-y-1">
                <span className="font-medium">Operating Voltage:</span>
                <span className="block text-muted-foreground">
                  5V (logic level is 5V)
                </span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Input Voltage (Vin):</span>
                <span className="block text-muted-foreground">
                  7–12V recommended (absolute max: 6–20V)
                </span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">DC Current per I/O Pin:</span>
                <span className="block text-muted-foreground">20–40 mA</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">DC Current for 3.3V Pin:</span>
                <span className="block text-muted-foreground">Max 50 mA</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Total DC Current (5V Pin):</span>
                <span className="block text-muted-foreground">
                  Up to 500 mA (from USB)
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Special Features</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>USB-to-Serial converter onboard (CH340 or FT232RL)</li>
              <li>Reset button</li>
              <li>ICSP header for programming bootloader</li>
              <li>Built-in LED on D13</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Practical Examples</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                Blinking an LED on pin D13 (basic "Hello World" of Arduino)
              </li>
              <li>
                Reading a temperature sensor from A0 and displaying values on
                serial monitor
              </li>
              <li>Driving a servo motor using PWM pin D9</li>
              <li>Controlling an OLED display via I²C (A4, A5)</li>
              <li>
                Reading multiple analog sensors simultaneously for data logging
              </li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
