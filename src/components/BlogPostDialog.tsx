import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock } from "lucide-react";

interface BlogPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BlogPostDialog = ({ open, onOpenChange }: BlogPostDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Optimizing Power Consumption in IoT Devices | Best Strategies for
            Energy Efficiency
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
              Power Management
            </span>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Jan 15, 2024</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>8 min read</span>
            </div>
          </div>
        </DialogHeader>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            Optimizing power consumption in IoT devices is a key factor for
            building reliable and energy-efficient connected systems. IoT
            devices like smart sensors, wearables, and industrial monitoring
            units often run on batteries, so extending battery life is crucial
            to reduce maintenance costs and ensure uninterrupted operation. The
            main power consumers in an IoT system are the microcontroller,
            wireless communication module (Wi-Fi, LoRa, BLE, Zigbee), and
            sensors. Choosing low-power IoT hardware, enabling deep sleep modes,
            and using duty cycling help keep devices in an ultra-low-power state
            most of the time.
          </p>
          <p className="text-muted-foreground mb-6">
            Another effective way to save energy is to optimize wireless
            communication. Reducing transmission frequency, batching data, and
            using low-power IoT protocols like LoRaWAN or MQTT significantly cut
            down energy usage. Engineers can also disable unused peripherals,
            use efficient power regulators, and apply interrupt-driven
            programming to reduce active time. Smart sensor management—turning
            sensors on only when needed—further contributes to energy savings.
          </p>
          <p className="text-muted-foreground">
            By combining these strategies and monitoring current draw with power
            profiling tools, IoT devices can operate for months or even years on
            a single battery charge. This approach is essential for smart
            agriculture, remote health monitoring, industrial automation, and
            other IoT applications where maintenance access is limited and
            energy efficiency directly impacts performance and
            cost-effectiveness.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostDialog;
