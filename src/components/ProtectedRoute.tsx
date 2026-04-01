import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  isCurrentUserInAdminAllowlist,
  isValidGmail,
} from "@/lib/supabaseService";

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
  const location = useLocation();
  const { user, profile, loading } = useAuth();
  const [profileCheckComplete, setProfileCheckComplete] = useState(false);
  const [adminGateLoading, setAdminGateLoading] = useState(requireAdmin);
  const [adminGatePassed, setAdminGatePassed] = useState(false);

  const ADMIN_UNLOCK_KEY = "admin_unlock_until";

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

  useEffect(() => {
    const checkAdminGate = async () => {
      if (!requireAdmin) {
        setAdminGateLoading(false);
        setAdminGatePassed(true);
        return;
      }

      if (loading || !user) {
        return;
      }

      if (profile?.role !== "admin") {
        setAdminGatePassed(false);
        setAdminGateLoading(false);
        return;
      }

      const email = user.email?.toLowerCase() || "";
      const hasGmail = isValidGmail(email);
      const inAllowlist = await isCurrentUserInAdminAllowlist();
      const unlockedUntil = Number(
        sessionStorage.getItem(ADMIN_UNLOCK_KEY) || 0,
      );
      const hasUnlockedAdmin =
        Number.isFinite(unlockedUntil) && unlockedUntil > Date.now();

      setAdminGatePassed(hasGmail && inAllowlist && hasUnlockedAdmin);
      setAdminGateLoading(false);
    };

    checkAdminGate().catch((error) => {
      console.error("ProtectedRoute: Admin gate check failed", error);
      setAdminGatePassed(false);
      setAdminGateLoading(false);
    });
  }, [requireAdmin, loading, user, profile?.role]);

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

  // Admin required - first level check: user role
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

    if (adminGateLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
            <p className="text-muted-foreground">
              Verifying admin security checks...
            </p>
          </div>
        </div>
      );
    }

    if (!adminGatePassed) {
      const next = encodeURIComponent(location.pathname + location.search);
      return <Navigate to={`/admin-login?next=${next}`} replace />;
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
