import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const TestSupabase = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>("");
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Test Supabase connection
  const testConnection = async () => {
    setLoading(true);
    setConnectionStatus("Testing connection...");

    try {
      // Test 1: Check if Supabase client is initialized
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

      console.log("Supabase URL:", url);
      console.log(
        "Supabase Key (first 20 chars):",
        key?.substring(0, 20) + "..."
      );

      if (!url || !key) {
        setConnectionStatus(
          "❌ ERROR: Supabase credentials not found in .env file"
        );
        setLoading(false);
        return;
      }

      // Test 2: Try to connect to Supabase
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setConnectionStatus(`❌ Connection Error: ${error.message}`);
        console.error("Connection error:", error);
      } else {
        setConnectionStatus("✅ Supabase connection successful!");
        console.log("Connection test passed:", data);
      }

      // Test 3: Check if user_profiles table exists
      const { data: tableData, error: tableError } = await supabase
        .from("user_profiles")
        .select("id")
        .limit(1);

      if (tableError) {
        setConnectionStatus(
          (prev) =>
            prev + "\n⚠️ user_profiles table error: " + tableError.message
        );
        console.error("Table error:", tableError);
      } else {
        setConnectionStatus(
          (prev) => prev + "\n✅ user_profiles table exists!"
        );
        console.log("Table test passed");
      }
    } catch (error) {
      setConnectionStatus(`❌ Exception: ${error}`);
      console.error("Test exception:", error);
    }

    setLoading(false);
  };

  // Create dummy user
  const createDummyUser = async () => {
    setLoading(true);
    setTestResult("Creating dummy user...");

    try {
      const dummyEmail = `test${Date.now()}@example.com`;
      const dummyPassword = "Test123456!";
      const dummyData = {
        fullName: "Test User",
        phone: "+1234567890",
        location: "New York, USA",
        age: 25,
      };

      console.log("Creating user:", dummyEmail);
      console.log("User data:", dummyData);

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: dummyEmail,
        password: dummyPassword,
        options: {
          data: {
            full_name: dummyData.fullName,
            phone: dummyData.phone,
            location: dummyData.location,
            age: dummyData.age.toString(),
          },
        },
      });

      if (error) {
        setTestResult(`❌ Signup Error: ${error.message}`);
        console.error("Signup error:", error);
        setLoading(false);
        return;
      }

      console.log("User created:", data);
      setTestResult(
        `✅ User created successfully!\n\nEmail: ${dummyEmail}\nPassword: ${dummyPassword}\nUser ID: ${data.user?.id}`
      );

      // Wait for trigger to create profile
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check if profile was created
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          setTestResult(
            (prev) =>
              prev +
              `\n\n⚠️ Profile not found in database!\nError: ${profileError.message}\n\nPlease run AUTH_DATABASE_SETUP.sql in Supabase!`
          );
          console.error("Profile error:", profileError);

          // Try to create profile manually
          const { error: insertError } = await supabase
            .from("user_profiles")
            .insert({
              id: data.user.id,
              email: dummyEmail,
              full_name: dummyData.fullName,
              phone_number: dummyData.phone,
              location: dummyData.location,
              age: dummyData.age,
              role: "customer",
              email_verified: false,
            });

          if (insertError) {
            setTestResult(
              (prev) =>
                prev +
                `\n❌ Manual profile creation failed: ${insertError.message}`
            );
          } else {
            setTestResult((prev) => prev + `\n✅ Profile created manually!`);
          }
        } else {
          setTestResult(
            (prev) =>
              prev +
              `\n\n✅ Profile created in database!\n\nProfile Data:\n${JSON.stringify(
                profileData,
                null,
                2
              )}`
          );
          console.log("Profile found:", profileData);
        }
      }
    } catch (error) {
      setTestResult(`❌ Exception: ${error}`);
      console.error("Exception:", error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold mb-8">Supabase Connection Test</h1>

          {/* Connection Test Card */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">1. Test Connection</h2>
            <p className="text-muted-foreground mb-4">
              Check if Supabase is properly connected and configured.
            </p>
            <Button
              onClick={testConnection}
              disabled={loading}
              className="mb-4"
            >
              {loading ? "Testing..." : "Test Connection"}
            </Button>
            {connectionStatus && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">
                  {connectionStatus}
                </pre>
              </div>
            )}
          </Card>

          {/* Create Dummy User Card */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              2. Create Dummy User
            </h2>
            <p className="text-muted-foreground mb-4">
              Create a test user with sample data to verify signup works.
            </p>
            <Button
              onClick={createDummyUser}
              disabled={loading}
              variant="secondary"
              className="mb-4"
            >
              {loading ? "Creating..." : "Create Dummy User"}
            </Button>
            {testResult && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
              </div>
            )}
          </Card>

          {/* Instructions Card */}
          <Card className="p-6 bg-accent/5">
            <h2 className="text-2xl font-semibold mb-4">📋 Instructions</h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Step 1:</strong> Click "Test Connection" to verify
                Supabase is connected
              </p>
              <p>
                <strong>Step 2:</strong> If connection is OK, click "Create
                Dummy User"
              </p>
              <p>
                <strong>Step 3:</strong> Check your Supabase dashboard:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Go to Authentication → Users (should see new user)</li>
                <li>
                  Go to Table Editor → user_profiles (should see profile data)
                </li>
              </ul>
              <p className="mt-4 text-yellow-600">
                <strong>⚠️ Important:</strong> If profile is not created, you
                need to run AUTH_DATABASE_SETUP.sql in Supabase SQL Editor!
              </p>
            </div>
          </Card>

          {/* Debug Info Card */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">🔍 Debug Info</h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Supabase URL:</strong>{" "}
                {import.meta.env.VITE_SUPABASE_URL || "NOT SET"}
              </p>
              <p>
                <strong>API Key:</strong>{" "}
                {import.meta.env.VITE_SUPABASE_ANON_KEY
                  ? "✅ Set"
                  : "❌ NOT SET"}
              </p>
              <p>
                <strong>Console:</strong> Press F12 to see detailed logs
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestSupabase;
