import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import QuoteDialog from "./QuoteDialog";
import logoImage from "@/assets/2nd logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
      label: "Resources",
      href: "/resources",
    },
    {
      label: "Cost Estimator",
      href: "/cost-estimator",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-elevated/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group relative p-2 rounded-lg hover:bg-accent/10 transition-all duration-300"
          >
            <div className="relative bg-surface-elevated/90 rounded-lg p-2 -m-2">
              <img
                src={logoImage}
                alt="Circuit Crafters Logo"
                className="h-12 w-auto drop-shadow-lg brightness-110 contrast-125 saturate-110 group-hover:scale-105 transition-transform duration-300"
                style={{
                  filter:
                    "drop-shadow(0 2px 8px rgba(0, 154, 217, 0.3)) brightness(1.1) contrast(1.25)",
                }}
              />
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`transition-all duration-200 text-base px-3 py-1.5 rounded-md font-medium ${
                  item.href === "/cost-estimator"
                    ? "bg-accent text-white hover:bg-accent/90 shadow-md hover:shadow-lg font-semibold"
                    : `text-foreground hover:text-accent ${
                        location.pathname === item.href
                          ? "text-accent font-semibold"
                          : ""
                      }`
                }`}
              >
                {item.label}
              </Link>
            ))}
            <QuoteDialog>
              <Button
                variant="default"
                className="bg-accent hover:bg-accent/90"
              >
                Get Quote
              </Button>
            </QuoteDialog>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-foreground hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`py-2 px-4 rounded-md transition-all ${
                    item.href === "/cost-estimator"
                      ? "bg-accent text-white font-semibold shadow-md"
                      : location.pathname === item.href
                      ? "bg-accent/10 text-accent font-semibold"
                      : "text-foreground hover:bg-accent/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2">
                <QuoteDialog>
                  <Button
                    variant="default"
                    className="w-full bg-accent hover:bg-accent/90"
                  >
                    Get Quote
                  </Button>
                </QuoteDialog>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
