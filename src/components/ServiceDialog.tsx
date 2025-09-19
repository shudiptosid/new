import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ServiceDialogProps {
  title: string;
  children: React.ReactNode;
}

const ProjectOnDemandContent = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold bg-accent/10 text-accent p-4 rounded-lg">
      Project On-Demand: From Idea to Reality
    </h2>

    <p className="text-foreground/80 leading-relaxed italic font-bold">
      "You have a vision for a groundbreaking IoT device or an embedded system.
      We have the expertise to bring it to life. Our Project On-Demand service
      is our most comprehensive offering, designed to be your dedicated
      technical partner through every step of the development journey. We manage
      the complexities so you can focus on your goals."
    </p>

    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-accent">
          1. Full Project Lifecycle Management
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
          <li>
            <span className="font-medium">Conceptualization & Strategy:</span>{" "}
            We work with you to refine your idea, define key features, identify
            target performance metrics, and map out the project's technical
            requirements.
          </li>
          <li>
            <span className="font-medium">System Architecture & Design:</span>{" "}
            We create a high-level design, selecting the optimal
            microcontrollers, sensors, and communication protocols (like Wi-Fi,
            Bluetooth, LoRa) to meet your project's specific needs and budget.
          </li>
          <li>
            <span className="font-medium">Milestone Planning:</span> We break
            down the project into manageable phases with clear deliverables and
            timelines, so you always know what to expect and when.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-accent">
          2. Hardware & Software Integration
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
          <li>
            <span className="font-medium">Hardware Development:</span> From
            component selection and schematic design to multi-layer PCB layout,
            we create the physical foundation of your device, optimized for
            performance, size, and manufacturability.
          </li>
          <li>
            <span className="font-medium">Firmware Development:</span> We write
            clean, efficient, and reliable firmware in C/C++, MicroPython, or
            other relevant languages. This is the "brain" of your device,
            controlling its logic, processing sensor data, and managing
            connectivity.
          </li>
          <li>
            <span className="font-medium">Software & Cloud Integration:</span>{" "}
            Need your device to communicate with a mobile app, a web dashboard,
            or a cloud service like AWS IoT, Blynk IoT or Google Cloud? We
            handle the API integrations and data protocols to ensure your device
            is a smart, connected part of a larger ecosystem.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-accent">
          3. Rigorous Testing & Validation
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
          <li>
            <span className="font-medium">Functional Testing:</span> We verify
            that every feature works exactly as specified in the project
            requirements.
          </li>
          <li>
            <span className="font-medium">Performance & Stress Testing:</span>{" "}
            We push the device to its limits to test its battery life, data
            processing speed, and stability under heavy load.
          </li>
          <li>
            <span className="font-medium">Connectivity & Security Audits:</span>{" "}
            We ensure the wireless communication is reliable and implement
            essential security measures to protect your device and its data from
            vulnerabilities.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-accent">
          4. Production & Manufacturing Support
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
          <li>
            <span className="font-medium">
              Bill of Materials (BOM) Optimization:
            </span>{" "}
            We refine the list of components to balance cost, availability, and
            quality for manufacturing.
          </li>
          <li>
            <span className="font-medium">Manufacturer Coordination:</span> We
            can help you connect with and provide technical specifications to
            assembly houses and manufacturing partners.
          </li>
          <li>
            <span className="font-medium">Deployment & Future-Proofing:</span>{" "}
            We provide complete documentation and support for the initial
            rollout. We also design with the future in mind, making it easier to
            deploy firmware updates and add new features down the road.
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const ConsultingContent = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold bg-accent/10 text-accent p-4 rounded-lg">
      Expert Guidance for Your Embedded Project
    </h2>

    <p className="text-foreground/80 leading-relaxed italic font-bold">
      "A successful embedded systems project is built on a foundation of smart
      decisions. Choosing the right components, designing a scalable
      architecture, and anticipating future challenges can be the difference
      between a breakthrough product and a frustrating dead-end. Our consulting
      service provides the strategic guidance and expert advice you need to
      navigate these complexities with confidence."
    </p>

    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-accent">
          1. Technical Architecture Review
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
          <li>
            <span className="font-medium">What we analyze:</span> Your choice of
            microcontroller, sensor integration strategy, power management
            design, data flow, and software structure.
          </li>
          <li>
            <span className="font-medium">What you get:</span> A comprehensive
            report detailing our findings, identifying potential bottlenecks or
            design flaws, and providing actionable recommendations to strengthen
            your project's foundation.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-accent">
          2. Technology Selection
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
          <li>
            <span className="font-medium">Our process:</span> We analyze your
            specific requirements for performance, power consumption, cost, and
            physical size.
          </li>
          <li>
            <span className="font-medium">What you get:</span> A clear,
            justified recommendation for the ideal hardware and software
            technologies for your project. We'll explain the pros and cons of
            each option, empowering you to choose the best components for the
            job.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-accent">
          3. Performance Optimization
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
          <li>
            <span className="font-medium">Where we focus:</span> We dive deep
            into your firmware, hardware configurations, and system-level
            interactions to identify optimization opportunities.
          </li>
          <li>
            <span className="font-medium">What you get:</span> Concrete
            strategies and code-level suggestions to boost speed, improve
            responsiveness, increase power efficiency, and enhance the overall
            stability of your device.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-accent">
          4. Project Risk Assessment
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
          <li>
            <span className="font-medium">What we evaluate:</span> We look for
            risks in component sourcing (supply chain issues), software
            complexity (potential for critical bugs), scalability, and future
            maintenance.
          </li>
          <li>
            <span className="font-medium">What you get:</span> A clear risk
            assessment summary that outlines potential issues, their likelihood
            of occurring, their potential impact, and practical strategies to
            mitigate them. This foresight saves you invaluable time and
            resources down the line.
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const PrototypingContent = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold bg-accent/10 text-accent p-4 rounded-lg">
      Prototyping: Bringing Your Concepts to Life
    </h2>

    <p className="text-foreground/80 leading-relaxed italic font-bold">
      "An idea is just the beginning. The most critical step in any hardware
      project is transforming that abstract concept into a physical, functional
      prototype you can hold, test, and demonstrate. Our Prototyping service is
      designed to do exactly that—quickly and effectively. We build working
      models that allow you to validate your assumptions, gather crucial user
      feedback, and refine your design before committing to the final product.
      It's about making your idea real, fast."
    </p>

    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-accent">1. Rapid Prototyping</h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
          <li>
            <span className="font-medium">Our Approach:</span> We leverage
            development boards (like ESP32, Arduino), breadboards, and existing
            modules to assemble a working system efficiently.
          </li>
          <li>
            <span className="font-medium">What you get:</span> A tangible,
            interactive prototype that proves out your core functionality and
            can be used for demos, user testing, or securing investor buy-in.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-accent">
          2. Proof of Concept (PoC)
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
          <li>
            <span className="font-medium">Our Focus:</span> We isolate the
            riskiest technical assumption—be it a novel sensor application, a
            complex algorithm, or a specific communication method—and build a
            minimal setup to test it.
          </li>
          <li>
            <span className="font-medium">What you get:</span> A definitive
            answer and a working demonstration that confirms the viability of
            your core technology, giving you the confidence to move forward with
            the full project.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-accent">
          3. Design Iteration & Refinement
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
          <li>
            <span className="font-medium">The Process:</span> We work
            collaboratively with you, taking feedback from one version and
            incorporating it into the next. This cycle of building, testing, and
            learning is key to developing a truly great product.
          </li>
          <li>
            <span className="font-medium">What you get:</span> Evolved versions
            of your prototype (e.g., v1.1, v2.0) that are progressively more
            robust, efficient, and closer to your final vision.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-accent">
          4. Technology Validation
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
          <li>
            <span className="font-medium">What we test:</span> We create
            real-world testbeds to verify the performance of specific
            microcontrollers, sensors, batteries, or wireless modules (Wi-Fi,
            Bluetooth, etc.) under your expected operating conditions.
          </li>
          <li>
            <span className="font-medium">What you get:</span> Empirical data
            and a clear verdict on whether your chosen components meet the
            necessary performance, power, and reliability requirements for your
            project.
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const FirmwareDevelopmentContent = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold bg-accent/10 text-accent p-4 rounded-lg">
      Firmware: The Intelligence Inside Your Hardware
    </h2>

    <p className="text-foreground/80 leading-relaxed italic font-bold">
      "Great hardware is only as good as the software that runs on it. Firmware
      is the foundational code that breathes life into your device, controlling
      its every action from the moment it powers on. Our firmware development
      service focuses on creating clean, highly efficient, and incredibly
      reliable code that unlocks the full potential of your hardware. We go
      beyond just making things work; we write firmware that is optimized for
      speed, stability, and minimal power consumption, ensuring your product
      delivers an exceptional user experience."
    </p>

    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-accent">
          1. Low-Level Programming
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
          <li>
            <span className="font-medium">Our Expertise:</span> We architect
            code that is both memory-efficient and fast, tailored specifically
            to the hardware it's running on.
          </li>
          <li>
            <span className="font-medium">What you get:</span> A lean, powerful,
            and highly optimized firmware base that ensures your device is as
            responsive and capable as possible.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-accent">
          2. RTOS Implementation
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
          <li>
            <span className="font-medium">Our Approach:</span> We are
            experienced in implementing and configuring RTOS environments like
            FreeRTOS and Zephyr to handle complex, concurrent tasks reliably.
          </li>
          <li>
            <span className="font-medium">What you get:</span> A stable and
            scalable firmware architecture that ensures critical tasks are
            always executed on time, preventing system crashes and creating a
            smooth, predictable user experience.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-accent">
          3. Custom Driver Development
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
          <li>
            <span className="font-medium">Our Process:</span> We write clean,
            well-documented drivers from the ground up, following datasheet
            specifications precisely to ensure seamless hardware integration.
          </li>
          <li>
            <span className="font-medium">What you get:</span> Reliable and
            efficient communication between all components in your system,
            guaranteeing your hardware performs exactly as intended.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-accent">
          4. Advanced Power Optimization
        </h3>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
          <li>
            <span className="font-medium">Our Techniques:</span> We implement
            strategies like deep-sleep modes, dynamic clock scaling, and
            intelligent peripheral management to ensure the device consumes the
            absolute minimum power necessary.
          </li>
          <li>
            <span className="font-medium">What you get:</span> A significant
            increase in battery life, allowing your product to run for days,
            weeks, or even years on a single charge.
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const ServiceDialog = ({ title, children }: ServiceDialogProps) => {
  const getContent = () => {
    switch (title) {
      case "Project On-Demand":
        return <ProjectOnDemandContent />;
      case "Consulting":
        return <ConsultingContent />;
      case "Prototyping":
        return <PrototypingContent />;
      case "Firmware Development":
        return <FirmwareDevelopmentContent />;
      default:
        return <div>Content coming soon...</div>;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold mb-4">{title}</DialogTitle>
          <DialogDescription className="space-y-6">
            {getContent()}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDialog;
