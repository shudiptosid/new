import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import fpga from "@/assets/KYB/FPGA.png";

export function FPGADialog() {
  return (
    <Dialog>
      <DialogTrigger className="text-left text-lg font-semibold text-accent hover:text-accent/80 transition cursor-pointer">
        FPGA
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            FPGA — Field Programmable Gate Array — With Diagrams & Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={fpga}
              alt="FPGA Pinout Diagram"
              className="rounded-lg object-contain w-full"
            />
          </div>

          <section>
            <h3 className="text-xl font-semibold mb-3">Hardware Overview</h3>
            <p className="text-muted-foreground">
              An FPGA (Field Programmable Gate Array) is an integrated circuit that can be programmed 
              after manufacturing. Unlike microcontrollers or microprocessors, FPGAs contain an array 
              of programmable logic blocks and interconnects that can be configured to implement 
              custom digital circuits. This makes them extremely versatile for a wide range of 
              applications from digital signal processing to high-performance computing.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Programmable Logic Blocks</h4>
                <p className="text-sm text-muted-foreground">
                  Configurable logic units that can implement various digital functions
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Interconnect Resources</h4>
                <p className="text-sm text-muted-foreground">
                  Routing channels that connect logic blocks
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Memory Elements</h4>
                <p className="text-sm text-muted-foreground">
                  Block RAM and distributed RAM for data storage
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">I/O Banks</h4>
                <p className="text-sm text-muted-foreground">
                  Configurable input/output pins with various voltage standards
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Applications
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Digital signal processing and filtering</li>
              <li>Protocol bridging and conversion</li>
              <li>High-speed data acquisition and processing</li>
              <li>Custom computing machines</li>
              <li>Prototyping ASIC designs</li>
              <li>Real-time image and video processing</li>
              <li>Cryptographic applications</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Advantages
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>High performance through parallel processing</li>
              <li>Reconfigurable for different applications</li>
              <li>Low latency compared to software implementations</li>
              <li>Customizable to specific application needs</li>
              <li>Can be updated in the field</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">
              Electrical Characteristics & Limits
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="space-y-1">
                <span className="font-medium">Operating voltage:</span>
                <span className="block text-muted-foreground">Varies by device (typically 1.0V - 3.3V)</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Logic levels:</span>
                <span className="block text-muted-foreground">Various I/O standards supported</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Clock frequencies:</span>
                <span className="block text-muted-foreground">Up to several hundred MHz</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Operating temperature:</span>
                <span className="block text-muted-foreground">Commercial: 0°C to +85°C, Industrial: -40°C to +100°C</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Power consumption:</span>
                <span className="block text-muted-foreground">Varies by configuration and activity</span>
              </li>
              <li className="space-y-1">
                <span className="font-medium">Logic cells:</span>
                <span className="block text-muted-foreground">Thousands to millions depending on device</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Datasheet Link */}
        <div className="pt-4 border-t border-border">
          <h3 className="text-xl font-semibold mb-3">📄 Datasheet</h3>
          <a
            href="https://www.xilinx.com/support/documentation-handbooks.html"
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