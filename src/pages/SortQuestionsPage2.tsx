import Navigation from "@/components/Navigation";
import ContactCTA from "@/components/ContactCTA";
import React from "react";
import { Card } from "@/components/ui/card";
import booksImg from "@/assets/books.png";
import boardImg from "@/assets/board.png";
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
import { useNavigate } from "react-router-dom";

const questions = [
  {
    q: "Q11: What is ESP32?",
    a: "A: ESP32 is a low-cost, low-power microcontroller with built-in Wi-Fi and Bluetooth.",
  },
  {
    q: "Q12: Which company developed ESP32?",
    a: "A: Espressif Systems.",
  },
  {
    q: "Q13: How many cores does ESP32 have?",
    a: "A: Dual-core (Tensilica Xtensa LX6).",
  },
  {
    q: "Q14: What is the operating voltage of ESP32?",
    a: "A: 3.3V.",
  },
  {
    q: "Q15: Does ESP32 support Bluetooth?",
    a: "A: Yes, both Bluetooth Classic and BLE (Bluetooth Low Energy).",
  },
  {
    q: "Q16: What is the clock speed range of ESP32?",
    a: "A: Up to 240 MHz.",
  },
  {
    q: "Q17: How many GPIO pins are available on ESP32 (in general modules like ESP32-WROOM-32)?",
    a: "A: Around 34 GPIO pins.",
  },
  {
    q: "Q18: Which communication protocols are supported by ESP32?",
    a: "A: UART, SPI, I2C, I2S, CAN, and PWM.",
  },
  {
    q: "Q19: Can ESP32 be programmed using Arduino IDE?",
    a: "A: Yes, by installing the ESP32 board package.",
  },
  {
    q: "Q20: Name one feature that makes ESP32 better than Arduino Uno.",
    a: "A: Built-in Wi-Fi and Bluetooth connectivity.",
  },
];

const SortQuestionsPage2 = () => {
  const navigate = useNavigate();
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
            <div className="max-w-2xl w-full bg-white/80 rounded-xl shadow-lg border-2 border-accent/20 p-6 flex flex-col items-center">
              <p className="text-muted-foreground text-center mb-2">
                Here you can find a collection of important sort questions for
                your studies and board preparation.
              </p>
              <ul className="list-disc pl-6 text-left w-full space-y-2">
                {questions.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.q}</strong>
                    <br />
                    <span>{item.a}</span>
                  </li>
                ))}
              </ul>
              {/* Previous Button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => navigate("/resources")}
                  className="px-6 py-2 bg-accent text-white rounded font-bold shadow hover:bg-accent/90 transition"
                >
                  Previous
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
