import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import iotSensorImage from "@/assets/Project A.jpg";
import smartHomeImage from "@/assets/Project B.jpg";
import industrialImage from "@/assets/Project C.jpg";

const FeaturedProjects = () => {
  // Only show your project description in quotes, no photo
  const myProjectDescription = "Your project description goes here.";

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how I've helped companies bring innovative embedded
            solutions to life, from proof of concept to market-ready products.
          </p>
        </div>

        {/* Static 2x3 grid for top projects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Row 1 */}
          <Card className="p-6 flex flex-col items-center text-center shadow-lg">
            <img
              src={iotSensorImage}
              alt="Crop Shade"
              className="h-32 w-full object-cover rounded mb-4"
            />
            <h3 className="text-xl font-bold mb-2">Crop Shade</h3>
            <p className="text-muted-foreground mb-2">
              Wireless sensor nodes for environmental monitoring with ultra-low
              power consumption.
            </p>
          </Card>
          <Card className="p-6 flex flex-col items-center text-center shadow-lg">
            <img
              src={smartHomeImage}
              alt="Automatic Green House Ambience Control"
              className="h-32 w-full object-cover rounded mb-4"
            />
            <h3 className="text-xl font-bold mb-2">
              Automatic Green House Ambience Control
            </h3>
            <p className="text-muted-foreground mb-2">
              Home automation hub with touchscreen and seamless device
              integration.
            </p>
          </Card>
          <Card className="p-6 flex flex-col items-center text-center shadow-lg">
            <img
              src={industrialImage}
              alt="Remote Heart Rate and SPO2 monitor"
              className="h-32 w-full object-cover rounded mb-4"
            />

            <h3 className="text-xl font-bold mb-2">
              Remote Heart Rate and SPO2 monitor
            </h3>
            <p className="text-muted-foreground mb-2">
              Rugged gateway for connecting legacy equipment to modern IoT
              platforms.
            </p>
          </Card>
        </div>

        {/* Space for a video */}
        <div className="flex justify-center items-center mb-12 min-h-[240px] bg-muted rounded-lg">
          {/* Replace the div below with your video embed or player */}
          <span className="text-muted-foreground text-lg">
            Video coming soon...
          </span>
        </div>

        {/* Space for a video */}
        <div className="flex justify-center items-center mb-12 min-h-[240px] bg-muted rounded-lg">
          {/* Replace the div below with your video embed or player */}
          <span className="text-muted-foreground text-lg">
            Video coming soon...
          </span>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
