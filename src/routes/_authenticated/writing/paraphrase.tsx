import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PenTool, Sparkles, Send, Loader2, Copy, Check, RotateCcw, Sliders } from "lucide-react";
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
import { paraphraseTextFn } from "@/lib/ai/server-functions";
import { ResultPanel } from "@/components/shared/result-panel";
import { ApiConfigBanner } from "@/components/shared/api-config-banner";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/writing/paraphrase")({
  component: ParaphraserPage,
});

function ParaphraserPage() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"Formal" | "Simple" | "Academic" | "Professional" | "Creative">(
    "Academic",
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

  const handleParaphrase = async () => {
    if (!text.trim()) {
      toast.error("Please enter text to paraphrase.");
      return;
    }

    setIsLoading(true);
    setConfigError(null);

    try {
      const res = await paraphraseTextFn({
        data: {
          text: text.trim(),
          mode,
        },
      });

      if (res.success && res.data) {
        setResult(res.data);
        setDurationMs(res.durationMs);
        toast.success(`Paraphrased in ${mode} mode!`);
      } else {
        if (!res.isConfigured && res.configGuide) {
          setConfigError(res.configGuide);
          toast.error(res.error || "Gemini API key is not configured.");
        } else {
          toast.error(res.error || "Failed to paraphrase text.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error during paraphrasing.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30">
            <PenTool className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Stylistic AI Paraphraser
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Transform syntax, elevate vocabulary, and adapt register across academic, formal, and
              creative tones
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
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-xl shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <div className="flex items-center gap-2">
                <Label className="text-xs font-semibold text-muted-foreground">Rewrite Mode:</Label>
                <Select value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
                  <SelectTrigger className="h-8 w-36 bg-surface-container-lowest border-border/60 text-xs font-mono text-primary">
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Simple">Simple</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setText("")}
                className="h-7 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            </div>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste text you wish to restyle, elevate, or simplify..."
              className="min-h-[220px] resize-y bg-surface-container-lowest font-sans text-sm border-border/60 focus:border-primary"
            />

            <Button
              onClick={handleParaphrase}
              disabled={isLoading || !text.trim()}
              className="w-full h-10 gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold shadow-md shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Synthesizing Stylistic Rewrite...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  <span>Paraphrase in {mode} Mode</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <ResultPanel
              title={`Paraphrased Output (${mode})`}
              subtitle="Stylistic Transformation Engine"
              content={result}
              isLoading={isLoading}
              onRegenerate={handleParaphrase}
              metadata={{
                durationMs,
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/20 p-10 text-center min-h-[360px]">
              <PenTool className="size-8 text-primary mb-3" />
              <h3 className="text-sm font-bold text-foreground">Stylistic Engine Idle</h3>
              <p className="mt-1.5 max-w-xs text-xs text-muted-foreground leading-relaxed">
                Provide text and select a target mode on the left. NEXORA rewrites sentence flow
                while strictly preserving underlying factual intent.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
