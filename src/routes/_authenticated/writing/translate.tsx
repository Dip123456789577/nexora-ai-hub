import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Languages,
  Sparkles,
  Send,
  Loader2,
  ArrowRightLeft,
  Copy,
  Check,
  RotateCcw,
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
import { translateTextFn } from "@/lib/ai/server-functions";
import { ApiConfigBanner } from "@/components/shared/api-config-banner";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/writing/translate")({
  component: PolyglotTranslator,
});

const LANGUAGES = [
  "Spanish",
  "French",
  "German",
  "Japanese",
  "Mandarin Chinese",
  "Hindi",
  "Bengali",
  "Russian",
  "Portuguese",
  "Arabic",
  "Korean",
  "Italian",
  "Dutch",
  "Turkish",
  "Swedish",
  "Polish",
];

function PolyglotTranslator() {
  const [text, setText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const [sourceLanguage, setSourceLanguage] = useState("Auto-detect");
  const [tone, setTone] = useState<"Formal" | "Conversational" | "Academic" | "Technical">(
    "Formal",
  );

  const [isLoading, setIsLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [configError, setConfigError] = useState<{
    provider: string;
    envVar: string;
    docsUrl: string;
    message: string;
  } | null>(null);

  const handleTranslate = async () => {
    if (!text.trim()) {
      toast.error("Please enter text to translate.");
      return;
    }

    setIsLoading(true);
    setConfigError(null);

    try {
      const res = await translateTextFn({
        data: {
          text: text.trim(),
          targetLanguage,
          sourceLanguage: sourceLanguage === "Auto-detect" ? undefined : sourceLanguage,
          tone,
        },
      });

      if (res.success && res.data) {
        setTranslatedText(res.data);
        toast.success(`Translated into ${targetLanguage}!`);
      } else {
        if (!res.isConfigured && res.configGuide) {
          setConfigError(res.configGuide);
          toast.error(res.error || "Gemini API key is not configured.");
        } else {
          toast.error(res.error || "Translation failed.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error in translation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      toast.success("Translation copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-secondary/15 text-secondary border border-secondary/30">
            <Languages className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Polyglot AI Translator
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Context-aware neural translation preserving syntax, technical jargon, and register
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

      {/* Language Selector Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Label className="text-xs font-semibold text-muted-foreground">From:</Label>
            <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
              <SelectTrigger className="h-8 w-36 bg-surface-container-lowest border-border/60 text-xs font-mono">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Auto-detect">Auto-detect</SelectItem>
                <SelectItem value="English">English</SelectItem>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ArrowRightLeft className="size-4 text-muted-foreground hidden sm:inline" />

          <div className="flex items-center gap-2">
            <Label className="text-xs font-semibold text-muted-foreground">To:</Label>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger className="h-8 w-36 bg-surface-container-lowest border-border/60 text-xs font-mono text-secondary">
                <SelectValue placeholder="Target" />
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

          <div className="flex items-center gap-2">
            <Label className="text-xs font-semibold text-muted-foreground">Tone:</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
              <SelectTrigger className="h-8 w-32 bg-surface-container-lowest border-border/60 text-xs">
                <SelectValue placeholder="Tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Conversational">Conversational</SelectItem>
                <SelectItem value="Academic">Academic</SelectItem>
                <SelectItem value="Technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleTranslate}
          disabled={isLoading || !text.trim()}
          className="h-8 gap-1.5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold text-xs px-4"
        >
          {isLoading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Send className="size-3.5" />
          )}
          <span>Translate</span>
        </Button>
      </div>

      {/* Side-by-Side Editor Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source Textarea */}
        <div className="flex flex-col rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur-xl shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <span className="text-xs font-mono font-semibold text-muted-foreground uppercase">
              {sourceLanguage}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setText("")}
              className="h-6 text-[11px] text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to translate here... (Markdown, code snippets, technical manuals are preserved intact)"
            className="flex-1 min-h-[280px] resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
          />
        </div>

        {/* Target Output */}
        <div className="flex flex-col rounded-2xl border border-border/60 bg-surface-container/40 p-4 backdrop-blur-xl shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <span className="text-xs font-mono font-semibold text-secondary uppercase">
              {targetLanguage} Output
            </span>
            {translatedText && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-6 gap-1 border-border/60 text-[11px]"
              >
                {copied ? (
                  <Check className="size-3 text-emerald-400" />
                ) : (
                  <Copy className="size-3" />
                )}
                <span>{copied ? "Copied" : "Copy"}</span>
              </Button>
            )}
          </div>

          <div className="flex-1 min-h-[280px] overflow-y-auto text-sm leading-relaxed text-foreground">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                <Loader2 className="size-6 animate-spin text-secondary" />
                <span className="text-xs">Generating neural translation...</span>
              </div>
            ) : translatedText ? (
              <div className="whitespace-pre-wrap">{translatedText}</div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground/60 text-xs">
                <span>Translated text will appear here</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
