import { AlertCircle, ExternalLink, Key, Settings as SettingsIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface ApiConfigBannerProps {
  providerName?: string;
  envVar?: string;
  docsUrl?: string;
  message?: string;
}

export function ApiConfigBanner({
  providerName = "Google Gemini",
  envVar = "GEMINI_API_KEY",
  docsUrl = "https://aistudio.google.com/app/apikey",
  message,
}: ApiConfigBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-surface-container to-surface-container-high p-4 text-on-surface shadow-lg backdrop-blur-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
            <AlertCircle className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-amber-200">
                {providerName} API Key Required
              </h4>
              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-300 border border-amber-500/20">
                {envVar}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {message ||
                `To enable real-time generation with ${providerName}, please configure ${envVar} in your environment or Settings.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Key className="size-3.5 text-secondary" />
            <span>Get Free Key</span>
            <ExternalLink className="size-3 text-muted-foreground" />
          </a>
          <Link
            to="/settings"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/20 border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/30 transition-colors"
          >
            <SettingsIcon className="size-3.5" />
            <span>Configure in Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
