import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  Upload,
  Briefcase,
  Cpu,
  CircuitBoard,
  Brain,
  FlaskConical,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type ApplicationForm = {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  skills: string;
  portfolio: string;
};

const CAREERS_CV_BUCKET =
  import.meta.env.VITE_CAREERS_CV_BUCKET || "careers-cv";

const positions = [
  {
    title: "Electronics Project Developer",
    description:
      "Work on electronics and IoT project development including circuit design, sensor integration, and hardware prototyping.",
    skills: [
      "Arduino / ESP32",
      "Sensor interfacing",
      "Basic electronics knowledge",
      "Embedded programming",
    ],
    icon: CircuitBoard,
  },
  {
    title: "IoT Developer",
    description:
      "Develop IoT systems that connect devices to cloud dashboards and monitoring platforms.",
    skills: [
      "ESP32 / ESP8266",
      "WiFi / MQTT communication",
      "IoT dashboards (Blynk, Node-RED, etc.)",
      "API integration",
    ],
    icon: Cpu,
  },
  {
    title: "Embedded Systems Engineer",
    description:
      "Design firmware and embedded control systems for hardware devices.",
    skills: [
      "Embedded C / C++",
      "Microcontroller programming",
      "Serial communication protocols",
      "Hardware debugging",
    ],
    icon: Briefcase,
  },
  {
    title: "PCB Design Engineer",
    description:
      "Design professional circuit boards and optimize hardware layouts.",
    skills: [
      "KiCad / Eagle / Altium",
      "Schematic design",
      "PCB layout and routing",
      "Electronics component knowledge",
    ],
    icon: CircuitBoard,
  },
  {
    title: "AI / Computer Vision Developer",
    description:
      "Work on intelligent systems involving cameras, object detection, and AI-based automation.",
    skills: [
      "Python",
      "OpenCV",
      "Machine learning basics",
      "Embedded AI systems",
    ],
    icon: Brain,
  },
  {
    title: "Technical Research Intern",
    description:
      "Assist in research and development of new electronic devices, IoT systems, and prototype designs.",
    skills: [
      "Curiosity and problem solving",
      "Basic programming or electronics knowledge",
      "Willingness to learn",
    ],
    icon: FlaskConical,
  },
];

