import { useState, useEffect } from "react";
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
import { DifficultyLevel } from "@/types/question.types";

interface BulkMCQData {
    question_text: string;
    question_type?: "mcq"; // Optional in JSON, strictly validated in logic
    category: string;
    difficulty: "easy" | "medium" | "hard";
    explanation?: string;
    options: string[]; // Array of 4 options
    correct_answer: number; // Index 0-3
}

interface BulkMCQUploadProps {
    parentCategory?: string;
    parentDifficulty?: DifficultyLevel;
}

const BulkMCQUpload = ({ parentCategory, parentDifficulty }: BulkMCQUploadProps) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { createQuestion } = useQuestions();
    const [jsonInput, setJsonInput] = useState("");
    const [uploading, setUploading] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // Local state for defaults
    const [defaultCategory, setDefaultCategory] = useState(parentCategory || "Arduino");
    const [defaultDifficulty, setDefaultDifficulty] = useState<DifficultyLevel>(parentDifficulty || "medium");

    useEffect(() => {
        if (parentCategory) setDefaultCategory(parentCategory);
        if (parentDifficulty) setDefaultDifficulty(parentDifficulty);
    }, [parentCategory, parentDifficulty]);

    const sampleJSON = `[
  {
    "question_text": "What is the operating voltage of Arduino Uno?",
    "category": "${parentCategory || 'Arduino'}",
    "difficulty": "${parentDifficulty || 'easy'}",
    "explanation": "Arduino Uno operates at 5V logic level",
    "options": ["3.3V", "5V", "9V", "12V"],
    "correct_answer": 1
  },
  {
    "question_text": "Which pin is used for PWM?",
    "category": "Arduino",
    "difficulty": "medium",
    "options": ["Pin 13", "Pin 3", "Pin 0", "Pin 1"],
    "correct_answer": 1
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
            const questionsData: BulkMCQData[] = JSON.parse(jsonInput);

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

                    // Force question_type to 'mcq' implicitly, or validate if present
                    if (question.question_type && question.question_type !== "mcq") {
                        throw new Error(`Invalid question_type: '${question.question_type}'. This uploader is for MCQs only.`);
                    }

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
                            `Invalid correct_answer index (0-3) for MCQ: ${question.question_text}`,
                        );
                    }

                    const category = question.category || defaultCategory;
                    const difficulty = question.difficulty || defaultDifficulty;

                    // Create MCQ question
                    await createQuestion({
                        question_text: question.question_text,
                        question_type: "mcq",
                        category: category,
                        difficulty: difficulty,
                        explanation: question.explanation || "",
                        is_active: true,
                        mcq_options: question.options.map((opt, idx) => ({
                            option_text: opt,
                            is_correct: idx === question.correct_answer,
                            order_index: idx,
                        })),
                    });

                    successCount++;
                } catch (err: any) {
                    console.error(`Error uploading question:`, err);
                    errorCount++;
                }
            }

            toast({
                title: "Bulk Upload Complete",
                description: `✅ ${successCount} MCQs uploaded successfully. ${errorCount > 0 ? `❌ ${errorCount} failed.` : ""}`,
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
        a.download = "sample-mcq-questions.json";
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
                        Bulk MCQ Upload
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
                                    📂 Default Category
                                </label>
                                <select
                                    value={defaultCategory}
                                    onChange={(e) => setDefaultCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {!parentDifficulty && (
                            <div>
                                <label className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 block">
                                    ⚡ Default Difficulty
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
                                    ✅ MCQs Uploaded Successfully!
                                </h3>
                                <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                                    Your MCQs are live.
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
                            📋 MCQ JSON Format
                        </h3>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 list-disc ml-6 space-y-1">
                            <li><strong>question_text</strong>: (Required) The question.</li>
                            <li><strong>options</strong>: (Required) Array of 4 answer choices.</li>
                            <li><strong>correct_answer</strong>: (Required) Index (0-3) of the correct option.</li>
                            <li><strong>category</strong>: (Optional) Uses default if missing.</li>
                            <li><strong>difficulty</strong>: (Optional) Uses default if missing.</li>
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
                        Paste JSON Data (MCQ Only):
                    </label>
                    <Textarea
                        placeholder="[{ 'question_text': '...', 'options': [...], 'correct_answer': 0 }, ...]"
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
                        {uploading ? "Uploading..." : "Upload MCQs"}
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

export default BulkMCQUpload;
