import Navigation from "@/components/Navigation";
import ContactCTA from "@/components/ContactCTA";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import booksImg from "@/assets/books.png";
import boardImg from "@/assets/board.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const studyMaterials = [
  {
    title: "Reference Books and Article",
    description: "A detailed PDF about a featured project.",
    link: "/resources/sample-project.pdf",
  },
  // Add more study materials as needed
];

const knowYourBoard = [
  {
    title: "Arduino Uno Reference",
    description: "Datasheet and pinout for Arduino Uno.",
    link: "/resources/arduino-uno.pdf",
  },
  // Add more board resources as needed
];

// All categories available
const categories = [
  "All Categories",
  "Arduino",
  "ESP32",
  "ESP8266",
  "Raspberry Pi",
  "IoT",
  "Electronics",
  "Sensors",
  "Programming",
  "Circuit Design",
  "Embedded Systems",
  "Other",
];

const allQuestions = [
  {
    q: "Q1: What is Arduino?",
    a: "A: Arduino is an open-source electronics platform.",
    category: "Arduino",
  },
  {
    q: "Q2: What is the operating voltage of Arduino Uno?",
    a: "A: 5V.",
    category: "Arduino",
  },
  {
    q: "Q3: Which microcontroller is used in Arduino Uno?",
    a: "A: ATmega328P.",
    category: "Arduino",
  },
  {
    q: "Q4: How many digital I/O pins does Arduino Uno have?",
    a: "A: 14.",
    category: "Arduino",
  },
  {
    q: "Q5: How many analog input pins does Arduino Uno have?",
    a: "A: 6.",
    category: "Arduino",
  },
  {
    q: "Q6: What is the clock speed of Arduino Uno?",
    a: "A: 16 MHz.",
    category: "Arduino",
  },
  {
    q: "Q7: Which programming language is used for Arduino?",
    a: "A: C/C++.",
    category: "Programming",
  },
  {
    q: "Q8: What is the default baud rate for Arduino serial communication?",
    a: "A: 9600.",
    category: "Arduino",
  },
  {
    q: "Q9: Can Arduino Uno work with 3.3V devices?",
    a: "A: Yes, but careful logic level conversion is needed.",
    category: "Arduino",
  },
  {
    q: "Q10: What is the flash memory size of Arduino Uno?",
    a: "A: 32 KB.",
    category: "Arduino",
  },
  {
    q: "Q11: What is ESP32?",
    a: "A: ESP32 is a low-cost, low-power microcontroller with built-in Wi-Fi and Bluetooth.",
    category: "ESP32",
  },
  {
    q: "Q12: Which company developed ESP32?",
    a: "A: Espressif Systems.",
    category: "ESP32",
  },
  {
    q: "Q13: How many cores does ESP32 have?",
    a: "A: Dual-core (Tensilica Xtensa LX6).",
    category: "ESP32",
  },
  {
    q: "Q14: What is the operating voltage of ESP32?",
    a: "A: 3.3V.",
    category: "ESP32",
  },
  {
    q: "Q15: Does ESP32 support Bluetooth?",
    a: "A: Yes, both Bluetooth Classic and BLE (Bluetooth Low Energy).",
    category: "ESP32",
  },
  {
    q: "Q16: What is the clock speed range of ESP32?",
    a: "A: Up to 240 MHz.",
    category: "ESP32",
  },
  {
    q: "Q17: How many GPIO pins are available on ESP32 (in general modules like ESP32-WROOM-32)?",
    a: "A: Around 34 GPIO pins.",
    category: "ESP32",
  },
  {
    q: "Q18: Which communication protocols are supported by ESP32?",
    a: "A: UART, SPI, I2C, I2S, CAN, and PWM.",
    category: "ESP32",
  },
  {
    q: "Q19: Can ESP32 be programmed using Arduino IDE?",
    a: "A: Yes, by installing the ESP32 board package.",
    category: "ESP32",
  },
  {
    q: "Q20: Name one feature that makes ESP32 better than Arduino Uno.",
    a: "A: Built-in Wi-Fi and Bluetooth connectivity.",
    category: "ESP32",
  },
  {
    q: "Q21: What is IoT?",
    a: "A: Internet of Things - network of connected devices.",
    category: "IoT",
  },
  {
    q: "Q22: What is a sensor?",
    a: "A: A device that detects and responds to physical inputs.",
    category: "Sensors",
  },
  {
    q: "Q23: What does GPIO stand for?",
    a: "A: General Purpose Input/Output.",
    category: "Electronics",
  },
  {
    q: "Q24: What is I2C?",
    a: "A: Inter-Integrated Circuit - a serial communication protocol.",
    category: "Electronics",
  },
  {
    q: "Q25: What is PWM?",
    a: "A: Pulse Width Modulation - technique for controlling power.",
    category: "Electronics",
  },
];

const QUESTIONS_PER_PAGE = 10;

