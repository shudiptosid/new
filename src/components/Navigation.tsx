import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import QuoteDialog from "./QuoteDialog";
import logoImage from "@/assets/circuit-crafters-logo.png";
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Services",
      href: "/services",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-elevated/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoImage}
              alt="Circuit Crafters Logo"
              className="h-12 w-auto ml-4"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-foreground hover:text-accent transition-colors duration-200 text-base px-2 py-1 rounded-md font-bold"
              >
                {item.label}
              </Link>
            ))}
            <QuoteDialog>
              <Button
                variant="default"
                className="bg-tech-blue hover:bg-tech-blue/90"
              >
                Get Quote
              </Button>
            </QuoteDialog>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block py-2 text-foreground hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <QuoteDialog>
              <Button
                variant="default"
                className="w-full mt-4 bg-tech-blue hover:bg-tech-blue/90"
              >
                Get Quote
              </Button>
            </QuoteDialog>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navigation;
