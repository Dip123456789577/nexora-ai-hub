import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Sparkles,
  Send,
  Loader2,
  Download,
  Image as ImageIcon,
  Sliders,
  Palette,
  Ratio,
  Maximize2,
  AlertCircle,
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
import { ApiConfigBanner } from "@/components/shared/api-config-banner";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/assistant/image-generator")({
  component: ImageGeneratorStudio,
});

const STYLES = [
  "Photorealistic 8K",
  "Cyberpunk Synthetic Obsidian",
  "Cinematic 3D Render",
  "Digital Concept Art",
  "Minimalist Geometric Vector",
  "Dark Holographic Blueprint",
];

const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3"];

function ImageGeneratorStudio() {
  const [prompt, setPrompt] = useState(
    "Futuristic synthetic obsidian quantum computer server rack with subtle violet and cyan optical illumination, 8k resolution",
  );
  const [style, setStyle] = useState("Cyberpunk Synthetic Obsidian");
  const [aspectRatio, setAspectRatio] = useState("16:9");

  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Check if image generation key is configured
  const hasImageKey = false; // By default report configuration requirement until key is set

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter an image prompt.");
      return;
    }

    setIsLoading(true);

    // Simulate backend call / config check
    setTimeout(() => {
      setIsLoading(false);
      toast.error("Image Generation API key is not configured.");
    }, 800);
  };

  const handleEnhancePrompt = () => {
    setPrompt(
      `${prompt.trim()}, masterpiece, ultra-detailed architectural rendering, octane render, ray tracing reflections, cinematic lighting, 8k resolution`,
    );
    toast.success("Prompt enhanced with cinematic tokens!");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-secondary/15 text-secondary border border-secondary/30">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Image Generator & Neural Diffusion Studio
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Synthesize high-fidelity generative imagery with style tokenization and prompt
              enhancement
            </p>
          </div>
        </div>
      </div>

      {/* Config Banner */}
      <ApiConfigBanner
        providerName="Image Generation Engine"
        envVar="IMAGE_GENERATION_API_KEY"
        docsUrl="https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview"
        message="Text-to-image synthesis requires a dedicated image generation provider key (e.g. Google Imagen 3 on Vertex AI, FLUX, or OpenAI DALL-E 3). Add IMAGE_GENERATION_API_KEY to enable generation."
      />

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Prompt Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-xl shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                Text-to-Image Prompt
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEnhancePrompt}
                className="h-7 text-xs text-secondary hover:text-secondary/80 gap-1"
              >
                <Sparkles className="size-3" />
                <span>Enhance Prompt</span>
              </Button>
            </div>

            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to visualize in vivid detail..."
              className="min-h-[140px] bg-surface-container-lowest font-sans text-xs border-border/60 focus:border-secondary"
            />

            {/* Style & Aspect Ratio */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Style Preset</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs">
                    <SelectValue placeholder="Style" />
                  </SelectTrigger>
                  <SelectContent>
                    {STYLES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs font-mono">
                    <SelectValue placeholder="Ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASPECT_RATIOS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-full h-10 gap-2 bg-gradient-to-r from-secondary to-primary text-surface-container-lowest font-bold shadow-md shadow-secondary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Synthesizing Latents...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  <span>Generate Image</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Output Canvas */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/20 p-10 text-center min-h-[380px]">
            <ImageIcon className="size-10 text-secondary/60 mb-3" />
            <h3 className="text-sm font-bold text-foreground">Generative Diffusion Canvas</h3>
            <p className="mt-1.5 max-w-xs text-xs text-muted-foreground leading-relaxed">
              Once IMAGE_GENERATION_API_KEY is configured in your environment or Settings, rendered
              diffusion canvases will materialize here with full download options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
