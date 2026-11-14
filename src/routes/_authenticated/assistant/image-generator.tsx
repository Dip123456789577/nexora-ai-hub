import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Download,
  Sliders,
  Palette,
  Maximize2,
  AlertCircle,
  Copy,
  Star,
  Check,
  RefreshCw,
  Wand2,
  Dice5,
  Layers,
  Zap,
  Terminal,
  Shield,
  ZoomIn,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiConfigBanner } from "@/components/shared/api-config-banner";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/assistant/image-generator")({
  component: ImageGeneratorStudio,
});

const PRESETS = [
  {
    id: "sci-fi",
    name: "Cinematic Sci-Fi",
    icon: "🚀",
    promptSuffix: "cinematic sci-fi, volumetric mist, octane render",
  },
  {
    id: "photo-8k",
    name: "Photorealistic 8K",
    icon: "📸",
    promptSuffix: "photorealistic 8k, hyper-detailed, ray tracing, sharp focus",
  },
  {
    id: "arch-3d",
    name: "Architectural 3D",
    icon: "🏛️",
    promptSuffix: "modern architectural rendering, parametric facade, ambient occlusion",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk Obsidian",
    icon: "⚡",
    promptSuffix: "cyberpunk noir, synthetic obsidian surfaces, neon cyan and violet telemetry",
  },
  {
    id: "anime-neo",
    name: "Anime Neo-Tokyo",
    icon: "🎨",
    promptSuffix: "makoto shinkai aesthetic, neo tokyo twilight, vibrant atmospheric lighting",
  },
  {
    id: "brutalist",
    name: "Brutalist 3D",
    icon: "🧱",
    promptSuffix: "monolithic brutalist architecture, raw concrete, dramatic shadows, geometric",
  },
];

const ASPECT_RATIOS = [
  { ratio: "16:9", label: "Landscape", previewClass: "w-7 h-4" },
  { ratio: "1:1", label: "Square", previewClass: "w-5 h-5" },
  { ratio: "3:4", label: "Portrait", previewClass: "w-4 h-5" },
  { ratio: "9:16", label: "Story", previewClass: "w-3.5 h-6" },
  { ratio: "21:9", label: "Cinematic", previewClass: "w-8 h-3.5" },
];

