# NEXORA AI PRO MAX — One Intelligence. Infinite Possibilities.

NEXORA AI is an enterprise all-in-one AI platform engineered with production-ready server boundaries, structured academic scoring rubrics, multimodal vision OCR, developer tools, and cloud persistence.

---

## 1. System Architecture

- **Frontend Framework:** TanStack Start (SSR + Server Functions) with React 19, TypeScript, and Tailwind CSS v4.
- **Design System:** Synthetic Obsidian dark palette (`#0f131c` background, cyan `#4cd7f6` highlights, violet `#d0bcff` accents, glassmorphic cards).
- **Backend Boundaries:** All AI calls and provider secrets execute strictly within server functions (`createServerFn`) or dedicated server handlers in `src/server.ts`. Client bundles never receive raw credentials.
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS), supporting profiles, multi-turn conversation threads, messages, and persistent `ai_generations`.
- **Primary AI Provider:** Google Gemini API (`gemini-2.5-flash`, `gemini-1.5-pro`, `gemini-1.5-flash`) with structured output validation and multimodal vision.
- **Optional Secondary Providers:** OpenAI (`gpt-4o`), Anthropic (`claude-3-5-sonnet`), Tavily Search, and Judge0 Code Sandbox.

---

## 2. Flagship Studios & Features

### A. Study Intelligence

- **Exam Answer Writer:** University Model Solver Rubric Engine v4.2. Allows selecting 2, 3, 5, 8, 10, 15, or 20 marks, academic level, difficulty, subject, and format. Generates structured answers with definitions, numbered arguments, examples, diagram descriptions, and conclusions. Supports Markdown copy, PDF export, and `Ctrl+Enter` shortcut.
- **Interactive Quiz Generator:** Generates MCQs and True/False assessments with immediate scoring and pedagogical explanations.
- **Flashcard Engine:** Active recall flashcards with 3D flip card animations, shuffle, and mastery tracking.
- **AI Summarizer:** High-density executive summaries, key takeaways, and definition glossaries.

### B. AI Assistant & Vision

- **Cognitive Multi-turn Chat:** Thread management, model selection, code highlighting, and streaming response support.
- **Image Q&A & Vision OCR:** Drag-and-drop image upload (PNG, JPG, WebP) with Gemini Vision analysis for solving photographed questions, diagram comprehension, and text extraction.
- **Image Diffusion Studio:** Text-to-image studio with prompt enhancement and aspect ratio controls.

### C. Developer Hub

- **Code Helper & Debugger:** Pinpoints root-cause bugs, provides corrected code with defensive guards, and analyzes Big-O time and space complexity.
- **SQL Plan Studio:** Generates CTEs, window functions, and cross-dialect conversions across PostgreSQL, MySQL, SQLite, and Oracle.

### D. Writing & Career Studios

- **Polyglot Translator:** Context-aware translations preserving code blocks across 30+ languages.
- **Stylistic Paraphraser:** Academic, Formal, Simple, Professional, and Creative rewrite modes.
- **ATS Resume Builder:** Quantified Google XYZ metric resume builder tailored against target job descriptions.
- **Deep Web Research Lab:** Evidence-grounded synthesis with IEEE, APA, MLA, and Chicago citation formatting.

### E. Workspace Infrastructure

- **Mission Control Dashboard:** Tool matrix, system status, fast workflows, and provider latency indicators.
- **Cloud History:** Full search, filtering, and JSON export of past generations.
- **Settings & APIs:** Live provider health checks and default model preferences.
- **Admin Panel:** Telemetry, audit metrics, and API configuration inspection.

---

## 3. Getting Started

### Prerequisites

- Node.js 20+ (Node v22 recommended)
- npm or bun

### Installation

```bash
git clone <repository-url>
cd nexora-ai-hub
npm install
```

### Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Populate your Google Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

_(Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey))_

### Development Server

```bash
npm run dev
```

### Production Build & Preview

```bash
npm run build
npm run preview
```

### Running Test Suite

```bash
npm run test
```

---

## 4. API Configuration & Transparent Error Reporting

If an API key is not configured, NEXORA AI displays a prominent configuration banner with direct links to the relevant developer portal instead of crashing or generating fake data.
