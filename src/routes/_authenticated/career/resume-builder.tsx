import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Briefcase,
  Sparkles,
  Send,
  Loader2,
  FileText,
  UserCheck,
  CheckCircle2,
  Award,
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

export const Route = createFileRoute("/_authenticated/career/resume-builder")({
  component: ResumeBuilderPage,
});

function ResumeBuilderPage() {
  const [role, setRole] = useState("Staff Distributed Systems Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Senior");
  const [skills, setSkills] = useState(
    "Go, Rust, Kubernetes, Kafka, gRPC, Distributed Consensus, High-Throughput Microservices, Redis",
  );
  const [jobDescription, setJobDescription] = useState(
    "Looking for a Principal Engineer to architect low-latency event-driven data streaming infrastructure handling 100k+ events/second with 99.999% availability.",
  );
  const [achievements, setAchievements] = useState(
    "Led migration of monolith to microservices reducing p99 latency by 45%. Designed real-time event pipeline processing 50k ops/sec with zero data loss.",
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

  const handleGenerate = async () => {
    if (!role.trim()) {
      toast.error("Please specify a role.");
      return;
    }

    setIsLoading(true);
    setConfigError(null);

    const prompt = `You are NEXORA Executive Career Architect & ATS Optimization Engine.
Construct an ATS-optimized, high-impact resume profile tailored precisely to the target role and job description.

ROLE: ${role}
EXPERIENCE LEVEL: ${experienceLevel}
CORE SKILLS: ${skills}
RAW ACHIEVEMENTS / CONTEXT: ${achievements}
TARGET JOB DESCRIPTION:
"""
${jobDescription}
"""

Format the output strictly as professional Markdown:
# [CANDIDATE FULL NAME]
**${role}** | Location: Remote / Global | Contact: candidate@nexora.ai

## Executive Summary
(A high-impact 3-4 sentence value proposition integrating key job description keywords)

## Core Technical Competencies
(Categorized bullet clusters)

## Professional Experience & Quantified Impact
(3-4 detailed job entries with metric-driven bullet points using Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]")

## Education & Certifications

## ATS Keyword Optimization Analysis
(Brief summary of top keywords matched against the job description)`;

    try {
      const res = await runCustomPromptFn({
        data: {
          prompt,
          provider: "gemini",
          model: "gemini-2.5-flash",
          systemPrompt:
            "You are NEXORA Career Studio. Generate outstanding, quantified, ATS-friendly resumes.",
        },
      });

      if (res.success && res.data) {
        setResult(res.data);
        setDurationMs(res.durationMs);
        toast.success("Resume synthesized successfully!");
      } else {
        if (!res.isConfigured && res.configGuide) {
          setConfigError(res.configGuide);
          toast.error(res.error || "Gemini API key is not configured.");
        } else {
          toast.error(res.error || "Failed to generate resume.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error generating resume.");
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
            <Briefcase className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              ATS Resume Builder & Career Architect
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Synthesize ATS-optimized resumes with quantified impact metrics and job description
              keyword alignment
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
        {/* Left: Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-xl shadow-lg space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Target Role</Label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Machine Learning Engineer"
                  className="bg-surface-container-lowest border-border/60 text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Seniority Level
                </Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger className="h-9 bg-surface-container-lowest border-border/60 text-xs">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Junior">Junior / Associate (1-2 yrs)</SelectItem>
                    <SelectItem value="Mid">Mid-Level (3-5 yrs)</SelectItem>
                    <SelectItem value="Senior">Senior (5-8 yrs)</SelectItem>
                    <SelectItem value="Staff">Staff / Principal (8+ yrs)</SelectItem>
                    <SelectItem value="Executive">Executive / VP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Core Technical Skills
              </Label>
              <Input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Comma-separated technologies..."
                className="bg-surface-container-lowest border-border/60 text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Key Accomplishments & Responsibilities
              </Label>
              <Textarea
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                placeholder="List major projects, achievements, and impact..."
                className="min-h-[90px] bg-surface-container-lowest font-sans text-xs border-border/60"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Target Job Description (for ATS Match)
              </Label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job posting to tailor keywords..."
                className="min-h-[100px] bg-surface-container-lowest font-sans text-xs border-border/60"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading || !role.trim()}
              className="w-full h-10 gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold shadow-md shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Synthesizing ATS Resume...</span>
                </>
              ) : (
                <>
                  <Award className="size-4" />
                  <span>Build Tailored ATS Resume</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <ResultPanel
              title={`ATS Resume: ${role}`}
              subtitle={`${experienceLevel} Level • Google XYZ Metric Framework`}
              content={result}
              isLoading={isLoading}
              onRegenerate={handleGenerate}
              metadata={{
                durationMs,
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/20 p-10 text-center min-h-[460px]">
              <Briefcase className="size-8 text-secondary mb-3" />
              <h3 className="text-sm font-bold text-foreground">ATS Resume Engine Ready</h3>
              <p className="mt-1.5 max-w-xs text-xs text-muted-foreground leading-relaxed">
                Provide your role and target job posting on the left. NEXORA structures an executive
                resume optimized for automated applicant tracking systems.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
