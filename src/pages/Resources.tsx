import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import ContactCTA from "@/components/ContactCTA";
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

const Resources = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <section className="relative py-20 min-h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 overflow-hidden">
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
            <div className="mx-auto mb-12 max-w-2xl rounded-2xl bg-white/80 shadow-xl border-2 border-accent/30 p-6 flex flex-col items-center backdrop-blur-md">
              <h2 className="text-4xl md:text-5xl font-extrabold text-center drop-shadow-lg bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent animate-pulse">
                Study Materials & Resources
              </h2>
              <span className="block mx-auto mt-2 w-24 h-1 rounded-full bg-gradient-to-r from-accent via-primary to-accent opacity-80 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 px-4">
            {/* Study Material Section */}
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold text-foreground mb-4 mt-0 lg:mt-12 w-full max-w-2xl text-center mx-auto">
                Study Material
              </h3>
              <div className="flex-1 flex flex-col justify-stretch w-full max-w-2xl">
                {studyMaterials.map((res, idx) => (
                  <Card
                    key={idx}
                    className="p-6 flex flex-col justify-between min-h-[340px] h-full w-full flex-grow shadow-lg border-2 border-accent/20 hover:border-accent/60 transition group bg-white/80 backdrop-blur-md relative overflow-hidden mb-8"
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
                      <p className="text-muted-foreground mb-4 text-center">
                        {res.description}
                      </p>
                    </div>
                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 px-4 py-2 bg-accent text-white rounded hover:bg-accent/90 transition shadow self-center"
                    >
                      View / Download
                    </a>
                  </Card>
                ))}
              </div>
            </div>
            {/* Know Your Board Section */}
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold text-foreground mb-4 mt-12 lg:mt-0 w-full max-w-2xl text-center mx-auto">
                Know Your Board
              </h3>
              <div className="flex-1 flex flex-col justify-stretch w-full max-w-2xl mx-auto">
                {knowYourBoard.map((res, idx) => (
                  <Card
                    key={idx}
                    className="p-6 flex flex-col justify-between min-h-[340px] w-full mt-8 shadow-lg border-2 border-primary/20 hover:border-primary/60 transition group bg-white/80 backdrop-blur-md relative overflow-hidden"
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
                      <p className="text-muted-foreground mb-4 text-center">
                        {res.description}
                      </p>
                    </div>
                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition shadow self-center"
                    >
                      View / Download
                    </a>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          {/* Sort Question Section at the bottom */}
          <div className="mt-8 flex flex-col items-center px-4">
            <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
              Sort Question
            </h3>
            <div className="max-w-2xl w-full bg-white/80 rounded-xl shadow-lg border-2 border-accent/20 p-6 flex flex-col items-center">
              <p className="text-muted-foreground text-center mb-2">
                Here you can find a collection of important sort questions for
                your studies and board preparation.
              </p>
              <ul className="list-disc pl-6 text-left w-full space-y-2">
                <li>
                  <strong>Q1: What is Arduino Uno?</strong>
                  <br />
                  <span>
                    A: Arduino Uno is an open-source microcontroller board based
                    on the ATmega328P chip.
                  </span>
                </li>
                <li>
                  <strong>
                    Q2: How many digital I/O pins does Arduino Uno have?
                  </strong>
                  <br />
                  <span>
                    A: 14 digital I/O pins (of which 6 can be used as PWM
                    outputs).
                  </span>
                </li>
                <li>
                  <strong>
                    Q3: How many analog input pins are there on Arduino Uno?
                  </strong>
                  <br />
                  <span>A: 6 analog input pins (A0–A5).</span>
                </li>
                <li>
                  <strong>
                    Q4: What is the operating voltage of Arduino Uno?
                  </strong>
                  <br />
                  <span>A: 5V.</span>
                </li>
                <li>
                  <strong>Q5: Which USB connector does Arduino Uno use?</strong>
                  <br />
                  <span>A: USB Type-B connector.</span>
                </li>
                <li>
                  <strong>Q6: What is the clock speed of Arduino Uno?</strong>
                  <br />
                  <span>A: 16 MHz.</span>
                </li>
                <li>
                  <strong>Q7: How is Arduino Uno programmed?</strong>
                  <br />
                  <span>A: Using the Arduino IDE with a USB cable.</span>
                </li>
                <li>
                  <strong>
                    Q8: What is the flash memory size of Arduino Uno?
                  </strong>
                  <br />
                  <span>A: 32 KB (0.5 KB used by bootloader).</span>
                </li>
                <li>
                  <strong>
                    Q9: Which communication protocols does Arduino Uno support?
                  </strong>
                  <br />
                  <span>A: UART (Serial), I2C, and SPI.</span>
                </li>
                <li>
                  <strong>
                    Q10: Can Arduino Uno run without being connected to a PC?
                  </strong>
                  <br />
                  <span>
                    A: Yes, it can run from an external 7–12V power supply.
                  </span>
                </li>
              </ul>
            </div>
            {/* Next Button for pagination */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => navigate("/resources/questions/2")}
                className="px-6 py-2 bg-accent text-white rounded font-bold shadow hover:bg-accent/90 transition"
              >
                Next
              </button>
            </div>
          </div>
        </section>
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
