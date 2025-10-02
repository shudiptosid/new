import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContactCTA from "@/components/ContactCTA";
import { Upload, FileText, X, Download, Calendar } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  type: string;
}

const ECEResources = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: "1",
      name: "Digital Signal Processing - Lecture Notes.pdf",
      size: 2456789,
      uploadDate: "2024-09-28",
      type: "application/pdf",
    },
    {
      id: "2",
      name: "VLSI Design Tutorial.pdf",
      size: 1876543,
      uploadDate: "2024-09-25",
      type: "application/pdf",
    },
    {
      id: "3",
      name: "Communication Systems Study Guide.docx",
      size: 987654,
      uploadDate: "2024-09-20",
      type: "application/docx",
    },
  ]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      uploadDate: new Date().toISOString().split("T")[0],
      type: file.type,
    }));

    setUploadedFiles([...newFiles, ...uploadedFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <section className="relative py-16 min-h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 overflow-hidden">
          {/* Decorative background shapes */}
          <div
            className="absolute top-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-2xl -z-10 animate-pulse"
            style={{ filter: "blur(80px)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-2xl -z-10 animate-pulse"
            style={{ filter: "blur(100px)" }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="mx-auto mb-12 max-w-2xl rounded-2xl bg-white/90 shadow-xl border-2 border-accent/30 p-6 flex flex-col items-center backdrop-blur-md hover:bg-white/95 transition-colors duration-300">
              <h2 className="text-4xl md:text-5xl font-extrabold text-center drop-shadow-lg bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent animate-pulse">
                Electronics and Communication Engineering
              </h2>
              <span className="block mx-auto mt-2 w-24 h-1 rounded-full bg-gradient-to-r from-accent via-primary to-accent opacity-80 animate-pulse" />
            </div>
          </div>

          {/* Upload Learning Materials Section */}
          <div className="container mx-auto px-4 mt-8 mb-8">
            <Card className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md shadow-xl border-2 border-accent/30 overflow-hidden">
              <div className="bg-gradient-to-r from-accent via-primary to-accent p-6">
                <h3 className="text-3xl font-bold text-white text-center">
                  Learning Materials Library
                </h3>
                <p className="text-white/90 text-center mt-2">
                  Access study materials, notes, and resources
                </p>
              </div>

              <div className="p-6">
                {/* Materials List with Scroll */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-accent" />
                      Uploaded Materials ({uploadedFiles.length})
                    </h4>
                  </div>

                  <div className="max-h-96 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="group bg-gradient-to-r from-white to-accent/5 border-2 border-accent/20 rounded-xl p-4 hover:border-accent/60 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                              <FileText className="w-6 h-6 text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 truncate group-hover:text-accent transition-colors">
                                {file.name}
                              </p>
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {file.uploadDate}
                                </span>
                                <span>{formatFileSize(file.size)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-accent/30 text-accent hover:bg-accent hover:text-white transition-all"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveFile(file.id)}
                              className="border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Online Learning Resources - Vertical Card */}
          <div className="container mx-auto px-4 mt-12 mb-8">
            <Card className="max-w-4xl mx-auto p-8 bg-white/90 backdrop-blur-md shadow-xl border-2 border-accent/30 hover:border-accent/60 transition-all duration-300">
              <h3 className="text-3xl font-bold text-primary mb-6 text-center">
                Online Learning Resources
              </h3>
              <div className="space-y-6">
                <div className="border-b border-accent/20 pb-4">
                  <a
                    href="https://ocw.mit.edu/search/?d=Electrical%20Engineering%20and%20Computer%20Science"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold hover:text-accent transition-colors block mb-2"
                  >
                    MIT OpenCourseWare: Microelectronics
                  </a>
                  <p className="text-gray-600">
                    Free online course materials with lectures, assignments, and
                    exams
                  </p>
                </div>

                <div className="border-b border-accent/20 pb-4">
                  <a
                    href="https://www.allaboutcircuits.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold hover:text-accent transition-colors block mb-2"
                  >
                    AllAboutCircuits.com
                  </a>
                  <p className="text-gray-600">
                    Comprehensive tutorials, circuit analysis tools, and
                    engineering forum
                  </p>
                </div>

                <div className="border-b border-accent/20 pb-4">
                  <a
                    href="https://ieeexplore.ieee.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold hover:text-accent transition-colors block mb-2"
                  >
                    IEEE Xplore Digital Library
                  </a>
                  <p className="text-gray-600">
                    Access to millions of research papers and standards
                    documents
                  </p>
                </div>

                <div className="border-b border-accent/20 pb-4">
                  <a
                    href="https://www.coursera.org/specializations/signal-processing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold hover:text-accent transition-colors block mb-2"
                  >
                    Coursera: Signal Processing Specialization
                  </a>
                  <p className="text-gray-600">
                    EPFL's comprehensive online certificate program
                  </p>
                </div>

                <div className="border-b border-accent/20 pb-4">
                  <a
                    href="https://spectrum.ieee.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold hover:text-accent transition-colors block mb-2"
                  >
                    IEEE Spectrum
                  </a>
                  <p className="text-gray-600">
                    Latest technology news, analysis, and commentary from IEEE
                  </p>
                </div>

                <div className="pb-2">
                  <a
                    href="https://www.edx.org/learn/electronic-engineering"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold hover:text-accent transition-colors block mb-2"
                  >
                    edX Electronics Courses
                  </a>
                  <p className="text-gray-600">
                    University-level electronics courses from MIT, TU Delft, and
                    more
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default ECEResources;
