import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";

interface SensorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sensor: {
    name: string;
    type: string;
    image: string;
    shortDescription: string;
    workingPrinciple: string;
    pinDiagram: string;
    useCases: string[];
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    datasheet?: string; // Optional datasheet URL
  };
}

export const SensorDialog = ({
  isOpen,
  onClose,
  sensor,
}: SensorDialogProps) => {
  // Update document metadata for SEO when dialog opens
  useEffect(() => {
    if (isOpen) {
      const originalTitle = document.title;
      const originalDescription = document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content");

      // Update page title and meta description
      document.title = sensor.metaTitle;
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", sensor.metaDescription);
      }

      // Add keywords meta tag
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", sensor.keywords.join(", "));

      // Restore original metadata when dialog closes
      return () => {
        document.title = originalTitle;
        if (originalDescription && metaDescription) {
          metaDescription.setAttribute("content", originalDescription);
        }
      };
    }
  }, [isOpen, sensor]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-accent mb-2">
            {sensor.name}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {sensor.type}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Sensor Image */}
          <div className="flex justify-center">
            <div className="w-64 h-64 bg-white rounded-xl border-2 border-accent/20 p-4 flex items-center justify-center">
              <img
                src={sensor.image}
                alt={sensor.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
              🔹 Short Description
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {sensor.shortDescription}
            </p>
          </div>

          {/* Working Principle */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
              ⚙️ Working Principle
            </h3>
            <div
              className="text-muted-foreground leading-relaxed space-y-2"
              dangerouslySetInnerHTML={{ __html: sensor.workingPrinciple }}
            />
          </div>

          {/* Pin Diagram */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
              🔌 Pin Diagram and Description
            </h3>
            <div
              className="text-muted-foreground leading-relaxed space-y-2"
              dangerouslySetInnerHTML={{ __html: sensor.pinDiagram }}
            />
          </div>

          {/* Use Cases */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
              💡 Use Cases
            </h3>
            <p className="text-muted-foreground mb-3">
              {sensor.name} is widely used in multiple applications:
            </p>
            <ul className="space-y-2">
              {sensor.useCases.map((useCase, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-muted-foreground"
                >
                  <span className="text-accent font-bold">•</span>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Datasheet Link */}
          {sensor.datasheet && (
            <div className="pt-4 border-t border-border">
              <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                📄 Datasheet
              </h3>
              <a
                href={sensor.datasheet}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors duration-200 font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                View Datasheet
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
