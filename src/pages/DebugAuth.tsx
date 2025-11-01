import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

const DebugAuth = () => {
  const { user, profile, loading, session } = useAuth();
  const [supabaseConfig, setSupabaseConfig] = useState<any>(null);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    // Check Supabase configuration
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    setSupabaseConfig({
      url: url ? `${url.substring(0, 30)}...` : "NOT SET",
      key: key ? `${key.substring(0, 20)}...` : "NOT SET",
      hasUrl: !!url,
      hasKey: !!key,
    });

    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setSessionData(data);
      console.log("Current session:", data);
    });
  }, []);

  const testConnection = async () => {
    try {
      console.log("Testing Supabase connection...");
      const { data, error } = await supabase
        .from("user_profiles")
        .select("count");

      if (error) {
        console.error("Connection test failed:", error);
        alert(`❌ Connection failed: ${error.message}`);
      } else {
        console.log("Connection test succeeded:", data);
        alert("✅ Supabase connection is working!");
      }
    } catch (err) {
      console.error("Connection test exception:", err);
      alert(`❌ Connection error: ${err}`);
    }
  };

  const checkAuthState = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("Current auth session:", session);
    alert(
      session ? `✅ Logged in as: ${session.user.email}` : "❌ Not logged in"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">
          Auth Debug Page
        </h1>

        {/* Supabase Config */}
        <Card className="p-6 mb-6 bg-surface border-border">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Supabase Configuration
          </h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">URL:</span>
              <span
                className={
                  supabaseConfig?.hasUrl ? "text-green-500" : "text-red-500"
                }
              >
                {supabaseConfig?.url}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Anon Key:</span>
              <span
                className={
                  supabaseConfig?.hasKey ? "text-green-500" : "text-red-500"
                }
              >
                {supabaseConfig?.key}
              </span>
            </div>
          </div>
          <Button onClick={testConnection} className="mt-4" variant="outline">
            Test Connection
          </Button>
        </Card>

        {/* Auth Context State */}
        <Card className="p-6 mb-6 bg-surface border-border">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Auth Context State
          </h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Loading:</span>
              <span className={loading ? "text-yellow-500" : "text-green-500"}>
                {loading ? "true" : "false"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">User:</span>
              <span className={user ? "text-green-500" : "text-red-500"}>
                {user ? user.email : "null"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Profile:</span>
              <span className={profile ? "text-green-500" : "text-red-500"}>
                {profile ? profile.full_name || "Loaded (no name)" : "null"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Session:</span>
              <span className={session ? "text-green-500" : "text-red-500"}>
                {session ? "Active" : "null"}
              </span>
            </div>
          </div>
          <Button onClick={checkAuthState} className="mt-4" variant="outline">
            Check Auth State
          </Button>
        </Card>

        {/* Session Data */}
        <Card className="p-6 mb-6 bg-surface border-border">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Session Data
          </h2>
          <pre className="bg-background p-4 rounded text-xs overflow-auto max-h-96">
            {JSON.stringify(sessionData, null, 2)}
          </pre>
        </Card>

        {/* User Data */}
        {user && (
          <Card className="p-6 mb-6 bg-surface border-border">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              User Data
            </h2>
            <pre className="bg-background p-4 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(user, null, 2)}
            </pre>
          </Card>
        )}

        {/* Profile Data */}
        {profile && (
          <Card className="p-6 bg-surface border-border">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Profile Data
            </h2>
            <pre className="bg-background p-4 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </Card>
        )}

        {/* Console Log Note */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded">
          <p className="text-sm text-foreground">
            📝 <strong>Note:</strong> Check the browser console (F12) for
            detailed logs. All auth events and state changes are logged there.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DebugAuth;
