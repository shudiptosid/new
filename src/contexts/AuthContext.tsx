import { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone_number?: string;
  role: "customer" | "admin";
  company?: string;
  location?: string;
  age?: number;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone?: string,
    location?: string,
    age?: number
  ) => Promise<{ error: AuthError | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (
    updates: Partial<UserProfile>
  ) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database with timeout
  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);

      // Create a timeout promise (10 seconds for slower connections)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Profile fetch timeout")), 10000);
      });

      // Race between fetch and timeout
      const fetchPromise = supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      const { data, error } = (await Promise.race([
        fetchPromise,
        timeoutPromise.then(() => ({
          data: null,
          error: new Error("Timeout"),
        })),
      ])) as any;

      if (error) {
        console.error("Profile fetch error:", error);
        console.error("Error details:", error.message, error.code);
        // Set profile to null so we know fetch completed (even if failed)
        setProfile(null);
        return null;
      }

      console.log("Profile fetched successfully:", data);
      setProfile(data);
      return data;
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      console.error("Exception details:", error?.message);
      // Always set profile (to null if failed) so loading can complete
      setProfile(null);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    console.log("AuthContext initializing...");

    // Get initial session
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        if (!mounted) return;

        console.log("Initial session:", session?.user?.email || "No user");

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        }

        // CRITICAL: Always set loading to false, even if profile fetch failed
        setLoading(false);
        console.log("Auth loading complete, loading set to false");
      })
      .catch((error) => {
        console.error("Error getting session:", error);
        setLoading(false); // Set loading false even on error
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log(
        "Auth state changed:",
        event,
        session?.user?.email || "No user"
      );

      setSession(session);
      setUser(session?.user ?? null);

      // Fetch profile on SIGNED_IN event
      if (event === "SIGNED_IN" && session?.user) {
        console.log("User signed in, fetching profile...");
        await fetchProfile(session.user.id);
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out, clearing profile");
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string,
    location?: string,
    age?: number
  ) => {
    try {
      const metadata = {
        full_name: fullName,
        phone: phone || "",
        location: location || "",
        age: age?.toString() || "",
      };

      console.log("Signing up with metadata:", metadata);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        return { error };
      }

      console.log("User signed up successfully:", data.user?.email);
      console.log("User metadata:", data.user?.user_metadata);
      console.log(
        "User session:",
        data.session ? "Created" : "Pending confirmation"
      );

      // Backup: Create profile manually if trigger might have failed
      // Use shorter timeout to avoid UI freeze
      if (data.user) {
        // Check if profile exists after brief delay for trigger
        setTimeout(async () => {
          try {
            const { data: existingProfile } = await supabase
              .from("user_profiles")
              .select("id")
              .eq("id", data.user!.id)
              .single();

            if (!existingProfile) {
              console.log("Profile not found, creating manually...");
              const { error: profileError } = await supabase
                .from("user_profiles")
                .insert({
                  id: data.user!.id,
                  email: data.user!.email!,
                  full_name: fullName,
                  phone_number: phone || null,
                  location: location || null,
                  age: age || null,
                  role: "customer",
                  email_verified: false,
                });

              if (profileError) {
                console.error("Error creating profile manually:", profileError);
              } else {
                console.log("Profile created manually successfully");
              }
            } else {
              console.log("Profile exists from trigger");
            }
          } catch (err) {
            console.error("Error checking/creating profile:", err);
          }
        }, 500); // Non-blocking 500ms delay
      }

      return { error: null };
    } catch (error) {
      console.error("Signup exception:", error);
      return { error: error as AuthError };
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) return { error };

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      console.log("Signing out...");

      // Clear state first
      setUser(null);
      setProfile(null);
      setSession(null);

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase signout error:", error);
      }

      console.log("Sign out successful, redirecting...");

      // Redirect to home and reload page
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out exception:", error);
      // Force clear state and redirect even if signOut fails
      setUser(null);
      setProfile(null);
      setSession(null);
      window.location.href = "/";
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error("No user logged in") };

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      // Refresh profile
      await fetchProfile(user.id);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
