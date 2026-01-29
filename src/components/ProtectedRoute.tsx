import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [profileCheckComplete, setProfileCheckComplete] = useState(false);

  // Wait for profile to be loaded when admin access is required
  useEffect(() => {
    if (!loading && user && requireAdmin) {
      // Give profile a moment to load after user is authenticated
      const timer = setTimeout(() => {
        setProfileCheckComplete(true);
      }, 1000); // Increased to 1 second to ensure profile loads

      return () => clearTimeout(timer);
    } else {
      setProfileCheckComplete(true);
    }
  }, [loading, user, requireAdmin]);

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
    console.log("ProtectedRoute: No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Admin required - wait for profile check to complete
  if (requireAdmin && !profileCheckComplete) {
    console.log("ProtectedRoute: Waiting for profile check...", {
      email: user?.email,
      profileLoaded: !!profile,
      profileRole: profile?.role,
    });
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Admin required - check role only (any user with admin role can access)
  if (requireAdmin) {
    const isAdminRole = profile?.role === "admin";

    console.log("ProtectedRoute: Admin check", {
      email: user?.email,
      profileRole: profile?.role,
      isAdminRole,
      profileLoaded: !!profile,
    });

    // User must have admin role
    if (!isAdminRole) {
      console.log("ProtectedRoute: Access denied - not admin", {
        email: user?.email,
        role: profile?.role,
      });
      return <Navigate to="/" replace />;
    }
  }

  console.log("ProtectedRoute: Access granted", {
    requireAdmin,
    userRole: profile?.role,
    email: user?.email,
  });

  // User is authenticated (and admin if required) - render the protected page
  return <>{children}</>;
};
