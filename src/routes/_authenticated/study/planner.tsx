import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar as CalendarIcon,
  Sparkles,
  Send,
  Loader2,
  Clock,
  BookOpen,
  CheckCircle2,
  ListTodo,
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
import { runCustomPromptFn } from "@/lib/ai/server-functions";
import { ResultPanel } from "@/components/shared/result-panel";
import { ApiConfigBanner } from "@/components/shared/api-config-banner";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/study/planner")({
  component: StudyPlannerPage,
});

function StudyPlannerPage() {
  const [subjects, setSubjects] = useState(
    "Distributed Systems, Quantum Mechanics, Machine Learning",
  );
  const [examDate, setExamDate] = useState("In 3 weeks (21 days)");
  const [dailyHours, setDailyHours] = useState("4 hours");
  const [prepLevel, setPrepLevel] = useState<"Beginner" | "Intermediate" | "Advanced">(
    "Intermediate",
  );

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState<number | undefined>();
  const [configError, setConfigError] = useState<{
    provider: string;
    envVar: string;
    docsUrl: string;
    message: string;
  } | null>(null);

  const handleGeneratePlan = async () => {
    if (!subjects.trim()) {
      toast.error("Please enter your subjects.");
      return;
    }

    setIsLoading(true);
    setConfigError(null);

    const prompt = `You are NEXORA Academic Curriculum & Study Schedule Architect.
Construct an optimized, high-performance study timetable and spaced-revision roadmap.

SUBJECTS: ${subjects}
EXAM TIMEFRAME: ${examDate}
DAILY AVAILABLE STUDY TIME: ${dailyHours}
CURRENT MASTERY LEVEL: ${prepLevel}

Formatting structure:
# Comprehensive Exam Preparation Blueprint
## 1. Diagnostic Summary & Time Allocation Strategy
(Breakdown of subject weights based on difficulty and daily study capacity)

## 2. Weekly Milestone Roadmap
(Week-by-week conceptual goals and syllabus coverage)

## 3. Daily Study Schedule (Sample 7-Day Block Template)
(Morning, Afternoon, Evening blocks incorporating Pomodoro intervals & Active Recall)

## 4. Spaced Repetition & Mock Exam Schedule
(Explicit dates for mock papers, flashcard reviews, and weakness remediation)

## 5. High-Impact Memory & Exam Day Strategy
(Techniques to maximize retention and manage cognitive fatigue)`;

    try {
      const res = await runCustomPromptFn({
        data: {
          prompt,
          provider: "gemini",
          model: "gemini-2.5-flash",
          systemPrompt:
            "You are NEXORA Academic Planner. Create structured, realistic study timetables.",
        },
      });

      if (res.success && res.data) {
        setResult(res.data);
        setDurationMs(res.durationMs);
        toast.success("Study timetable generated successfully!");
      } else {
        if (!res.isConfigured && res.configGuide) {
          setConfigError(res.configGuide);
          toast.error(res.error || "Gemini API key is not configured.");
        } else {
          toast.error(res.error || "Failed to generate study timetable.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error generating study plan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-secondary/15 text-secondary border border-secondary/30">
            <CalendarIcon className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Study Planner & Timetable Engine
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Spaced revision schedules • Daily study blocks • Mock exam milestones
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

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-xl shadow-lg space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Subjects / Syllabus Modules
              </Label>
              <Input
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                placeholder="e.g. Organic Chemistry, Calculus III, Macroeconomics"
                className="bg-surface-container-lowest border-border/60 text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Exam Timeline / Countdown
              </Label>
              <Input
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                placeholder="e.g. 14 days, Nov 30"
                className="bg-surface-container-lowest border-border/60 text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Daily Time</Label>
                <Input
                  value={dailyHours}
                  onChange={(e) => setDailyHours(e.target.value)}
                  placeholder="e.g. 3 hours"
                  className="bg-surface-container-lowest border-border/60 text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Current Level</Label>
                <Select
                  value={prepLevel}
                  onValueChange={(v) => setPrepLevel(v as typeof prepLevel)}
                >
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner (Starting now)</SelectItem>
                    <SelectItem value="Intermediate">Intermediate (Halfway)</SelectItem>
                    <SelectItem value="Advanced">Advanced (Final Polish)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGeneratePlan}
              disabled={isLoading || !subjects.trim()}
              className="w-full h-10 gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold shadow-md shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Constructing Timetable...</span>
                </>
              ) : (
                <>
                  <CalendarIcon className="size-4" />
                  <span>Generate Custom Timetable</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <ResultPanel
              title="Personalized Study Timetable"
              subtitle={`${examDate} • ${dailyHours}/day • ${prepLevel}`}
              content={result}
              isLoading={isLoading}
              onRegenerate={handleGeneratePlan}
              metadata={{
                durationMs,
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/20 p-10 text-center min-h-[380px]">
              <CalendarIcon className="size-8 text-secondary mb-3" />
              <h3 className="text-sm font-bold text-foreground">Timetable Engine Ready</h3>
              <p className="mt-1.5 max-w-xs text-xs text-muted-foreground leading-relaxed">
                Provide your subject list and exam deadline on the left. NEXORA constructs a
                balanced daily study timetable with active recall intervals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
