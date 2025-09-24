import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import piImg from "@/assets/KYB/pi.png";

export function RaspberryPiPicoDialog() {
  return (
    <Dialog>
      <DialogTrigger className="font-bold text-red-600 hover:text-red-500 transition">
        Raspberry Pi
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Everything You Need to Know About Raspberry Pi Pico (Pinout +
            Hardware Overview)
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={piImg}
              alt="Raspberry Pi Pico Pinout Diagram"
              className="rounded-lg object-contain w-full"
            />
          </div>

          <section>
            <h3 className="text-xl font-semibold mb-3">Hardware Overview</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                The Raspberry Pi Pico is a small, affordable, and versatile
                microcontroller board based on the RP2040 chip designed by
                Raspberry Pi. It offers a dual-core processor, large memory,
                flexible I/O options, and multiple communication interfaces,
                making it ideal for IoT projects, robotics, automation,
                prototyping, and embedded systems.
              </p>
              <p className="text-muted-foreground">
                Unlike a full Raspberry Pi single-board computer, the Pico does
                not run an operating system but instead executes code directly
                on the microcontroller. This makes it faster for real-time
                applications and low-power projects.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Pin & Block Diagram Components
            </h3>
            <div className="space-y-2">
              <h4 className="font-medium">Microcontroller (RP2040 SoC)</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>
                  Dual-core ARM Cortex-M0+ processor, clocked up to 133 MHz
                </li>
                <li>264 KB SRAM</li>
                <li>
                  2 MB onboard QSPI flash memory (expandable via external flash)
                </li>
                <li>
                  Built-in USB 1.1 controller with support for device and host
                  mode
                </li>
                <li>
                  Programmable I/O (PIO) subsystem for custom peripheral support
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Power Supply Section</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>VSYS Pin – Main system power input (1.8V – 5.5V)</li>
              <li>VBUS Pin – USB power (5V from USB connection)</li>
              <li>3V3 Pin – Regulated 3.3V output for external peripherals</li>
              <li>GND Pins – Multiple ground pins for stable connections</li>
              <li>
                Low Power Modes – Supports deep-sleep and dormant modes for
                battery-powered applications
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">GPIO Pins (0–28)</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                26 Multi-function GPIO Pins: Can be configured as digital
                input/output, PWM, I²C, SPI, UART
              </li>
              <li>
                Analog Inputs: 3 ADC channels (GPIO26–GPIO28) with 12-bit
                resolution
              </li>
              <li>PWM: 16 independent PWM channels</li>
              <li>
                Programmable I/O (PIO): Two state machines per PIO block allow
                custom communication protocols
              </li>
              <li>
                Current Limit: ~12 mA per GPIO (50 mA max total recommended for
                all GPIO combined)
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Communication Interfaces
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>UART: Up to 2 hardware UART ports</li>
              <li>
                I²C: Up to 2 I²C controllers (can be assigned to almost any
                GPIO)
              </li>
              <li>SPI: Up to 2 SPI controllers</li>
              <li>PWM: Available on all GPIO pins through 8 PWM slices</li>
              <li>USB: Full-speed USB 1.1 for programming and data transfer</li>
              <li>
                PIO: Can emulate protocols like WS2812 LED control, custom
                UART/SPI/I²C, or other timing-based signals
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Timers</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Multiple hardware timers and watchdog timers</li>
              <li>Real-time counter (RTC) for timekeeping</li>
              <li>SysTick timer for OS tick and precise timing functions</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Electrical Characteristics & Limits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Power Specifications</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>
                    Operating Voltage: 3.3V (all GPIO operate at 3.3V logic)
                  </li>
                  <li>Input Voltage Range: 1.8V – 5.5V (via VSYS)</li>
                  <li>Deep Sleep Current: &lt;1 mA</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Performance</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Clock Speed: Up to 133 MHz (adjustable)</li>
                  <li>Max Current Draw: ~300 mA</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Special Features</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                Drag-and-Drop Programming: Appears as a USB mass storage device
                for easy code upload (.UF2 files)
              </li>
              <li>
                Programmable I/O (PIO): Unique feature allowing custom digital
                interfaces in hardware
              </li>
              <li>
                SWD Debugging Interface: For advanced debugging and programming
              </li>
              <li>
                Flexible Power Supply: Can run from battery, USB, or regulated
                3.3V source
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Practical Examples</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                Reading a temperature sensor via ADC (GPIO26) and displaying
                data over serial
              </li>
              <li>Driving a servo motor using PWM output on GPIO15</li>
              <li>
                Creating custom communication protocols with PIO for addressable
                LEDs
              </li>
              <li>
                Logging sensor data to external flash storage or sending over
                USB serial
              </li>
              <li>
                Controlling an I²C OLED display and reading multiple sensors
                simultaneously
              </li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
