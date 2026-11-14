import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Database, Sparkles, Send, Loader2, Table, Zap } from "lucide-react";
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
import { sqlHelperFn } from "@/lib/ai/server-functions";
import { ResultPanel } from "@/components/shared/result-panel";
import { ApiConfigBanner } from "@/components/shared/api-config-banner";
import { toast } from "sonner";
import type { SqlHelperInput } from "@/lib/ai/types";

export const Route = createFileRoute("/_authenticated/developer/sql")({
  component: SqlAssistantPage,
});

function SqlAssistantPage() {
  const [dialect, setDialect] = useState<"PostgreSQL" | "MySQL" | "SQLite" | "Oracle">(
    "PostgreSQL",
  );
  const [action, setAction] = useState<"generate" | "explain" | "optimize" | "convert">("generate");
  const [prompt, setPrompt] = useState(
    "Compute monthly cohort retention rate for users who signed up in 2026, using window functions and CTEs.",
  );
  const [schema, setSchema] = useState(`CREATE TABLE users (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL,
  email TEXT UNIQUE
);

CREATE TABLE user_activity (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL
);`);

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
    if (!prompt.trim()) {
      toast.error("Please enter a query request or question.");
      return;
    }

    setIsLoading(true);
    setConfigError(null);

    try {
      const payload: SqlHelperInput = {
        prompt: prompt.trim(),
        dialect,
        schema: schema.trim() || undefined,
        action,
      };

      const res = await sqlHelperFn({ data: payload });

      if (res.success && res.data) {
        setResult(res.data);
        setDurationMs(res.durationMs);
        toast.success("SQL generated successfully!");
      } else {
        if (!res.isConfigured && res.configGuide) {
          setConfigError(res.configGuide);
          toast.error(res.error || "Gemini API key is not configured.");
        } else {
          toast.error(res.error || "Failed to process SQL request.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error processing SQL.");
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
            <Database className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              SQL Plan Studio & Query Accelerator
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Synthesize CTEs, window functions, index strategies, and cross-dialect translations
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Dialect</Label>
                <Select value={dialect} onValueChange={(v) => setDialect(v as typeof dialect)}>
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs font-mono">
                    <SelectValue placeholder="Dialect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                    <SelectItem value="MySQL">MySQL</SelectItem>
                    <SelectItem value="SQLite">SQLite</SelectItem>
                    <SelectItem value="Oracle">Oracle SQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Action</Label>
                <Select value={action} onValueChange={(v) => setAction(v as typeof action)}>
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="generate">Generate Query</SelectItem>
                    <SelectItem value="explain">Explain Query Plan</SelectItem>
                    <SelectItem value="optimize">Optimize Indexing</SelectItem>
                    <SelectItem value="convert">Convert Dialect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Query Requirement / Natural Language Prompt
              </Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What query do you need? (e.g., 'Find top 5 customers with highest revenue across quarterly periods with rank() over partition')"
                className="min-h-[80px] bg-surface-container-lowest font-sans text-xs border-border/60"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Database Schema (Optional)
              </Label>
              <Textarea
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                placeholder="Paste DDL schema (CREATE TABLE ...)"
                className="min-h-[140px] bg-surface-container-lowest font-mono text-xs border-border/60 text-primary/90"
              />
            </div>

            <Button
              onClick={handleExecute}
              disabled={isLoading || !prompt.trim()}
              className="w-full h-10 gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold shadow-md shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Synthesizing Relational Query...</span>
                </>
              ) : (
                <>
                  <Zap className="size-4" />
                  <span>Generate SQL</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <ResultPanel
              title={`${dialect} Optimized Plan`}
              subtitle={`Mode: ${action.toUpperCase()}`}
              content={result}
              isLoading={isLoading}
              onRegenerate={handleExecute}
              metadata={{
                durationMs,
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/20 p-10 text-center min-h-[440px]">
              <Database className="size-8 text-primary mb-3" />
              <h3 className="text-sm font-bold text-foreground">Relational Schema Accelerator</h3>
              <p className="mt-1.5 max-w-xs text-xs text-muted-foreground leading-relaxed">
                Describe your data query requirements on the left. NEXORA will construct performant
                CTEs, indexing blueprints, and dialect-specific optimizations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
