import { useState, useMemo, useEffect, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Cpu,
  Gauge,
  Zap,
  Monitor,
  Calculator,
  Download,
  RotateCcw,
  ChevronDown,
  Settings2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyContactBar from "@/components/StickyContactBar";

// MCU options - Static fallback data
const mcuOptions = [
  {
    id: "MCU-01",
    name: "Arduino Uno",
    price: 450,
  },
  {
    id: "MCU-02",
    name: "Arduino Nano",
    price: 350,
  },
  { id: "MCU-03", name: "ESP32", price: 850 },
  { id: "MCU-04", name: "ESP8266", price: 300 },
  {
    id: "MCU-05",
    name: "Raspberry Pi Pico",
    price: 400,
  },
  {
    id: "MCU-06",
    name: "STM32 Blue Pill",
    price: 550,
  },
];

// Display options - Static fallback data
const displayOptions = [
  {
    id: "DISP-01",
    name: "16x2 LCD Display",
    price: 120,
  },
  {
    id: "DISP-02",
    name: '0.96" OLED Display',
    price: 180,
  },
  {
    id: "DISP-03",
    name: '1.3" OLED Display',
    price: 250,
  },
  {
    id: "DISP-04",
    name: "Nokia 5110 LCD",
    price: 150,
  },
  {
    id: "DISP-05",
    name: 'TFT 1.8" Color Display',
    price: 350,
  },
  {
    id: "DISP-06",
    name: 'TFT 2.4" Touchscreen',
    price: 650,
  },
  { id: "DISP-07", name: "None", price: 0 },
];

// Power & Components options - Static fallback data
const powerComponents = [
  {
    id: "PWR-01",
    name: "5V Power Adapter",
    price: 80,
    category: "Power Supply",
  },
  {
    id: "PWR-02",
    name: "9V Battery",
    price: 30,
    category: "Power Supply",
  },
  {
    id: "PWR-03",
    name: "18650 Battery",
    price: 50,
    category: "Power Supply",
  },
  {
    id: "PWR-04",
    name: "18650 Battery Holder (Single)",
    price: 40,
    category: "Power Supply",
  },
  {
    id: "PWR-05",
    name: "18650 Battery Holder (Double)",
    price: 60,
    category: "Power Supply",
  },
  {
    id: "PWR-06",
    name: "18650 Battery Holder (Triple)",
    price: 80,
    category: "Power Supply",
  },
  {
    id: "PWR-07",
    name: "USB Cable",
    price: 25,
    category: "Cable",
  },
  {
    id: "COMP-01",
    name: "Breadboard 400 Points",
    price: 45,
    category: "Component",
  },
  {
    id: "COMP-02",
    name: "Breadboard 830 Points",
    price: 80,
    category: "Component",
  },
  {
    id: "COMP-03",
    name: "Jumper Wires (Pack)",
    price: 30,
    category: "Component",
  },
  {
    id: "COMP-04",
    name: "LED Pack (10pcs)",
    price: 20,
    category: "Component",
  },
  {
    id: "COMP-05",
    name: "Resistor Kit",
    price: 50,
    category: "Component",
  },
  {
    id: "COMP-06",
    name: "Push Button (5pcs)",
    price: 15,
    category: "Component",
  },
  {
    id: "COMP-07",
    name: "Relay Module",
    price: 60,
    category: "Module",
  },
  {
    id: "COMP-08",
    name: "Motor Driver L298N",
    price: 120,
    category: "Module",
  },
];

// Actuator options - Static fallback data
const actuatorOptions = [
  {
    id: "ACT-01",
    name: "DC Motor (Standard)",
    price: 40,
    category: "Motor",
  },
  {
    id: "ACT-02",
    name: "Geared DC Motor",
    price: 80,
    category: "Motor",
  },
  {
    id: "ACT-03",
    name: "9g Servo Motor",
    price: 90,
    category: "Servo",
  },
  {
    id: "ACT-04",
    name: "Tower Pro SG90 Servo",
    price: 120,
    category: "Servo",
  },
  {
    id: "ACT-05",
    name: "MG996R Servo (Metal Gear)",
    price: 350,
    category: "Servo",
  },
  {
    id: "ACT-06",
    name: "Mini Water Pump",
    price: 120,
    category: "Pump",
  },
  {
    id: "ACT-07",
    name: "Submersible Water Pump",
    price: 180,
    category: "Pump",
  },
  {
    id: "ACT-08",
    name: "Stepper Motor (28BYJ-48)",
    price: 150,
    category: "Motor",
  },
];

export default function CostEstimator() {
  const [productsData, setProductsData] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedMCU, setSelectedMCU] = useState<string>("");
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [selectedActuators, setSelectedActuators] = useState<string[]>([]);
  const [selectedDisplay, setSelectedDisplay] = useState<string>("");
  const [sensorQuantities, setSensorQuantities] = useState<
    Record<string, number>
  >({});
  const [componentQuantities, setComponentQuantities] = useState<
    Record<string, number>
  >({});
  const [actuatorQuantities, setActuatorQuantities] = useState<
    Record<string, number>
  >({});

  // Load products data asynchronously
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await import("@/data/productsData.json");
        setProductsData(data.default || []);
        setDataLoaded(true);
      } catch (error) {
        console.error("Failed to load products data:", error);
        setDataLoaded(true); // Still set to true to show the UI
      }
    };
    loadData();
  }, []);

  // Calculate totals - MUST be before early return
  const mcuCost = useMemo(() => {
    const mcu = mcuOptions.find((m) => m.id === selectedMCU);
    return mcu ? mcu.price : 0;
  }, [selectedMCU]);

  const sensorsCost = useMemo(() => {
    return selectedSensors.reduce((total, sensorId) => {
      const sensor = productsData.find((s) => s.id === sensorId);
      const quantity = sensorQuantities[sensorId] || 1;
      return total + (sensor ? sensor.price * quantity : 0);
    }, 0);
  }, [selectedSensors, sensorQuantities, productsData, dataLoaded]);

  const componentsCost = useMemo(() => {
    return selectedComponents.reduce((total, compId) => {
      const component = powerComponents.find((c) => c.id === compId);
      const quantity = componentQuantities[compId] || 1;
      return total + (component ? component.price * quantity : 0);
    }, 0);
  }, [selectedComponents, componentQuantities]);

  const actuatorsCost = useMemo(() => {
    return selectedActuators.reduce((total, actId) => {
      const actuator = actuatorOptions.find((a) => a.id === actId);
      const quantity = actuatorQuantities[actId] || 1;
      return total + (actuator ? actuator.price * quantity : 0);
    }, 0);
  }, [selectedActuators, actuatorQuantities]);

  const displayCost = useMemo(() => {
    const display = displayOptions.find((d) => d.id === selectedDisplay);
    return display ? display.price : 0;
  }, [selectedDisplay]);

  const totalCost =
    mcuCost + sensorsCost + componentsCost + actuatorsCost + displayCost;

  // Group sensors by category - MUST be before early return
  const sensorsByCategory = useMemo(() => {
    const grouped: Record<string, typeof productsData> = {};
    productsData.forEach((sensor) => {
      if (!grouped[sensor.category]) {
        grouped[sensor.category] = [];
      }
      grouped[sensor.category].push(sensor);
    });
    return grouped;
  }, [productsData, dataLoaded]);

  // Group components by category - MUST be before early return
  const componentsByCategory = useMemo(() => {
    const grouped: Record<string, typeof powerComponents> = {};
    powerComponents.forEach((comp) => {
      if (!grouped[comp.category]) {
        grouped[comp.category] = [];
      }
      grouped[comp.category].push(comp);
    });
    return grouped;
  }, [dataLoaded]);

  // Group actuators by category - MUST be before early return
  const actuatorsByCategory = useMemo(() => {
    const grouped: Record<string, typeof actuatorOptions> = {};
    actuatorOptions.forEach((act) => {
      if (!grouped[act.category]) {
        grouped[act.category] = [];
      }
      grouped[act.category].push(act);
    });
    return grouped;
  }, [dataLoaded]);

  // Show loading spinner while data loads - AFTER all hooks
  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Loading cost estimator...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Toggle sensor selection
  const toggleSensor = (sensorId: string) => {
    if (selectedSensors.includes(sensorId)) {
      setSelectedSensors(selectedSensors.filter((id) => id !== sensorId));
      const newQuantities = { ...sensorQuantities };
      delete newQuantities[sensorId];
      setSensorQuantities(newQuantities);
    } else {
      setSelectedSensors([...selectedSensors, sensorId]);
      setSensorQuantities({ ...sensorQuantities, [sensorId]: 1 });
    }
  };

  // Toggle component selection
  const toggleComponent = (componentId: string) => {
    if (selectedComponents.includes(componentId)) {
      setSelectedComponents(
        selectedComponents.filter((id) => id !== componentId),
      );
      const newQuantities = { ...componentQuantities };
      delete newQuantities[componentId];
      setComponentQuantities(newQuantities);
    } else {
      setSelectedComponents([...selectedComponents, componentId]);
      setComponentQuantities({ ...componentQuantities, [componentId]: 1 });
    }
  };

  // Toggle actuator selection
  const toggleActuator = (actuatorId: string) => {
    if (selectedActuators.includes(actuatorId)) {
      setSelectedActuators(selectedActuators.filter((id) => id !== actuatorId));
      const newQuantities = { ...actuatorQuantities };
      delete newQuantities[actuatorId];
      setActuatorQuantities(newQuantities);
    } else {
      setSelectedActuators([...selectedActuators, actuatorId]);
      setActuatorQuantities({ ...actuatorQuantities, [actuatorId]: 1 });
    }
  };

  // Update quantity
  const updateQuantity = (
    id: string,
    delta: number,
    type: "sensor" | "component" | "actuator",
  ) => {
    if (type === "sensor") {
      setSensorQuantities({
        ...sensorQuantities,
        [id]: Math.max(1, (sensorQuantities[id] || 1) + delta),
      });
    } else if (type === "component") {
      setComponentQuantities({
        ...componentQuantities,
        [id]: Math.max(1, (componentQuantities[id] || 1) + delta),
      });
    } else {
      setActuatorQuantities({
        ...actuatorQuantities,
        [id]: Math.max(1, (actuatorQuantities[id] || 1) + delta),
      });
    }
  };

  // Reset all
  const resetAll = () => {
    setSelectedMCU("");
    setSelectedSensors([]);
    setSelectedComponents([]);
    setSelectedActuators([]);
    setSelectedDisplay("");
    setSensorQuantities({});
    setComponentQuantities({});
    setActuatorQuantities({});
  };

  // Export estimate
  const exportEstimate = () => {
    const mcu = mcuOptions.find((m) => m.id === selectedMCU);
    const display = displayOptions.find((d) => d.id === selectedDisplay);

    let estimate = `PROJECT COST ESTIMATE - Circuit Crafters\nDate: ${new Date().toLocaleDateString()}\n${"=".repeat(
      50,
    )}\n\n`;

    if (mcu) {
      estimate += `1. MICROCONTROLLER\n   ${mcu.name} - ₹${mcu.price}\n\n`;
    }

    if (selectedSensors.length > 0) {
      estimate += `2. SENSORS (${selectedSensors.length})\n`;
      selectedSensors.forEach((sensorId) => {
        const sensor = productsData.find((s) => s.id === sensorId);
        const qty = sensorQuantities[sensorId] || 1;
        if (sensor) {
          estimate += `   ${sensor.name} x${qty} - ₹${sensor.price * qty}\n`;
        }
      });
      estimate += `\n`;
    }

    if (selectedComponents.length > 0) {
      estimate += `3. COMPONENTS & POWER (${selectedComponents.length})\n`;
      selectedComponents.forEach((compId) => {
        const comp = powerComponents.find((c) => c.id === compId);
        const qty = componentQuantities[compId] || 1;
        if (comp) {
          estimate += `   ${comp.name} x${qty} - ₹${comp.price * qty}\n`;
        }
      });
      estimate += `\n`;
    }

    if (selectedActuators.length > 0) {
      estimate += `4. ACTUATORS (${selectedActuators.length})\n`;
      selectedActuators.forEach((actId) => {
        const act = actuatorOptions.find((a) => a.id === actId);
        const qty = actuatorQuantities[actId] || 1;
        if (act) {
          estimate += `   ${act.name} x${qty} - ₹${act.price * qty}\n`;
        }
      });
      estimate += `\n`;
    }

    if (display) {
      estimate += `5. DISPLAY\n   ${display.name} - ₹${display.price}\n\n`;
    }

    estimate += `${"=".repeat(
      50,
    )}\nTOTAL ESTIMATED COST: ₹${totalCost.toLocaleString(
      "en-IN",
    )}\n${"=".repeat(
      50,
    )}\n\nNote: This is an estimate only. Actual costs may vary.\nContact us for a detailed quote.`;

    const blob = new Blob([estimate], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `estimate-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-24 sm:pt-32 md:pt-40 pb-8 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent px-2">
              IoT Project Cost Estimator
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-4">
              Build your project step-by-step and get instant cost estimates
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {/* Left Column - Selection Cards */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
              {/* Card 1: Choose MCU */}
              <Card className="border-2 border-accent/20 shadow-sm">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                    <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
                    1. Choose Your MCU
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Select the microcontroller for your project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedMCU} onValueChange={setSelectedMCU}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a microcontroller..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mcuOptions.map((mcu) => (
                        <SelectItem key={mcu.id} value={mcu.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{mcu.name}</span>
                            <Badge variant="secondary" className="ml-4">
                              ₹{mcu.price}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Card 2: Choose Sensors */}
              <Card className="border-2 border-accent/20 shadow-sm">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                    <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
                    2. Choose Sensors
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Select multiple sensors (optional - {selectedSensors.length}{" "}
                    selected)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1 sm:pr-2">
                  {Object.entries(sensorsByCategory).map(
                    ([category, sensors]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground flex items-center gap-2 sticky top-0 bg-background py-1">
                          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                          {category}
                        </h4>
                        <div className="grid gap-2 pl-3 sm:pl-6">
                          {sensors.map((sensor) => (
                            <div
                              key={sensor.id}
                              className={`p-2 sm:p-3 rounded-lg border transition-colors ${
                                selectedSensors.includes(sensor.id)
                                  ? "border-accent bg-accent/5"
                                  : "border-border hover:border-accent/50"
                              }`}
                            >
                              {/* Top row: Checkbox, Name, and Price */}
                              <div className="flex items-start gap-2 sm:gap-3 w-full">
                                <Checkbox
                                  checked={selectedSensors.includes(sensor.id)}
                                  onCheckedChange={() =>
                                    toggleSensor(sensor.id)
                                  }
                                  className="shrink-0 mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs sm:text-sm font-medium leading-tight mb-0.5">
                                    {sensor.name}
                                  </p>
                                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                                    {sensor.id}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="shrink-0 text-xs font-semibold"
                                >
                                  ₹{sensor.price}
                                </Badge>
                              </div>

                              {/* Bottom row: Quantity controls (only when selected) */}
                              {selectedSensors.includes(sensor.id) && (
                                <div className="flex items-center gap-1.5 sm:gap-2 mt-2 ml-6 sm:ml-8">
                                  <span className="text-[10px] sm:text-xs text-muted-foreground mr-1">
                                    Qty:
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 sm:h-7 sm:w-7"
                                    onClick={() =>
                                      updateQuantity(sensor.id, -1, "sensor")
                                    }
                                  >
                                    -
                                  </Button>
                                  <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">
                                    {sensorQuantities[sensor.id] || 1}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 sm:h-7 sm:w-7"
                                    onClick={() =>
                                      updateQuantity(sensor.id, 1, "sensor")
                                    }
                                  >
                                    +
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </CardContent>
              </Card>

              {/* Card 3: Components & Power */}
              <Card className="border-2 border-accent/20 shadow-sm">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
                    3. Components & Power
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Add power supplies and other components (
                    {selectedComponents.length} selected)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {Object.entries(componentsByCategory).map(
                    ([category, components]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                          {category}
                        </h4>
                        <div className="grid gap-2 pl-3 sm:pl-6">
                          {components.map((component) => (
                            <div
                              key={component.id}
                              className={`p-2 sm:p-3 rounded-lg border transition-colors ${
                                selectedComponents.includes(component.id)
                                  ? "border-accent bg-accent/5"
                                  : "border-border hover:border-accent/50"
                              }`}
                            >
                              {/* Top row: Checkbox, Name, and Price */}
                              <div className="flex items-start gap-2 sm:gap-3 w-full">
                                <Checkbox
                                  checked={selectedComponents.includes(
                                    component.id,
                                  )}
                                  onCheckedChange={() =>
                                    toggleComponent(component.id)
                                  }
                                  className="shrink-0 mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs sm:text-sm font-medium leading-tight">
                                    {component.name}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="shrink-0 text-xs font-semibold"
                                >
                                  ₹{component.price}
                                </Badge>
                              </div>

                              {/* Bottom row: Quantity controls (only when selected) */}
                              {selectedComponents.includes(component.id) && (
                                <div className="flex items-center gap-1.5 sm:gap-2 mt-2 ml-6 sm:ml-8">
                                  <span className="text-[10px] sm:text-xs text-muted-foreground mr-1">
                                    Qty:
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 sm:h-7 sm:w-7"
                                    onClick={() =>
                                      updateQuantity(
                                        component.id,
                                        -1,
                                        "component",
                                      )
                                    }
                                  >
                                    -
                                  </Button>
                                  <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">
                                    {componentQuantities[component.id] || 1}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 sm:h-7 sm:w-7"
                                    onClick={() =>
                                      updateQuantity(
                                        component.id,
                                        1,
                                        "component",
                                      )
                                    }
                                  >
                                    +
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </CardContent>
              </Card>

              {/* Card 4: Choose Actuators */}
              <Card className="border-2 border-accent/20 shadow-sm">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                    <Settings2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
                    4. Choose Actuators
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Add motors, servos, and pumps ({selectedActuators.length}{" "}
                    selected)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {Object.entries(actuatorsByCategory).map(
                    ([category, actuators]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                          {category}
                        </h4>
                        <div className="grid gap-2 pl-3 sm:pl-6">
                          {actuators.map((actuator) => (
                            <div
                              key={actuator.id}
                              className={`p-2 sm:p-3 rounded-lg border transition-colors ${
                                selectedActuators.includes(actuator.id)
                                  ? "border-accent bg-accent/5"
                                  : "border-border hover:border-accent/50"
                              }`}
                            >
                              {/* Top row: Checkbox, Name, and Price */}
                              <div className="flex items-start gap-2 sm:gap-3 w-full">
                                <Checkbox
                                  checked={selectedActuators.includes(
                                    actuator.id,
                                  )}
                                  onCheckedChange={() =>
                                    toggleActuator(actuator.id)
                                  }
                                  className="shrink-0 mt-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs sm:text-sm font-medium leading-tight">
                                    {actuator.name}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="shrink-0 text-xs font-semibold"
                                >
                                  ₹{actuator.price}
                                </Badge>
                              </div>

                              {/* Bottom row: Quantity controls (only when selected) */}
                              {selectedActuators.includes(actuator.id) && (
                                <div className="flex items-center gap-1.5 sm:gap-2 mt-2 ml-6 sm:ml-8">
                                  <span className="text-[10px] sm:text-xs text-muted-foreground mr-1">
                                    Qty:
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 sm:h-7 sm:w-7"
                                    onClick={() =>
                                      updateQuantity(
                                        actuator.id,
                                        -1,
                                        "actuator",
                                      )
                                    }
                                  >
                                    -
                                  </Button>
                                  <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">
                                    {actuatorQuantities[actuator.id] || 1}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6 sm:h-7 sm:w-7"
                                    onClick={() =>
                                      updateQuantity(actuator.id, 1, "actuator")
                                    }
                                  >
                                    +
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </CardContent>
              </Card>

              {/* Card 5: Choose Display */}
              <Card className="border-2 border-accent/20 shadow-sm">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                    <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
                    5. Choose Display
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Select a display for your project (optional)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedDisplay}
                    onValueChange={setSelectedDisplay}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a display (optional)..." />
                    </SelectTrigger>
                    <SelectContent>
                      {displayOptions.map((display) => (
                        <SelectItem key={display.id} value={display.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{display.name}</span>
                            <Badge
                              variant={
                                display.price === 0 ? "outline" : "secondary"
                              }
                              className="ml-4"
                            >
                              {display.price === 0
                                ? "Free"
                                : `₹${display.price}`}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Cost Summary (Card 6) */}
            <div className="lg:col-span-1">
              <Card className="lg:sticky lg:top-24 border-2 border-accent shadow-lg">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
                    6. Cost Estimate
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Your project breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {/* MCU Cost */}
                  {selectedMCU && (
                    <div className="pb-2 border-b">
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span className="text-muted-foreground">
                          Microcontroller:
                        </span>
                        <span className="font-medium">₹{mcuCost}</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {mcuOptions.find((m) => m.id === selectedMCU)?.name}
                      </p>
                    </div>
                  )}

                  {/* Sensors Cost */}
                  {selectedSensors.length > 0 && (
                    <div className="pb-2 border-b">
                      <div className="flex justify-between text-xs sm:text-sm mb-1">
                        <span className="text-muted-foreground">
                          Sensors ({selectedSensors.length}):
                        </span>
                        <span className="font-medium">₹{sensorsCost}</span>
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground space-y-1">
                        {selectedSensors.slice(0, 3).map((sensorId) => {
                          const sensor = productsData.find(
                            (s) => s.id === sensorId,
                          );
                          const qty = sensorQuantities[sensorId] || 1;
                          return (
                            <div
                              key={sensorId}
                              className="flex justify-between"
                            >
                              <span className="truncate mr-2">
                                {sensor?.name} x{qty}
                              </span>
                              <span>₹{sensor ? sensor.price * qty : 0}</span>
                            </div>
                          );
                        })}
                        {selectedSensors.length > 3 && (
                          <p className="text-xs italic">
                            +{selectedSensors.length - 3} more...
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Components Cost */}
                  {selectedComponents.length > 0 && (
                    <div className="pb-2 border-b">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">
                          Components ({selectedComponents.length}):
                        </span>
                        <span className="font-medium">₹{componentsCost}</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {selectedComponents.slice(0, 3).map((compId) => {
                          const comp = powerComponents.find(
                            (c) => c.id === compId,
                          );
                          const qty = componentQuantities[compId] || 1;
                          return (
                            <div key={compId} className="flex justify-between">
                              <span className="truncate mr-2">
                                {comp?.name} x{qty}
                              </span>
                              <span>₹{comp ? comp.price * qty : 0}</span>
                            </div>
                          );
                        })}
                        {selectedComponents.length > 3 && (
                          <p className="text-xs italic">
                            +{selectedComponents.length - 3} more...
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actuators Cost */}
                  {selectedActuators.length > 0 && (
                    <div className="pb-2 border-b">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">
                          Actuators ({selectedActuators.length}):
                        </span>
                        <span className="font-medium">₹{actuatorsCost}</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {selectedActuators.slice(0, 3).map((actId) => {
                          const act = actuatorOptions.find(
                            (a) => a.id === actId,
                          );
                          const qty = actuatorQuantities[actId] || 1;
                          return (
                            <div key={actId} className="flex justify-between">
                              <span className="truncate mr-2">
                                {act?.name} x{qty}
                              </span>
                              <span>₹{act ? act.price * qty : 0}</span>
                            </div>
                          );
                        })}
                        {selectedActuators.length > 3 && (
                          <p className="text-xs italic">
                            +{selectedActuators.length - 3} more...
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Display Cost */}
                  {selectedDisplay && displayCost > 0 && (
                    <div className="pb-2 border-b">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Display:</span>
                        <span className="font-medium">₹{displayCost}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {
                          displayOptions.find((d) => d.id === selectedDisplay)
                            ?.name
                        }
                      </p>
                    </div>
                  )}

                  {/* Total */}
                  <div className="pt-3 sm:pt-4 border-t-2 border-accent">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <span className="text-sm sm:text-base md:text-lg font-bold">
                        Total Estimate:
                      </span>
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-accent">
                        ₹{totalCost.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Important Note - Price Disclaimer */}
                    {totalCost > 0 && (
                      <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 rounded-r-md">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-[10px] sm:text-xs font-semibold text-amber-800 dark:text-amber-400 mb-1">
                              N.B: Important Notice
                            </p>
                            <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                              Prices may not exactly match current market rates.
                              This cost estimation is{" "}
                              <span className="font-bold">approximate</span> and
                              subject to change based on availability and market
                              conditions.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {totalCost === 0 && (
                      <p className="text-[10px] sm:text-xs text-muted-foreground text-center mb-3 sm:mb-4">
                        Start by selecting components above
                      </p>
                    )}

                    {totalCost > 0 && (
                      <div className="space-y-2">
                        <Button
                          onClick={exportEstimate}
                          className="w-full text-xs sm:text-sm"
                          variant="default"
                        >
                          <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Download Estimate
                        </Button>
                        <Button
                          onClick={resetAll}
                          className="w-full text-xs sm:text-sm"
                          variant="outline"
                        >
                          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Start Over
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 sm:pt-4 text-[10px] sm:text-xs text-muted-foreground text-center border-t">
                    <p className="px-2">
                      This is an estimate only. Contact us for a detailed quote
                      and availability.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <StickyContactBar />
    </>
  );
}
