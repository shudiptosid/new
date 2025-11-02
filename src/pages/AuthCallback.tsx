import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

/**
 * OAuth Callback Handler
 * This page processes the OAuth callback from Google/other providers
 * and redirects users to the appropriate page after authentication.
 */
const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("Processing OAuth callback...");

        // Get the session from the URL hash/query params
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("OAuth callback error:", error);
          // Redirect to login with error
          navigate("/login?error=oauth_failed", { replace: true });
          return;
        }

        if (data.session) {
          console.log("OAuth successful! User:", data.session.user.email);

          // Check if user has a profile (for Google OAuth, this might be their first time)
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", data.session.user.id)
            .single();

          if (!profile) {
            console.log("Creating profile for OAuth user...");
            // Create profile for OAuth user
            await supabase.from("user_profiles").insert({
              id: data.session.user.id,
              email: data.session.user.email!,
              full_name:
                data.session.user.user_metadata?.full_name ||
                data.session.user.user_metadata?.name ||
                data.session.user.email?.split("@")[0] ||
                "User",
              avatar_url: data.session.user.user_metadata?.avatar_url || null,
              role: "customer",
              email_verified: true, // OAuth emails are pre-verified
            });
          }

          // Redirect to dashboard
          console.log("Redirecting to dashboard...");
          navigate("/dashboard", { replace: true });
        } else {
          console.log("No session found in callback");
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Exception in OAuth callback:", error);
        navigate("/login?error=callback_failed", { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Completing Sign In...
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Please wait while we set up your account
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
