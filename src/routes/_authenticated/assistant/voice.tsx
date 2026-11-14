import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Loader2,
  RotateCcw,
  Bot,
  User,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { runCustomPromptFn } from "@/lib/ai/server-functions";
import { ApiConfigBanner } from "@/components/shared/api-config-banner";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/assistant/voice")({
  component: VoiceAssistantPage,
});

interface TranscriptMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: {
    [index: number]: SpeechRecognitionResultItem;
  };
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

interface WindowWithSpeech {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
}

function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<TranscriptMessage[]>([
    {
      id: "init",
      role: "assistant",
      text: "Voice interface active. Tap the microphone and speak naturally. I will process your voice in real-time and reply with synthesized speech.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [configError, setConfigError] = useState<{
    provider: string;
    envVar: string;
    docsUrl: string;
    message: string;
  } | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    // Initialize Web Speech API SpeechRecognition if available
    const win = window as unknown as WindowWithSpeech;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i]?.[0];
          if (item) {
            currentTranscript += item.transcript;
          }
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        setIsListening(false);
        if (event.error === "not-allowed") {
          toast.error("Microphone permission denied. Please allow microphone access in browser.");
        } else if (event.error !== "no-speech") {
          toast.error(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleListen = () => {
    if (!recognitionRef.current) {
      toast.error(
        "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.",
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (transcript.trim()) {
        processVoiceInput(transcript.trim());
      }
    } else {
      setTranscript("");
      try {
        recognitionRef.current.start();
        toast.info("Listening... Speak into your microphone.");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const processVoiceInput = async (spokenText: string) => {
    const userMsg: TranscriptMessage = {
      id: Date.now().toString(),
      role: "user",
      text: spokenText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);
    setConfigError(null);

    try {
      const res = await runCustomPromptFn({
        data: {
          prompt: spokenText,
          provider: "gemini",
          model: "gemini-2.5-flash",
          systemPrompt:
            "You are NEXORA Voice Cognitive Assistant. Respond with concise, conversational, high-intelligence voice-optimized prose. Avoid long markdown tables or excessive code blocks; speak clearly and decisively.",
        },
      });

      if (res.success && res.data) {
        const assistantMsg: TranscriptMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: res.data,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        speakText(res.data);
      } else {
        if (!res.isConfigured && res.configGuide) {
          setConfigError(res.configGuide);
          toast.error(res.error || "Gemini API key is not configured.");
        } else {
          toast.error(res.error || "Failed to synthesize voice response.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error processing voice command.");
    } finally {
      setIsProcessing(false);
      setTranscript("");
    }
  };

  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    // Clean markdown before speaking
    const cleanSpeech = text
      .replace(/[#*_`]/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      toast.info("Audio stopped.");
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <div className="flex size-9 items-center justify-center rounded-xl bg-secondary/15 text-secondary border border-secondary/30">
            <Radio className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Voice Assistant & Speech Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Speech-to-text input • Real-time neural reasoning • Synthesized voice output
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

      {/* Central Visualizer & Mic Trigger */}
      <div className="rounded-3xl border border-border/60 bg-gradient-to-b from-card/80 via-surface-container to-surface-container-high p-8 backdrop-blur-2xl shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
        {/* Pulsing Visualizer Circle */}
        <div className="relative flex items-center justify-center">
          {isListening && (
            <div className="absolute size-36 rounded-full bg-secondary/20 animate-ping" />
          )}
          {isSpeaking && (
            <div className="absolute size-36 rounded-full bg-primary/20 animate-pulse" />
          )}

          <button
            onClick={toggleListen}
            className={`relative z-10 flex size-24 items-center justify-center rounded-full border-2 transition-all duration-300 shadow-2xl ${
              isListening
                ? "border-secondary bg-secondary text-surface-container-lowest scale-110 shadow-secondary/40"
                : "border-border/70 bg-surface-container-high text-foreground hover:border-secondary hover:scale-105"
            }`}
          >
            {isListening ? (
              <Mic className="size-10 animate-bounce" />
            ) : (
              <MicOff className="size-10 text-muted-foreground" />
            )}
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">
            {isListening
              ? "Listening to your voice..."
              : isProcessing
                ? "NEXORA is synthesizing response..."
                : isSpeaking
                  ? "Speaking response..."
                  : "Tap to Speak with NEXORA"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {isListening
              ? "Tap again when you finish speaking"
              : "Uses native Web Speech API for low-latency recognition"}
          </p>
        </div>

        {/* Live Interim Transcript */}
        {transcript && (
          <div className="rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-2 text-xs font-mono text-secondary max-w-lg">
            "{transcript}"
          </div>
        )}

        {/* Voice control button */}
        {isSpeaking && (
          <Button
            variant="outline"
            size="sm"
            onClick={stopSpeaking}
            className="gap-1.5 border-border/60 text-xs text-muted-foreground hover:text-foreground"
          >
            <VolumeX className="size-3.5" />
            <span>Mute Speech Output</span>
          </Button>
        )}
      </div>

      {/* Transcript Conversation History */}
      <div className="rounded-2xl border border-border/60 bg-card/40 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <span className="text-xs font-bold text-foreground font-mono">
            Voice Conversation Transcript
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessages([])}
            className="h-6 text-[11px] text-muted-foreground hover:text-foreground"
          >
            Clear Transcript
          </Button>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-3 text-xs leading-relaxed ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div
                  className={`flex size-6 shrink-0 items-center justify-center rounded-lg ${
                    isUser ? "bg-primary/20 text-primary" : "bg-surface-container text-secondary"
                  }`}
                >
                  {isUser ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
                </div>
                <div
                  className={`rounded-xl p-3 max-w-md ${
                    isUser
                      ? "bg-primary text-primary-foreground font-medium"
                      : "bg-surface-container border border-border/40 text-foreground"
                  }`}
                >
                  <p>{m.text}</p>
                  <span className="mt-1 block text-[10px] opacity-60 text-right">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
