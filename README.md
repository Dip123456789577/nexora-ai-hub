# Nexora AI Hub

2. API connection plan

This is the important part. These are the services you'll need to configure.

Provider

What it powers

Google Gemini

Chat, exam answers, coding, writing, image understanding

Supabase

Login, database, history, storage

OpenAI

Optional alternative AI models

Anthropic

Optional Claude models

Image generation API

Generate and edit images

Web search API

Live research and citations

Speech API

Voice features                                                                                                                                                                                                                                                                                                                                Important: Each service needs its own credentials. Gemini alone cannot automatically provide every capability, such as image generation, isolated code execution or live web search.

3. What you should do first in Lovable

Open Lovable.

Start a new project named NEXORA AI.

Attach the three Stitch design references, preferably the extracted screenshots and DESIGN.md.

Paste the master prompt.

Connect Supabase when Lovable requests it.

Implement the project phase by phase and test each API integration.

4. One important suggestion

Don't try to launch 30+ AI tools with unconfigured APIs. First get these five working perfectly:

Your first development milestone

Priority 1

AI Assistant — Gemini API

Exam Answer Writer — Gemini API

Image Q&A — Gemini Vision

Quiz Generator — Gemini API

AI Summarizer — Gemini API

Then add authentication, persistent history and the remaining tools.

One question before we start the actual implementation: Do you want to use Google Gemini as your main AI provider, with other AI providers as optional additions?

That will help me prepare the exact API setup and backend architecture without wasting your time or API credits.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3ae6f8b7-8894-4961-b947-3f43953bc661).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
