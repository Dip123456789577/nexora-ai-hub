import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  FileQuestion,
  MessageSquare,
  BrainCircuit,
  Layers,
  FileText,
  Code2,
  Database,
  Languages,
  PenTool,
  Briefcase,
  Search,
  Image,
  Sparkles,
  Settings,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";

interface CommandMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandMenu({ open, setOpen }: CommandMenuProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search any AI tool, action, or document..." />
      <CommandList>
        <CommandEmpty>No matching tool or action found.</CommandEmpty>

        <CommandGroup heading="Study Intelligence">
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/study/exam-answer" }))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <FileQuestion className="size-4 text-secondary" />
            <span>Exam Answer Writer (2-20 Marks Rubric)</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/study/quiz" }))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <BrainCircuit className="size-4 text-primary" />
            <span>Interactive Quiz Generator</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/study/flashcards" }))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Layers className="size-4 text-secondary" />
            <span>Flashcard Engine</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/study/summarizer" }))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <FileText className="size-4 text-primary" />
            <span>AI Summarizer & Executive Brief</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="AI Assistant & Vision">
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/assistant/chat" }))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="size-4 text-secondary" />
            <span>AI Chat (Streaming Multi-turn)</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/assistant/image-qa" }))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Image className="size-4 text-primary" />
            <span>Image Q&A & Vision OCR</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/assistant/image-generator" }))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="size-4 text-secondary" />
            <span>Image Generator Studio</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Developer Hub">
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/developer/debugger" }))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Code2 className="size-4 text-secondary" />
            <span>Code Helper & Debugger</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/developer/sql" }))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Database className="size-4 text-primary" />
            <span>SQL Assistant & Query Optimizer</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Writing & Career">
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/writing/translate" }))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Languages className="size-4 text-secondary" />
            <span>Polyglot Translator (30+ Languages)</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/writing/paraphrase" }))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <PenTool className="size-4 text-primary" />
            <span>Paraphraser & Stylistic Rewriter</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/career/resume-builder" }))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Briefcase className="size-4 text-secondary" />
            <span>ATS Resume Builder</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/research/web" }))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Search className="size-4 text-primary" />
            <span>Live Web Research Lab</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="System & Workspace">
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/dashboard" }))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="size-4 text-muted-foreground" />
            <span>Mission Control Dashboard</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/settings" }))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Settings className="size-4 text-muted-foreground" />
            <span>Settings & API Configuration</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate({ to: "/admin" }))}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="size-4 text-secondary" />
            <span>Admin Health Panel</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
