import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute Component
 * Wraps public routes like Login/Signup.
 * Redirects already-authenticated users to dashboard.
 * This prevents logged-in users from accessing login/signup pages.
 */
export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Already authenticated - redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Not authenticated - show the public page (login/signup)
  return <>{children}</>;
};
