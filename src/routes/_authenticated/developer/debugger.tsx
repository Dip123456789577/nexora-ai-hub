import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Code2,
  Sparkles,
  Send,
  Loader2,
  Bug,
  Cpu,
  Layers,
  ArrowRight,
  Terminal,
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
import { codeHelperFn } from "@/lib/ai/server-functions";
import { ResultPanel } from "@/components/shared/result-panel";
import { ApiConfigBanner } from "@/components/shared/api-config-banner";
import { toast } from "sonner";
import type { CodeHelperInput } from "@/lib/ai/types";

export const Route = createFileRoute("/_authenticated/developer/debugger")({
  component: CodeDebuggerPage,
});

const LANGUAGES = [
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "C++",
  "Java",
  "JavaScript",
  "C#",
  "SQL",
  "Bash / Shell",
];

function CodeDebuggerPage() {
  const [language, setLanguage] = useState("TypeScript");
  const [action, setAction] = useState<"debug" | "generate" | "explain" | "optimize" | "convert">(
    "debug",
  );
  const [task, setTask] = useState(
    "Fix race condition in mutex lock during concurrent worker dequeue",
  );
  const [code, setCode] = useState(`async function processQueue(queue: Queue) {
  while (queue.hasItems()) {
    const item = queue.pop();
    // Potential concurrency bug: lock not acquired before state mutation
    await updateItemStatus(item.id, 'PROCESSING');
    await executeJob(item);
  }
}`);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState<number | undefined>();
  const [configError, setConfigError] = useState<{
    provider: string;
    envVar: string;
    docsUrl: string;
    message: string;
  } | null>(null);

  const handleExecute = async () => {
    if (!task.trim()) {
      toast.error("Please describe your task or error.");
      return;
    }

    setIsLoading(true);
    setConfigError(null);

    try {
      const payload: CodeHelperInput = {
        task: task.trim(),
        language,
        code: code.trim(),
        action,
      };

      const res = await codeHelperFn({ data: payload });

      if (res.success && res.data) {
        setResult(res.data);
        setDurationMs(res.durationMs);
        toast.success("Code analysis completed!");
      } else {
        if (!res.isConfigured && res.configGuide) {
          setConfigError(res.configGuide);
          toast.error(res.error || "Gemini API key is not configured.");
        } else {
          toast.error(res.error || "Failed to process code.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error processing code.");
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
            <Code2 className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Code Helper & Kernel Debugger
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Root-cause diagnostics • Defensive refactoring • Algorithmic complexity benchmarks
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
        {/* Left: Input & Editor */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-xl shadow-lg space-y-4">
            {/* Action & Language Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Action Mode</Label>
                <Select value={action} onValueChange={(v) => setAction(v as typeof action)}>
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug Error / Trace Bug</SelectItem>
                    <SelectItem value="generate">Generate Clean Code</SelectItem>
                    <SelectItem value="explain">Explain Line-by-Line</SelectItem>
                    <SelectItem value="optimize">Optimize Big-O Complexity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs font-mono">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Task prompt */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Task Description / Error Log
              </Label>
              <Textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Describe the issue, stack trace, or requirement..."
                className="min-h-[70px] bg-surface-container-lowest font-sans text-xs border-border/60"
              />
            </div>

            {/* Code Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Source Code Buffer
                </Label>
                <span className="text-[10px] font-mono text-secondary">{language}</span>
              </div>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste code here..."
                className="min-h-[200px] bg-surface-container-lowest font-mono text-xs border-border/60 text-secondary/90 leading-relaxed"
              />
            </div>

            <Button
              onClick={handleExecute}
              disabled={isLoading || !task.trim()}
              className="w-full h-10 gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold shadow-md shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Analyzing AST & Trace...</span>
                </>
              ) : (
                <>
                  <Bug className="size-4" />
                  <span>Execute Analysis</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <ResultPanel
              title={`Analysis: ${action.toUpperCase()}`}
              subtitle={`${language} • Compiler Runtime Evaluator`}
              content={result}
              isLoading={isLoading}
              onRegenerate={handleExecute}
              metadata={{
                durationMs,
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/20 p-10 text-center min-h-[440px]">
              <Terminal className="size-8 text-secondary mb-3" />
              <h3 className="text-sm font-bold text-foreground">Compiler Sandbox Idle</h3>
              <p className="mt-1.5 max-w-xs text-xs text-muted-foreground leading-relaxed">
                Supply your code and compiler error on the left. NEXORA will pinpoint runtime
                exceptions, concurrency deadlocks, and algorithmic bottlenecks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
