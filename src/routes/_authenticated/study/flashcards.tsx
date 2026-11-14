import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Layers,
  Sparkles,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle,
  RotateCw,
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
import { generateFlashcardsFn } from "@/lib/ai/server-functions";
import { ApiConfigBanner } from "@/components/shared/api-config-banner";
import { toast } from "sonner";
import type { FlashcardResultData, FlashcardInput } from "@/lib/ai/types";

export const Route = createFileRoute("/_authenticated/study/flashcards")({
  component: FlashcardEngine,
});

function FlashcardEngine() {
  const [topic, setTopic] = useState("Machine Learning: Optimization Algorithms & Loss Functions");
  const [cardCount, setCardCount] = useState(6);
  const [depth, setDepth] = useState<"Core Concepts" | "Comprehensive Review" | "Advanced Nuance">(
    "Core Concepts",
  );

  const [isLoading, setIsLoading] = useState(false);
  const [flashcardData, setFlashcardData] = useState<FlashcardResultData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedMap, setLearnedMap] = useState<Record<number, boolean>>({});
  const [configError, setConfigError] = useState<{
    provider: string;
    envVar: string;
    docsUrl: string;
    message: string;
  } | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please specify a flashcard topic.");
      return;
    }

    setIsLoading(true);
    setConfigError(null);
    setCurrentIndex(0);
    setIsFlipped(false);
    setLearnedMap({});

    try {
      const payload: FlashcardInput = {
        topic: topic.trim(),
        cardCount,
        depth,
      };

      const res = await generateFlashcardsFn({ data: payload });

      if (res.success && res.data) {
        setFlashcardData(res.data);
        toast.success(`Generated ${res.data.cards.length} flashcards on ${res.data.topic}!`);
      } else {
        if (!res.isConfigured && res.configGuide) {
          setConfigError(res.configGuide);
          toast.error(res.error || "Gemini API key is not configured.");
        } else {
          toast.error(res.error || "Failed to generate flashcards.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error generating flashcards.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (!flashcardData) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcardData.cards.length);
  };

  const handlePrev = () => {
    if (!flashcardData) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcardData.cards.length) % flashcardData.cards.length);
  };

  const handleShuffle = () => {
    if (!flashcardData) return;
    const shuffled = [...flashcardData.cards].sort(() => Math.random() - 0.5);
    setFlashcardData({ ...flashcardData, cards: shuffled });
    setCurrentIndex(0);
    setIsFlipped(false);
    toast.info("Flashcards shuffled.");
  };

  const toggleLearned = (cardId: number) => {
    setLearnedMap((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const currentCard = flashcardData?.cards[currentIndex];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-secondary/15 text-secondary border border-secondary/30">
            <Layers className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Flashcard Engine & Active Recall
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Spaced repetition flashcards with flip animations and conceptual mastery tracking
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

      {/* Control Bar */}
      <div className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-xl shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Subject / Concept</Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Distributed Consensus, Cellular Respiration, Microeconomics"
              className="bg-surface-container-lowest border-border/60 text-sm h-10"
            />
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Number of Cards</Label>
            <Select value={cardCount.toString()} onValueChange={(v) => setCardCount(Number(v))}>
              <SelectTrigger className="h-10 bg-surface-container-lowest border-border/60 text-xs">
                <SelectValue placeholder="Cards" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 Cards (Quick Review)</SelectItem>
                <SelectItem value="6">6 Cards (Standard)</SelectItem>
                <SelectItem value="10">10 Cards (Deep Dive)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3 flex items-end">
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
              className="w-full h-10 gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold shadow-md shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  <span>Generate Cards</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Flashcard Viewer */}
      {flashcardData && currentCard && (
        <div className="flex flex-col items-center space-y-6 max-w-2xl mx-auto">
          {/* Card Meta & Controls */}
          <div className="flex items-center justify-between w-full px-2 text-xs text-muted-foreground">
            <span className="font-mono text-secondary">
              Card {currentIndex + 1} of {flashcardData.cards.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShuffle}
                className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Shuffle className="size-3.5" />
                <span>Shuffle</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleLearned(currentCard.id)}
                className={`h-8 gap-1.5 text-xs ${
                  learnedMap[currentCard.id]
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                    : "border-border/60 text-muted-foreground"
                }`}
              >
                <CheckCircle className="size-3.5" />
                <span>{learnedMap[currentCard.id] ? "Learned" : "Mark Learned"}</span>
              </Button>
            </div>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="group relative w-full min-h-[300px] cursor-pointer rounded-3xl border border-border/70 bg-gradient-to-br from-card/80 via-surface-container to-surface-container-high p-8 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-primary/50 hover:shadow-primary/5 flex flex-col justify-between select-none"
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-3 text-xs font-mono">
              <span className="text-secondary uppercase tracking-wider">
                {isFlipped ? "Answer / Solution" : "Question / Concept"}
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <RotateCw className="size-3 text-primary animate-spin-slow" />
                <span>Click to Flip</span>
              </span>
            </div>

            <div className="py-6 flex items-center justify-center text-center">
              <p className="text-base sm:text-xl font-medium leading-relaxed text-foreground">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>

            <div className="border-t border-border/40 pt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono text-[11px]">
                {currentCard.category || "Core Principle"}
              </span>
              <span className="text-primary text-[11px]">NEXORA Active Recall</span>
            </div>
          </div>

          {/* Prev / Next navigation */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              className="h-10 px-5 gap-2 border-border/60 hover:border-primary"
            >
              <ChevronLeft className="size-4" />
              <span>Previous</span>
            </Button>
            <Button
              size="sm"
              onClick={handleNext}
              className="h-10 px-6 gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold"
            >
              <span>Next Card</span>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
