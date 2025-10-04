// ECE Resources Page - Updated with NOC IoT folder and Reference Books
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContactCTA from "@/components/ContactCTA";
import {
  Upload,
  FileText,
  X,
  Download,
  Calendar,
  Folder,
  ChevronDown,
  ChevronRight,
  Eye,
  Book,
} from "lucide-react";

// Import Embedded System PDFs
import MemoryInterfacing from "@/assets/ECE/Embeded System/Memory-Interfacing.pdf";
import MemoryII from "@/assets/ECE/Embeded System/Memory-II.pdf";
import MemoryI from "@/assets/ECE/Embeded System/Memory-I.pdf";
import GeneralPurposeProcessorsII from "@/assets/ECE/Embeded System/General Purpose Processors - II.pdf";
import GeneralPurposeProcessorsI from "@/assets/ECE/Embeded System/General Purpose Processors - I.pdf";
import EmbeddedProcessorsII from "@/assets/ECE/Embeded System/Embedded Processors - II.pdf";
import EmbeddedProcessorsI from "@/assets/ECE/Embeded System/Embedded Processors - I.pdf";
import DigitalSignalProcessors from "@/assets/ECE/Embeded System/Digital Signal Processors.pdf";

// Import Digital Electronics PDFs
import AdditionalLogicOperations from "@/assets/ECE/Digital Electronics/Additional Logic Operations .pdf";
import TransistorTransistorLogic from "@/assets/ECE/Digital Electronics/Transistor-Transistor Logic (TTL) .pdf";
import NumberSystem from "@/assets/ECE/Digital Electronics/Number System.pdf";
import Memories from "@/assets/ECE/Digital Electronics/MEMORIES.pdf";
import LogicExpressionMinimization from "@/assets/ECE/Digital Electronics/Logic Expression Minimization.pdf";
import NumberBaseConversions from "@/assets/ECE/Digital Electronics/Introduction - Number Base Conversions.pdf";
import CMOSLogic from "@/assets/ECE/Digital Electronics/CMOS Logic.pdf";
import BooleanAlgebra from "@/assets/ECE/Digital Electronics/Boolean Algebra and Basic Operators.pdf";
import CombinationalLogicCircuits from "@/assets/ECE/Digital Electronics/Analyses and Synthesis of Combinational Logic Circuits.pdf";

// Import NOC Introduction to Internet of Things PDFs
import AdvancedTechnologiesSDN from "@/assets/ECE/NOC Introduction to Internet of Things/Advanced Technologies SDN in IIoT P2.pdf";
import AnalyticsDataManagement from "@/assets/ECE/NOC Introduction to Internet of Things/Analytics and Data Management.pdf";
import ComponentsCybersecurity from "@/assets/ECE/NOC Introduction to Internet of Things/Components of Cybersecurity.pdf";
import CyberPhysicalSystems from "@/assets/ECE/NOC Introduction to Internet of Things/Cyber-Physical Systems and Next-Generation Sensors.pdf";
import HistoricalContext from "@/assets/ECE/NOC Introduction to Internet of Things/Historical Context.pdf";
import IIoTAnalytics from "@/assets/ECE/NOC Introduction to Internet of Things/IIoT Analytics and Data Management.pdf";
import IIoTHealthcare from "@/assets/ECE/NOC Introduction to Internet of Things/IIoT Applications Healthcare.pdf";
import IIoTOilChemical from "@/assets/ECE/NOC Introduction to Internet of Things/IIoT Applications Oil Chemical and Pharma.pdf";
import Industry40 from "@/assets/ECE/NOC Introduction to Internet of Things/Industry 4.0 – Different Sectors.pdf";
import IntroLPWAN from "@/assets/ECE/NOC Introduction to Internet of Things/Introduction to LPWAN.pdf";
import KeyEnablers from "@/assets/ECE/NOC Introduction to Internet of Things/Key Enablers of Industrial IoT.pdf";
import Transducer from "@/assets/ECE/NOC Introduction to Internet of Things/Transducer.pdf";

// Import Reference Books
import CommunicationsNetworkingBook from "@/assets/ECE/Books/Data-Communications-and-Networking-By-Behrouz-A.Forouzan.pdf";
import IntroToIoTBook from "@/assets/ECE/Books/INTRODUCTION TO IOT by SUDIP MISRA, ANANDARUP MUKHERJEE, ARIJIT ROY.pdf";
import IoTRajKamalBook from "@/assets/ECE/Books/Internet of things IoT by Raj Kamal Text Book.pdf";

