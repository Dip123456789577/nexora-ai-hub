import { useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FileQuestion,
  Sparkles,
  Send,
  Loader2,
  BookOpen,
  Sliders,
  RotateCcw,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateExamAnswerFn } from "@/lib/ai/server-functions";
import { ResultPanel } from "@/components/shared/result-panel";
import { ApiConfigBanner } from "@/components/shared/api-config-banner";
import { toast } from "sonner";
import type { ExamAnswerInput } from "@/lib/ai/types";

export const Route = createFileRoute("/_authenticated/study/exam-answer")({
  component: ExamAnswerWriter,
});

const SUBJECTS = [
  "Computer Science & Engineering",
  "Physics & Quantum Mechanics",
  "Mathematics & Statistics",
  "Electrical & Electronics Engineering",
  "Economics & Finance",
  "Biology & Biotechnology",
  "Chemistry & Chemical Engineering",
  "History & International Relations",
  "Constitutional & Corporate Law",
  "Medicine & Pharmacology",
];

const EXAMPLE_QUESTIONS = [
  {
    subject: "Computer Science & Engineering",
    marks: 10 as const,
    difficulty: "Advanced" as const,
    academicLevel: "Undergraduate" as const,
    question:
      "Explain the Raft Consensus Algorithm in distributed systems. Detail leader election, log replication, and safety guarantees.",
  },
  {
    subject: "Physics & Quantum Mechanics",
    marks: 10 as const,
    difficulty: "Advanced" as const,
    academicLevel: "Postgraduate" as const,
    question:
      "Compare Quantum Annealing vs Gate Teleportation. Analyze decoherence thresholds and architectural trade-offs.",
  },
  {
    subject: "Economics & Finance",
    marks: 5 as const,
    difficulty: "Moderate" as const,
    academicLevel: "Undergraduate" as const,
    question:
      "Explain the Fisher Effect and how real interest rates respond to unanticipated monetary inflation.",
  },
  {
    subject: "Biology & Biotechnology",
    marks: 8 as const,
    difficulty: "Advanced" as const,
    academicLevel: "Undergraduate" as const,
    question:
      "Describe the mechanism of CRISPR-Cas9 genome editing, specifically targeting sgRNA, PAM sequences, and DSB repair pathways.",
  },
];