const Careers = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ApplicationForm>({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    skills: "",
    portfolio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleResumeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file",
        description: "Please upload your resume in PDF format only.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Resume file must be under 10MB.",
        variant: "destructive",
      });
      return;
    }

    setResumeFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeFile) {
      toast({
        title: "Resume required",
        description: "Please upload your resume in PDF format.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const safeName = formData.fullName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      const filePath = `applications/${Date.now()}-${safeName || "candidate"}.pdf`;

      const { error: uploadError } = await supabase.storage
        .from(CAREERS_CV_BUCKET)
        .upload(filePath, resumeFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from("career_applications")
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          phone_number: formData.phone,
          position_applied: formData.position,
          skills_summary: formData.skills,
          portfolio_url: formData.portfolio || null,
          resume_file_name: resumeFile.name,
          resume_file_size: resumeFile.size,
          resume_file_path: filePath,
          status: "new",
        });

      if (insertError) throw insertError;

      toast({
        title: "Application submitted",
        description:
          "Thank you. Your career application has been submitted successfully.",
      });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        position: "",
        skills: "",
        portfolio: "",
      });
      setResumeFile(null);
    } catch (error: any) {
      console.error("Career application error:", error);

      const isBucketMissing =
        (error?.message &&
          String(error.message).toLowerCase().includes("bucket not found")) ||
        error?.statusCode === "404";

      toast({
        title: "Submission failed",
        description: isBucketMissing
          ? `Storage bucket '${CAREERS_CV_BUCKET}' was not found. Please create it in Supabase Storage and run CAREERS_SYSTEM_SCHEMA.sql policies.`
          : error?.message ||
            "Could not submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SEO
        title="Careers"
        description="Join Circuit Crafters to work on electronics, IoT, embedded systems, and intelligent hardware development."
        keywords={[
          "Careers",
          "IoT jobs",
          "Embedded systems jobs",
          "Electronics internships",
          "Circuit Crafters careers",
        ]}
      />

      <Navigation />

      <main className="flex-grow pt-24 pb-14">
        <section className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-sm uppercase tracking-[0.18em] text-accent font-semibold mb-2">
                Careers
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                Join Our Team
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-4xl mx-auto">
                We are building innovative solutions in electronics, IoT,
                embedded systems, and intelligent hardware devices. Our mission
                is to design practical technology that solves real-world
                problems through smart hardware and software integration.
              </p>
            </div>

            <Card className="p-6 sm:p-8 mb-8">
              <p className="text-foreground/90 mb-4">
                If you are passionate about engineering, innovation, and
                technology development, we would love to work with you.
              </p>
              <p className="text-foreground/90">
                We welcome engineers, developers, researchers, and interns who
                are eager to learn and build real systems.
              </p>
            </Card>

            <Card className="p-6 sm:p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Why Join Us</h2>
              <div className="space-y-4 text-foreground/90">
                <div>
                  <h3 className="font-semibold text-lg">
                    Work on Real Hardware Projects
                  </h3>
                  <p>
                    You will get the opportunity to work on real-world
                    electronics and IoT systems involving sensors, embedded
                    controllers, communication modules, and automation systems.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Learn Advanced Technologies
                  </h3>
                  <p>
                    Work with technologies like ESP32, Arduino, Raspberry Pi,
                    IoT dashboards, PCB design, and AI-based embedded systems.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Innovation Driven Environment
                  </h3>
                  <p>
                    We encourage experimentation, learning, and problem solving.
                    Our goal is to build solutions that combine engineering
                    creativity with practical implementation.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Flexible Opportunities
                  </h3>
                  <p>
                    We offer opportunities for remote collaboration,
                    internships, and project-based roles depending on the nature
                    of the work.
                  </p>
                </div>
              </div>
            </Card>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Open Positions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {positions.map((position) => {
                  const Icon = position.icon;
                  return (
                    <Card key={position.title} className="p-6 h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-accent" />
                        </div>
                        <h3 className="text-lg font-semibold">
                          {position.title}
                        </h3>
                      </div>

                      <p className="text-muted-foreground mb-4">
                        {position.description}
                      </p>

                      <h4 className="font-medium mb-2">Skills Required</h4>
                      <ul className="list-disc pl-5 text-sm text-foreground/90 space-y-1">
                        {position.skills.map((skill) => (
                          <li key={skill}>{skill}</li>
                        ))}
                      </ul>
                    </Card>
                  );
                })}
              </div>
            </div>

            <Card className="p-6 sm:p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Application Process
              </h2>
              <p className="mb-3 text-foreground/90">
                If you are interested in joining our team, please send your
                details including:
              </p>
              <ul className="list-disc pl-6 text-foreground/90 space-y-1 mb-4">
                <li>Full Name</li>
                <li>Email Address</li>
                <li>Phone Number</li>
                <li>Position you are applying for</li>
                <li>Skills and technologies you know</li>
                <li>Portfolio / GitHub / previous projects (if available)</li>
                <li>Resume (PDF)</li>
              </ul>
              <p className="text-foreground/90">
                You can submit your application through our Career Application
                Form or send your resume to our official email.
              </p>
            </Card>

            <Card className="p-6 sm:p-8 mb-8 border-accent/30">
              <h2 className="text-2xl font-semibold mb-4">
                Career Application Form
              </h2>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position Applying For</Label>
                    <select
                      id="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select position</option>
                      {positions.map((p) => (
                        <option key={p.title} value={p.title}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="skills">
                    Skills and Technologies You Know
                  </Label>
                  <Textarea
                    id="skills"
                    rows={4}
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Example: Arduino, ESP32, Embedded C, PCB design, Python, OpenCV..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="portfolio">
                    Portfolio / GitHub / Previous Projects (Optional)
                  </Label>
                  <Input
                    id="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="https://github.com/your-profile"
                  />
                </div>

                <div>
                  <Label htmlFor="resume">Resume (PDF)</Label>
                  <Input
                    id="resume"
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeSelect}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Upload PDF only (max 10MB).
                  </p>
                  {resumeFile && (
                    <p className="text-sm text-accent mt-2">
                      Selected: {resumeFile.name}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </form>
            </Card>

            <Card className="p-6 sm:p-8">
              <h2 className="text-2xl font-semibold mb-4">Important Note</h2>
              <p className="mb-2 text-foreground/90">
                We are looking for individuals who are:
              </p>
              <ul className="list-disc pl-6 text-foreground/90 space-y-1">
                <li>Passionate about engineering and technology</li>
                <li>Interested in building real hardware systems</li>
                <li>Willing to learn and experiment</li>
                <li>Responsible and collaborative</li>
              </ul>
              <p className="mt-4 text-foreground/90">
                Both experienced developers and motivated learners are welcome
                to apply.
              </p>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;
