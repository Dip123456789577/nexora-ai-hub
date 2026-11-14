import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
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
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/productivity/tasks")({
  component: TaskManagerPage,
});

interface TaskItem {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  dueDate: string;
}

function TaskManagerPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [category, setCategory] = useState("Study");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("High");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("nexora_tasks") || "[]");
    if (stored.length > 0) {
      setTasks(stored);
    } else {
      const defaultTasks: TaskItem[] = [
        {
          id: "1",
          title: "Review 10-Mark Exam Answer on Quantum Annealing",
          category: "Study",
          priority: "High",
          completed: true,
          dueDate: "Today",
        },
        {
          id: "2",
          title: "Complete Distributed Systems Flashcard Deck",
          category: "Study",
          priority: "High",
          completed: false,
          dueDate: "Tomorrow",
        },
        {
          id: "3",
          title: "Optimize SQL CTE query for monthly retention",
          category: "Developer",
          priority: "Medium",
          completed: false,
          dueDate: "Nov 18",
        },
      ];
      setTasks(defaultTasks);
      localStorage.setItem("nexora_tasks", JSON.stringify(defaultTasks));
    }
  }, []);

  const saveTasks = (newTasks: TaskItem[]) => {
    setTasks(newTasks);
    localStorage.setItem("nexora_tasks", JSON.stringify(newTasks));
  };

  const handleAddTask = () => {
    if (!newTitle.trim()) {
      toast.error("Please enter a task description.");
      return;
    }

    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      category,
      priority,
      completed: false,
      dueDate: "Upcoming",
    };

    const updated = [newTask, ...tasks];
    saveTasks(updated);
    setNewTitle("");
    toast.success("Task added to productivity queue!");
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
    toast.info("Task removed.");
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30">
            <CheckSquare className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Productivity Queue & Milestones
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage study deadlines, algorithmic milestones, and research objectives
            </p>
          </div>
        </div>
      </div>

      {/* Add Task Bar */}
      <div className="rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-xl shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            placeholder="Add a new milestone, study goal, or assignment..."
            className="flex-1 bg-surface-container-lowest border-border/60 text-sm h-10"
          />

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-10 w-32 bg-surface-container-lowest border-border/60 text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Study">Study</SelectItem>
              <SelectItem value="Developer">Developer</SelectItem>
              <SelectItem value="Research">Research</SelectItem>
              <SelectItem value="Career">Career</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
            <SelectTrigger className="h-10 w-28 bg-surface-container-lowest border-border/60 text-xs font-mono">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleAddTask}
            className="h-10 gap-1.5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold px-4"
          >
            <Plus className="size-4" />
            <span>Add</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="h-8 text-xs"
          >
            All ({tasks.length})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
            className="h-8 text-xs"
          >
            Pending ({tasks.filter((t) => !t.completed).length})
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
            className="h-8 text-xs"
          >
            Completed ({tasks.filter((t) => t.completed).length})
          </Button>
        </div>

        <span className="text-xs font-mono text-muted-foreground">
          {Math.round((tasks.filter((t) => t.completed).length / (tasks.length || 1)) * 100)}%
          Complete
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-card/20 p-8 text-center text-xs text-muted-foreground">
            No milestones in this view.
          </div>
        ) : (
          filteredTasks.map((t) => (
            <div
              key={t.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                t.completed
                  ? "border-border/30 bg-surface-container/20 opacity-60"
                  : "border-border/50 bg-card/40 hover:bg-card"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTask(t.id)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.completed ? (
                    <CheckCircle2 className="size-5 text-emerald-400" />
                  ) : (
                    <Circle className="size-5" />
                  )}
                </button>
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-medium ${
                      t.completed ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {t.title}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground mt-0.5">
                    <span className="text-secondary">{t.category}</span>
                    <span>•</span>
                    <span
                      className={
                        t.priority === "High"
                          ? "text-red-400"
                          : t.priority === "Medium"
                            ? "text-amber-400"
                            : "text-muted-foreground"
                      }
                    >
                      {t.priority} Priority
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteTask(t.id)}
                className="text-muted-foreground hover:text-red-400 p-1.5 transition-colors"
                title="Delete task"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
