import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import arduinoUno from "@/assets/KYB/UNO.png";

export function ArduinoUnoDialog() {
  return (
    <Dialog>
      <DialogTrigger className="text-left text-lg font-semibold text-accent hover:text-accent/80 transition cursor-pointer">
        Arduino Uno
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Arduino Uno — With Diagrams & Pin-Out Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={arduinoUno}
              alt="Arduino Uno Pinout Diagram"
              className="rounded-lg object-contain w-full"
            />
          </div>

          <section>
            <h3 className="text-xl font-semibold mb-3">Hardware Overview</h3>
            <p className="text-muted-foreground">
              The Arduino Uno is a microcontroller board based on the
              ATmega328P. It is part of the Arduino family and is well suited
              for prototyping and educational electronics. It allows connections
              with sensors, actuators, and other modules.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Pin & Block Diagram Components
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Microcontroller (ATmega328P)</h4>
                <p className="text-sm text-muted-foreground">
                  Main processor; executes your code, handles I/O.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Power Supply Section</h4>
                <p className="text-sm text-muted-foreground">
                  Barrel Jack, USB connector, Vin, 5V, 3.3V pins, GNDs for power
                  management.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Digital I/O Pins (0-13)</h4>
                <p className="text-sm text-muted-foreground">
                  Used for digital input/output. Pins 3, 5, 6, 9, 10, 11 support
                  PWM.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Analog Input Pins (A0-A5)</h4>
                <p className="text-sm text-muted-foreground">
                  For reading analog sensors. They feed into ADC
                  (Analog-to-Digital Converter).
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Communication Interfaces
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>UART (Serial): pins 0 (RX), 1 (TX)</li>
              <li>I²C: pins A4 (SDA), A5 (SCL)</li>
              <li>SPI: pins 10 (SS), 11 (MOSI), 12 (MISO), 13 (SCK)</li>
            </ul>
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
                <span className="font-medium">
                  Input voltage (recommended):
                </span>
                <span className="block text-muted-foreground">7-12V</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Clock speed:</span>
                <span className="block text-muted-foreground">16 MHz</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Flash memory:</span>
                <span className="block text-muted-foreground">
                  32 KB (0.5 KB used by bootloader)
                </span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">SRAM:</span>
                <span className="block text-muted-foreground">2 KB</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">EEPROM:</span>
                <span className="block text-muted-foreground">1 KB</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Datasheet Link */}
        <div className="pt-4 border-t border-border">
          <h3 className="text-xl font-semibold mb-3">📄 Datasheet</h3>
          <a
            href="https://docs.arduino.cc/hardware/uno-rev3"
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
