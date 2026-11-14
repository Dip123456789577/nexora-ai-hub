import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Lock, Mail, Sparkles, ArrowRight, Shield, Loader2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import nexoraMark from "@/assets/nexora-mark.png";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: name || email.split("@")[0],
            },
          },
        });
        if (error) throw error;
        toast.success("Account created successfully! Welcome to NEXORA.");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Signed in successfully! Launching workspace.");
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    toast.success("Entering NEXORA Workspace in Guest Operator Mode.");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 selection:bg-primary/20 selection:text-primary relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 size-96 rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2">
            <img src={nexoraMark} alt="NEXORA" className="size-10 object-contain" />
            <span className="text-2xl font-black tracking-tight text-foreground">NEXORA AI</span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {isSignUp ? "Create your Workspace Account" : "Sign in to Mission Control"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {isSignUp
              ? "Join NEXORA AI to persist cloud history and cross-model workflows"
              : "Enter your credentials or launch in Guest Workspace mode"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Display Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Vance"
                  className="bg-surface-container-lowest border-border/60 text-sm h-10"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@nexora.ai"
                  required
                  className="pl-9 bg-surface-container-lowest border-border/60 text-sm h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="pl-9 bg-surface-container-lowest border-border/60 text-sm h-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold shadow-md shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? "Create Workspace Account" : "Sign In"}</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          {/* Guest Mode Direct Access */}
          <div className="relative border-t border-border/40 pt-4 text-center">
            <span className="absolute top-0 -translate-y-1/2 bg-card px-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground left-1/2 -translate-x-1/2">
              or instant evaluation
            </span>
            <Button
              variant="outline"
              onClick={handleGuestAccess}
              className="w-full h-10 gap-2 border-border/60 hover:border-secondary hover:text-secondary text-xs font-medium"
            >
              <UserCheck className="size-4 text-secondary" />
              <span>Launch Workspace as Guest</span>
            </Button>
          </div>

          {/* Toggle between In / Up */}
          <div className="text-center pt-2">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account yet? Create one"}
            </button>
          </div>
        </div>

        {/* Security footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-muted-foreground">
          <Shield className="size-3.5 text-secondary" />
          <span>Protected by Supabase Authentication & RLS</span>
        </div>
      </div>
    </div>
  );
}
