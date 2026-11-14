import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BrainCircuit,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateQuizFn } from "@/lib/ai/server-functions";
import { ApiConfigBanner } from "@/components/shared/api-config-banner";
import { toast } from "sonner";
import type { QuizResultData, QuizInput } from "@/lib/ai/types";

export const Route = createFileRoute("/_authenticated/study/quiz")({
  component: QuizGenerator,
});

function QuizGenerator() {
  const [topic, setTopic] = useState("Operating Systems: Virtual Memory & Page Faults");
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [quizType, setQuizType] = useState<"mcq" | "true-false">("mcq");

  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizResultData | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [configError, setConfigError] = useState<{
    provider: string;
    envVar: string;
    docsUrl: string;
    message: string;
  } | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please specify a quiz topic.");
      return;
    }

    setIsLoading(true);
    setConfigError(null);
    setIsSubmitted(false);
    setUserAnswers({});

    try {
      const payload: QuizInput = {
        topic: topic.trim(),
        questionCount,
        difficulty,
        type: quizType,
      };

      const res = await generateQuizFn({ data: payload });

      if (res.success && res.data) {
        setQuizData(res.data);
        toast.success(`Generated ${res.data.questions.length} questions on ${res.data.topic}!`);
      } else {
        if (!res.isConfigured && res.configGuide) {
          setConfigError(res.configGuide);
          toast.error(res.error || "Gemini API key is not configured.");
        } else {
          toast.error(res.error || "Failed to generate quiz.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error generating quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    if (!quizData) return { correct: 0, total: 0, percentage: 0 };
    let correct = 0;
    quizData.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return {
      correct,
      total: quizData.questions.length,
      percentage: Math.round((correct / quizData.questions.length) * 100),
    };
  };

  const score = calculateScore();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30">
            <BrainCircuit className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Interactive Quiz & Knowledge Tester
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Synthesize custom multi-choice test assessments with real-time grading and
              explanations
            </p>
          </div>
        </div>
      </div>

      {configError && (
        <ApiConfigBanner
          providerName={configError.provider}
          envVar={configError.envVar}
          docsUrl={configError.docsUrl}
          message={configError.message}
        />
      )}

      {/* Configuration Card */}
      <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-xl shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Subject / Topic</Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Distributed Database Transactions, Biochemistry, World War II"
              className="bg-surface-container-lowest border-border/60 text-sm h-10"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Questions</Label>
            <Select
              value={questionCount.toString()}
              onValueChange={(v) => setQuestionCount(Number(v))}
            >
              <SelectTrigger className="h-10 bg-surface-container-lowest border-border/60 text-xs">
                <SelectValue placeholder="Count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Questions</SelectItem>
                <SelectItem value="5">5 Questions</SelectItem>
                <SelectItem value="10">10 Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Difficulty</Label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as typeof difficulty)}>
              <SelectTrigger className="h-10 bg-surface-container-lowest border-border/60 text-xs">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy (Fundamental)</SelectItem>
                <SelectItem value="Medium">Medium (Applied)</SelectItem>
                <SelectItem value="Hard">Hard (Expert)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 flex items-end">
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
              className="w-full h-10 gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold shadow-md shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  <span>Generate Quiz</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Interactive Quiz Area */}
      {quizData && (
        <div className="space-y-6">
          {/* Score Header when submitted */}
          {isSubmitted && (
            <div className="rounded-2xl border border-secondary/40 bg-gradient-to-r from-secondary/15 via-surface-container to-primary/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary/20 text-secondary">
                  <Trophy className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Quiz Score: {score.correct} / {score.total} ({score.percentage}%)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {score.percentage >= 80
                      ? "Exceptional mastery! Ready for exam assessment."
                      : score.percentage >= 50
                        ? "Solid foundation. Review the detailed explanations below."
                        : "Recommended for revision. Check the explanations and retry."}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setIsSubmitted(false);
                  setUserAnswers({});
                }}
                className="gap-2 border-border/60 hover:border-primary"
              >
                <RotateCcw className="size-4" />
                <span>Retry Quiz</span>
              </Button>
            </div>
          )}

          {/* Question Cards */}
          <div className="space-y-4">
            {quizData.questions.map((q, qIndex) => {
              const selectedOpt = userAnswers[q.id];
              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-md shadow-md space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-secondary">
                      Question {qIndex + 1} of {quizData.questions.length}
                    </span>
                    {isSubmitted && (
                      <span className="flex items-center gap-1 text-xs font-semibold">
                        {selectedOpt === q.correctIndex ? (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="size-4" /> Correct
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-400">
                            <XCircle className="size-4" /> Incorrect
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-foreground">
                    {q.question}
                  </h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-2.5 pt-1">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = selectedOpt === optIndex;
                      const isCorrect = q.correctIndex === optIndex;

                      let btnStyle =
                        "border-border/50 bg-surface-container/40 text-foreground hover:bg-surface-container hover:border-primary/40";
                      if (isSelected && !isSubmitted) {
                        btnStyle = "border-primary bg-primary/20 text-primary font-medium";
                      }
                      if (isSubmitted) {
                        if (isCorrect) {
                          btnStyle =
                            "border-emerald-500/60 bg-emerald-500/20 text-emerald-300 font-medium";
                        } else if (isSelected && !isCorrect) {
                          btnStyle = "border-red-500/60 bg-red-500/20 text-red-300";
                        } else {
                          btnStyle =
                            "opacity-50 border-border/30 bg-surface-container/20 text-muted-foreground";
                        }
                      }

                      return (
                        <button
                          key={optIndex}
                          disabled={isSubmitted}
                          onClick={() => handleSelectOption(q.id, optIndex)}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all ${btnStyle}`}
                        >
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-surface text-xs font-mono font-bold">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {isSubmitted && (
                    <div className="rounded-xl border border-border/40 bg-surface-container-low/70 p-4 text-xs leading-relaxed text-muted-foreground mt-3">
                      <div className="flex items-center gap-1.5 font-semibold text-foreground mb-1">
                        <HelpCircle className="size-3.5 text-secondary" />
                        <span>Pedagogical Explanation:</span>
                      </div>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Action */}
          {!isSubmitted && (
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => {
                  if (Object.keys(userAnswers).length < quizData.questions.length) {
                    toast.warning(
                      "You have unanswered questions. Please complete all before submitting.",
                    );
                  }
                  setIsSubmitted(true);
                  toast.success("Quiz submitted! Check your score and explanations.");
                }}
                className="gap-2 bg-gradient-to-r from-secondary to-primary text-surface-container-lowest font-bold px-8 h-11"
              >
                <CheckCircle2 className="size-4" />
                <span>Submit & View Explanations</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
