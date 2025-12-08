import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect, memo } from "react";
import logoImage from "@/assets/2nd logo.png";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

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
      label: "Contact",
      href: "/contact",
    },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showUserMenu]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-elevated/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group relative p-2 rounded-lg hover:bg-accent/10 transition-all duration-150"
          >
            <div className="relative bg-surface-elevated/90 rounded-lg p-2 -m-2">
              <img
                src={logoImage}
                alt="Circuit Crafters Logo"
                className="h-12 w-auto drop-shadow-lg brightness-110 contrast-125 saturate-110 group-hover:scale-105 transition-transform duration-150"
                style={{
                  filter:
                    "drop-shadow(0 2px 8px rgba(0, 154, 217, 0.3)) brightness(1.1) contrast(1.25)",
                }}
              />
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 -z-10"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`transition-all duration-200 text-sm px-3 py-1.5 rounded-md font-medium ${
                  location.pathname === item.href
                    ? "text-accent font-semibold"
                    : "text-foreground hover:text-accent"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Auth Buttons / User Menu */}
            {user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors"
                >
                  <User size={18} />
                  <span className="text-sm font-medium">
                    {profile?.full_name || "User"}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface-elevated border border-border rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-semibold">
                        {profile?.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent/10 transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={async () => {
                        setShowUserMenu(false);
                        await signOut(); // signOut now handles redirect and reload
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative user-menu-container">
                <Button
                  variant="default"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="bg-accent hover:bg-accent/90 flex items-center gap-2"
                >
                  <User size={16} />
                  Account
                </Button>

                {/* Dropdown Menu for Login/Signup */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-surface-elevated border border-border rounded-lg shadow-xl py-2 z-50">
                    <button
                      onClick={() => {
                        navigate("/login");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent/10 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate("/signup");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent/10 transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            )}
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

              {/* Mobile Auth Buttons */}
              {user ? (
                <div className="pt-2 border-t border-border mt-2">
                  <div className="px-4 py-3 bg-accent/10 rounded-lg mb-2">
                    <p className="text-sm font-semibold">
                      {profile?.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate("/dashboard");
                      setIsMenuOpen(false);
                    }}
                    className="w-full mb-2"
                  >
                    <User size={16} className="mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await signOut(); // signOut now handles redirect and reload
                    }}
                    className="w-full text-red-500 border-red-500 hover:bg-red-500/10"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="pt-2 border-t border-border mt-2 space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    className="w-full border-accent text-accent hover:bg-accent/10"
                  >
                    Login
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      navigate("/signup");
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default memo(Navigation);
