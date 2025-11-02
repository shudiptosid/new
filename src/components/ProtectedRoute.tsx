import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication.
 * Prevents unauthorized page loads by checking auth BEFORE rendering the page.
 *
 * @param requireAdmin - If true, requires admin role
 */
export const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  // Show loading spinner while checking authentication
  // This prevents flash of content and unnecessary page loads
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

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin required but user is not admin
  if (requireAdmin && profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // User is authenticated (and admin if required) - render the protected page
  return <>{children}</>;
};
