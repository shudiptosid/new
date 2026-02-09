import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  FileJson,
  HelpCircle,
  CheckCircle,
  PlayCircle,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuestions } from "@/hooks/useQuestions";

interface BulkQuestionData {
  question_text: string;
  question_type: "mcq" | "short_answer";
  category: string;
  difficulty: "easy" | "medium" | "hard";
  explanation?: string;
  options?: string[]; // For MCQ: array of 4 options
  correct_answer: number | string; // For MCQ: index (0-3), for short answer: the answer text
  alternative_answers?: string[]; // For short answer only
}

const BulkQuestionUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createQuestion } = useQuestions();
  const [jsonInput, setJsonInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [defaultCategory, setDefaultCategory] = useState("Arduino");
  const [defaultDifficulty, setDefaultDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("medium");

  const sampleJSON = `[
  {
    "question_text": "What is the operating voltage of Arduino Uno?",
    "question_type": "mcq",
    "category": "Arduino",
    "difficulty": "easy",
    "explanation": "Arduino Uno operates at 5V logic level",
    "options": ["3.3V", "5V", "9V", "12V"],
    "correct_answer": 1
  },
  {
    "question_text": "What does PWM stand for?",
    "question_type": "mcq",
    "category": "Electronics",
    "difficulty": "easy",
    "options": ["Pulse Width Modulation", "Power Wave Management", "Parallel Wire Mode", "Programmable Width Module"],
    "correct_answer": 0
  },
  {
    "question_text": "What is the default baud rate for Arduino Serial communication?",
    "question_type": "short_answer",
    "category": "Arduino",
    "difficulty": "medium",
    "correct_answer": "9600",
    "alternative_answers": ["9600 baud", "9600 bps"]
  }
]`;

  const handleBulkUpload = async () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Empty Input",
        description: "Please paste your JSON data first",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const questionsData: BulkQuestionData[] = JSON.parse(jsonInput);

      if (!Array.isArray(questionsData)) {
        throw new Error("Input must be an array of questions");
      }

      let successCount = 0;
      let errorCount = 0;

      for (const question of questionsData) {
        try {
          // Validate required fields (category and difficulty are optional - will use defaults)
          if (!question.question_text || !question.question_type) {
            throw new Error(
              "Missing required fields: question_text and question_type are required",
            );
          }

          if (question.question_type === "mcq") {
            if (!question.options || question.options.length !== 4) {
              throw new Error(
                `MCQ must have exactly 4 options for: ${question.question_text}`,
              );
            }
            if (
              typeof question.correct_answer !== "number" ||
              question.correct_answer < 0 ||
              question.correct_answer > 3
            ) {
              throw new Error(
                `Invalid correct_answer index for MCQ: ${question.question_text}`,
              );
            }

            // Create MCQ question
            await createQuestion({
              question_text: question.question_text,
              question_type: "mcq",
              category: question.category || defaultCategory,
              difficulty: question.difficulty || defaultDifficulty,
              explanation: question.explanation || "",
              is_active: true,
              mcq_options: question.options.map((opt, idx) => ({
                option_text: opt,
                is_correct: idx === question.correct_answer,
                order_index: idx,
              })),
            });
          } else if (question.question_type === "short_answer") {
            if (
              !question.correct_answer ||
              typeof question.correct_answer !== "string"
            ) {
              throw new Error(
                `Short answer must have correct_answer as string: ${question.question_text}`,
              );
            }

            // Create short answer question
            await createQuestion({
              question_text: question.question_text,
              question_type: "short_answer",
              category: question.category || defaultCategory,
              difficulty: question.difficulty || defaultDifficulty,
              explanation: question.explanation || "",
              is_active: true,
              short_answer: {
                correct_answer: question.correct_answer,
                alternative_answers: question.alternative_answers || [],
              },
            });
          }

          successCount++;
        } catch (err: any) {
          console.error(`Error uploading question:`, err);
          errorCount++;
        }
      }

      toast({
        title: "Bulk Upload Complete",
        description: `✅ ${successCount} questions uploaded successfully. ${errorCount > 0 ? `❌ ${errorCount} failed.` : ""}`,
        variant: successCount > 0 ? "default" : "destructive",
      });

      if (successCount > 0) {
        setJsonInput(""); // Clear input on success
        setUploadSuccess(true); // Show success card
        setTimeout(() => setUploadSuccess(false), 30000); // Hide after 30s
      }
    } catch (error: any) {
      console.error("Bulk upload error:", error);
      toast({
        title: "Upload Failed",
        description:
          error.message || "Invalid JSON format. Please check your input.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleJSON);
    toast({
      title: "Copied!",
      description: "Sample JSON copied to clipboard",
    });
  };

  const downloadSampleJSON = () => {
    const blob = new Blob([sampleJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-questions.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "Sample JSON file downloaded",
    });
  };

  const categories = [
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

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Upload className="w-6 h-6" />
            Bulk Question Upload
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHelp(!showHelp)}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            {showHelp ? "Hide" : "Show"} Help
          </Button>
        </div>

        {/* Default Category and Difficulty Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div>
            <label className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 block">
              📂 Default Category
            </label>
            <select
              value={defaultCategory}
              onChange={(e) => setDefaultCategory(e.target.value)}
              className="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Applied if not specified in JSON
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 block">
              ⚡ Default Difficulty
            </label>
            <select
              value={defaultDifficulty}
              onChange={(e) =>
                setDefaultDifficulty(
                  e.target.value as "easy" | "medium" | "hard",
                )
              }
              className="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Applied if not specified in JSON
            </p>
          </div>
        </div>

        {/* Success Card - Show after successful upload */}
        {uploadSuccess && (
          <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  ✅ Questions Uploaded Successfully!
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                  Your questions are now live! Click below to participate in the
                  quiz and see exactly what students will experience.
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => navigate("/quiz")}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Test Quiz Now (Student View)
                </Button>
              </div>
            </div>
          </Card>
        )}

        {showHelp && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              📋 JSON Format Guide
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Upload multiple questions at once using JSON format. You can
              specify category and difficulty for each question, or use the
              default values selected above.
            </p>
            <ul className="text-sm text-blue-800 dark:text-blue-200 list-disc ml-6 space-y-1">
              <li>
                <strong>question_text</strong>: The question (required)
              </li>
              <li>
                <strong>question_type</strong>: "mcq" or "short_answer"
                (required)
              </li>
              <li>
                <strong>category</strong>: Question category (optional - uses
                default if not specified)
              </li>
              <li>
                <strong>difficulty</strong>: "easy", "medium", or "hard"
                (optional - uses default if not specified)
              </li>
              <li>
                <strong>category</strong>: e.g., "Arduino", "IoT", "Sensors"
                (required)
              </li>
              <li>
                <strong>difficulty</strong>: "easy", "medium", or "hard"
                (optional, default: "medium")
              </li>
              <li>
                <strong>explanation</strong>: Explanation text (optional)
              </li>
            </ul>
            <p className="text-sm text-blue-800 dark:text-blue-200 font-semibold mt-2">
              For MCQ questions:
            </p>
            <ul className="text-sm text-blue-800 dark:text-blue-200 list-disc ml-6">
              <li>
                <strong>options</strong>: Array of exactly 4 option strings
              </li>
              <li>
                <strong>correct_answer</strong>: Index of correct option (0-3)
              </li>
            </ul>
            <p className="text-sm text-blue-800 dark:text-blue-200 font-semibold mt-2">
              For Short Answer questions:
            </p>
            <ul className="text-sm text-blue-800 dark:text-blue-200 list-disc ml-6">
              <li>
                <strong>correct_answer</strong>: The correct answer as a string
              </li>
              <li>
                <strong>alternative_answers</strong>: Array of alternative
                correct answers (optional)
              </li>
            </ul>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Sample JSON:
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadSampleJSON}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <FileJson className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
              <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
                {sampleJSON}
              </pre>
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium mb-2 block">
            Paste Your JSON Data Below:
          </label>
          <Textarea
            placeholder="Paste JSON array of questions here..."
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setUploadSuccess(false); // Hide success card when user starts editing
            }}
            className="min-h-[300px] font-mono text-sm"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleBulkUpload}
            disabled={uploading || !jsonInput.trim()}
            className="flex-1"
          >
            {uploading ? (
              <>Uploading...</>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Upload Questions
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setJsonInput("")}
            disabled={!jsonInput.trim()}
          >
            Clear
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          💡 Tip: You can upload 10-15 or even more questions at once!
        </p>
      </div>
    </Card>
  );
};

export default BulkQuestionUpload;