export function ImageGeneratorStudio() {
  const [model, setModel] = useState("FLUX.1-Pro (Ultra-Realism & Text)");
  const [prompt, setPrompt] = useState(
    "Hyper-realistic cinematic 4K masterpiece of a futuristic cybernetic biomechanical android observatory surrounded by ethereal luminescent nebulae, cosmic starlight refraction, ornate geodesic glass dome, high-voltage violet telemetry pulses, volumetric mist, photorealistic 8K octane-render aesthetic, cinematic symmetry, depth of field.",
  );
  const [negativePrompt, setNegativePrompt] = useState(
    "low quality, blurry, deformed fingers, distorted anatomy, bad render, chromatic aberration, signature, watermark, lowres, cloned face, artifacts.",
  );
  const [activePreset, setActivePreset] = useState("sci-fi");
  const [selectedRatio, setSelectedRatio] = useState("16:9");
  const [inferenceSteps, setInferenceSteps] = useState(35);
  const [cfgGuidance, setCfgGuidance] = useState(7.5);
  const [sampler, setSampler] = useState("Euler a / Karras");
  const [seed, setSeed] = useState("4829104");
  const [enableUpscale, setEnableUpscale] = useState(true);
  const [batchCount, setBatchCount] = useState(1);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [starred, setStarred] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  // Configuration status flag
  const hasImageKey = false; // By default report configuration requirement until key is set

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a positive prompt.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.error("Diffusion Engine API key is not configured. Review configuration guide above.");
    }, 700);
  };

  const handleEnhance = () => {
    const additions =
      ", 8K resolution, high-fidelity ray tracing reflections, cinematic lighting, photorealistic depth of field";
    if (!prompt.includes("8K resolution")) {
      setPrompt((prev) => prev.trim() + additions);
      toast.success("Prompt enhanced with cinematic tokens!");
    } else {
      toast.info("Prompt is already enhanced.");
    }
  };

  const handleRandomize = () => {
    const randomPrompts = [
      "Bioluminescent subterranean crystalline forest with floating quantum orbs, glowing cyan spores, deep violet caverns, photorealistic 8k octane render.",
      "Cybernetic samurai standing atop a rain-slicked Neo-Tokyo skyscraper looking into holographic nebula advertisements, cinematic 35mm lens, depth of field.",
      "Futuristic orbital space station botanical dome with panoramic view of planet Earth below, volumetric golden hour sunlight, architectural realism.",
    ];
    const picked = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    if (picked) {
      setPrompt(picked);
      toast.success("Randomized prompt loaded!");
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* SUB-HEADER TOOLBAR & MODE SELECTOR */}
      <div className="w-full flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-4 py-1">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-surface-container-lowest p-1 rounded-xl border border-outline-variant/30">
            <button
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-container-high text-primary font-medium text-xs shadow-md border border-primary/25"
              type="button"
            >
              <Sparkles className="size-3.5 text-secondary" />
              <span>AI Image Generator</span>
              <span className="px-1.5 py-0.2 rounded-full font-mono text-[9px] bg-surface-container text-secondary border border-secondary/30">
                FLUX.1 / SDXL
              </span>
            </button>
            <Link
              to="/assistant/image-qa"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs transition-colors"
            >
              <Terminal className="size-3.5" />
              <span>Image Q&A & Vision OCR</span>
            </Link>
          </div>

          {/* Action Cluster */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30">
              <Zap className="size-3.5 text-secondary" />
              <span>GPU: H100 TensorRT</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-outline border border-outline-variant/30">
              <span>Latency: ~1.4s</span>
            </div>
          </div>
        </div>

        {/* Cluster Telemetry Strip (Stitch 4 Spec) */}
        <div className="flex flex-wrap items-center justify-between px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface-variant font-mono text-xs border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-secondary">
              <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#4cd7f6] animate-pulse" />
              <span>Cluster: H100 Tensor-Core x8 Online</span>
            </div>
            <div className="flex items-center gap-1.5 text-outline">
              <span>VRAM: 14.2 / 80 GB (17.7%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-outline">
              <span>Speed: ~1.4s / 4K frame</span>
            </div>
            <div className="flex items-center gap-1.5 text-outline">
              <span>Seed Mode: Deterministic #{seed}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-outline">
            <span className="text-primary font-medium">Flux.1-Pro v2.4 Engine Active</span>
            <span>•</span>
            <span className="text-secondary font-mono">FP8 TensorRT</span>
          </div>
        </div>
      </div>

      {/* API Key Missing Notification Banner */}
      {!hasImageKey && (
        <ApiConfigBanner
          providerName="Image Generation Engine (FLUX.1 / SDXL)"
          envVar="IMAGE_GENERATION_API_KEY"
          docsUrl="https://replicate.com"
          message="To enable live 4K image diffusion rendering on your cluster, configure IMAGE_GENERATION_API_KEY or STABILITY_API_KEY in your .env file or in Settings."
        />
      )}

      {/* DUAL-PANEL WORKSPACE (Stitch Screen 4 Spec) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start w-full">
        {/* LEFT PANEL: ADVANCED PROMPT & SYNTHESIS CONTROLS */}
        <div className="xl:col-span-5 flex flex-col gap-5 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-xl">
          {/* Model Selector */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-outline">
              Diffusion Pipeline & Checkpoint
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant/40 focus:outline-none focus:border-primary cursor-pointer font-sans"
            >
              <option value="FLUX.1-Pro (Ultra-Realism & Text)">
                FLUX.1-Pro (Ultra-Realism & Text)
              </option>
              <option value="SDXL Turbo (High-Throughput Sub-Second)">
                SDXL Turbo (High-Throughput Sub-Second)
              </option>
              <option value="Midjourney Style V6 (Atmospheric Cinematic)">
                Midjourney Style V6 (Atmospheric Cinematic)
              </option>
              <option value="DALL-E 3 HD (Concept Semantics)">
                DALL-E 3 HD (Concept Semantics)
              </option>
            </select>
          </div>

          {/* Positive Prompt Console */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[10px] uppercase tracking-wider text-outline">
                Positive Prompt Synthesis
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleEnhance}
                  className="flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] bg-surface-container text-secondary hover:bg-surface-container-high transition-colors border border-secondary/20"
                >
                  <Wand2 className="size-3" />
                  <span>Enhance</span>
                </button>
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors border border-outline-variant/30"
                >
                  <Dice5 className="size-3" />
                  <span>Random</span>
                </button>
              </div>
            </div>
            <div className="relative bg-surface-container-low rounded-xl p-3 border border-outline-variant/30 focus-within:border-primary/60 shadow-inner">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full bg-transparent font-mono text-xs text-on-surface resize-none focus:outline-none leading-relaxed"
                placeholder="Describe the visual scene in detail..."
              />
              <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-outline border-t border-outline-variant/20 mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-secondary">Token weight active</span>
                  <span>•</span>
                  <span className="text-primary font-medium">(bioluminescent:1.3)</span>
                </div>
                <span>{prompt.length} chars</span>
              </div>
            </div>
          </div>

          {/* Negative Prompt (Collapsible) */}
          <details className="group bg-surface-container-low rounded-xl p-3 border border-outline-variant/25 transition-all">
            <summary className="flex items-center justify-between cursor-pointer list-none font-mono text-[10px] uppercase tracking-wider text-outline select-none">
              <span>Negative Prompt Exclusion</span>
              <span className="text-xs group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 pt-2 border-t border-outline-variant/20">
              <textarea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                rows={2}
                className="w-full bg-surface-container-lowest p-2 rounded-lg font-mono text-xs text-on-surface-variant resize-none focus:outline-none border border-outline-variant/25"
                placeholder="Negative tokens to exclude..."
              />
            </div>
          </details>

          {/* Aesthetic Presets Grid */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-outline">
              Aesthetic Engine & Preset
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePreset(p.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                    activePreset === p.id
                      ? "bg-surface-container-high text-primary border border-primary/40 shadow-md shadow-primary/10"
                      : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface border border-outline-variant/20"
                  }`}
                >
                  <span className="text-base mb-0.5">{p.icon}</span>
                  <span className="text-[10px] font-medium leading-tight">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-outline">
              Aspect Ratio Canvas
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.ratio}
                  type="button"
                  onClick={() => setSelectedRatio(ar.ratio)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                    selectedRatio === ar.ratio
                      ? "bg-surface-container-high text-primary border border-primary/40 shadow-sm"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-outline-variant/20"
                  }`}
                >
                  <div
                    className={`${ar.previewClass} rounded-sm ${
                      selectedRatio === ar.ratio ? "bg-primary/50" : "bg-surface-container-highest"
                    }`}
                  />
                  <span className="font-mono text-[10px]">{ar.ratio}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fine-Grain Parameters Grid */}
          <div className="grid grid-cols-2 gap-3 bg-surface-container-low p-3 rounded-xl border border-outline-variant/25">
            <div className="space-y-1">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-outline">Inference Steps</span>
                <span className="text-on-surface font-medium">{inferenceSteps}</span>
              </div>
              <input
                type="range"
                min="15"
                max="60"
                value={inferenceSteps}
                onChange={(e) => setInferenceSteps(Number(e.target.value))}
                className="w-full accent-primary h-1 bg-surface-container-highest rounded cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-outline">CFG Guidance</span>
                <span className="text-on-surface font-medium">{cfgGuidance}</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={cfgGuidance}
                onChange={(e) => setCfgGuidance(Number(e.target.value))}
                className="w-full accent-secondary h-1 bg-surface-container-highest rounded cursor-pointer"
              />
            </div>
          </div>

          {/* 4K Latent Upscale Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/25">
            <div className="flex items-center gap-2.5">
              <Sparkles className="size-4 text-secondary" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-on-surface">4K Latent Upscale (2x)</span>
                <span className="text-[10px] text-outline font-mono">
                  Neural High-Res Fix Active
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEnableUpscale(!enableUpscale)}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                enableUpscale ? "bg-primary" : "bg-surface-container-highest"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-surface-container-lowest transition-transform ${
                  enableUpscale ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Primary CTA Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-primary-container via-purple-600 to-inverse-primary hover:opacity-95 text-white font-semibold text-sm flex items-center justify-between shadow-[0_0_24px_rgba(160,120,255,0.4)] transition-all disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-secondary" />
              <span>{isLoading ? "Synthesizing Diffusion..." : "Generate 4K Visuals"}</span>
            </div>
            <div className="flex flex-col items-end font-mono text-[10px] text-white/80">
              <span>40 Credits</span>
              <span>Est. 2.8s</span>
            </div>
          </button>
        </div>

        {/* RIGHT PANEL: HERO PREVIEW, ACTIVE INSPECTOR & RECENT BATCH */}
        <div className="xl:col-span-7 flex flex-col gap-5">
          {/* Generation Session Top Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-md">
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-surface-container text-secondary border border-secondary/30">
                  Batch #8492
                </span>
                <span className="text-sm font-semibold text-on-surface truncate">
                  Cybernetic Observatory & Quantum Nebula
                </span>
              </div>
              <p className="font-mono text-[10px] text-outline truncate">
                Flux.1-Pro • 3840×2160 (4K UHD) • 35 Steps • Latency: 2.6s • Seed: {seed}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toast.info("Download package initialized (UHD 4K)")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs text-on-surface transition-colors border border-outline-variant/30"
              >
                <Download className="size-3.5 text-secondary" />
                <span>Export 4K</span>
              </button>
            </div>
          </div>

          {/* MAIN HERO SHOWCASE (Large Active Preview from Stitch 4) */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-surface-container-lowest border border-outline-variant/30 shadow-2xl group aspect-[16/9]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8pju1kdcDjTBZGEm3Ft4LrGwog5smcMpp3C3T16XEVIu3UFbarwAmRBUZyvCAsN2-3y5tf2oPFZh7ytZjBpqPFArr-ml2MEd6roih-7Etz0zsOf5RsF1HTu0rk7NXZBAYsHVTIVDeNiNZUgTwWxrnIF_6w7n25WsrQhbfxjHcIgrzp9Eh074kBb3dKGjaznTPgHEpUiXFtn2bOBSSrAIHo0Lc7Ux2nAC-Q0uf_WY"
              alt="Futuristic cybernetic biomechanical android observatory surrounded by luminescent nebulae"
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500 ease-out"
            />

            {/* Subtle Gradient Vignette Overlays for Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-black/50 pointer-events-none" />

            {/* Top-Right HUD Controls */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
              <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md font-mono text-[10px] text-secondary border border-secondary/30 shadow-lg">
                4K Native UHD
              </span>
              <button
                type="button"
                onClick={() => toast.info("Inspecting at 100% pixel scale")}
                className="p-1.5 rounded-lg bg-surface-container-lowest/80 backdrop-blur-md text-on-surface hover:text-primary transition-colors border border-outline-variant/30 shadow-lg"
              >
                <ZoomIn className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setStarred(!starred)}
                className="p-1.5 rounded-lg bg-surface-container-lowest/80 backdrop-blur-md text-primary transition-colors border border-outline-variant/30 shadow-lg"
              >
                <Star
                  className={`size-4 ${starred ? "fill-primary text-primary" : "text-outline"}`}
                />
              </button>
            </div>

            {/* Top-Left Status Pill */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/85 backdrop-blur-md font-mono text-[10px] text-on-surface border border-outline-variant/30 shadow-lg">
                <span className="size-2 rounded-full bg-secondary shadow-[0_0_8px_#4cd7f6]" />
                <span>SYNTHESIZED IN 2.6s</span>
              </div>
            </div>

            {/* Bottom Prompt Telemetry Banner Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/90 to-transparent flex flex-col gap-1.5 z-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-secondary">
                  <Terminal className="size-3" />
                  <span>Active Synthesis Prompt Metadata</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] bg-surface-container text-primary hover:bg-surface-container-high transition-colors border border-primary/25"
                >
                  {copiedPrompt ? (
                    <Check className="size-3 text-secondary" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                  <span>{copiedPrompt ? "Copied" : "Copy Prompt"}</span>
                </button>
              </div>
              <p className="text-xs text-on-surface line-clamp-2 leading-relaxed">"{prompt}"</p>
            </div>
          </div>

          {/* Quick Editing Canvas Bar Below Hero */}
          <div className="flex flex-wrap items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/25 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-outline font-mono text-[10px] uppercase tracking-wider">
                Quick Tools:
              </span>
              <button
                type="button"
                onClick={() => toast.info("Inpaint selection brush loaded")}
                className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors border border-outline-variant/20 text-xs"
              >
                Inpaint Selection
              </button>
              <button
                type="button"
                onClick={() => toast.info("Outpaint expander active (+25%)")}
                className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors border border-outline-variant/20 text-xs"
              >
                Outpaint Canvas (+25%)
              </button>
              <button
                type="button"
                onClick={() => toast.info("Upscale target: 8K Extreme TensorRT")}
                className="px-2.5 py-1 rounded-lg bg-surface-container text-secondary hover:bg-surface-container-high transition-colors border border-secondary/20 text-xs font-mono"
              >
                8K Extreme
              </button>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-outline">
              <span>Display P3</span>
              <span>•</span>
              <span className="text-secondary font-medium">10-Bit Dynamic</span>
            </div>
          </div>

          {/* BATCH HISTORY & GENERATED SIBLING ASSETS GRID */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-on-surface">
                  Recent Visual Synthesis Iterations
                </span>
                <span className="px-2 py-0.5 rounded-full font-mono text-[10px] bg-surface-container text-outline border border-outline-variant/30">
                  3 sister frames
                </span>
              </div>
              <span className="font-mono text-xs text-primary">Gallery Matrix</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sibling Frame 1 */}
              <div className="group relative rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/30 aspect-[16/9]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7bPe0Cc12m3bSdRgg_4u6LovtUC28jQ7bC4M2Nb-ENjnu2JBgg_Y52Ajcca4_uoaVFU15KCe3bOV5dn7nsEJofFXQtCLQCBD5lULUVQ3KvL3TDD3E1YD6b_4RGKrn43nPuISay3-AirLNSaygWOtNQhA-7sKkeq6-ElMHP5F1EKDgWLagM2HoZbbiJGXPGxmNwjhIrWh1ZvU2FnwmGRXnZRghk7WaS9sjDqS5rc4"
                  alt="Quantum Metropolis Over Mirror Sea"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md font-mono text-[9px] text-secondary border border-secondary/30">
                  16:9 • 4K
                </div>
                <div className="absolute inset-0 bg-surface-container-lowest/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity p-4 text-center">
                  <span className="text-xs font-medium text-on-surface">
                    Quantum Metropolis Over Mirror Sea
                  </span>
                </div>
              </div>

              {/* Sibling Frame 2 */}
              <div className="group relative rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/30 aspect-[16/9]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8pju1kdcDjTBZGEm3Ft4LrGwog5smcMpp3C3T16XEVIu3UFbarwAmRBUZyvCAsN2-3y5tf2oPFZh7ytZjBpqPFArr-ml2MEd6roih-7Etz0zsOf5RsF1HTu0rk7NXZBAYsHVTIVDeNiNZUgTwWxrnIF_6w7n25WsrQhbfxjHcIgrzp9Eh074kBb3dKGjaznTPgHEpUiXFtn2bOBSSrAIHo0Lc7Ux2nAC-Q0uf_WY"
                  alt="Cybernetic Biomechanical Observatory"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md font-mono text-[9px] text-primary border border-primary/30">
                  Variation #2
                </div>
                <div className="absolute inset-0 bg-surface-container-lowest/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity p-4 text-center">
                  <span className="text-xs font-medium text-on-surface">
                    Bioluminescent Android Core
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
