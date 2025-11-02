import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingIconsHome from "@/components/FloatingIconsHome";
import DashboardMessages from "@/components/DashboardMessages";
import backgroundImage from "@/assets/bg3.jpg";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  User,
  Briefcase,
  Code,
  Lightbulb,
  Wrench,
  MapPin,
  Send,
  Phone,
} from "lucide-react";

// Service categories with questionnaires
const categories = [
  {
    id: "consulting",
    name: "Consulting",
    subtitle: "Project Planning & Feasibility",
    icon: Lightbulb,
    color: "from-blue-500 to-blue-600",
    questions: [
      "What problem or goal does your project aim to solve?",
      "Do you already have any hardware or is this a new concept?",
      "What kind of system are you planning (IoT, embedded, automation, sensor-based, etc.)?",
      "Do you need help in circuit design, coding, or both?",
      "What's your expected project completion timeline?",
      "Do you have a preferred microcontroller or platform (Arduino, ESP32, Raspberry Pi, etc.)?",
      "What's your estimated budget for consultation and development?",
      "Do you require documentation or a report for academic/industrial submission?",
    ],
  },
  {
    id: "prototyping",
    name: "Prototyping",
    subtitle: "Hardware + Design Stage",
    icon: Wrench,
    color: "from-purple-500 to-purple-600",
    questions: [
      "Do you have a circuit design or schematic ready, or should we design it for you?",
      "What sensors, modules, or components do you plan to use?",
      "What will be the prototype's key function or output?",
      "Should the prototype be portable, fixed, or PCB-based?",
      "Do you need PCB design and fabrication support?",
      "Do you need enclosure design or 3D printing for the prototype?",
      "Is this for a college project, startup demo, or industrial prototype?",
      "What's your target deadline for prototype delivery?",
    ],
  },
  {
    id: "firmware",
    name: "Firmware Development",
    subtitle: "Coding & Control Logic",
    icon: Code,
    color: "from-green-500 to-green-600",
    questions: [
      "Which microcontroller or board will be used (ESP32, STM32, Arduino, etc.)?",
      "Do you already have the hardware setup ready for testing?",
      "What inputs and outputs (sensors, motors, relays, displays) should the firmware handle?",
      "Do you need integration with any IoT platform (Blynk, Firebase, MQTT, etc.)?",
      "Should the code include data logging or cloud storage?",
      "Are there any specific control algorithms or logic requirements?",
      "What communication protocol is preferred (Wi-Fi, Bluetooth, LoRa, etc.)?",
      "Should we optimize the firmware for speed, power efficiency, or both?",
    ],
  },
  {
    id: "ondemand",
    name: "On Demand Project",
    subtitle: "Complete End-to-End Development",
    icon: Briefcase,
    color: "from-orange-500 to-orange-600",
    questions: [
      "Describe your project idea or goal in a few sentences.",
      "What problem will this project solve or demonstrate?",
      "Do you want us to handle design, development, and testing — or specific parts only?",
      "Should it include IoT integration (app/dashboard/web)?",
      "What are your preferred hardware components (if any)?",
      "What is the expected final output or demo result?",
      "Do you require project documentation, a report, or presentation slides?",
      "What's your expected delivery date and budget range?",
    ],
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [wantsConsultation, setWantsConsultation] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Note: Authentication is now handled by ProtectedRoute wrapper
  // No need to check auth or redirect here - the route handles it!

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
    setResponses({}); // Clear previous responses
    setWantsConsultation(false);
  };

  // Handle response change
  const handleResponseChange = (questionIndex: number, value: string) => {
    setResponses((prev) => ({ ...prev, [questionIndex]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const selectedCat = categories.find((c) => c.id === selectedCategory);
      if (!selectedCat || !user) {
        throw new Error("Missing category or user information");
      }

      // Prepare the data based on category
      const baseData = {
        user_id: user.id,
        user_email: user.email!,
        user_name: profile?.full_name || user.email?.split("@")[0] || "Unknown",
        wants_consultation: wantsConsultation,
      };

      let tableName = "";
      let requestData: any = { ...baseData };

      // Map responses to appropriate table columns based on category
      switch (selectedCategory) {
        case "consulting":
          tableName = "consulting_requests";
          requestData = {
            ...baseData,
            problem_goal: responses[0] || null,
            hardware_status: responses[1] || null,
            system_type: responses[2] || null,
            help_needed: responses[3] || null,
            timeline: responses[4] || null,
            platform_preference: responses[5] || null,
            budget: responses[6] || null,
            documentation_needed: responses[7] || null,
          };
          break;

        case "prototyping":
          tableName = "prototyping_requests";
          requestData = {
            ...baseData,
            circuit_design_status: responses[0] || null,
            components_list: responses[1] || null,
            key_function: responses[2] || null,
            prototype_type: responses[3] || null,
            pcb_support_needed: responses[4] || null,
            enclosure_design_needed: responses[5] || null,
            project_purpose: responses[6] || null,
            deadline: responses[7] || null,
          };
          break;

        case "firmware":
          tableName = "firmware_requests";
          requestData = {
            ...baseData,
            microcontroller: responses[0] || null,
            hardware_ready: responses[1] || null,
            inputs_outputs: responses[2] || null,
            iot_platform: responses[3] || null,
            data_logging: responses[4] || null,
            control_algorithms: responses[5] || null,
            communication_protocol: responses[6] || null,
            optimization_focus: responses[7] || null,
          };
          break;

        case "ondemand":
          tableName = "ondemand_requests";
          requestData = {
            ...baseData,
            project_description: responses[0] || null,
            problem_solving: responses[1] || null,
            scope_of_work: responses[2] || null,
            iot_integration: responses[3] || null,
            hardware_components: responses[4] || null,
            expected_output: responses[5] || null,
            documentation_needed: responses[6] || null,
            delivery_and_budget: responses[7] || null,
          };
          break;

        default:
          throw new Error("Invalid category");
      }

      console.log(`Submitting to ${tableName}:`, requestData);

      // Insert into appropriate table
      const { data, error } = await supabase
        .from(tableName)
        .insert([requestData])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Successfully saved:", data);

      // Show success message
      alert(
        `✅ Your ${
          selectedCat.name
        } request has been submitted successfully!\n\nRequest ID: ${
          data[0]?.id
        }\n\nWe'll review your requirements and get back to you soon.${
          wantsConsultation
            ? "\n\nWe'll contact you to schedule your free consultation call!"
            : ""
        }`
      );

      // Reset form
      setResponses({});
      setWantsConsultation(false);
      setSelectedCategory(null);
    } catch (error: any) {
      console.error("Submission error:", error);
      alert(
        `❌ Failed to submit request: ${
          error.message || "Unknown error"
        }\n\nPlease try again or contact support.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Note: No need for loading/redirect checks - ProtectedRoute handles authentication
  // The user is guaranteed to be authenticated when this component renders

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
              {/* Messages from Admin */}
              <DashboardMessages />

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

              {/* Questionnaire Section */}
              {selectedCategory && (
                <Card className="p-8 bg-surface-elevated/95 backdrop-blur-sm border-border shadow-xl">
                  {(() => {
                    const selectedCat = categories.find(
                      (c) => c.id === selectedCategory
                    );
                    if (!selectedCat) return null;

                    const Icon = selectedCat.icon;

                    return (
                      <>
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-8">
                          <div
                            className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedCat.color} flex items-center justify-center`}
                          >
                            <Icon size={32} className="text-white" />
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold text-foreground">
                              {selectedCat.name}
                            </h2>
                            <p className="text-muted-foreground">
                              {selectedCat.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Questions */}
                        <div className="space-y-6 mb-8">
                          {selectedCat.questions.map((question, index) => (
                            <div key={index} className="space-y-2">
                              <label className="flex items-start gap-2 text-foreground font-medium">
                                <span
                                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br ${selectedCat.color} text-white text-sm font-bold flex-shrink-0 mt-0.5`}
                                >
                                  {index + 1}
                                </span>
                                <span className="flex-1">{question}</span>
                              </label>
                              <Textarea
                                value={responses[index] || ""}
                                onChange={(e) =>
                                  handleResponseChange(index, e.target.value)
                                }
                                placeholder="Type your answer here..."
                                className="min-h-[100px] bg-background/50 border-border focus:border-accent transition-colors"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Consultation Call Option */}
                        <div className="mb-8 p-6 bg-gradient-to-r from-accent/10 to-accent/5 border-2 border-accent/20 rounded-lg">
                          <div className="flex items-start gap-4">
                            <Phone className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-foreground mb-2">
                                Free 10-Minute Consultation Call
                              </h3>
                              <p className="text-muted-foreground mb-4">
                                Would you like a free consultation call to
                                finalize your requirements? Our experts will
                                help clarify your project needs and provide
                                guidance.
                              </p>
                              <div className="flex gap-4">
                                <Button
                                  variant={
                                    wantsConsultation ? "default" : "outline"
                                  }
                                  onClick={() => setWantsConsultation(true)}
                                  className={
                                    wantsConsultation
                                      ? "bg-accent hover:bg-accent/90"
                                      : ""
                                  }
                                >
                                  Yes, I'm Interested
                                </Button>
                                <Button
                                  variant={
                                    !wantsConsultation ? "default" : "outline"
                                  }
                                  onClick={() => setWantsConsultation(false)}
                                  className={
                                    !wantsConsultation
                                      ? "bg-muted hover:bg-muted/90"
                                      : ""
                                  }
                                >
                                  No, Thanks
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                          <Button
                            onClick={handleSubmit}
                            disabled={
                              isSubmitting ||
                              Object.keys(responses).length === 0
                            }
                            className={`flex-1 h-12 text-lg font-semibold bg-gradient-to-r ${selectedCat.color} hover:opacity-90 transition-opacity`}
                          >
                            {isSubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send size={20} className="mr-2" />
                                Submit Responses
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedCategory(null);
                              setResponses({});
                              setWantsConsultation(false);
                            }}
                            variant="outline"
                            className="h-12"
                          >
                            Cancel
                          </Button>
                        </div>

                        {/* Helper Text */}
                        <p className="text-center text-sm text-muted-foreground mt-4">
                          💡 Tip: The more details you provide, the better we
                          can assist you!
                        </p>
                      </>
                    );
                  })()}
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
