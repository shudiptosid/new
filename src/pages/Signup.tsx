import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingIconsHome from "@/components/FloatingIconsHome";
import backgroundImage from "@/assets/bg3.jpg";
import "@/styles/auth-animations.css";

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    age: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Animation effects on component mount
  useEffect(() => {
    // Fade in and slide up animation for header
    if (headerRef.current) {
      headerRef.current.style.opacity = "0";
      headerRef.current.style.transform = "translateY(-20px)";

      setTimeout(() => {
        if (headerRef.current) {
          headerRef.current.style.transition =
            "opacity 0.6s ease-out, transform 0.6s ease-out";
          headerRef.current.style.opacity = "1";
          headerRef.current.style.transform = "translateY(0)";
        }
      }, 100);
    }

    // Fade in and scale animation for card
    if (cardRef.current) {
      cardRef.current.style.opacity = "0";
      cardRef.current.style.transform = "scale(0.95)";

      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition =
            "opacity 0.6s ease-out, transform 0.6s ease-out";
          cardRef.current.style.opacity = "1";
          cardRef.current.style.transform = "scale(1)";
        }
      }, 200);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    // Check all required fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Validate phone if provided
    if (formData.phone && formData.phone.length < 10) {
      setError("Please enter a valid phone number");
      return false;
    }

    // Validate age if provided
    if (formData.age) {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 18 || age > 120) {
        setError("Please enter a valid age between 18 and 120");
        return false;
      }
    }

    return true;
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log("Starting signup process...");

      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone || undefined,
        formData.location || undefined,
        formData.age ? parseInt(formData.age) : undefined
      );

      if (signUpError) {
        console.error("Signup error:", signUpError);
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Success - redirect immediately
      setSuccess(true);

      // Force redirect to login
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (err) {
      console.error("Signup exception:", err);
      setError("An unexpected error occurred during signup");
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    const { error: googleError } = await signInWithGoogle();

    if (googleError) {
      setError(googleError.message);
      setLoading(false);
      return;
    }

    // Google OAuth will redirect automatically
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Image */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-fixed z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundAttachment: "fixed",
          opacity: 0.9,
          backgroundSize: "cover",
        }}
      />
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/10 to-black/25 backdrop-blur-[0.2px] z-0" />

      {/* Floating Icons */}
      <div className="pointer-events-none z-10">
        <FloatingIconsHome isHomePage={false} />
      </div>

      <Navigation />

      <div className="flex-1 flex items-center justify-center px-4 py-12 pt-24 md:pt-32 relative z-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-white/90">
              Join Circuit Crafters and start your IoT journey
            </p>
          </div>

          {/* Signup Card */}
          <Card
            ref={cardRef}
            className="auth-card p-8 bg-surface-elevated border border-border shadow-xl"
          >
            {/* Success Message */}
            {success && (
              <div className="auth-success mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-500 font-semibold">
                    Account created successfully!
                  </p>
                  <p className="text-xs text-green-500/80 mt-1">
                    Please check your email to verify your account.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="auth-error mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {/* Google Sign Up Button (Top) */}
            <Button
              type="button"
              onClick={handleGoogleSignup}
              className="social-button w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-semibold flex items-center justify-center gap-3 mb-6"
              disabled={loading || success}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>

            {/* Divider */}
            <div className="auth-divider relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface-elevated text-muted-foreground">
                  OR
                </span>
              </div>
            </div>

            {/* Manual Signup Form */}
            <form onSubmit={handleEmailSignup} className="space-y-4">
              {/* Full Name Input */}
              <div className="form-field">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="auth-input pl-10 h-12"
                    disabled={loading || success}
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="form-field">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="auth-input pl-10 h-12"
                    disabled={loading || success}
                    required
                  />
                </div>
              </div>

              {/* Phone Input (Optional) */}
              <div className="form-field">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Phone Number{" "}
                  <span className="text-muted-foreground text-xs">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="auth-input pl-10 h-12"
                    disabled={loading || success}
                  />
                </div>
              </div>

              {/* Location Input (Optional) */}
              <div className="form-field">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Location{" "}
                  <span className="text-muted-foreground text-xs">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={handleChange}
                    className="auth-input pl-10 h-12"
                    disabled={loading || success}
                  />
                </div>
              </div>

              {/* Age Input (Optional) */}
              <div className="form-field">
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Age{" "}
                  <span className="text-muted-foreground text-xs">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="18+"
                    min="18"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                    className="auth-input pl-10 h-12"
                    disabled={loading || success}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-field">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className="auth-input pl-10 pr-12 h-12"
                    disabled={loading || success}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading || success}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="form-field">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="auth-input pl-10 pr-12 h-12"
                    disabled={loading || success}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading || success}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="text-xs text-muted-foreground pt-2">
                By signing up, you agree to our{" "}
                <Link to="/terms" className="text-accent hover:text-accent/80">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-accent hover:text-accent/80"
                >
                  Privacy Policy
                </Link>
              </div>

              {/* Signup Button */}
              <Button
                type="submit"
                className="auth-button w-full h-12 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-semibold text-base mt-4"
                disabled={loading || success}
              >
                {loading
                  ? "Creating Account..."
                  : success
                  ? "Account Created!"
                  : "Create Account"}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="auth-link text-accent hover:text-accent/80 font-semibold transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </Card>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-white hover:text-white/80 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Signup;
