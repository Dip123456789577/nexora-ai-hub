import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  Sparkles,
  Send,
  Loader2,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export const Route = createFileRoute("/_authenticated/research/web")({
  component: WebResearchLabPage,
});

function WebResearchLabPage() {
  const [query, setQuery] = useState(
    "Room-Temperature Superconductivity: LK-99 & Hydride Synthesis experimental validation",
  );
  const [depth, setDepth] = useState<"Standard Synthesis" | "Deep Literature Review">(
    "Deep Literature Review",
  );
  const [citationStyle, setCitationStyle] = useState<"APA" | "IEEE" | "MLA" | "Chicago">("IEEE");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState<number | undefined>();
  const [configError, setConfigError] = useState<{
    provider: string;
    envVar: string;
    docsUrl: string;
    message: string;
  } | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a research topic or inquiry.");
      return;
    }

    setIsLoading(true);
    setConfigError(null);

    const prompt = `You are NEXORA Academic Research & Literature Synthesis Engine.
Conduct an exhaustive, evidence-grounded research synthesis on:
"${query}"

RESEARCH DEPTH: ${depth}
CITATION STYLE: ${citationStyle}

Formatting Requirements:
1. # Executive Literature Synthesis
2. ## 1. Verified Empirical Consensus & Ground Truth
3. ## 2. Core Experimental Formulations & Methodologies
4. ## 3. Conflicting Evidence & Contradictions (Critical Peer-Review Viewpoint)
5. ## 4. Forward Hypotheses & Technological Implications
6. ## 5. Academic References & Citations in ${citationStyle} Format

Ensure all statements clearly distinguish empirical observations from theoretical models.`;

    try {
      const res = await runCustomPromptFn({
        data: {
          prompt,
          provider: "gemini",
          model: "gemini-2.5-flash",
          systemPrompt:
            "You are NEXORA Research Lab. Produce rigorous, peer-reviewed academic literature reports.",
        },
      });

      if (res.success && res.data) {
        setResult(res.data);
        setDurationMs(res.durationMs);
        toast.success("Research synthesis completed!");
      } else {
        if (!res.isConfigured && res.configGuide) {
          setConfigError(res.configGuide);
          toast.error(res.error || "Gemini API key is not configured.");
        } else {
          toast.error(res.error || "Research synthesis failed.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error in research synthesis.");
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
            <Search className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Deep Literature & Web Research Lab
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Synthesize scientific literature, extract peer consensus, and format multi-standard
              academic citations
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
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Research Inquiry / Scientific Topic
              </Label>
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter scientific question, theorem, or literature query..."
                className="min-h-[120px] bg-surface-container-lowest font-sans text-xs border-border/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Synthesis Depth
                </Label>
                <Select value={depth} onValueChange={(v) => setDepth(v as typeof depth)}>
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs">
                    <SelectValue placeholder="Depth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard Synthesis">Standard Synthesis</SelectItem>
                    <SelectItem value="Deep Literature Review">Deep Literature Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Citation Style
                </Label>
                <Select
                  value={citationStyle}
                  onValueChange={(v) => setCitationStyle(v as typeof citationStyle)}
                >
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs font-mono">
                    <SelectValue placeholder="Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IEEE">IEEE Format</SelectItem>
                    <SelectItem value="APA">APA 7th Ed.</SelectItem>
                    <SelectItem value="MLA">MLA 9th Ed.</SelectItem>
                    <SelectItem value="Chicago">Chicago Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              className="w-full h-10 gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold shadow-md shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Synthesizing Literature & Consensus...</span>
                </>
              ) : (
                <>
                  <Globe className="size-4" />
                  <span>Synthesize Research Report</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <ResultPanel
              title="Literature Synthesis Report"
              subtitle={`Format: ${citationStyle} • Depth: ${depth}`}
              content={result}
              isLoading={isLoading}
              onRegenerate={handleSearch}
              metadata={{
                durationMs,
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/20 p-10 text-center min-h-[380px]">
              <Search className="size-8 text-primary mb-3" />
              <h3 className="text-sm font-bold text-foreground">
                Literature Synthesis Chamber Idle
              </h3>
              <p className="mt-1.5 max-w-xs text-xs text-muted-foreground leading-relaxed">
                Enter your research thesis on the left. NEXORA synthesizes peer consensus, annotates
                empirical contradictions, and structures references in {citationStyle} format.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
