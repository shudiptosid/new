import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import iotSensorImage from "@/assets/project-iot-sensor.jpg";
import smartHomeImage from "@/assets/project-smart-home.jpg";
import industrialImage from "@/assets/project-industrial.jpg";

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

        <div className="flex justify-center mb-12">
          <Card className="w-full max-w-2xl mx-auto p-8 text-center text-xl font-medium text-foreground shadow-lg">
            "{myProjectDescription}"
          </Card>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 px-8 py-4 text-lg"
          >
            View All Projects
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