function ExamAnswerWriter() {
  const [question, setQuestion] = useState("");
  const [marks, setMarks] = useState<2 | 3 | 5 | 8 | 10 | 15 | 20>(10);
  const [difficulty, setDifficulty] = useState<"Foundation" | "Moderate" | "Advanced" | "Master">(
    "Advanced",
  );
  const [academicLevel, setAcademicLevel] = useState<
    "School" | "High School" | "Undergraduate" | "Postgraduate"
  >("Undergraduate");
  const [subject, setSubject] = useState("Computer Science & Engineering");
  const [language, setLanguage] = useState("English");
  const [format, setFormat] = useState<
    "Standard Exam" | "Bulleted Key Points" | "Step-by-Step Technical" | "Thesis & Analytical"
  >("Standard Exam");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [configError, setConfigError] = useState<{
    provider: string;
    envVar: string;
    docsUrl: string;
    message: string;
  } | null>(null);
  const [durationMs, setDurationMs] = useState<number | undefined>();

  const handleGenerate = useCallback(async () => {
    if (!question.trim()) {
      toast.error("Please enter an examination question first.");
      return;
    }

    setIsLoading(true);
    setConfigError(null);

    try {
      const payload: ExamAnswerInput = {
        question: question.trim(),
        marks,
        difficulty,
        academicLevel,
        subject,
        language,
        format,
      };

      const res = await generateExamAnswerFn({ data: payload });

      if (res.success && res.data) {
        setResult(res.data);
        setDurationMs(res.durationMs);
        toast.success(`Generated ${marks}-mark answer successfully!`);

        // Save to browser history
        try {
          const past = JSON.parse(localStorage.getItem("nexora_exam_history") || "[]");
          past.unshift({
            id: Date.now().toString(),
            question: payload.question,
            marks: payload.marks,
            subject: payload.subject,
            output: res.data,
            timestamp: new Date().toISOString(),
          });
          localStorage.setItem("nexora_exam_history", JSON.stringify(past.slice(0, 30)));
        } catch {
          // ignore localStorage error
        }
      } else {
        if (!res.isConfigured && res.configGuide) {
          setConfigError(res.configGuide);
          toast.error(res.error || "Gemini API key is not configured.");
        } else {
          toast.error(res.error || "Failed to generate answer.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected generation error.");
    } finally {
      setIsLoading(false);
    }
  }, [question, marks, difficulty, academicLevel, subject, language, format]);

  // Keyboard shortcut Ctrl+Enter or Cmd+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleGenerate]);

  const loadExample = (ex: (typeof EXAMPLE_QUESTIONS)[number]) => {
    setQuestion(ex.question);
    setSubject(ex.subject);
    setMarks(ex.marks);
    setDifficulty(ex.difficulty);
    setAcademicLevel(ex.academicLevel);
    toast.info("Loaded example question.");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-secondary/15 text-secondary border border-secondary/30">
            <FileQuestion className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Exam Answer Writer
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              University Model Solver Rubric Engine v4.2 • Precision grading rubrics from 2 to 20
              marks
            </p>
          </div>
        </div>
      </div>

      {/* API Key Missing Banner if detected */}
      {configError && (
        <ApiConfigBanner
          providerName={configError.provider}
          envVar={configError.envVar}
          docsUrl={configError.docsUrl}
          message={configError.message}
        />
      )}

      {/* Main Workspace Grid: Controls & Input */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Rubric Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-xl shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <span className="text-sm font-bold text-foreground flex items-center gap-2">
                <BookOpen className="size-4 text-primary" />
                Examination Question & Prompt
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Press Ctrl + Enter to Generate
              </span>
            </div>

            {/* Question Textarea */}
            <div className="space-y-2">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type or paste your examination question here... (e.g., 'Discuss the architectural trade-offs between Monolithic and Microservices architectures with respect to fault tolerance and deployment overhead.')"
                className="min-h-[140px] resize-y bg-surface-container-lowest font-sans text-sm border-border/60 focus:border-primary"
              />
            </div>

            {/* Rubric Settings Row 1: Marks, Difficulty, Academic Level */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Marks Rubric</Label>
                <Select
                  value={marks.toString()}
                  onValueChange={(v) => setMarks(Number(v) as 2 | 3 | 5 | 8 | 10 | 15 | 20)}
                >
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs">
                    <SelectValue placeholder="Marks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Marks (Concise Definition)</SelectItem>
                    <SelectItem value="3">3 Marks (Definition + 3 Points)</SelectItem>
                    <SelectItem value="5">5 Marks (Standard Exam Answer)</SelectItem>
                    <SelectItem value="8">8 Marks (Detailed with Examples)</SelectItem>
                    <SelectItem value="10">10 Marks (Comprehensive Essay)</SelectItem>
                    <SelectItem value="15">15 Marks (Major Analytical Treatise)</SelectItem>
                    <SelectItem value="20">20 Marks (Exhaustive Thesis Rubric)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Difficulty Level
                </Label>
                <Select
                  value={difficulty}
                  onValueChange={(v) => setDifficulty(v as typeof difficulty)}
                >
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Foundation">Foundation (Clear & Direct)</SelectItem>
                    <SelectItem value="Moderate">Moderate (Standard College)</SelectItem>
                    <SelectItem value="Advanced">Advanced (Rigorous & In-depth)</SelectItem>
                    <SelectItem value="Master">Master (Postgrad & Research)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Academic Level
                </Label>
                <Select
                  value={academicLevel}
                  onValueChange={(v) => setAcademicLevel(v as typeof academicLevel)}
                >
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs">
                    <SelectValue placeholder="Academic Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="School">School Level</SelectItem>
                    <SelectItem value="High School">High School / AP / IB</SelectItem>
                    <SelectItem value="Undergraduate">Undergraduate Degree</SelectItem>
                    <SelectItem value="Postgraduate">Postgraduate / Masters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Rubric Settings Row 2: Subject, Language, Format */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish (Español)</SelectItem>
                    <SelectItem value="French">French (Français)</SelectItem>
                    <SelectItem value="German">German (Deutsch)</SelectItem>
                    <SelectItem value="Hindi">Hindi (हिन्दी)</SelectItem>
                    <SelectItem value="Bengali">Bengali (বাংলা)</SelectItem>
                    <SelectItem value="Japanese">Japanese (日本語)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Answer Format</Label>
                <Select value={format} onValueChange={(v) => setFormat(v as typeof format)}>
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard Exam">Standard Exam Format</SelectItem>
                    <SelectItem value="Bulleted Key Points">Bulleted Key Points</SelectItem>
                    <SelectItem value="Step-by-Step Technical">Step-by-Step Technical</SelectItem>
                    <SelectItem value="Thesis & Analytical">Thesis & Analytical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-border/40">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuestion("");
                  setResult(null);
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3.5 mr-1" />
                Clear
              </Button>

              <Button
                onClick={handleGenerate}
                disabled={isLoading || !question.trim()}
                className="gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold shadow-md shadow-primary/20 h-10 px-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Synthesizing Answer...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    <span>Generate Model Answer</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Example Questions Carousel / List */}
          <div className="rounded-2xl border border-border/50 bg-card/30 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Zap className="size-3.5 text-secondary" />
              <span>Preloaded University Exam Questions</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EXAMPLE_QUESTIONS.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => loadExample(ex)}
                  className="flex flex-col text-left p-3 rounded-xl border border-border/40 bg-surface-container/30 hover:bg-surface-container hover:border-secondary/40 transition-colors group"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1">
                    <span className="text-secondary">{ex.marks} Marks</span>
                    <span>{ex.subject.split("&")[0]}</span>
                  </div>
                  <span className="text-xs text-foreground/90 font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {ex.question}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Structured Output Result Panel */}
        <div className="lg:col-span-5 space-y-4">
          {result ? (
            <ResultPanel
              title={`${marks} Marks Model Answer`}
              subtitle={`${subject} • ${difficulty} • ${academicLevel}`}
              content={result}
              isLoading={isLoading}
              onRegenerate={handleGenerate}
              metadata={{
                marks,
                difficulty,
                durationMs,
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/20 p-10 text-center min-h-[420px]">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-surface-container border border-border/50 text-muted-foreground mb-4">
                <FileQuestion className="size-7 text-secondary" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Model Examination Solver Awaiting Input
              </h3>
              <p className="mt-2 max-w-xs text-xs text-muted-foreground leading-relaxed">
                Enter your question and select marks rubric. The university engine will construct a
                structured, high-scoring answer with definitions, numbered explanations, examples,
                and diagrammatic summaries.
              </p>
              <div className="mt-6 flex items-center gap-2 text-[11px] font-mono text-secondary">
                <Sparkles className="size-3.5" />
                <span>Supports 2 to 20 Marks Scoring Standards</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
