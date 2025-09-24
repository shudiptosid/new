import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import stm32Img from "@/assets/KYB/stm32.png";

export function STM32Dialog() {
  return (
    <Dialog>
      <DialogTrigger className="font-bold text-orange-600 hover:text-orange-500 transition">
        STM32
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Everything You Need to Know About STM32 (Pinout + Hardware Overview)
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={stm32Img}
              alt="STM32 Pinout Diagram"
              className="rounded-lg object-contain w-full"
            />
          </div>

          <section>
            <h3 className="text-xl font-semibold mb-3">Hardware Overview</h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                The STM32 is a family of 32-bit microcontrollers developed by
                STMicroelectronics, based on the ARM Cortex-M processor cores.
                They are available in multiple series (F0, F1, F3, F4, G4, H7,
                L0, L4, WB, WL) to cover a wide range of applications — from
                ultra-low-power battery devices to high-performance real-time
                systems.
              </p>
              <p className="text-muted-foreground">
                STM32 boards are widely used in industrial automation, IoT
                systems, robotics, motor control, medical devices, and consumer
                electronics. They offer high performance, low power consumption,
                and a rich set of peripherals, making them one of the most
                popular MCU families for professional and hobbyist use.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Pin & Block Diagram Components
            </h3>
            <div className="space-y-2">
              <h4 className="font-medium">
                Microcontroller (Example: STM32F103C8T6 – Blue Pill Board)
              </h4>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>ARM Cortex-M3 Core running up to 72 MHz</li>
                <li>Flash Memory: 64 KB (up to 1 MB in higher variants)</li>
                <li>SRAM: 20 KB (up to 512 KB depending on series)</li>
                <li>EEPROM Emulation: Via Flash memory</li>
                <li>
                  Floating Point Unit (FPU): Available in Cortex-M4/M7 series
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Power Supply Section</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>VDD Pins – Operating voltage typically 2.0V – 3.6V</li>
              <li>
                3.3V Regulator – Many boards include onboard regulator (supply
                from USB or external 5V)
              </li>
              <li>
                VBAT Pin – Backup battery supply for RTC (Real-Time Clock)
              </li>
              <li>GND Pins – Multiple ground pins available</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">GPIO Pins</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                Number of GPIOs: Varies by MCU package (up to 168 on
                high-pin-count packages)
              </li>
              <li>
                Configurable Modes: Input, Output, Analog, Alternate Function
              </li>
              <li>
                Analog Inputs: Multiple 12-bit ADC channels (e.g., STM32F103 has
                10/16 channels)
              </li>
              <li>
                DAC: Available on some series (e.g., STM32F303, STM32F4) for
                true analog output
              </li>
              <li>
                Current Limit: ~20 mA per pin (max total current depends on
                package)
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Communication Interfaces
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                UART/USART: Multiple hardware UARTs for serial communication
              </li>
              <li>I²C: Up to 3 I²C interfaces (depends on series)</li>
              <li>
                SPI/I²S: Multiple SPI buses for displays, SD cards, sensors
              </li>
              <li>
                CAN Bus: Available on many STM32 models for
                automotive/industrial applications
              </li>
              <li>
                USB: Full-Speed (12 Mbps) or High-Speed (480 Mbps) support
                (depends on series)
              </li>
              <li>Ethernet: Available on STM32F107, F2, F4, H7 series</li>
              <li>
                PWM: Advanced timers provide high-resolution PWM on many pins
              </li>
              <li>
                Timers: General-purpose, basic, and advanced timers (can be used
                for motor control)
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Timers & Peripherals</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                General Purpose Timers: For PWM, delay, input capture, output
                compare
              </li>
              <li>
                SysTick Timer: 24-bit timer for OS tick or periodic interrupts
              </li>
              <li>Watchdog Timer: Ensures recovery from software hang</li>
              <li>Real-Time Clock (RTC): Battery-backed timekeeping</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Electrical Characteristics & Limits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Operating Specifications</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Operating Voltage: 2.0V – 3.6V (3.3V typical)</li>
                  <li>
                    I/O Logic Level: 3.3V (5V tolerant pins available on some
                    series)
                  </li>
                  <li>Max Current per GPIO: ~20 mA</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Clock Speeds</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>STM32F1 Series: up to 72 MHz</li>
                  <li>STM32F4 Series: up to 180 MHz</li>
                  <li>STM32H7 Series: up to 480 MHz</li>
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground">
                Low-Power Modes: Stop, Standby, Sleep (&lt;1 µA current draw
                possible)
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Special Features</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>In-System Programming via SWD/JTAG</li>
              <li>
                Bootloader supports UART, USB DFU, CAN, and I²C (depends on
                chip)
              </li>
              <li>
                DMA (Direct Memory Access): Offloads CPU for high-speed data
                transfer
              </li>
              <li>
                Floating Point Unit (FPU) and DSP Instructions (on Cortex-M4/M7)
              </li>
              <li>Cryptographic Acceleration on some STM32 families</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Practical Examples</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Controlling a BLDC motor using advanced PWM timers</li>
              <li>Reading multiple sensors simultaneously using ADC + DMA</li>
              <li>
                Sending sensor data to the cloud via Wi-Fi/Ethernet module
              </li>
              <li>Building low-power IoT nodes using Stop/Standby modes</li>
              <li>
                Implementing USB HID device (mouse/keyboard) with built-in USB
                peripheral
              </li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
