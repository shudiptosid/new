import Navigation from "@/components/Navigation";
import ContactCTA from "@/components/ContactCTA";
import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import booksImg from "@/assets/books.png";
import boardImg from "@/assets/board.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuestions } from "@/hooks/useQuestions";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

const QUESTIONS_PER_PAGE = 10;

const SortQuestionsPage2 = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { questions, loading, fetchQuestions } = useQuestions();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Filter only short answer questions
  const shortAnswerQuestions = useMemo(() =>
    questions.filter(q => q.question_type === 'short_answer'),
    [questions]
  );

  // Derive stats for categories
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; easy: number; medium: number; hard: number }> = {};

    // Initialize stats for known categories
    shortAnswerQuestions.forEach(q => {
      const cat = q.category || "Uncategorized";
      if (!stats[cat]) {
        stats[cat] = { total: 0, easy: 0, medium: 0, hard: 0 };
      }
      stats[cat].total++;
      if (q.difficulty === 'easy') stats[cat].easy++;
      if (q.difficulty === 'medium') stats[cat].medium++;
      if (q.difficulty === 'hard') stats[cat].hard++;
    });

    return stats;
  }, [shortAnswerQuestions]);

  const categories = ["All Categories", ...Object.keys(categoryStats).sort()];

  const filteredQuestions = useMemo(() => {
    if (selectedCategory === "All Categories") {
      return shortAnswerQuestions;
    }
    return shortAnswerQuestions.filter((q) => q.category === selectedCategory);
  }, [selectedCategory, shortAnswerQuestions]);

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
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
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
        <div className="container mx-auto px-4 relative z-10 pt-8 pb-12">

          {/* Header Section */}
          <div className="mx-auto mb-12 max-w-2xl rounded-2xl bg-white/80 shadow-xl border-2 border-accent/30 p-6 flex flex-col items-center backdrop-blur-md">
            <h2 className="text-4xl font-extrabold text-center mb-4">
              Study Materials & Resources
            </h2>
            <span className="block mx-auto mt-2 w-24 h-1 rounded-full bg-gradient-to-r from-accent via-primary to-accent opacity-80 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Study Material Section */}
            <div className="flex flex-col flex-1 items-center">
              <h3 className="text-2xl font-bold text-foreground mb-4 w-full max-w-[580px] text-center">
                Study Material
              </h3>
              <div className="w-full max-w-[580px] space-y-4">
                {studyMaterials.map((res, idx) => (
                  <Card
                    key={idx}
                    className="p-6 flex flex-col justify-between min-h-[200px] shadow-lg border-2 border-accent/20 hover:border-accent/60 transition group bg-white/80 backdrop-blur-md relative overflow-hidden"
                  >
                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition -z-10" />
                    <div className="flex flex-col items-center">
                      <img
                        src={booksImg}
                        alt="Book Reference"
                        className="w-16 h-16 mb-3 object-contain"
                      />
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
                      className="inline-block mt-2 px-4 py-2 bg-accent text-white rounded hover:bg-accent/90 transition shadow text-center"
                    >
                      View / Download
                    </a>
                  </Card>
                ))}
              </div>
            </div>

            {/* Know Your Board Section */}
            <div className="flex flex-col flex-1 items-center">
              <h3 className="text-2xl font-bold text-foreground mb-4 w-full max-w-[580px] text-center">
                Know Your Board
              </h3>
              <div className="w-full max-w-[580px] space-y-4">
                {knowYourBoard.map((res, idx) => (
                  <Card
                    key={idx}
                    className="p-6 flex flex-col justify-between min-h-[200px] shadow-lg border-2 border-primary/20 hover:border-primary/60 transition group bg-white/80 backdrop-blur-md relative overflow-hidden"
                  >
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
                      className="inline-block mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition shadow text-center"
                    >
                      View / Download
                    </a>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sort Question Section */}
          <div className="mt-16 flex flex-col items-center w-full">
            <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
              Sort Questions Bank
            </h3>

            {/* Category Filter - Expanded UI */}
            <div className="w-full max-w-6xl mb-8">
              <div className="flex flex-wrap justify-center gap-3">
                {/* All Categories Button */}
                <button
                  onClick={() => {
                    setSelectedCategory("All Categories");
                    setCurrentPage(1);
                  }}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all min-w-[120px] ${selectedCategory === "All Categories"
                    ? "bg-primary text-white border-primary shadow-lg scale-105"
                    : "bg-white text-gray-700 border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                    }`}
                >
                  <span className="font-bold text-lg mb-1">All</span>
                  <Badge variant="secondary" className="bg-black/20 text-current hover:bg-black/30">
                    {shortAnswerQuestions.length}
                  </Badge>
                </button>

                {/* Individual Category Buttons */}
                {Object.keys(categoryStats).sort().map((cat) => {
                  const stats = categoryStats[cat];
                  const isSelected = selectedCategory === cat;

                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                      }}
                      className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all min-w-[140px] ${isSelected
                        ? "bg-white border-primary shadow-lg ring-2 ring-primary/20"
                        : "bg-white border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex justify-between w-full items-center mb-2">
                        <span className={`font-bold ${isSelected ? 'text-primary' : 'text-gray-800'}`}>
                          {cat}
                        </span>
                        <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                          {stats.total}
                        </span>
                      </div>

                      <div className="flex gap-1 text-[10px] w-full justify-between opacity-80">
                        <span className="text-green-600 font-semibold bg-green-50 px-1.5 rounded">
                          E:{stats.easy}
                        </span>
                        <span className="text-yellow-600 font-semibold bg-yellow-50 px-1.5 rounded">
                          M:{stats.medium}
                        </span>
                        <span className="text-red-600 font-semibold bg-red-50 px-1.5 rounded">
                          H:{stats.hard}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Questions List */}
            <div className="w-full max-w-4xl bg-white/90 rounded-2xl shadow-xl border border-white/50 p-6 md:p-8 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div>
                  <h4 className="text-xl font-bold flex items-center gap-2">
                    {selectedCategory === "All Categories" ? "All Questions" : selectedCategory}
                    <Badge variant="outline" className="ml-2">
                      {filteredQuestions.length}
                    </Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Page {currentPage} of {totalPages || 1}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="py-12 flex justify-center w-full">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">
                    Empty
                  </div>
                  <p className="text-muted-foreground text-lg">
                    No short answer questions found in this category.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentQuestions.map((item) => (
                    <div
                      key={item.id}
                      className="group p-4 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-blue-50/30 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h5 className="font-semibold text-gray-900 text-lg leading-snug">
                          {item.question_text}
                        </h5>
                        <Badge variant={
                          item.difficulty === 'easy' ? 'default' :
                            item.difficulty === 'medium' ? 'secondary' : 'destructive'
                        } className="capitalize shrink-0">
                          {item.difficulty}
                        </Badge>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-primary/50">
                        <p className="text-gray-700 font-medium">
                          <span className="text-primary font-bold mr-2">A:</span>
                          {item.short_answer?.correct_answer || item.short_answer?.alternative_answers?.[0] || "Answer not available"}
                        </p>
                      </div>

                      <div className="mt-2 flex justify-end">
                        <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && filteredQuestions.length > 0 && (
                <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {getPageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page as number)}
                          className={`w-10 h-10 rounded-lg font-bold transition-all ${currentPage === page
                            ? "bg-primary text-white shadow-md scale-105"
                            : "bg-white border hover:bg-gray-50 text-gray-600"
                            }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Quiz CTA */}
              <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                  onClick={() => navigate("/resources")}
                  className="px-6 py-2.5 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  ← Back to Resources
                </button>

                <button
                  onClick={handleQuizClick}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-bold shadow-lg hover:from-green-700 hover:to-green-600 hover:shadow-green-500/25 hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Take a Quiz
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
