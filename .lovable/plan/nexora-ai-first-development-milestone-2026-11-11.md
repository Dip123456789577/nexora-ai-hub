# NEXORA AI — First Development Milestone

## Build
- Apply the uploaded Stitch direction: dark, high-density workspace, violet/cyan signals, and compact structured tool panels.
- Create the signed-in application shell and dashboard with navigation to the five priority tools: AI Assistant, Exam Answer Writer, Image Q&A, Quiz Generator, and AI Summarizer.
- Add account creation/sign-in and profile setup; protect private pages and all saved data.
- Build Gemini-backed generation on the secure Lovable AI Gateway. Never expose credentials or return placeholder results. Use the current authenticated, zero-retention Gemini chat model; image Q&A validates and passes the actual image MIME type.
- Save separate AI Assistant conversations and their messages, and save outputs from the other tools for the signed-in user.

## Technical approach
- Keep the app on TanStack Start. Use a dedicated streaming server route for chat; use authenticated server functions for the one-shot tools and history operations.
- Add owner-scoped database policies and signup profile creation. Use the generated Cloud Auth middleware and preserve its bearer-token wiring.
- Use AI Elements for the streaming chat transcript and composer, plus the project's semantic design tokens for all styling.
- Verify build diagnostics, route tests, sign-in and database-backed thread flows where preview authentication is available, and the actual Gemini response before reporting success.

## Not included in this milestone
Image generation/editing, speech, web research, and the other studios from the full brief remain later phases; this milestone does not imply those integrations are operational.
