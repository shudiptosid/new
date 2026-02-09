import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  BarChart3,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

interface QuizAttempt {
  id: string;
  category: string | null;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  time_taken_seconds: number;
  completed_at: string;
}

const TestHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    totalQuestions: 0,
    totalCorrect: 0,
  });

  useEffect(() => {
    if (user) {
      fetchAttempts();
    }
  }, [user]);

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_quiz_attempts")
        .select("*")
        .eq("user_id", user?.id)
        .order("completed_at", { ascending: false });

      if (error) throw error;

      setAttempts(data || []);

      // Calculate stats
      if (data && data.length > 0) {
        const totalCorrect = data.reduce(
          (sum, attempt) => sum + attempt.correct_answers,
          0,
        );
        const totalQuestions = data.reduce(
          (sum, attempt) => sum + attempt.total_questions,
          0,
        );
        const avgScore =
          data.reduce((sum, attempt) => sum + attempt.score_percentage, 0) /
          data.length;

        setStats({
          totalAttempts: data.length,
          averageScore: avgScore,
          totalQuestions,
          totalCorrect,
        });
      }
    } catch (error) {
      console.error("Error fetching quiz attempts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#000000] mx-auto mb-4"></div>
          <p className="text-[#777777]">Loading your test history...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#FAFAFA]"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-[#111111] text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#E5E5E5] hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Test History</h1>
              <p className="text-[#E5E5E5]">Track your quiz performance</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-[#1A1A1A] border-[#333333] p-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-[#E5E5E5] text-sm">Total Tests</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalAttempts}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="bg-[#1A1A1A] border-[#333333] p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-[#E5E5E5] text-sm">Average Score</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.averageScore.toFixed(1)}%
                  </p>
                </div>
              </div>
            </Card>
            <Card className="bg-[#1A1A1A] border-[#333333] p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-[#E5E5E5] text-sm">Correct Answers</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalCorrect}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="bg-[#1A1A1A] border-[#333333] p-4">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-[#E5E5E5] text-sm">Wrong Answers</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalQuestions - stats.totalCorrect}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Test History List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {attempts.length === 0 ? (
          <Card className="p-12 text-center bg-white border-[#DCDCDC]">
            <BarChart3 className="w-16 h-16 text-[#777777] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#000000] mb-2">
              No Test History Yet
            </h3>
            <p className="text-[#777777] mb-6">
              Take your first quiz to start tracking your progress!
            </p>
            <Button
              onClick={() => navigate("/quiz")}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:shadow-lg"
            >
              Take a Quiz
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt) => {
              const wrongAnswers =
                attempt.total_questions - attempt.correct_answers;
              const wrongPercentage =
                (wrongAnswers / attempt.total_questions) * 100;

              return (
                <Card
                  key={attempt.id}
                  className="p-6 bg-white border-[#DCDCDC] hover:border-[#000000] hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                          <Trophy
                            className={`w-6 h-6 ${getScoreColor(attempt.score_percentage)}`}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#000000]">
                            {attempt.category || "All Questions"}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-[#777777]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(attempt.completed_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTime(attempt.time_taken_seconds)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Score Details */}
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-[#777777] mb-1">
                            Questions
                          </p>
                          <p className="text-lg font-bold text-[#000000]">
                            {attempt.total_questions}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#777777] mb-1">Correct</p>
                          <p className="text-lg font-bold text-green-600">
                            {attempt.correct_answers}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#777777] mb-1">Wrong</p>
                          <p className="text-lg font-bold text-red-600">
                            {wrongAnswers}
                          </p>
                        </div>
                      </div>

                      {/* Wrong Answers Progress Bar */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-[#777777]">
                            Wrong Answers
                          </p>
                          <p className="text-xs font-semibold text-red-600">
                            {wrongAnswers} / {attempt.total_questions} (
                            {wrongPercentage.toFixed(0)}%)
                          </p>
                        </div>
                        <div className="w-full bg-[#F5F5F5] rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-red-500 h-full transition-all duration-500 rounded-full"
                            style={{ width: `${wrongPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Score Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-[#777777]">Score</p>
                          <p
                            className={`text-xs font-semibold ${getScoreColor(attempt.score_percentage)}`}
                          >
                            {attempt.score_percentage.toFixed(1)}%
                          </p>
                        </div>
                        <div className="w-full bg-[#F5F5F5] rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${getProgressColor(attempt.score_percentage)}`}
                            style={{
                              width: `${attempt.score_percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Score Badge */}
                    <div className="flex flex-col items-center justify-center bg-[#F5F5F5] rounded-xl p-6 min-w-[120px]">
                      <p className="text-sm text-[#777777] mb-1">Final Score</p>
                      <p
                        className={`text-4xl font-bold ${getScoreColor(attempt.score_percentage)}`}
                      >
                        {attempt.score_percentage.toFixed(0)}
                        <span className="text-xl">%</span>
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestHistory;
