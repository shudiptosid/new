import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestions } from "@/hooks/useQuestions";
import {
  QuestionWithOptions,
  QuestionFormData,
  DifficultyLevel,
} from "@/types/question.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Trash2,
  Edit,
  Save,
  X,
  Upload,
  FileEdit,
  ArrowLeft,
  Eye,
  EyeOff,
  BarChart3,
  BookOpen,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BulkShortAnswerUpload from "@/components/BulkShortAnswerUpload";

const AdminQuestions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    questions,
    loading,
    fetchQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    toggleQuestionActive,
  } = useQuestions();

  // Filter only Short Answer questions
  const shortAnswerQuestions = questions.filter((q) => q.question_type === "short_answer");

  // State
  const [activeView, setActiveView] = useState<"dashboard" | "upload" | "manage">("dashboard");
  const [uploadType, setUploadType] = useState<"single" | "bulk">("single");

  // Global upload settings
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>("medium");

  const [categories, setCategories] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | "all">("all");

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state for single question upload
  const [formData, setFormData] = useState<QuestionFormData>({
    question_text: "",
    question_type: "short_answer",
    category: "",
    difficulty: "medium",
    explanation: "",
    is_active: true,
    short_answer: {
      correct_answer: "",
      alternative_answers: [],
    },
  });

  useEffect(() => {
    fetchQuestions(true);
  }, []);

  useEffect(() => {
    // Extract unique categories from Short Answer questions
    const uniqueCategories = [...new Set(shortAnswerQuestions.map((q) => q.category))];
    setCategories(uniqueCategories);
  }, [questions]);

  // Calculate category statistics for Short Answer only
  const getStats = () => {
    const catStats: { [key: string]: { total: number; easy: number; medium: number; hard: number } } = {};
    const globalStats = { total: 0, easy: 0, medium: 0, hard: 0 };

    shortAnswerQuestions.forEach((q) => {
      // Category Stats
      if (!catStats[q.category]) {
        catStats[q.category] = { total: 0, easy: 0, medium: 0, hard: 0 };
      }
      catStats[q.category].total++;
      catStats[q.category][q.difficulty]++;

      // Global Stats
      globalStats.total++;
      globalStats[q.difficulty]++;
    });

    return { catStats, globalStats };
  };

  const { catStats: categoryStats, globalStats } = getStats();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question_text.trim()) {
      toast({ title: "Error", description: "Question text is required", variant: "destructive" });
      return;
    }

    if (uploadType === "single" && !selectedCategory) {
      toast({ title: "Error", description: "Please select a category", variant: "destructive" });
      return;
    }

    if (uploadType === "single" && !formData.short_answer?.correct_answer.trim()) {
      toast({ title: "Error", description: "Correct Answer is required", variant: "destructive" });
      return;
    }

    try {
      const questionData = {
        ...formData,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        question_type: "short_answer" as const,
      };

      if (editingId) {
        await updateQuestion(editingId, questionData);
        toast({ title: "Success", description: "Question updated successfully!" });
      } else {
        await createQuestion(questionData);
        toast({ title: "Success", description: "Question created successfully!" });
      }

      resetForm();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save question", variant: "destructive" });
    }
  };

  const handleEdit = (question: QuestionWithOptions) => {
    setEditingId(question.id);
    setIsEditing(true);
    setSelectedCategory(question.category);
    setSelectedDifficulty(question.difficulty);
    setFormData({
      question_text: question.question_text,
      question_type: "short_answer",
      category: question.category,
      difficulty: question.difficulty,
      explanation: question.explanation || "",
      is_active: question.is_active,
      short_answer: question.short_answer
        ? {
          correct_answer: question.short_answer.correct_answer,
          alternative_answers: question.short_answer.alternative_answers || [],
        }
        : { correct_answer: "", alternative_answers: [] },
    });
    setActiveView("upload");
    setUploadType("single");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(id);
        toast({ title: "Success", description: "Question deleted successfully!" });
      } catch (error: any) {
        toast({ title: "Error", description: error.message || "Failed to delete question", variant: "destructive" });
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      question_text: "",
      question_type: "short_answer",
      category: "",
      difficulty: "medium",
      explanation: "",
      is_active: true,
      short_answer: {
        correct_answer: "",
        alternative_answers: [],
      },
    });
  };

  const filteredQuestions = shortAnswerQuestions.filter((q) => {
    const matchCategory = filterCategory === "all" || q.category === filterCategory;
    const matchDifficulty = filterDifficulty === "all" || q.difficulty === filterDifficulty;
    return matchCategory && matchDifficulty;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#111111]">
              Sort Question Manager
            </h1>
            <p className="text-[#777777] mt-2">
              Manage short answer questions for study resources
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeView === "dashboard" ? "default" : "outline"}
            onClick={() => setActiveView("dashboard")}
            className={activeView === "dashboard" ? "bg-[#111111] text-white" : ""}
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeView === "upload" ? "default" : "outline"}
            onClick={() => setActiveView("upload")}
            className={activeView === "upload" ? "bg-[#111111] text-white" : ""}
          >
            <Upload className="w-4 h-4 mr-2" />
            Add Questions
          </Button>
          <Button
            variant={activeView === "manage" ? "default" : "outline"}
            onClick={() => setActiveView("manage")}
            className={activeView === "manage" ? "bg-[#111111] text-white" : ""}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Manage Questions ({shortAnswerQuestions.length})
          </Button>
        </div>

        {/* ==================== DASHBOARD VIEW ==================== */}
        {activeView === "dashboard" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Global Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6 bg-[#111111] text-white shadow-lg">
                <h3 className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Questions</h3>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-4xl font-bold">{globalStats.total}</p>
                  <BookOpen className="w-8 h-8 opacity-20" />
                </div>
              </Card>
              <Card
                className="p-6 bg-green-50 border-green-200 shadow-sm cursor-pointer hover:shadow-md transition-all"
                onClick={() => {
                  setFilterDifficulty("easy");
                  setFilterCategory("all");
                  setActiveView("manage");
                }}
              >
                <h3 className="text-sm font-medium text-green-800 uppercase tracking-wider">Easy</h3>
                <p className="text-4xl font-bold text-green-600 mt-2">{globalStats.easy}</p>
                <p className="text-xs text-green-700 mt-1">Beginner Level</p>
              </Card>
              <Card
                className="p-6 bg-yellow-50 border-yellow-200 shadow-sm cursor-pointer hover:shadow-md transition-all"
                onClick={() => {
                  setFilterDifficulty("medium");
                  setFilterCategory("all");
                  setActiveView("manage");
                }}
              >
                <h3 className="text-sm font-medium text-yellow-800 uppercase tracking-wider">Medium</h3>
                <p className="text-4xl font-bold text-yellow-600 mt-2">{globalStats.medium}</p>
                <p className="text-xs text-yellow-700 mt-1">Intermediate Level</p>
              </Card>
              <Card
                className="p-6 bg-red-50 border-red-200 shadow-sm cursor-pointer hover:shadow-md transition-all"
                onClick={() => {
                  setFilterDifficulty("hard");
                  setFilterCategory("all");
                  setActiveView("manage");
                }}
              >
                <h3 className="text-sm font-medium text-red-800 uppercase tracking-wider">Hard</h3>
                <p className="text-4xl font-bold text-red-600 mt-2">{globalStats.hard}</p>
                <p className="text-xs text-red-700 mt-1">Advanced Level</p>
              </Card>
            </div>

            {/* Category Grid */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Category Breakdown
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(categoryStats).map(([cat, stats]) => (
                  <Card key={cat} className="p-6 hover:shadow-md transition-all border-l-4 border-l-[#111111]">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{cat}</h3>
                        <p className="text-sm text-gray-500">{stats.total} Questions total</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700">
                        {cat.substring(0, 2).toUpperCase()}
                      </div>
                    </div>

                    {/* Difficulty Progress Bars */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-green-700">Easy</span>
                          <span>{stats.easy}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${stats.total ? (stats.easy / stats.total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-yellow-700">Medium</span>
                          <span>{stats.medium}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${stats.total ? (stats.medium / stats.total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-red-700">Hard</span>
                          <span>{stats.hard}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${stats.total ? (stats.hard / stats.total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Button
                        variant="outline"
                        className="w-full text-xs"
                        onClick={() => {
                          setFilterCategory(cat);
                          setActiveView("manage");
                        }}
                      >
                        Manage {cat} Questions →
                      </Button>
                    </div>
                  </Card>
                ))}

                {/* Add New Category Card */}
                <Card
                  className="p-6 border-dashed border-2 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all min-h-[300px]"
                  onClick={() => {
                    setActiveView("upload");
                    setUploadType("single");
                    setIsEditing(false);
                    setSelectedCategory("");
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-bold text-gray-900">Add New Category</h3>
                  <p className="text-sm text-gray-500 mt-2">Create questions for a new topic</p>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ==================== UPLOAD VIEW ==================== */}
        {activeView === "upload" && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {isEditing ? "Edit Question" : "Add New Questions"}
                </h2>
                <p className="text-gray-500">
                  {isEditing ? "Update existing question details" : "Choose your upload method and settings"}
                </p>
              </div>
              {isEditing && (
                <Button variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel Edit
                </Button>
              )}
            </div>

            {/* Settings Panel */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Upload Method */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Upload Method</label>
                  <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                    <button
                      onClick={() => setUploadType("single")}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${uploadType === "single"
                        ? "bg-[#111111] text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      Single
                    </button>
                    <button
                      onClick={() => setUploadType("bulk")}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${uploadType === "bulk"
                        ? "bg-[#111111] text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      Bulk
                    </button>
                  </div>
                </div>

                {/* 2. Category */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Category {uploadType === "single" && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <Input
                      list="category-suggestions"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      placeholder="Select or type new category..."
                      className="w-full"
                      required={uploadType === "single"}
                    />
                    <datalist id="category-suggestions">
                      {categories.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Type to create a new category</p>
                </div>

                {/* 3. Difficulty */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Difficulty <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:border-[#111111] focus:ring-0 text-sm"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {uploadType === "single" ? (
                /* Single Upload Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {/* Question Text */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Question Text <span className="text-red-500">*</span></label>
                      <Textarea
                        value={formData.question_text}
                        onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                        placeholder="Enter the question here..."
                        className="min-h-[100px]"
                        required
                      />
                    </div>

                    {/* Answer Field */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <label className="block text-sm font-medium mb-3">Correct Answer <span className="text-red-500">*</span></label>
                      <Textarea
                        value={formData.short_answer?.correct_answer || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          short_answer: {
                            ...formData.short_answer!,
                            correct_answer: e.target.value
                          }
                        })}
                        placeholder="Enter the correct answer (2-4 lines expected)..."
                        rows={4}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        This answer will be displayed to students when they view sort questions.
                      </p>
                    </div>

                    {/* Explanation */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Additional Notes <span className="text-gray-400">(Optional)</span></label>
                      <Textarea
                        value={formData.explanation}
                        onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                        placeholder="Any extra context or notes..."
                        rows={2}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-6 bg-[#111111] hover:bg-[#333333] text-lg font-semibold"
                    disabled={loading || !selectedCategory}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {isEditing ? "Update Question" : "Save Question to Bank"}
                  </Button>

                  {!selectedCategory && (
                    <p className="text-center text-sm text-red-500 mt-2">
                      Please select or create a category above to save.
                    </p>
                  )}
                </form>
              ) : (
                /* Bulk Upload View */
                <div>
                  <div className="mb-6 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
                    <div className="text-blue-600 mt-0.5">ℹ️</div>
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Bulk Upload Instructions</p>
                      <p>
                        Upload a JSON or CSV file containing your questions.
                        {selectedCategory ? (
                          <span> Questions will be tagged with <strong>{selectedCategory}</strong> by default.</span>
                        ) : (
                          <span> <strong>No default category selected.</strong> Your file MUST contain a 'category' column/field.</span>
                        )}
                        <span> Difficulty will default to <strong>{selectedDifficulty}</strong>.</span>
                      </p>
                      <p className="mt-2 text-xs opacity-80">
                        Note: Ensure 'question_type' column is set to 'short_answer' in your file, or it will be set automatically.
                      </p>
                    </div>
                  </div>
                  <BulkShortAnswerUpload
                    parentCategory={selectedCategory}
                    parentDifficulty={selectedDifficulty}
                  />
                </div>
              )}
            </div>
          </Card>
        )}

        {/* ==================== MANAGE VIEW ==================== */}
        {activeView === "manage" && (
          <>
            {/* Category Stats */}
            <Card className="mb-6 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Filter Questions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <button
                  onClick={() => setFilterCategory("all")}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${filterCategory === "all"
                    ? "border-[#111111] bg-[#111111]/5"
                    : "border-gray-200 hover:border-gray-400"
                    }`}
                >
                  <div className="text-sm text-gray-500">All Questions</div>
                  <div className="text-2xl font-bold">{shortAnswerQuestions.length}</div>
                </button>
                {Object.entries(categoryStats).map(([cat, stats]) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${filterCategory === cat
                      ? "border-[#111111] bg-[#111111]/5"
                      : "border-gray-200 hover:border-gray-400"
                      }`}
                  >
                    <div className="text-sm text-gray-500 truncate">{cat}</div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-xs text-gray-400">
                      E:{stats.easy} M:{stats.medium} H:{stats.hard}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Questions List */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  Questions ({filteredQuestions.length})
                </h3>
                {filterDifficulty !== "all" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilterDifficulty("all")}
                    className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Filter: <span className="capitalize ml-1 font-bold">{filterDifficulty}</span>
                  </Button>
                )}
              </div>

              {filteredQuestions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No questions found.</p>
                  <Button onClick={() => setActiveView("upload")} className="mt-4">
                    Add Your First Question
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuestions.map((question, index) => (
                    <Card key={question.id} className={`p-4 ${!question.is_active ? "opacity-50" : ""}`}>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-bold text-[#111111]">Q{index + 1}.</span>
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                              {question.category}
                            </span>
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 capitalize">
                              {question.difficulty}
                            </span>
                          </div>
                          <p className="font-medium mb-3">{question.question_text}</p>

                          <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                            <span className="font-semibold text-gray-900">Answer: </span>
                            {question.short_answer?.correct_answer}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleQuestionActive(question.id, question.is_active)}
                          >
                            {question.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(question)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(question.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminQuestions;
