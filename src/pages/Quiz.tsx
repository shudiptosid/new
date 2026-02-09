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

  // Exam Mode State
  const [showExamModal, setShowExamModal] = useState(false);
  const [examCategory, setExamCategory] = useState<string>('random');
  const [examDifficulty, setExamDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [examQuestionCount, setExamQuestionCount] = useState(25);
  const [examMode, setExamMode] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuestionWithOptions[]>([]);

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

  // Fisher-Yates Shuffle Algorithm - for true randomization
  const shuffleQuestions = (questions: QuestionWithOptions[]): QuestionWithOptions[] => {
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Start Exam with category selection and shuffle
  const startExam = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please sign in to take exams and track your progress.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    let questionsToUse: QuestionWithOptions[] = [];

    // 1. Filter by Category
    if (examCategory === 'random') {
      await fetchQuestions();
      questionsToUse = allQuestions.filter(q => q.is_active);
    } else {
      await fetchQuestionsByCategory(examCategory);
      questionsToUse = allQuestions.filter(q => q.category === examCategory && q.is_active);
    }

    // 2. Filter by Difficulty
    if (examDifficulty !== 'mixed') {
      questionsToUse = questionsToUse.filter(q => q.difficulty === examDifficulty);
    }

    if (questionsToUse.length === 0) {
      toast({
        title: "No Questions Found",
        description: `No ${examDifficulty !== 'mixed' ? examDifficulty : ''} questions found for this selection. Try satisfying criteria.`,
        variant: "destructive",
      });
      return;
    }

    // 3. Shuffle
    questionsToUse = shuffleQuestions(questionsToUse);

    // 4. Take only the requested count
    const limitedQuestions = questionsToUse.slice(0, examQuestionCount);
    setShuffledQuestions(limitedQuestions);

    setExamMode(true);
    setSelectedCategory(examCategory === 'random' ? 'Random Mix' : examCategory);
    setShowExamModal(false);
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setScore(0);
    setStartTime(Date.now());
    setQuestionTimer(30);
    setTimerActive(true);
  };

  const startQuiz = async (category?: string) => {
    if (category) {
      await fetchQuestionsByCategory(category);
      setSelectedCategory(category);
    } else {
      await fetchQuestions();
    }
    setExamMode(false);
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
    const questions = examMode ? shuffledQuestions : allQuestions;
    if (currentQuestionIndex < questions.length - 1) {
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

    const questions = examMode ? shuffledQuestions : allQuestions;
    if (Object.keys(selectedAnswers).length < questions.length) {
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
    questions.forEach((question) => {
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
          questions.length,
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

  // Use shuffled questions in exam mode, allQuestions otherwise
  const activeQuestions = examMode ? shuffledQuestions : allQuestions;
  const currentQuestion = activeQuestions[currentQuestionIndex];
  const progress = activeQuestions.length > 0
    ? ((currentQuestionIndex + 1) / activeQuestions.length) * 100
    : 0;

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
              onClick={() => {
                if (!isAuthenticated) {
                  toast({
                    title: "Login Required",
                    description: "Please sign in to take exams.",
                    variant: "destructive",
                  });
                  navigate("/login");
                } else {
                  setShowExamModal(true);
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

        {/* Exam Modal */}
        {showExamModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Modal Header */}
              <div className="bg-[#111111] text-white p-6">
                <h3 className="text-2xl font-bold">Start New Exam</h3>
                <p className="text-white/70 mt-1">Configure your exam settings</p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-semibold text-[#000000] mb-2">
                    Select Category
                  </label>
                  <select
                    value={examCategory}
                    onChange={(e) => setExamCategory(e.target.value)}
                    className="w-full p-3 border-2 border-[#E0E0E0] rounded-xl focus:border-[#000000] focus:outline-none transition-colors bg-white"
                  >
                    <option value="random">🎲 Random Mix (All Categories)</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        📚 {cat} ({allQuestions.filter(q => q.category === cat && q.is_active).length} questions)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question Count */}
                <div>
                  <label className="block text-sm font-semibold text-[#000000] mb-2">
                    Number of Questions
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 25, 50, 100].map((count) => (
                      <button
                        key={count}
                        onClick={() => setExamQuestionCount(count)}
                        className={`py-3 rounded-xl font-semibold transition-all ${examQuestionCount === count
                          ? 'bg-[#111111] text-white'
                          : 'bg-[#F5F5F5] text-[#000000] hover:bg-[#E5E5E5]'
                          }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Level */}
                <div>
                  <label className="block text-sm font-semibold text-[#000000] mb-2">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['easy', 'medium', 'hard', 'mixed'] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setExamDifficulty(diff)}
                        className={`py-3 rounded-xl font-semibold capitalize transition-all ${examDifficulty === diff
                          ? 'bg-[#111111] text-white'
                          : 'bg-[#F5F5F5] text-[#000000] hover:bg-[#E5E5E5]'
                          }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Exam Features</p>
                      <ul className="space-y-1 text-blue-700">
                        <li>• 30 seconds per question</li>
                        <li>• -0.25 marks for wrong answers</li>
                        <li>• Questions are shuffled randomly</li>
                        <li>• Progress is saved automatically</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={() => setShowExamModal(false)}
                  className="flex-1 py-3 border-2 border-[#E0E0E0] text-[#000000] rounded-xl font-semibold hover:bg-[#F5F5F5] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={startExam}
                  className="flex-1 py-3 bg-[#111111] text-white rounded-xl font-semibold hover:bg-[#333333] transition-all flex items-center justify-center gap-2"
                >
                  Start Exam
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

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
            <div className="max-w-6xl mx-auto">

              {/* Hero Section */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-full mb-4">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  {allQuestions.filter((q) => q.is_active).length} Questions Available
                </div>
                <h2 className="text-4xl font-bold text-[#000000] mb-4">
                  Start Your Practice Session
                </h2>
                <p className="text-[#777777] text-lg max-w-2xl mx-auto">
                  Choose a category below to test your knowledge. Each quiz includes timed questions with instant feedback.
                </p>
              </div>

              {/* Featured: All Questions Card */}
              <div className="mb-8">
                <button
                  onClick={() => startQuiz()}
                  className="w-full p-8 bg-[#111111] text-white rounded-2xl hover:bg-[#222222] transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                  </div>

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur group-hover:bg-white/20 transition-all">
                        <span className="text-3xl">🎯</span>
                      </div>
                      <div className="text-left">
                        <h3 className="text-2xl font-bold mb-1">Complete Quiz Challenge</h3>
                        <p className="text-white/70">Test yourself with all {allQuestions.filter((q) => q.is_active).length} questions across all categories</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-3xl font-bold">{allQuestions.filter((q) => q.is_active).length}</div>
                        <div className="text-sm text-white/60">Questions</div>
                      </div>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </button>
              </div>

              {/* Category Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#000000]">Browse by Category</h3>
                <span className="text-sm text-[#777777]">{categories.length} categories available</span>
              </div>

              {/* Category Grid - Redesigned Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((category, index) => {
                  const categoryQuestions = allQuestions.filter((q) => q.category === category && q.is_active);
                  const questionCount = categoryQuestions.length;
                  const easyCount = categoryQuestions.filter(q => q.difficulty === 'easy').length;
                  const mediumCount = categoryQuestions.filter(q => q.difficulty === 'medium').length;
                  const hardCount = categoryQuestions.filter(q => q.difficulty === 'hard').length;

                  // Different accent colors for each category
                  const colors = [
                    { bg: 'bg-blue-50', border: 'border-blue-200', accent: 'bg-blue-500', text: 'text-blue-600', icon: '💻' },
                    { bg: 'bg-emerald-50', border: 'border-emerald-200', accent: 'bg-emerald-500', text: 'text-emerald-600', icon: '🌐' },
                    { bg: 'bg-purple-50', border: 'border-purple-200', accent: 'bg-purple-500', text: 'text-purple-600', icon: '⚡' },
                    { bg: 'bg-orange-50', border: 'border-orange-200', accent: 'bg-orange-500', text: 'text-orange-600', icon: '🔧' },
                    { bg: 'bg-rose-50', border: 'border-rose-200', accent: 'bg-rose-500', text: 'text-rose-600', icon: '📡' },
                    { bg: 'bg-cyan-50', border: 'border-cyan-200', accent: 'bg-cyan-500', text: 'text-cyan-600', icon: '🎓' },
                  ];
                  const color = colors[index % colors.length];

                  return (
                    <button
                      key={category}
                      onClick={() => startQuiz(category)}
                      className={`p-6 ${color.bg} border-2 ${color.border} rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group text-left relative overflow-hidden`}
                    >
                      {/* Top Bar Accent */}
                      <div className={`absolute top-0 left-0 right-0 h-1 ${color.accent}`}></div>

                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${color.accent} rounded-xl flex items-center justify-center text-white text-xl shadow-sm`}>
                          {color.icon}
                        </div>
                        <div className={`px-3 py-1 bg-white rounded-full text-sm font-semibold ${color.text} shadow-sm`}>
                          {questionCount} Qs
                        </div>
                      </div>

                      {/* Category Name */}
                      <h4 className="text-xl font-bold text-[#000000] mb-1 group-hover:text-[#333333]">
                        {category}
                      </h4>
                      <p className="text-sm text-[#777777] mb-3">{questionCount} Questions</p>

                      {/* Difficulty Breakdown */}
                      <div className="flex gap-3 mb-4">
                        {easyCount > 0 && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            {easyCount} Easy
                          </span>
                        )}
                        {mediumCount > 0 && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                            {mediumCount} Medium
                          </span>
                        )}
                        {hardCount > 0 && (
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                            {hardCount} Hard
                          </span>
                        )}
                      </div>

                      {/* Progress Bar (placeholder) */}
                      <div className="h-2 bg-white rounded-full overflow-hidden">
                        <div className={`h-full ${color.accent} w-0 group-hover:w-full transition-all duration-500`}></div>
                      </div>

                      {/* Start CTA */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/50">
                        <span className="text-sm text-[#777777]">Start Quiz</span>
                        <ArrowRight className={`w-5 h-5 ${color.text} group-hover:translate-x-1 transition-transform`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Sign In Prompt (if not authenticated) */}
              {!isAuthenticated && (
                <div className="mt-8 bg-[#FAFAFA] border-2 border-dashed border-[#E0E0E0] rounded-xl p-8">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center text-white text-2xl">
                      🔐
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#000000] text-lg mb-1">
                        Unlock Progress Tracking
                      </h3>
                      <p className="text-[#777777]">
                        Sign in to save your quiz history, track performance analytics, and compete on leaderboards.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/login")}
                      className="px-6 py-3 bg-[#000000] text-white rounded-xl font-semibold hover:bg-[#333333] transition-all whitespace-nowrap"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Stats Footer */}
              {categories.length > 0 && (
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl border border-[#E0E0E0] p-5 text-center">
                    <div className="text-3xl font-bold text-[#000000]">
                      {allQuestions.filter((q) => q.is_active).length}
                    </div>
                    <div className="text-sm text-[#777777] mt-1">Total Questions</div>
                  </div>
                  <div className="bg-white rounded-xl border border-[#E0E0E0] p-5 text-center">
                    <div className="text-3xl font-bold text-[#000000]">
                      {categories.length}
                    </div>
                    <div className="text-sm text-[#777777] mt-1">Categories</div>
                  </div>
                  <div className="bg-white rounded-xl border border-[#E0E0E0] p-5 text-center">
                    <div className="text-3xl font-bold text-[#000000]">
                      30<span className="text-lg font-normal">s</span>
                    </div>
                    <div className="text-sm text-[#777777] mt-1">Per Question</div>
                  </div>
                  <div className="bg-white rounded-xl border border-[#E0E0E0] p-5 text-center">
                    <div className="text-3xl font-bold text-[#000000]">
                      -0.25
                    </div>
                    <div className="text-sm text-[#777777] mt-1">Wrong Penalty</div>
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
    const percentage = (activeQuestions.length > 0 ? (score / activeQuestions.length) * 100 : 0).toFixed(1);
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
                    {score}/{activeQuestions.length}
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
                  {activeQuestions.map((question, index) => {
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
                        className={`bg-white rounded-lg border-2 p-6 ${isCorrect ? "border-[#000000]" : "border-[#777777]"
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
                Question {currentQuestionIndex + 1} of {activeQuestions.length}
              </p>
            </div>
            <div className="flex items-center gap-6">
              {/* Question Timer - 30 seconds countdown */}
              <div
                className={`flex flex-col items-center p-4 rounded-lg ${questionTimer <= 10
                  ? "bg-red-50 border-2 border-red-500"
                  : "bg-blue-50 border-2 border-blue-500"
                  }`}
              >
                <div className="text-sm font-semibold text-[#777777] mb-1">
                  Time Left
                </div>
                <div
                  className={`text-4xl font-bold ${questionTimer <= 10
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
                        className={`w-full p-5 text-left rounded-lg border transition-all ${selectedAnswers[currentQuestion.id] ===
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
                {Object.keys(selectedAnswers).length}/{activeQuestions.length}{" "}
                answered
              </div>

              {currentQuestionIndex === activeQuestions.length - 1 ? (
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
                    className={`aspect-square rounded-lg font-bold text-sm transition-all ${index === currentQuestionIndex
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
