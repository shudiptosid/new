import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingIconsHome from "@/components/FloatingIconsHome";
import backgroundImage from "@/assets/bg3.jpg";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  Briefcase,
  Code,
  Lightbulb,
  Wrench,
  MapPin,
} from "lucide-react";

// Service categories
const categories = [
  {
    id: "consulting",
    name: "Consulting",
    icon: Lightbulb,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "prototyping",
    name: "Prototyping",
    icon: Wrench,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "firmware",
    name: "Firmware Development",
    icon: Code,
    color: "from-green-500 to-green-600",
  },
  {
    id: "ondemand",
    name: "On Demand Project",
    icon: Briefcase,
    color: "from-orange-500 to-orange-600",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [queries, setQueries] = useState<any[]>([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Member since date
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  // Handle category selection
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // TODO: Fetch queries for this category from backend
    // For now, we'll use placeholder data
    setQueries([]);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user after loading, they'll be redirected by useEffect
  if (!user) {
    return null;
  }

  // Log if profile is missing (still works without it)
  if (!profile) {
    console.log("No profile found for user:", user.id);
    console.log("Dashboard will use basic user info from auth");
  }

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

      <div className="flex-1 px-4 py-12 pt-24 md:pt-32 relative z-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - User Profile */}
            <div className="lg:col-span-3">
              <Card className="p-6 bg-surface-elevated/95 backdrop-blur-sm border-border shadow-xl sticky top-24">
                {/* User Photo */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile?.full_name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={64} className="text-white" />
                      )}
                    </div>
                    {/* Online status indicator */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center mb-6 px-2">
                  <h2 className="text-2xl font-bold text-foreground mb-1 break-words">
                    {profile?.full_name || user?.email?.split("@")[0] || "User"}
                  </h2>
                  <p className="text-sm text-muted-foreground break-all">
                    {user?.email}
                  </p>
                  {!profile && (
                    <p className="text-xs text-yellow-600 mt-2">
                      Profile loading...
                    </p>
                  )}
                </div>

                {/* User Details */}
                <div className="space-y-4">
                  {/* Member Since */}
                  {memberSince && profile && (
                    <div className="flex items-center gap-3 p-3 bg-accent/5 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Calendar size={20} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Member Since
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {memberSince}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Company */}
                  {profile?.company && (
                    <div className="flex items-center gap-3 p-3 bg-accent/5 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Briefcase size={20} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Company</p>
                        <p className="text-sm font-semibold text-foreground">
                          {profile.company}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {profile?.phone_number && (
                    <div className="flex items-center gap-3 p-3 bg-accent/5 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <User size={20} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-semibold text-foreground">
                          {profile.phone_number}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {profile?.location && (
                    <div className="flex items-center gap-3 p-3 bg-accent/5 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <MapPin size={20} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Location
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {profile.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Age */}
                  {profile?.age && (
                    <div className="flex items-center gap-3 p-3 bg-accent/5 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <Calendar size={20} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Age</p>
                        <p className="text-sm font-semibold text-foreground">
                          {profile.age} years
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Edit Profile Button */}
                <Button
                  variant="outline"
                  className="w-full mt-6 border-accent text-accent hover:bg-accent/10"
                >
                  Edit Profile
                </Button>
              </Card>
            </div>

            {/* Middle Section - Categories and Queries */}
            <div className="lg:col-span-9">
              {/* Categories */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-6">
                  Service Categories
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = selectedCategory === category.id;

                    return (
                      <Card
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                          isSelected
                            ? "bg-gradient-to-br " +
                              category.color +
                              " text-white border-none shadow-2xl"
                            : "bg-surface-elevated/95 backdrop-blur-sm border-border hover:border-accent"
                        }`}
                      >
                        <div className="flex flex-col items-center text-center gap-4">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center ${
                              isSelected
                                ? "bg-white/20"
                                : "bg-gradient-to-br " + category.color
                            }`}
                          >
                            <Icon
                              size={32}
                              className={
                                isSelected ? "text-white" : "text-white"
                              }
                            />
                          </div>
                          <h3
                            className={`font-semibold text-lg ${
                              isSelected ? "text-white" : "text-foreground"
                            }`}
                          >
                            {category.name}
                          </h3>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Queries Section */}
              {selectedCategory && (
                <Card className="p-8 bg-surface-elevated/95 backdrop-blur-sm border-border shadow-xl">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    {categories.find((c) => c.id === selectedCategory)?.name}{" "}
                    Queries
                  </h2>

                  {queries.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg">
                        No queries available for this category yet.
                      </p>
                      <p className="text-muted-foreground mt-2">
                        Please provide the queries you'd like to add for each
                        category.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Queries will be displayed here */}
                      {queries.map((query, index) => (
                        <div key={index} className="p-4 bg-accent/5 rounded-lg">
                          {/* Query content */}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* Welcome message if no category selected */}
              {!selectedCategory && (
                <Card className="p-12 bg-surface-elevated/95 backdrop-blur-sm border-border shadow-xl text-center">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Welcome to Your Dashboard! 👋
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Select a service category above to view and manage your
                    queries.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
