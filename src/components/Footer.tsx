import {
  Instagram,
  Phone,
  Mail,
  MapPin,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { memo } from "react";

const Footer = () => {
  return (
    <footer className="bg-surface-elevated border-t border-border relative z-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent drop-shadow-lg">
              Circuit Crafters
            </h3>
            <p className="text-muted-foreground font-medium">
              Expert firmware and IoT prototyping solutions for innovative
              embedded systems.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                asChild
              >
                <a
                  href="https://instagram.com/circuit_crafters_cc"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                asChild
              >
                <a
                  href="https://x.com/CraftersCircuit"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                asChild
              >
                <a
                  href="https://linkedin.com/company/circuit-crafters"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">+91 8389090990</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">
                  circuitcraftersiot@gmail.com
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">
                  Lovely Professional University, Punjab, India
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/projects"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* WhatsApp Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">
              Quick Contact
            </h4>
            <p className="text-muted-foreground">
              Have a question? Reach out via WhatsApp for a quick response.
            </p>
            <Button className="w-full bg-green-500 hover:bg-green-600" asChild>
              <a
                href="https://wa.me/918389090990"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="w-4 h-4 mr-2" />
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Circuit Crafters. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
