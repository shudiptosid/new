import React, { useState } from "react";
import {
  MessageCircle,
  Instagram,
  Twitter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const StickyContactBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const contacts = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: "https://wa.me/918389090990",
      bgColor: "bg-green-500 hover:bg-green-600",
      label: "Contact via WhatsApp",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/circuit_crafters_cc",
      bgColor:
        "bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600",
      label: "Follow on Instagram",
    },
    {
      name: "X",
      icon: Twitter,
      href: "https://x.com/CraftersCircuit",
      bgColor: "bg-black hover:bg-gray-800",
      label: "Follow on X",
    },
  ];

  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
      <div
        className={`flex items-center transition-all duration-300 ease-in-out ${
          isExpanded ? "translate-x-0" : "translate-x-[calc(100%-3rem)]"
        }`}
      >
        {/* Toggle Button */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-12 w-12 rounded-l-full rounded-r-none bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg border-r border-accent-foreground/20"
          size="icon"
        >
          {isExpanded ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </Button>

        {/* Contact Buttons */}
        <div
          className={`flex flex-col space-y-2 bg-white dark:bg-gray-900 p-3 rounded-l-lg shadow-lg border-l border-t border-b transition-all duration-300 ${
            isExpanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          }`}
        >
          {contacts.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <Button
                key={contact.name}
                asChild
                className={`h-10 w-10 rounded-full ${contact.bgColor} text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105`}
                size="icon"
                style={{
                  animationDelay: isExpanded ? `${index * 100}ms` : "0ms",
                }}
              >
                <a
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={contact.label}
                  title={contact.label}
                >
                  <IconComponent className="w-5 h-5" />
                </a>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default StickyContactBar;
