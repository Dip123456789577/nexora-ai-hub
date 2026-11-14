import { useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Image as ImageIcon,
  Upload,
  Send,
  Loader2,
  FileSearch,
  ScanText,
  Brain,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { imageQAFn } from "@/lib/ai/server-functions";
import { ResultPanel } from "@/components/shared/result-panel";
import { ApiConfigBanner } from "@/components/shared/api-config-banner";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/assistant/image-qa")({
  component: ImageQAPage,
});

function ImageQAPage() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/png");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [question, setQuestion] = useState(
    "Inspect this image in detail. Extract any text, decipher any diagrams, and solve any questions present step by step.",
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }

    setMimeType(file.type);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      // Remove data:image/...;base64, prefix
      const base64Data = dataUrl.split(",")[1] ?? null;
      setImageBase64(base64Data);
      toast.success(`Loaded image: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!imageBase64) {
      toast.error("Please upload an image first.");
      return;
    }
    if (!question.trim()) {
      toast.error("Please enter a question or instruction.");
      return;
    }

    setIsLoading(true);
    setConfigError(null);

    try {
      const res = await imageQAFn({
        data: {
          imageBase64,
          mimeType,
          question: question.trim(),
        },
      });

      if (res.success && res.data) {
        setResult(res.data);
        setDurationMs(res.durationMs);
        toast.success("Image vision analysis completed!");
      } else {
        if (!res.isConfigured && res.configGuide) {
          setConfigError(res.configGuide);
          toast.error(res.error || "Gemini API key is not configured.");
        } else {
          toast.error(res.error || "Vision analysis failed.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error in vision analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const setPreset = (presetQuestion: string) => {
    setQuestion(presetQuestion);
    toast.info("Applied preset prompt.");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-secondary/15 text-secondary border border-secondary/30">
            <ImageIcon className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Image Q&A & Neural Vision OCR
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Upload photographs, diagrams, math problems, or document scans for multimodal
              step-by-step solutions
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
        {/* Left: Upload & Prompt */}
        <div className="lg:col-span-6 space-y-4">
          {/* Upload Card */}
          <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-xl shadow-lg space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-border/60 bg-surface-container-lowest p-2 group">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="max-h-[260px] w-full object-contain rounded-lg"
                />
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="rounded-md bg-black/70 px-2 py-1 text-[11px] font-mono text-white">
                    {fileName}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setImageBase64(null);
                      setImagePreview(null);
                      setResult(null);
                    }}
                    className="size-8 p-0"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/70 hover:border-secondary/60 bg-surface-container/20 p-8 text-center cursor-pointer transition-all duration-200"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary mb-3">
                  <Upload className="size-6" />
                </div>
                <h4 className="text-sm font-bold text-foreground">
                  Click or Drag & Drop Image Here
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Supports JPG, PNG, and WebP images up to 10MB
                </p>
              </div>
            )}

            {/* Quick Action Chips */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPreset(
                    "Solve this photographed exam/math question step by step with clear proofs and formulas.",
                  )
                }
                className="h-7 text-[11px] gap-1 border-border/60"
              >
                <Brain className="size-3 text-secondary" />
                <span>Solve Step-by-Step</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPreset(
                    "Extract all visible text verbatim, preserving line breaks, tables, and formatting (OCR).",
                  )
                }
                className="h-7 text-[11px] gap-1 border-border/60"
              >
                <ScanText className="size-3 text-primary" />
                <span>Extract All Text (OCR)</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPreset(
                    "Explain this architectural diagram or flowchart, describing all components, data flow, and transitions.",
                  )
                }
                className="h-7 text-[11px] gap-1 border-border/60"
              >
                <FileSearch className="size-3 text-secondary" />
                <span>Explain Diagram</span>
              </Button>
            </div>

            {/* Question Textarea */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Question or Prompt for Vision Model
              </Label>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like NEXORA to solve or explain about this image?"
                className="min-h-[90px] bg-surface-container-lowest font-sans text-xs border-border/60"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isLoading || !imageBase64}
              className="w-full h-10 gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold shadow-md shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Processing Vision Model...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  <span>Analyze Image with Gemini Vision</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <ResultPanel
              title="Vision & Multimodal Analysis"
              subtitle={fileName || "Image Understanding"}
              content={result}
              isLoading={isLoading}
              onRegenerate={handleAnalyze}
              metadata={{
                durationMs,
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/20 p-10 text-center min-h-[460px]">
              <ImageIcon className="size-8 text-secondary mb-3" />
              <h3 className="text-sm font-bold text-foreground">Multimodal Vision Engine Ready</h3>
              <p className="mt-1.5 max-w-xs text-xs text-muted-foreground leading-relaxed">
                Upload any diagram, textbook problem, or document scan. Google Gemini Vision will
                extract equations, annotate architectures, and solve questions step by step.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
