import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  isCurrentUserInAdminAllowlist,
  verifyAdminPanelPassword,
} from "@/lib/supabaseService";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ADMIN_UNLOCK_KEY = "admin_unlock_until";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signOut } = useAuth();

  const params = new URLSearchParams(location.search);
  const nextPath = useMemo(
    () => params.get("next") || "/admin",
    [location.search],
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUserSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("Enter your permitted Gmail and account password");
      return;
    }

    setLoading(true);
    const { error: signInError } = await signIn(
      email.trim().toLowerCase(),
      password,
    );
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    setSuccess("Account verified. Enter admin passcode to continue.");
  };

  const handleAdminUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user?.email) {
      setError("Sign in with your Gmail account first");
      return;
    }

    if (!adminPasscode.trim()) {
      setError("Enter the admin passcode");
      return;
    }

    setLoading(true);

    try {
      const isAllowlisted = await isCurrentUserInAdminAllowlist();
      if (!isAllowlisted) {
        setError("Your Gmail is not permitted by admin");
        setLoading(false);
        return;
      }

      const result = await verifyAdminPanelPassword(adminPasscode.trim());

      const unlockUntil = Date.now() + result.expiresInMinutes * 60 * 1000;
      sessionStorage.setItem(ADMIN_UNLOCK_KEY, unlockUntil.toString());

      navigate(nextPath, { replace: true });
    } catch (unlockError: any) {
      setError(unlockError?.message || "Failed to verify admin passcode");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
      <Navigation />

      <main className="flex-1 pt-28 pb-12 px-4">
        <div className="max-w-lg mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Security Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {error ? (
                <div className="rounded-md border border-red-300 bg-red-50 text-red-700 px-3 py-2 text-sm">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="rounded-md border border-emerald-300 bg-emerald-50 text-emerald-700 px-3 py-2 text-sm">
                  {success}
                </div>
              ) : null}

              {!user ? (
                <form onSubmit={handleUserSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Permitted Gmail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Account Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your account password"
                      disabled={loading}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Checking account..." : "Sign In"}
                  </Button>
                </form>
              ) : (
                <div className="rounded-md border bg-muted px-3 py-2 text-sm">
                  Signed in as <strong>{user.email}</strong>
                </div>
              )}

              {user ? (
                <form onSubmit={handleAdminUnlock} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-passcode">Admin Passcode</Label>
                    <Input
                      id="admin-passcode"
                      type="password"
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      placeholder="Enter admin passcode"
                      disabled={loading}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Verifying..." : "Unlock Admin Panel"}
                  </Button>
                </form>
              ) : null}

              <div className="flex items-center justify-between text-sm">
                <Link to="/login" className="text-accent hover:underline">
                  Go to normal login
                </Link>
                {user ? (
                  <button
                    type="button"
                    className="text-red-600 hover:underline"
                    onClick={() => {
                      signOut();
                    }}
                  >
                    Sign out
                  </button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLogin;