interface PDFFile {
  id: string;
  name: string;
  path: string;
  size: number;
}

interface FolderItem {
  id: string;
  name: string;
  type: "folder";
  uploadDate: string;
  files: PDFFile[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  type: string;
}

interface ReferenceBook {
  id: string;
  bookName: string;
  author: string;
  path: string;
  size: number;
}

type LibraryItem = FolderItem | UploadedFile;

const ECEResources = () => {
  const embeddedSystemFiles: PDFFile[] = [
    {
      id: "es1",
      name: "Digital Signal Processors",
      path: DigitalSignalProcessors,
      size: 1234567,
    },
    {
      id: "es2",
      name: "Embedded Processors - I",
      path: EmbeddedProcessorsI,
      size: 987654,
    },
    {
      id: "es3",
      name: "Embedded Processors - II",
      path: EmbeddedProcessorsII,
      size: 1098765,
    },
    {
      id: "es4",
      name: "General Purpose Processors - I",
      path: GeneralPurposeProcessorsI,
      size: 1123456,
    },
    {
      id: "es5",
      name: "General Purpose Processors - II",
      path: GeneralPurposeProcessorsII,
      size: 1234890,
    },
    { id: "es6", name: "Memory - I", path: MemoryI, size: 876543 },
    { id: "es7", name: "Memory - II", path: MemoryII, size: 923456 },
    {
      id: "es8",
      name: "Memory Interfacing",
      path: MemoryInterfacing,
      size: 1045678,
    },
  ];

  const digitalElectronicsFiles: PDFFile[] = [
    {
      id: "de1",
      name: "Additional Logic Operations",
      path: AdditionalLogicOperations,
      size: 2456789,
    },
    {
      id: "de2",
      name: "Analyses and Synthesis of Combinational Logic Circuits",
      path: CombinationalLogicCircuits,
      size: 2134567,
    },
    {
      id: "de3",
      name: "Boolean Algebra and Basic Operators",
      path: BooleanAlgebra,
      size: 1987654,
    },
    {
      id: "de4",
      name: "CMOS Logic",
      path: CMOSLogic,
      size: 1876543,
    },
    {
      id: "de5",
      name: "Introduction - Number Base Conversions",
      path: NumberBaseConversions,
      size: 1654321,
    },
    {
      id: "de6",
      name: "Logic Expression Minimization",
      path: LogicExpressionMinimization,
      size: 2012345,
    },
    {
      id: "de7",
      name: "MEMORIES",
      path: Memories,
      size: 2234567,
    },
    {
      id: "de8",
      name: "Number System",
      path: NumberSystem,
      size: 1765432,
    },
    {
      id: "de9",
      name: "Transistor-Transistor Logic (TTL)",
      path: TransistorTransistorLogic,
      size: 2098765,
    },
  ];

  const nocIoTFiles: PDFFile[] = [
    {
      id: "noc1",
      name: "Historical Context",
      path: HistoricalContext,
      size: 1500000,
    },
    {
      id: "noc2",
      name: "Introduction to LPWAN",
      path: IntroLPWAN,
      size: 1600000,
    },
    {
      id: "noc3",
      name: "Key Enablers of Industrial IoT",
      path: KeyEnablers,
      size: 1700000,
    },
    {
      id: "noc4",
      name: "Cyber-Physical Systems and Next-Generation Sensors",
      path: CyberPhysicalSystems,
      size: 1800000,
    },
    {
      id: "noc5",
      name: "Transducer",
      path: Transducer,
      size: 1400000,
    },
    {
      id: "noc6",
      name: "Industry 4.0 – Different Sectors",
      path: Industry40,
      size: 1900000,
    },
    {
      id: "noc7",
      name: "Analytics and Data Management",
      path: AnalyticsDataManagement,
      size: 1750000,
    },
    {
      id: "noc8",
      name: "IIoT Analytics and Data Management",
      path: IIoTAnalytics,
      size: 1850000,
    },
    {
      id: "noc9",
      name: "IIoT Applications Healthcare",
      path: IIoTHealthcare,
      size: 1650000,
    },
    {
      id: "noc10",
      name: "IIoT Applications Oil Chemical and Pharma",
      path: IIoTOilChemical,
      size: 1950000,
    },
    {
      id: "noc11",
      name: "Components of Cybersecurity",
      path: ComponentsCybersecurity,
      size: 1550000,
    },
    {
      id: "noc12",
      name: "Advanced Technologies SDN in IIoT P2",
      path: AdvancedTechnologiesSDN,
      size: 2000000,
    },
  ];

  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([
    {
      id: "folder1",
      name: "Embedded System",
      type: "folder",
      uploadDate: "2024-09-28",
      files: embeddedSystemFiles,
    },
    {
      id: "folder2",
      name: "Digital Electronics",
      type: "folder",
      uploadDate: "2024-09-27",
      files: digitalElectronicsFiles,
    },
    {
      id: "folder3",
      name: "NOC: Introduction to Internet of Things",
      type: "folder",
      uploadDate: "2024-10-04",
      files: nocIoTFiles,
    },
  ]);

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [isDragging, setIsDragging] = useState(false);

  // Reference Books State - Add your books here later
  const [referenceBooks, setReferenceBooks] = useState<ReferenceBook[]>([
    {
      id: "book1",
      bookName: "Data Communications and Networking",
      author: "Behrouz A. Forouzan",
      path: CommunicationsNetworkingBook,
      size: 5242880, // Approximate size, will be calculated by browser
    },
    {
      id: "book2",
      bookName: "Introduction to IoT",
      author: "Sudip Misra, Anandarup Mukherjee, Arijit Roy",
      path: IntroToIoTBook,
      size: 6291456, // Approximate size, will be calculated by browser
    },
    {
      id: "book3",
      bookName: "Internet of Things (IoT)",
      author: "Raj Kamal",
      path: IoTRajKamalBook,
      size: 7340032, // Approximate size, will be calculated by browser
    },
  ]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleRemoveFile = (id: string) => {
    setLibraryItems(libraryItems.filter((item) => item.id !== id));
  };

  const handleDownloadPDF = (path: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = path;
    link.download = fileName;
    link.click();
  };

  const handleViewPDF = (path: string) => {
    window.open(path, "_blank");
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

          {/* Learning Materials and Reference Books Section - Side by Side */}
          <div className="container mx-auto px-4 mt-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
              {/* Upload Learning Materials Section */}
              <Card className="bg-white/90 backdrop-blur-md shadow-xl border-2 border-accent/30 overflow-hidden">
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
                        Learning Materials ({libraryItems.length})
                      </h4>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                      {libraryItems.map((item) => {
                        const isFolder =
                          "type" in item && item.type === "folder";
                        const isExpanded =
                          isFolder && expandedFolders.has(item.id);

                        return (
                          <div key={item.id} className="space-y-2">
                            {/* Folder or File Item */}
                            <div
                              className={`group bg-gradient-to-r from-white to-accent/5 border-2 border-accent/20 rounded-xl p-4 hover:border-accent/60 hover:shadow-lg transition-all duration-300 ${
                                !isFolder ? "hover:scale-[1.02]" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                  <div
                                    className={`p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors ${
                                      isFolder ? "cursor-pointer" : ""
                                    }`}
                                    onClick={
                                      isFolder
                                        ? () => toggleFolder(item.id)
                                        : undefined
                                    }
                                  >
                                    {isFolder ? (
                                      <Folder className="w-6 h-6 text-accent" />
                                    ) : (
                                      <FileText className="w-6 h-6 text-accent" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      {isFolder && (
                                        <button
                                          onClick={() => toggleFolder(item.id)}
                                          className="hover:text-accent transition-colors"
                                        >
                                          {isExpanded ? (
                                            <ChevronDown className="w-4 h-4" />
                                          ) : (
                                            <ChevronRight className="w-4 h-4" />
                                          )}
                                        </button>
                                      )}
                                      <p
                                        className={`font-semibold text-gray-800 truncate group-hover:text-accent transition-colors ${
                                          isFolder ? "cursor-pointer" : ""
                                        }`}
                                        onClick={
                                          isFolder
                                            ? () => toggleFolder(item.id)
                                            : undefined
                                        }
                                      >
                                        {item.name}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {item.uploadDate}
                                      </span>
                                      {!isFolder && (
                                        <span>
                                          {formatFileSize(
                                            (item as UploadedFile).size
                                          )}
                                        </span>
                                      )}
                                      {isFolder && (
                                        <span className="text-accent">
                                          {(item as FolderItem).files.length}{" "}
                                          files
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {!isFolder && (
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
                                      onClick={() => handleRemoveFile(item.id)}
                                      className="border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Expanded Folder Content */}
                            {isFolder && isExpanded && (
                              <div className="ml-12 space-y-2 animate-in slide-in-from-top">
                                {(item as FolderItem).files.map((pdf) => (
                                  <div
                                    key={pdf.id}
                                    className="bg-white border border-accent/10 rounded-lg p-3 hover:border-accent/40 hover:shadow-md transition-all duration-200"
                                  >
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <FileText className="w-4 h-4 text-accent/70 flex-shrink-0" />
                                        <span className="text-sm font-medium text-gray-700 truncate">
                                          {pdf.name}
                                        </span>
                                        <span className="text-xs text-gray-400 flex-shrink-0">
                                          {formatFileSize(pdf.size)}
                                        </span>
                                      </div>
                                      <div className="flex gap-1 flex-shrink-0">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            handleViewPDF(pdf.path)
                                          }
                                          className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                          title="View PDF"
                                        >
                                          <Eye className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            handleDownloadPDF(
                                              pdf.path,
                                              `${pdf.name}.pdf`
                                            )
                                          }
                                          className="h-7 px-2 text-accent hover:text-accent/80 hover:bg-accent/10"
                                          title="Download PDF"
                                        >
                                          <Download className="w-3.5 h-3.5" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Reference Books Section */}
              <Card className="bg-white/90 backdrop-blur-md shadow-xl border-2 border-primary/30 overflow-hidden">
                <div className="bg-gradient-to-r from-primary via-accent to-primary p-6">
                  <h3 className="text-3xl font-bold text-white text-center">
                    Reference Books
                  </h3>
                  <p className="text-white/90 text-center mt-2">
                    Comprehensive textbooks and reference materials
                  </p>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Available Books ({referenceBooks.length})
                      </h4>
                    </div>

                    {referenceBooks.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">
                          No reference books yet
                        </p>
                        <p className="text-sm mt-2">Books will be added soon</p>
                      </div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {/* Table Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-3 mb-3 border-2 border-primary/20">
                          <div className="grid grid-cols-12 gap-3 font-bold text-sm text-primary">
                            <div className="col-span-1 text-center">#</div>
                            <div className="col-span-5">Book Name</div>
                            <div className="col-span-3">Author</div>
                            <div className="col-span-3 text-center">
                              Actions
                            </div>
                          </div>
                        </div>

                        {/* Table Rows */}
                        <div className="space-y-2">
                          {referenceBooks.map((book, index) => (
                            <div
                              key={book.id}
                              className="bg-gradient-to-r from-white to-primary/5 border-2 border-primary/20 rounded-lg p-3 hover:border-primary/60 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                            >
                              <div className="grid grid-cols-12 gap-3 items-center">
                                {/* Number Column */}
                                <div className="col-span-1 text-center">
                                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                                    <span className="text-sm font-bold text-primary">
                                      {index + 1}
                                    </span>
                                  </div>
                                </div>

                                {/* Book Name Column */}
                                <div className="col-span-5">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                                    <span className="text-sm font-semibold text-gray-800 line-clamp-2">
                                      {book.bookName}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-400 ml-6">
                                    {formatFileSize(book.size)}
                                  </span>
                                </div>

                                {/* Author Column */}
                                <div className="col-span-3">
                                  <span className="text-sm text-gray-700 font-medium line-clamp-2">
                                    {book.author}
                                  </span>
                                </div>

                                {/* Actions Column */}
                                <div className="col-span-3 flex gap-2 justify-center">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleViewPDF(book.path)}
                                    className="h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200"
                                    title="View Book"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    <span className="text-xs">View</span>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      handleDownloadPDF(
                                        book.path,
                                        `${book.bookName}.pdf`
                                      )
                                    }
                                    className="h-8 px-2 text-primary hover:text-primary/80 hover:bg-primary/10 border border-primary/30"
                                    title="Download Book"
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
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