const SortQuestionsPage2 = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter questions by category
  const filteredQuestions =
    selectedCategory === "All Categories"
      ? allQuestions
      : allQuestions.filter((q) => q.category === selectedCategory);

  // Calculate pagination
  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page neighbors, and last page
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handleQuizClick = () => {
    if (user) {
      navigate("/quiz");
    } else {
      sessionStorage.setItem("redirectAfterLogin", "/quiz");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="relative min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto mb-12 max-w-2xl rounded-2xl bg-white/80 shadow-xl border-2 border-accent/30 p-6 flex flex-col items-center backdrop-blur-md">
            <h2 className="text-4xl font-extrabold text-center mb-4">
              Study Materials & Resources
            </h2>
            <span className="block mx-auto mt-2 w-24 h-1 rounded-full bg-gradient-to-r from-accent via-primary to-accent opacity-80 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Study Material Section */}
            <div className="flex flex-col flex-1 items-center">
              <h3 className="text-2xl font-bold text-foreground mb-4 mt-0 lg:mt-12 w-[580.31px] text-center mx-auto">
                Study Material
              </h3>
              <div className="flex-1 flex flex-col justify-stretch w-[580.31px]">
                {studyMaterials.map((res, idx) => (
                  <Card
                    key={idx}
                    className="p-6 flex flex-col justify-between min-h-[340px] h-full w-full flex-grow shadow-lg border-2 border-accent/20 hover:border-accent/60 transition group bg-white/80 backdrop-blur-md relative overflow-hidden"
                  >
                    {/* Decorative accent shape in card */}
                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition -z-10" />
                    <div className="flex flex-col items-center">
                      {res.title === "Reference Books and Article" && (
                        <img
                          src={booksImg}
                          alt="Book Reference"
                          className="w-16 h-16 mb-3 object-contain"
                        />
                      )}
                      <h4 className="text-xl font-bold mb-2 group-hover:text-accent transition">
                        {res.title}
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        {res.description}
                      </p>
                    </div>
                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 px-4 py-2 bg-accent text-white rounded hover:bg-accent/90 transition shadow"
                    >
                      View / Download
                    </a>
                  </Card>
                ))}
              </div>
            </div>
            {/* Know Your Board Section */}
            <div className="flex flex-col flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-4 mt-12 lg:mt-0 w-[580.31px] text-center mx-auto">
                Know Your Board
              </h3>
              <div className="flex-1 flex flex-col justify-stretch">
                {knowYourBoard.map((res, idx) => (
                  <Card
                    key={idx}
                    className="p-6 flex flex-col justify-between h-[340px] w-[580.31px] mt-8 shadow-lg border-2 border-primary/20 hover:border-primary/60 transition group bg-white/80 backdrop-blur-md relative overflow-hidden"
                  >
                    {/* Decorative accent shape in card */}
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition -z-10" />
                    <div className="flex flex-col items-center">
                      <img
                        src={boardImg}
                        alt="Board Reference"
                        className="w-16 h-16 mb-3 object-contain"
                      />
                      <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition">
                        {res.title}
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        {res.description}
                      </p>
                    </div>
                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition shadow"
                    >
                      View / Download
                    </a>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          {/* Sort Question Section at the bottom */}
          <div className="mt-8 flex flex-col items-center">
            <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
              Sort Question
            </h3>

            {/* Category Filter */}
            <div className="w-full max-w-2xl mb-4">
              <div className="bg-white/90 rounded-lg shadow-md border border-accent/20 p-4">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Filter by Category:
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => {
                    setSelectedCategory(value);
                    setCurrentPage(1); // Reset to first page when category changes
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="max-w-2xl w-full bg-white/80 rounded-xl shadow-lg border-2 border-accent/20 p-6 flex flex-col items-center">
              <p className="text-muted-foreground text-center mb-2">
                Here you can find a collection of important sort questions for
                your studies and board preparation.
                {selectedCategory !== "All Categories" && (
                  <span className="block mt-2 text-accent font-semibold">
                    Showing: {selectedCategory}
                  </span>
                )}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Total Questions: {filteredQuestions.length} | Page {currentPage}{" "}
                of {totalPages}
              </p>
              <ul className="list-disc pl-6 text-left w-full space-y-2">
                {currentQuestions.map((item, idx) => (
                  <li key={startIndex + idx}>
                    <strong>{item.q}</strong>
                    <br />
                    <span>{item.a}</span>
                    <br />
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary mt-1 inline-block">
                      {item.category}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Numbered Pagination */}
              <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-semibold shadow hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-gray-500"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page as number)}
                      className={`px-4 py-2 rounded font-semibold shadow transition ${
                        currentPage === page
                          ? "bg-accent text-white"
                          : "bg-white text-gray-700 hover:bg-accent/20"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-semibold shadow hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>

              {/* Go for a Quiz Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleQuizClick}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-bold shadow-lg hover:from-green-700 hover:to-green-600 hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Go for a Quiz
                </button>
              </div>

              {/* Previous Button to go back */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => navigate("/resources")}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded font-semibold shadow hover:bg-gray-400 transition"
                >
                  ← Back to Resources
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ContactCTA />
    </div>
  );
};

export default SortQuestionsPage2;
