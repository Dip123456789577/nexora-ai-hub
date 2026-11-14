import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  MessageSquare,
  Send,
  Loader2,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Bot,
  User,
  Paperclip,
  Image as ImageIcon,
  RotateCcw,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiConfigBanner } from "@/components/shared/api-config-banner";
import { runCustomPromptFn } from "@/lib/ai/server-functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/assistant/chat")({
  component: AIChat,
});

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  image?: string;
}

function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I am **NEXORA AI**, your high-performance cognitive assistant. How can I assist you with your research, calculations, code development, or study analysis today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [provider, setProvider] = useState("gemini");
  const [isLoading, setIsLoading] = useState(false);
  const [configError, setConfigError] = useState<{
    provider: string;
    envVar: string;
    docsUrl: string;
    message: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setConfigError(null);

    try {
      const res = await runCustomPromptFn({
        data: {
          prompt: userText,
          provider,
          model,
          systemPrompt:
            "You are NEXORA AI Pro Max, an ultra-intelligent, precise, and articulate AI assistant. Answer with clear markdown, rigorous analysis, code syntax highlighting, and authoritative reasoning.",
        },
      });

      if (res.success && res.data) {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: res.data,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        if (!res.isConfigured && res.configGuide) {
          setConfigError(res.configGuide);
          toast.error(res.error || "AI Provider is not configured.");
        } else {
          toast.error(res.error || "Failed to receive model response.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error in chat communication.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Message copied!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Conversation reset. What would you like to explore next?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    toast.info("Conversation cleared.");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] space-y-4">
      {/* Top Header & Model Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30">
            <MessageSquare className="size-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              AI Cognitive Assistant
            </h1>
            <p className="text-xs text-muted-foreground">
              Multi-turn reasoning • Code synthesis • Knowledge grounding
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={model}
            onValueChange={(v) => {
              setModel(v);
              if (v.startsWith("gemini")) setProvider("gemini");
              if (v.startsWith("gpt")) setProvider("openai");
              if (v.startsWith("claude")) setProvider("anthropic");
            }}
          >
            <SelectTrigger className="h-8 w-48 bg-surface-container-lowest border-border/60 text-xs font-mono">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash (Primary)</SelectItem>
              <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
              <SelectItem value="gpt-4o">OpenAI GPT-4o</SelectItem>
              <SelectItem value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="h-8 gap-1.5 border-border/60 text-xs text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="size-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>

      {/* Missing Key Banner */}
      {configError && (
        <ApiConfigBanner
          providerName={configError.provider}
          envVar={configError.envVar}
          docsUrl={configError.docsUrl}
          message={configError.message}
        />
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-border/50 bg-card/40 p-4 md:p-6 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-xl border ${
                  isUser
                    ? "bg-primary/20 border-primary/30 text-primary"
                    : "bg-surface-container-high border-border/60 text-secondary"
                }`}
              >
                {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
              </div>

              <div
                className={`group relative rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? "bg-primary text-primary-foreground font-medium rounded-tr-sm"
                    : "bg-surface-container border border-border/50 text-foreground rounded-tl-sm"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                <div
                  className={`mt-2 flex items-center justify-between text-[10px] font-mono opacity-60 ${
                    isUser ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground"
                      title="Copy response"
                    >
                      {copiedId === m.id ? (
                        <Check className="size-3 text-emerald-400" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-surface-container-high border border-border/60 text-secondary">
              <Bot className="size-4 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-surface-container border border-border/50 px-4 py-3 text-xs text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-secondary" />
              <span>NEXORA is synthesizing response...</span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input Box */}
      <div className="relative rounded-2xl border border-border/60 bg-surface-container/70 p-2 shadow-lg backdrop-blur-xl">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask anything, paste complex code, or analyze equations... (Press Enter to send, Shift+Enter for newline)"
          className="min-h-[60px] max-h-[160px] resize-none border-0 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
        />

        <div className="flex items-center justify-between px-2 pt-1 border-t border-border/30">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="flex size-2 rounded-full bg-secondary" />
            <span className="font-mono text-[11px]">{model}</span>
          </div>

          <Button
            size="sm"
            disabled={isLoading || !input.trim()}
            onClick={handleSend}
            className="h-8 gap-1.5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold shadow-sm"
          >
            <Send className="size-3.5" />
            <span>Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
