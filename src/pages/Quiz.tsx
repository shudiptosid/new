import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuestions } from "@/hooks/useQuestions";
import { QuestionWithOptions } from "@/types/question.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Clock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Home,
  LayoutDashboard,
  FileText,
  BookOpen,
  ClipboardList,
  BarChart3,
  Settings,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

const Quiz = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const {
    questions: allQuestions,
    loading,
    fetchQuestions,
    fetchQuestionsByCategory,
    saveQuizAttempt,
    saveQuestionProgress,
    getCategories,
  } = useQuestions();

  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(30); // 30 seconds per question
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    checkAuth();
    loadCategories();
    loadInitialQuestions(); // Load questions for stats
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      startQuiz(categoryParam);
    }
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (quizStarted && !quizCompleted && timerActive) {
      if (questionTimer > 0) {
        const timerId = setTimeout(() => {
          setQuestionTimer((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timerId);
      } else {
        // Time's up! Auto-advance to next question
        handleNext();
      }
    }
  }, [questionTimer, quizStarted, quizCompleted, timerActive]);

  // Reset timer when question changes
  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      setQuestionTimer(30);
      setTimerActive(true);
    }
  }, [currentQuestionIndex, quizStarted]);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getUser();
    setIsAuthenticated(!!data.user);
  };

  const loadCategories = async () => {
    const cats = await getCategories();
    setCategories(cats);
  };

  const loadInitialQuestions = async () => {
    // Load questions to show stats on category selection page
    await fetchQuestions();
  };

  const startQuiz = async (category?: string) => {
    if (category) {
      await fetchQuestionsByCategory(category);
      setSelectedCategory(category);
    } else {
      await fetchQuestions();
    }
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setScore(0);
    setStartTime(Date.now());
    setQuestionTimer(30);
    setTimerActive(true);
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionTimer(30); // Reset timer for next question
    } else {
      // Last question - submit automatically
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setTimerActive(false); // Stop the timer

    if (Object.keys(selectedAnswers).length < allQuestions.length) {
      if (!confirm("You haven't answered all questions. Submit anyway?")) {
        setTimerActive(true); // Resume timer if user cancels
        return;
      }
    }

    const endTime = Date.now();
    const timeInSeconds = Math.floor((endTime - startTime) / 1000);
    setTimeTaken(timeInSeconds);

    let correctCount = 0;
    let wrongCount = 0;
    let finalScore = 0;

    // Calculate score with negative marking
    allQuestions.forEach((question) => {
      const userAnswer = selectedAnswers[question.id];

      if (!userAnswer) {
        // No answer - no marks
        return;
      }

      let isCorrect = false;

      if (question.question_type === "mcq") {
        const correctOption = question.mcq_options?.find(
          (opt) => opt.is_correct,
        );
        isCorrect = correctOption?.option_text === userAnswer;
      } else if (
        question.question_type === "short_answer" &&
        question.short_answer
      ) {
        const correctAnswer = question.short_answer.correct_answer
          .toLowerCase()
          .trim();
        const alternatives = question.short_answer.alternative_answers || [];
        isCorrect =
          userAnswer.toLowerCase().trim() === correctAnswer ||
          alternatives.some(
            (alt) =>
              alt.toLowerCase().trim() === userAnswer.toLowerCase().trim(),
          );
      }

      if (isCorrect) {
        correctCount++;
        finalScore += 1; // +1 for correct answer
      } else {
        wrongCount++;
        finalScore -= 0.25; // -0.25 for wrong answer
      }

      // Save individual question progress (if authenticated)
      if (isAuthenticated) {
        saveQuestionProgress(question.id, isCorrect, userAnswer).catch(
          console.error,
        );
      }
    });

    // Ensure score doesn't go below 0
    finalScore = Math.max(0, finalScore);

    setScore(finalScore);
    setQuizCompleted(true);

    // Save quiz attempt (if authenticated)
    if (isAuthenticated) {
      try {
        await saveQuizAttempt(
          selectedCategory || undefined,
          allQuestions.length,
          correctCount,
          timeInSeconds,
        );
        toast({
          title: "Quiz Saved!",
          description: "Your progress has been saved to your account.",
        });
      } catch (error) {
        console.error("Failed to save quiz attempt:", error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;

  // Category Selection Screen
  if (!quizStarted) {
    return (
      <div
        className="min-h-screen bg-[#FAFAFA] flex"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {/* Left Sidebar - Black Background */}
        <aside className="w-64 bg-[#111111] min-h-screen p-6 flex flex-col">
          <div className="mb-10">
            <h2 className="text-white text-xl font-bold">Quiz Platform</h2>
          </div>

          <nav className="flex-1 space-y-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white hover:text-black rounded-lg transition-all"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white text-black rounded-lg font-semibold">
              <FileText className="w-5 h-5" />
              <span>Quiz Builder</span>
            </button>

            <button
              onClick={() => startQuiz()}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white hover:text-black rounded-lg transition-all"
            >
              <BookOpen className="w-5 h-5" />
              <span>Exams</span>
            </button>

            <button
              onClick={() => navigate("/test-history")}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white hover:text-black rounded-lg transition-all"
            >
              <ClipboardList className="w-5 h-5" />
              <span>My Tests</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white hover:text-black rounded-lg transition-all">
              <BarChart3 className="w-5 h-5" />
              <span>Reports</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white hover:text-black rounded-lg transition-all">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>

          <div className="mt-auto pt-6 border-t border-[#333333]">
            <button
              onClick={() => navigate("/resources")}
              className="w-full text-white text-sm hover:text-gray-300 transition-colors"
            >
              ← Back to Resources
            </button>
          </div>
        </aside>

        {/* Main Content Area - White Background */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-[#E5E5E5] px-8 py-6">
            <div>
              <h1 className="text-3xl font-bold text-[#000000]">
                Practice Quiz
              </h1>
              <p className="text-[#777777] mt-2">
                Test your knowledge and track your progress
              </p>
            </div>
          </header>

          {/* Category Selection Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              {/* Welcome Card */}
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-8 mb-8">
                <h2 className="text-2xl font-bold text-[#000000] mb-2">
                  Choose a Category
                </h2>
                <p className="text-[#777777] mb-6">
                  Select a topic to start your quiz or choose "All Questions"
                  for a comprehensive test
                </p>

                {/* Category Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* All Questions - Featured */}
                  <button
                    onClick={() => startQuiz()}
                    className="col-span-1 md:col-span-3 p-8 bg-[#000000] text-white rounded-lg hover:bg-[#333333] transition-all group"
                  >
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-4xl">🌐</div>
                      <div className="text-left">
                        <h3 className="text-2xl font-bold mb-1">
                          All Questions
                        </h3>
                        <p className="text-[#E5E5E5] text-sm">
                          Complete quiz with all available questions
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Category Cards */}
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => startQuiz(category)}
                      className="p-6 bg-white border border-[#DCDCDC] rounded-lg hover:bg-[#F5F5F5] hover:border-[#000000] transition-all group"
                    >
                      <div className="text-4xl mb-4">📚</div>
                      <h3 className="text-xl font-bold text-[#000000] mb-2">
                        {category}
                      </h3>
                      <p className="text-[#777777] text-sm">
                        {
                          allQuestions.filter(
                            (q) => q.category === category && q.is_active,
                          ).length
                        }{" "}
                        Questions
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Card */}
              {!isAuthenticated && (
                <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">💡</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#000000] mb-2">
                        Track Your Progress
                      </h3>
                      <p className="text-[#777777] mb-4">
                        Sign in to save your quiz attempts, view detailed
                        analytics, and track your learning progress over time.
                      </p>
                      <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 bg-[#000000] text-white rounded-lg hover:bg-[#333333] transition-all font-medium"
                      >
                        Sign In Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Preview (if categories exist) */}
              {categories.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 text-center">
                    <div className="text-3xl font-bold text-[#000000] mb-1">
                      {allQuestions.filter((q) => q.is_active).length}
                    </div>
                    <div className="text-[#777777] text-sm">
                      Total Questions
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 text-center">
                    <div className="text-3xl font-bold text-[#000000] mb-1">
                      {categories.length}
                    </div>
                    <div className="text-[#777777] text-sm">Categories</div>
                  </div>
                  <div className="bg-white rounded-lg border border-[#E0E0E0] p-6 text-center">
                    <div className="text-3xl font-bold text-[#000000] mb-1">
                      {
                        allQuestions.filter(
                          (q) => q.difficulty === "easy" && q.is_active,
                        ).length
                      }
                      +
                    </div>
                    <div className="text-[#777777] text-sm">Easy Questions</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Quiz Completed Screen
  if (quizCompleted) {
    const percentage = ((score / allQuestions.length) * 100).toFixed(1);
    const passed = parseFloat(percentage) >= 50;

    return (
      <div
        className="min-h-screen bg-[#FAFAFA] flex"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {/* Left Sidebar - Black Background */}
        <aside className="w-64 bg-[#111111] min-h-screen p-6 flex flex-col">
          <div className="mb-10">
            <h2 className="text-white text-xl font-bold">Quiz Platform</h2>
          </div>

          <nav className="flex-1 space-y-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white hover:text-black rounded-lg transition-all"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => navigate("/quiz")}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white text-black rounded-lg font-semibold"
            >
              <FileText className="w-5 h-5" />
              <span>Quiz Builder</span>
            </button>

            <button
              onClick={() => {
                setQuizCompleted(false);
                setQuizStarted(false);
                setCurrentQuestionIndex(0);
                setSelectedAnswers({});
                setScore(0);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white hover:text-black rounded-lg transition-all"
            >
              <BookOpen className="w-5 h-5" />
              <span>Exams</span>
            </button>

            <button
              onClick={() => navigate("/test-history")}
              className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white hover:text-black rounded-lg transition-all"
            >
              <ClipboardList className="w-5 h-5" />
              <span>My Tests</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white hover:text-black rounded-lg transition-all">
              <BarChart3 className="w-5 h-5" />
              <span>Reports</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white hover:text-black rounded-lg transition-all">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>

          <div className="mt-auto pt-6 border-t border-[#333333]">
            <button
              onClick={() => navigate("/resources")}
              className="w-full text-white text-sm hover:text-gray-300 transition-colors"
            >
              ← Back to Resources
            </button>
          </div>
        </aside>

        {/* Main Content Area - White Background */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-[#E5E5E5] px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-[#000000]">
                  Quiz Results
                </h1>
                <p className="text-[#777777] mt-2">
                  {selectedCategory || "All Questions"}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-[#777777]">Time Taken</div>
                <div className="text-2xl font-bold text-[#000000]">
                  {formatTime(timeTaken)}
                </div>
              </div>
            </div>
          </header>

          {/* Results Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              {/* Score Card */}
              <div className="bg-white rounded-lg border border-[#E0E0E0] p-12 mb-8 text-center">
                <div className="mb-6">
                  {passed ? (
                    <Trophy className="w-24 h-24 mx-auto text-[#000000]" />
                  ) : (
                    <div className="text-6xl mb-4">📚</div>
                  )}
                </div>

                <h2 className="text-4xl font-bold text-[#000000] mb-6">
                  {passed ? "Congratulations! 🎉" : "Quiz Completed! 📝"}
                </h2>

                <div className="bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg p-8 mb-6">
                  <div className="text-6xl font-bold text-[#000000] mb-2">
                    {score}/{allQuestions.length}
                  </div>
                  <div className="text-2xl text-[#777777] mb-4">
                    {percentage}% Correct
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[#777777]">
                    <Clock className="w-5 h-5" />
                    <span>Time: {formatTime(timeTaken)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => startQuiz(selectedCategory || undefined)}
                    className="px-8 py-3 bg-[#000000] text-white rounded-lg font-semibold hover:bg-[#333333] transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Retake Quiz
                  </button>
                  <button
                    onClick={() => navigate("/quiz")}
                    className="px-8 py-3 border border-[#000000] text-[#000000] rounded-lg font-semibold hover:bg-[#F5F5F5] transition-all flex items-center gap-2"
                  >
                    <Home className="w-5 h-5" />
                    Back to Categories
                  </button>
                </div>
              </div>

              {/* Answer Review */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-[#000000] mb-6">
                  Answer Review
                </h3>
                <div className="space-y-4">
                  {allQuestions.map((question, index) => {
                    const userAnswer = selectedAnswers[question.id];
                    let correctAnswer = "";
                    let isCorrect = false;

                    if (question.question_type === "mcq") {
                      const correctOption = question.mcq_options?.find(
                        (opt) => opt.is_correct,
                      );
                      correctAnswer = correctOption?.option_text || "";
                      isCorrect = correctAnswer === userAnswer;
                    } else if (
                      question.question_type === "short_answer" &&
                      question.short_answer
                    ) {
                      correctAnswer = question.short_answer.correct_answer;
                      const alternatives =
                        question.short_answer.alternative_answers || [];
                      isCorrect =
                        userAnswer?.toLowerCase().trim() ===
                          correctAnswer.toLowerCase().trim() ||
                        alternatives.some(
                          (alt) =>
                            alt.toLowerCase().trim() ===
                            userAnswer?.toLowerCase().trim(),
                        );
                    }

                    return (
                      <div
                        key={question.id}
                        className={`bg-white rounded-lg border-2 p-6 ${
                          isCorrect ? "border-[#000000]" : "border-[#777777]"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-3xl">
                            {isCorrect ? "✅" : "❌"}
                          </span>
                          <div className="flex-1">
                            <p className="font-bold text-[#000000] mb-3 text-lg">
                              Q{index + 1}. {question.question_text}
                            </p>
                            <div className="bg-[#FAFAFA] rounded p-3 mb-2">
                              <p className="text-sm text-[#777777]">
                                <strong className="text-[#000000]">
                                  Your answer:
                                </strong>{" "}
                                <span
                                  className={
                                    isCorrect
                                      ? "text-[#000000] font-semibold"
                                      : "text-[#777777]"
                                  }
                                >
                                  {userAnswer || "No answer"}
                                </span>
                              </p>
                            </div>
                            {!isCorrect && (
                              <div className="bg-[#FAFAFA] rounded p-3 mb-2">
                                <p className="text-sm">
                                  <strong className="text-[#000000]">
                                    Correct answer:
                                  </strong>{" "}
                                  <span className="text-[#000000] font-semibold">
                                    {correctAnswer}
                                  </span>
                                </p>
                              </div>
                            )}
                            {question.explanation && (
                              <div className="mt-3 p-3 bg-[#F5F5F5] rounded border-l-4 border-[#000000]">
                                <p className="text-sm text-[#000000]">
                                  💡 {question.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Quiz In Progress
  if (loading || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <p
          className="text-xl font-medium"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          Loading questions...
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#FAFAFA] flex"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Left Sidebar - Black Background */}
      <aside className="w-64 bg-[#111111] min-h-screen p-6 flex flex-col">
        <div className="mb-10">
          <h2 className="text-white text-xl font-bold">Quiz Platform</h2>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white hover:text-black rounded-lg transition-all"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white text-black rounded-lg font-semibold">
            <FileText className="w-5 h-5" />
            <span>Quiz Builder</span>
          </button>

          <button
            onClick={() => {
              if (
                confirm(
                  "Exit current quiz and start a new exam? Your progress will be lost.",
                )
              ) {
                setQuizCompleted(false);
                setQuizStarted(false);
                setCurrentQuestionIndex(0);
                setSelectedAnswers({});
                setScore(0);
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white hover:text-black rounded-lg transition-all"
          >
            <BookOpen className="w-5 h-5" />
            <span>Exams</span>
          </button>

          <button
            onClick={() => navigate("/test-history")}
            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white hover:text-black rounded-lg transition-all"
          >
            <ClipboardList className="w-5 h-5" />
            <span>My Tests</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white hover:text-black rounded-lg transition-all">
            <BarChart3 className="w-5 h-5" />
            <span>Reports</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white hover:text-black rounded-lg transition-all">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-[#333333]">
          <button
            onClick={() => navigate("/resources")}
            className="w-full text-white text-sm hover:text-gray-300 transition-colors"
          >
            ← Back to Resources
          </button>
        </div>
      </aside>

      {/* Main Content Area - White Background */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-[#E5E5E5] px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#000000]">
                {selectedCategory || "Practice Quiz"}
              </h1>
              <p className="text-[#777777] mt-1">
                Question {currentQuestionIndex + 1} of {allQuestions.length}
              </p>
            </div>
            <div className="flex items-center gap-6">
              {/* Question Timer - 30 seconds countdown */}
              <div
                className={`flex flex-col items-center p-4 rounded-lg ${
                  questionTimer <= 10
                    ? "bg-red-50 border-2 border-red-500"
                    : "bg-blue-50 border-2 border-blue-500"
                }`}
              >
                <div className="text-sm font-semibold text-[#777777] mb-1">
                  Time Left
                </div>
                <div
                  className={`text-4xl font-bold ${
                    questionTimer <= 10
                      ? "text-red-600 animate-pulse"
                      : "text-blue-600"
                  }`}
                >
                  {questionTimer}s
                </div>
              </div>

              {/* Total Time */}
              <div className="flex items-center gap-2 text-[#777777]">
                <Clock className="w-5 h-5" />
                <span className="font-medium">
                  {formatTime(Math.floor((Date.now() - startTime) / 1000))}
                </span>
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#000000] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        {/* Quiz Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Question Card */}
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-8 mb-6">
              {/* Question Meta Info */}
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-[#F5F5F5] text-[#000000] rounded text-sm font-medium border border-[#DCDCDC]">
                  {currentQuestion.category}
                </span>
                <span className="px-3 py-1 bg-[#F5F5F5] text-[#000000] rounded text-sm font-medium border border-[#DCDCDC]">
                  {currentQuestion.difficulty}
                </span>
              </div>

              {/* Question Text */}
              <h2 className="text-2xl font-bold text-[#000000] mb-8">
                {currentQuestion.question_text}
              </h2>

              {/* MCQ Options */}
              {currentQuestion.question_type === "mcq" &&
                currentQuestion.mcq_options && (
                  <div className="space-y-3">
                    {currentQuestion.mcq_options.map((option, index) => (
                      <button
                        key={option.id}
                        onClick={() =>
                          handleAnswerSelect(
                            currentQuestion.id,
                            option.option_text,
                          )
                        }
                        className={`w-full p-5 text-left rounded-lg border transition-all ${
                          selectedAnswers[currentQuestion.id] ===
                          option.option_text
                            ? "border-[#000000] bg-[#EAEAEA] font-bold"
                            : "border-[#DCDCDC] hover:bg-[#F5F5F5]"
                        }`}
                      >
                        <span className="font-bold mr-4 text-[#000000]">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className="text-[#000000]">
                          {option.option_text}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

              {/* Short Answer Input */}
              {currentQuestion.question_type === "short_answer" && (
                <div>
                  <textarea
                    value={selectedAnswers[currentQuestion.id] || ""}
                    onChange={(e) =>
                      handleAnswerSelect(currentQuestion.id, e.target.value)
                    }
                    placeholder="Type your answer here..."
                    className="w-full p-5 border border-[#DCDCDC] rounded-lg focus:border-[#000000] focus:outline-none resize-none h-32"
                    style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                  />
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mb-6">
              <button
                disabled={true}
                className="px-6 py-3 border border-[#DCDCDC] text-[#999999] rounded-lg font-medium opacity-40 cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Previous (Disabled)
              </button>

              <div className="text-sm text-[#777777] font-medium">
                {Object.keys(selectedAnswers).length}/{allQuestions.length}{" "}
                answered
              </div>

              {currentQuestionIndex === allQuestions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-8 py-3 bg-[#000000] text-white rounded-lg font-semibold hover:bg-[#333333] transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-[#000000] text-white rounded-lg font-medium hover:bg-[#333333] transition-all"
                >
                  Next
                  <ArrowRight className="w-4 h-4 inline ml-2" />
                </button>
              )}
            </div>

            {/* Quick Navigation Grid */}
            <div className="bg-white rounded-lg border border-[#E0E0E0] p-6">
              <h3 className="text-sm font-bold text-[#000000] mb-4">
                Quick Navigation
              </h3>
              <div className="grid grid-cols-10 gap-2">
                {allQuestions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`aspect-square rounded-lg font-bold text-sm transition-all ${
                      index === currentQuestionIndex
                        ? "bg-[#000000] text-white"
                        : selectedAnswers[q.id]
                          ? "bg-[#777777] text-white"
                          : "bg-[#E5E5E5] hover:bg-[#DCDCDC] text-[#000000]"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quiz;
