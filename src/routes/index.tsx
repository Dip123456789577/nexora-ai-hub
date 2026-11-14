import { createFileRoute } from "@tanstack/react-router";
import nexoraMark from "@/assets/nexora-mark.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXORA AI — Your AI workspace" },
      {
        name: "description",
        content: "NEXORA AI is preparing a focused workspace for learning and creating with AI.",
      },
      { property: "og:title", content: "NEXORA AI — Your AI workspace" },
      {
        property: "og:description",
        content: "A focused workspace for learning and creating with AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center gap-3 px-6 py-6">
        <img className="size-10 object-contain" src={nexoraMark} alt="" />
        <span className="text-lg font-semibold">NEXORA</span>
        <span className="text-sm text-muted-foreground">AI workspace</span>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-24">
        <p className="mb-5 text-sm font-medium text-muted-foreground">
          GEMINI FIRST · BUILT FOR LEARNING AND CREATING
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl">
          A clearer way to think, learn, and make.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          Your NEXORA workspace is being prepared. The first release is focused on
          an AI assistant, exam answers, image questions, quizzes, and summaries.
        </p>
        <div className="mt-12 flex items-center gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
          <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
          First milestone in progress
        </div>
      </section>
    </main>
  );
}