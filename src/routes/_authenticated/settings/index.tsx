import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Settings as SettingsIcon,
  Key,
  Shield,
  Palette,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Save,
  Server,
  Zap,
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
import { getAllProviderStatuses } from "@/lib/ai/provider-manager";
import type { ProviderConfigStatus } from "@/lib/ai/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings/")({
  component: SettingsPage,
});

function SettingsPage() {
  const [providerStatuses, setProviderStatuses] = useState<ProviderConfigStatus[]>([]);
  const [defaultProvider, setDefaultProvider] = useState("gemini");
  const [defaultModel, setDefaultModel] = useState("gemini-2.5-flash");
  const [geminiKeyInput, setGeminiKeyInput] = useState("");
  const [openaiKeyInput, setOpenaiKeyInput] = useState("");
  const [anthropicKeyInput, setAnthropicKeyInput] = useState("");

  useEffect(() => {
    setProviderStatuses(getAllProviderStatuses());
  }, []);

  const handleSavePreferences = () => {
    localStorage.setItem(
      "nexora_user_preferences",
      JSON.stringify({
        defaultProvider,
        defaultModel,
      }),
    );
    toast.success("Workspace preferences saved successfully!");
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30">
            <SettingsIcon className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Settings & Intelligence Configuration
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Connected AI providers, default model selection, server boundaries, and security
              policies
            </p>
          </div>
        </div>
      </div>

      {/* Connected Services & API Keys Status */}
      <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-xl shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <Server className="size-4 text-secondary" />
            <h3 className="text-base font-bold text-foreground">
              Connected AI Providers & Services
            </h3>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            Server Boundary Inspection
          </span>
        </div>

        <div className="space-y-3">
          {providerStatuses.map((prov) => (
            <div
              key={prov.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/50 bg-surface-container/30"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{prov.name}</span>
                  <span className="text-[10px] font-mono text-secondary px-1.5 py-0.5 rounded bg-secondary/10 border border-secondary/20">
                    {prov.defaultModel}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{prov.description}</p>
                <div className="text-[11px] font-mono text-muted-foreground/80">
                  Required Variable: <code className="text-foreground">{prov.envVar}</code>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-mono border font-medium ${
                    prov.isConfigured
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  {prov.isConfigured ? (
                    <CheckCircle2 className="size-3 text-emerald-400" />
                  ) : (
                    <AlertCircle className="size-3 text-amber-400" />
                  )}
                  <span>{prov.isConfigured ? "Operational" : "Waiting for Key"}</span>
                </span>

                <a
                  href={prov.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-surface-container-high px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Docs</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Default Model Preferences */}
      <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-xl shadow-lg space-y-5">
        <div className="flex items-center gap-2 border-b border-border/40 pb-3">
          <Zap className="size-4 text-primary" />
          <h3 className="text-base font-bold text-foreground">Default AI Generation Preferences</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
              Primary AI Provider
            </Label>
            <Select value={defaultProvider} onValueChange={setDefaultProvider}>
              <SelectTrigger className="h-10 bg-surface-container-lowest border-border/60 text-xs">
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Google Gemini (Recommended Default)</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic Claude</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
              Primary Reasoning Model
            </Label>
            <Select value={defaultModel} onValueChange={setDefaultModel}>
              <SelectTrigger className="h-10 bg-surface-container-lowest border-border/60 text-xs font-mono">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-2.5-flash">
                  gemini-2.5-flash (Fast & Multimodal)
                </SelectItem>
                <SelectItem value="gemini-1.5-pro">
                  gemini-1.5-pro (High Cognitive Depth)
                </SelectItem>
                <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                <SelectItem value="claude-3-5-sonnet-20241022">claude-3-5-sonnet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSavePreferences}
            className="gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold"
          >
            <Save className="size-4" />
            <span>Save Preferences</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
