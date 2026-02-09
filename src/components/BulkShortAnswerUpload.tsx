import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Upload,
    FileJson,
    HelpCircle,
    CheckCircle,
    PlayCircle,
    Download,
    Plus,
    X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuestions } from "@/hooks/useQuestions";
import { DifficultyLevel } from "@/types/question.types";

interface BulkShortAnswerData {
    question_text: string;
    question_type?: "short_answer";
    category?: string;
    difficulty?: "easy" | "medium" | "hard";
    explanation?: string;
    correct_answer?: string;
    answer?: string;
    alternative_answers?: string[];
}

interface BulkShortAnswerUploadProps {
    parentCategory?: string;
    parentDifficulty?: DifficultyLevel;
}

const BulkShortAnswerUpload = ({ parentCategory, parentDifficulty }: BulkShortAnswerUploadProps) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { createQuestion } = useQuestions();
    const [jsonInput, setJsonInput] = useState("");
    const [uploading, setUploading] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // Default Category / Difficulty Management
    const [defaultCategory, setDefaultCategory] = useState(parentCategory || "Arduino");
    const [defaultDifficulty, setDefaultDifficulty] = useState<DifficultyLevel>(parentDifficulty || "medium");
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");

    useEffect(() => {
        if (parentCategory) setDefaultCategory(parentCategory);
        if (parentDifficulty) setDefaultDifficulty(parentDifficulty);
    }, [parentCategory, parentDifficulty]);

    const sampleJSON = `[
  {
    "question_text": "What does PWM stand for?",
    "category": "${isAddingCategory && newCategory ? newCategory : defaultCategory}",
    "difficulty": "${defaultDifficulty}",
    "correct_answer": "Pulse Width Modulation",
    "alternative_answers": ["Pulse-width modulation"]
  },
  {
    "question_text": "Name the protocol used by the DHT11 sensor.",
    "category": "Sensors",
    "difficulty": "medium",
    "answer": "Single-wire custom protocol"
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

        const activeCategory = isAddingCategory ? newCategory.trim() : defaultCategory;

        if (isAddingCategory && !activeCategory) {
            toast({
                title: "Missing Category",
                description: "Please enter a name for the new category.",
                variant: "destructive",
            });
            return;
        }

        try {
            setUploading(true);
            const questionsData: BulkShortAnswerData[] = JSON.parse(jsonInput);

            if (!Array.isArray(questionsData)) {
                throw new Error("Input must be an array of questions");
            }

            let successCount = 0;
            let errorCount = 0;

            for (const question of questionsData) {
                try {
                    // Validate required fields
                    if (!question.question_text) {
                        throw new Error("Missing required field: question_text");
                    }

                    if (question.question_type && question.question_type !== "short_answer") {
                        throw new Error(`Invalid question_type: '${question.question_type}'. This uploader is for Short Answer questions only.`);
                    }

                    const finalAnswer = question.correct_answer || question.answer;
                    if (!finalAnswer || typeof finalAnswer !== "string") {
                        throw new Error(
                            `Short answer must have 'correct_answer' (or 'answer') as string: ${question.question_text}`,
                        );
                    }

                    // Use row-level category/difficulty if present, else fall back to global selection
                    // User requested stricter control ("nothing is optional"), ensuring we have valid values.
                    const finalCategory = question.category || activeCategory;
                    const finalDifficulty = question.difficulty || defaultDifficulty;

                    if (!finalCategory) throw new Error("Category is required for every question.");
                    if (!finalDifficulty) throw new Error("Difficulty is required for every question.");

                    await createQuestion({
                        question_text: question.question_text,
                        question_type: "short_answer",
                        category: finalCategory,
                        difficulty: finalDifficulty,
                        explanation: question.explanation || "",
                        is_active: true,
                        short_answer: {
                            correct_answer: finalAnswer,
                            alternative_answers: question.alternative_answers || [],
                        },
                    });

                    successCount++;
                } catch (err: any) {
                    console.error(`Error uploading question:`, err);
                    errorCount++;
                }
            }

            toast({
                title: "Bulk Upload Complete",
                description: `✅ ${successCount} Short Answer questions uploaded successfully. ${errorCount > 0 ? `❌ ${errorCount} failed.` : ""}`,
                variant: successCount > 0 ? "default" : "destructive",
            });

            if (successCount > 0) {
                setJsonInput("");
                setUploadSuccess(true);
                setTimeout(() => setUploadSuccess(false), 30000);
            }
        } catch (error: any) {
            console.error("Bulk upload error:", error);
            toast({
                title: "Upload Failed",
                description: error.message || "Invalid JSON format. Please check your input.",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(sampleJSON);
        toast({ title: "Copied!", description: "Sample JSON copied to clipboard" });
    };

    const downloadSampleJSON = () => {
        const blob = new Blob([sampleJSON], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sample-short-answers.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "Downloaded!", description: "Sample JSON file downloaded" });
    };

    const categories = [
        "Arduino", "ESP32", "ESP8266", "Raspberry Pi", "IoT",
        "Electronics", "Sensors", "Programming", "Circuit Design",
        "Embedded Systems", "Other"
    ];

    return (
        <Card className="p-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Upload className="w-6 h-6" />
                        Bulk Short Answer Upload
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

                {/* Default Selectors */}
                {(!parentCategory || !parentDifficulty) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        {!parentCategory && (
                            <div>
                                <label className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 block">
                                    📂 Default Category <span className="text-red-500">*</span>
                                </label>
                                {isAddingCategory ? (
                                    <div className="flex gap-2">
                                        <Input
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            placeholder="Enter new category name..."
                                            className="bg-white dark:bg-gray-800"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsAddingCategory(false)}
                                            title="Cancel add category"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <select
                                            value={defaultCategory}
                                            onChange={(e) => setDefaultCategory(e.target.value)}
                                            className="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setIsAddingCategory(true)}
                                            title="Add new category"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                    Used if 'category' is missing in JSON
                                </p>
                            </div>
                        )}
                        {!parentDifficulty && (
                            <div>
                                <label className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 block">
                                    ⚡ Default Difficulty <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={defaultDifficulty}
                                    onChange={(e) => setDefaultDifficulty(e.target.value as DifficultyLevel)}
                                    className="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                    Used if 'difficulty' is missing in JSON
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Success Message */}
                {uploadSuccess && (
                    <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                                    ✅ Questions Uploaded Successfully!
                                </h3>
                                <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                                    Your questions are live.
                                </p>
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => navigate("/quiz")}
                                >
                                    <PlayCircle className="w-4 h-4 mr-2" />
                                    Test Quiz Now
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Help Section */}
                {showHelp && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                            📋 Short Answer JSON Format
                        </h3>
                        <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                            <strong>Note:</strong> While optional in JSON (if defaults are set), using explicit categories/difficulties is recommended for better organization.
                        </p>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 list-disc ml-6 space-y-1">
                            <li><strong>question_text</strong>: (Required)</li>
                            <li><strong>answer</strong> (or correct_answer): (Required)</li>
                            <li><strong>category</strong>: (Recommended) Overrides default.</li>
                            <li><strong>difficulty</strong>: (Recommended) Overrides default.</li>
                        </ul>

                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                    Sample JSON:
                                </p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={downloadSampleJSON}>
                                        <Download className="w-4 h-4 mr-2" /> Download
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                                        <FileJson className="w-4 h-4 mr-2" /> Copy
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
                        Paste JSON Data (Short Answer Only):
                    </label>
                    <Textarea
                        placeholder="[{ 'question_text': '...', 'answer': '...' }, ...]"
                        value={jsonInput}
                        onChange={(e) => {
                            setJsonInput(e.target.value);
                            setUploadSuccess(false);
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
                        {uploading ? "Uploading..." : "Upload Questions"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setJsonInput("")}
                        disabled={!jsonInput.trim()}
                    >
                        Clear
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default BulkShortAnswerUpload;
