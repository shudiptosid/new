import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestions } from "@/hooks/useQuestions";
import {
  QuestionWithOptions,
  QuestionFormData,
  QuestionType,
  DifficultyLevel,
} from "@/types/question.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  Edit,
  Plus,
  Eye,
  EyeOff,
  Save,
  X,
  Upload,
  FileEdit,
  PlayCircle,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BulkQuestionUpload from "@/components/BulkQuestionUpload";

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

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

  // Form state
  const [formData, setFormData] = useState<QuestionFormData>({
    question_text: "",
    question_type: "mcq",
    category: "",
    difficulty: "medium",
    explanation: "",
    is_active: true,
    mcq_options: [
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
    ],
    short_answer: {
      correct_answer: "",
      alternative_answers: [],
    },
  });

  useEffect(() => {
    fetchQuestions(true);
  }, []);

  useEffect(() => {
    // Extract unique categories
    const uniqueCategories = [...new Set(questions.map((q) => q.category))];
    setCategories(uniqueCategories);
  }, [questions]);

  // Calculate category statistics
  const getCategoryStats = () => {
    const stats: {
      [key: string]: { total: number; mcq: number; shortAnswer: number };
    } = {};

    questions.forEach((q) => {
      if (!stats[q.category]) {
        stats[q.category] = { total: 0, mcq: 0, shortAnswer: 0 };
      }
      stats[q.category].total++;
      if (q.question_type === "mcq") {
        stats[q.category].mcq++;
      } else {
        stats[q.category].shortAnswer++;
      }
    });

    return stats;
  };

  const categoryStats = getCategoryStats();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.question_text.trim()) {
      toast({
        title: "Error",
        description: "Question text is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category.trim()) {
      toast({
        title: "Error",
        description: "Category is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.question_type === "mcq") {
      const hasCorrectAnswer = formData.mcq_options?.some(
        (opt) => opt.is_correct,
      );
      if (!hasCorrectAnswer) {
        toast({
          title: "Error",
          description: "Please mark at least one option as correct",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      if (editingId) {
        await updateQuestion(editingId, formData);
        toast({
          title: "Success",
          description: "Question updated successfully!",
        });
      } else {
        await createQuestion(formData);
        toast({
          title: "Success",
          description: "Question created successfully!",
        });
      }

      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save question",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (question: QuestionWithOptions) => {
    setEditingId(question.id);
    setIsEditing(true);
    setFormData({
      question_text: question.question_text,
      question_type: question.question_type,
      category: question.category,
      difficulty: question.difficulty,
      explanation: question.explanation || "",
      is_active: question.is_active,
      mcq_options:
        question.question_type === "mcq"
          ? question.mcq_options?.map((opt) => ({
              option_text: opt.option_text,
              is_correct: opt.is_correct,
            })) || []
          : [
              { option_text: "", is_correct: false },
              { option_text: "", is_correct: false },
              { option_text: "", is_correct: false },
              { option_text: "", is_correct: false },
            ],
      short_answer:
        question.question_type === "short_answer" && question.short_answer
          ? {
              correct_answer: question.short_answer.correct_answer,
              alternative_answers:
                question.short_answer.alternative_answers || [],
            }
          : { correct_answer: "", alternative_answers: [] },
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(id);
        toast({
          title: "Success",
          description: "Question deleted successfully!",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete question",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      question_text: "",
      question_type: "mcq",
      category: "",
      difficulty: "medium",
      explanation: "",
      is_active: true,
      mcq_options: [
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
      ],
      short_answer: {
        correct_answer: "",
        alternative_answers: [],
      },
    });
  };

  const filteredQuestions =
    filterCategory === "all"
      ? questions
      : questions.filter((q) => q.category === filterCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Question Manager
            </h1>
            <p className="text-muted-foreground mt-2">
              Create and manage quiz questions
            </p>
          </div>
        </div>

        {/* Category Statistics Section */}
        <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="w-5 h-5" />
              Category Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* All Categories Card */}
              <button
                onClick={() => setFilterCategory("all")}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  filterCategory === "all"
                    ? "border-primary bg-primary/10 shadow-lg scale-105"
                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  All Questions
                </div>
                <div className="text-2xl font-bold text-primary">
                  {questions.length}
                </div>
                <div className="text-xs text-muted-foreground mt-2">Total</div>
              </button>

              {/* Individual Category Cards */}
              {categories.sort().map((category) => {
                const stats = categoryStats[category];
                return (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      filterCategory === category
                        ? "border-primary bg-primary/10 shadow-lg scale-105"
                        : "border-border hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <div className="text-sm font-medium text-foreground mb-1 truncate">
                      {category}
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {stats.total}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {stats.mcq} MCQ · {stats.shortAnswer} Short
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Clear Filter Button */}
            {filterCategory !== "all" && (
              <div className="mt-4 flex items-center justify-between bg-primary/10 p-3 rounded-lg">
                <p className="text-sm font-medium">
                  Showing{" "}
                  <span className="text-primary font-bold">
                    {filteredQuestions.length}
                  </span>{" "}
                  questions in "{filterCategory}"
                </p>
                <button
                  onClick={() => setFilterCategory("all")}
                  className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm"
                >
                  <X className="w-4 h-4" />
                  Clear Filter
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mb-6">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => navigate("/quiz")}
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Test Quiz (Student View)
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin")}>
            ← Back to Admin
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "single" ? "default" : "outline"}
            onClick={() => setActiveTab("single")}
            className="flex-1"
          >
            <FileEdit className="w-4 h-4 mr-2" />
            Single Question
          </Button>
          <Button
            variant={activeTab === "bulk" ? "default" : "outline"}
            onClick={() => setActiveTab("bulk")}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload (10-15+ questions)
          </Button>
        </div>

        {/* Conditional Rendering Based on Tab */}
        {activeTab === "bulk" ? (
          <>
            <BulkQuestionUpload />

            {/* Student View Info Card */}
            <Card className="p-4 mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Want to see how students will experience the quiz?
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    After uploading questions, click the green "Test Quiz
                    (Student View)" button above to participate in the quiz just
                    like your students will.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-300 hover:bg-blue-100 dark:border-blue-700 dark:hover:bg-blue-800"
                    onClick={() => navigate("/quiz")}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Go to Student Quiz View
                  </Button>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <>
            {/* Add/Edit Question Form */}
            <Card className="p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {editingId ? "Edit Question" : "Add New Question"}
                </h2>
                {isEditing && (
                  <Button variant="ghost" onClick={resetForm}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Question Text *
                  </label>
                  <Textarea
                    value={formData.question_text}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        question_text: e.target.value,
                      })
                    }
                    placeholder="Enter your question..."
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Question Type *
                    </label>
                    <Select
                      value={formData.question_type}
                      onValueChange={(value: QuestionType) =>
                        setFormData({ ...formData, question_type: value })
                      }
                      disabled={!!editingId}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mcq">
                          Multiple Choice (MCQ)
                        </SelectItem>
                        <SelectItem value="short_answer">
                          Short Answer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category *
                    </label>
                    <Input
                      list="categories"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      placeholder="e.g., Arduino, IoT, Sensors"
                      required
                    />
                    <datalist id="categories">
                      {categories.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Difficulty *
                    </label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value: DifficultyLevel) =>
                        setFormData({ ...formData, difficulty: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* MCQ Options */}
                {formData.question_type === "mcq" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Options (Check the correct answer) *
                    </label>
                    <div className="space-y-2">
                      {formData.mcq_options?.map((option, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={option.is_correct}
                            onChange={(e) => {
                              const newOptions = [
                                ...(formData.mcq_options || []),
                              ];
                              newOptions[index].is_correct = e.target.checked;
                              setFormData({
                                ...formData,
                                mcq_options: newOptions,
                              });
                            }}
                            className="w-5 h-5"
                          />
                          <Input
                            value={option.option_text}
                            onChange={(e) => {
                              const newOptions = [
                                ...(formData.mcq_options || []),
                              ];
                              newOptions[index].option_text = e.target.value;
                              setFormData({
                                ...formData,
                                mcq_options: newOptions,
                              });
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Short Answer */}
                {formData.question_type === "short_answer" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Correct Answer *
                    </label>
                    <Input
                      value={formData.short_answer?.correct_answer || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          short_answer: {
                            ...formData.short_answer!,
                            correct_answer: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter the correct answer"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Explanation (Optional)
                  </label>
                  <Textarea
                    value={formData.explanation}
                    onChange={(e) =>
                      setFormData({ ...formData, explanation: e.target.value })
                    }
                    placeholder="Provide an explanation for the answer..."
                    rows={2}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium">
                    Active (Show on website)
                  </label>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? "Update Question" : "Add Question"}
                </Button>
              </form>
            </Card>

            {/* Questions List */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  All Questions ({filteredQuestions.length})
                </h2>
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <p className="text-center text-muted-foreground py-8">
                  Loading questions...
                </p>
              ) : filteredQuestions.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground py-8">
                    No questions found. Add your first question above!
                  </p>

                  {/* Helpful tip when no questions */}
                  <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <div className="text-center">
                      <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                        💡 Quick Start Tip
                      </h3>
                      <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                        Use the "Bulk Upload" tab above to quickly add 10-15
                        questions at once!
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-300 hover:bg-amber-100 dark:border-amber-700"
                        onClick={() => setActiveTab("bulk")}
                      >
                        Go to Bulk Upload
                      </Button>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuestions.map((question, index) => (
                    <Card
                      key={question.id}
                      className={`p-4 ${!question.is_active ? "opacity-50" : ""}`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-bold text-primary">
                              Q{index + 1}.
                            </span>
                            <span className="text-sm px-2 py-1 rounded bg-primary/10 text-primary">
                              {question.category}
                            </span>
                            <span className="text-sm px-2 py-1 rounded bg-accent/10 text-accent">
                              {question.difficulty}
                            </span>
                            <span className="text-sm px-2 py-1 rounded bg-muted">
                              {question.question_type === "mcq"
                                ? "MCQ"
                                : "Short Answer"}
                            </span>
                          </div>
                          <p className="font-medium mb-2">
                            {question.question_text}
                          </p>

                          {question.question_type === "mcq" &&
                            question.mcq_options &&
                            question.mcq_options.length > 0 && (
                              <div className="ml-6 space-y-1">
                                {question.mcq_options.map((opt, idx) => (
                                  <p
                                    key={opt.id}
                                    className={`text-sm ${
                                      opt.is_correct
                                        ? "text-green-600 font-semibold"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {String.fromCharCode(65 + idx)}.{" "}
                                    {opt.option_text}
                                    {opt.is_correct && " ✓"}
                                  </p>
                                ))}
                              </div>
                            )}

                          {question.question_type === "short_answer" &&
                            question.short_answer && (
                              <p className="text-sm text-green-600 ml-6">
                                ✓ {question.short_answer.correct_answer}
                              </p>
                            )}

                          {question.explanation && (
                            <p className="text-sm text-muted-foreground mt-2 italic">
                              💡 {question.explanation}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              toggleQuestionActive(
                                question.id,
                                question.is_active,
                              )
                            }
                          >
                            {question.is_active ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(question)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(question.id)}
                          >
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
