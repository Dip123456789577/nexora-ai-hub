export type AIProviderId = "gemini" | "openai" | "anthropic";

export interface ProviderConfigStatus {
  id: string;
  name: string;
  description: string;
  category: "text" | "vision" | "search" | "code-exec" | "database" | "storage";
  envVar: string;
  isConfigured: boolean;
  defaultModel: string;
  supportedModels: string[];
  docsUrl: string;
  statusMessage: string;
}

export interface AIResult<T = string> {
  success: boolean;
  data?: T | null | undefined;
  error?: string | undefined;
  provider: string;
  model: string;
  isConfigured: boolean;
  configGuide?:
    | {
        provider: string;
        envVar: string;
        docsUrl: string;
        message: string;
      }
    | undefined;
  durationMs?: number | undefined;
  metadata?: Record<string, string | number | boolean | null> | undefined;
}

export interface ExamAnswerInput {
  question: string;
  marks: 2 | 3 | 5 | 8 | 10 | 15 | 20;
  difficulty: "Foundation" | "Moderate" | "Advanced" | "Master";
  academicLevel: "School" | "High School" | "Undergraduate" | "Postgraduate";
  subject: string;
  language: string;
  format:
    "Standard Exam" | "Bulleted Key Points" | "Step-by-Step Technical" | "Thesis & Analytical";
  customInstructions?: string | undefined;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizInput {
  topic: string;
  questionCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
  type: "mcq" | "true-false";
}

export interface QuizResultData {
  title: string;
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
}

export interface FlashcardItem {
  id: number;
  front: string;
  back: string;
  category?: string | undefined;
}

export interface FlashcardInput {
  topic: string;
  cardCount: number;
  depth: "Core Concepts" | "Comprehensive Review" | "Advanced Nuance";
}

export interface FlashcardResultData {
  title: string;
  topic: string;
  cards: FlashcardItem[];
}

export interface SummarizeInput {
  text: string;
  length: "short" | "medium" | "long";
  format: "bullet-points" | "executive-summary" | "key-takeaways";
  includeDefinitions?: boolean | undefined;
}

export interface SummarizeResultData {
  summary: string;
  keyPoints: string[];
  definitions?: Array<{ term: string; definition: string }> | undefined;
  wordCountOriginal: number;
  wordCountSummary: number;
}

export interface TranslateInput {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string | undefined;
  tone?: "Formal" | "Conversational" | "Academic" | "Technical" | undefined;
}

export interface ParaphraseInput {
  text: string;
  mode: "Formal" | "Simple" | "Academic" | "Professional" | "Creative";
}

export interface GrammarInput {
  text: string;
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
  type: "spelling" | "grammar" | "punctuation" | "clarity";
}

export interface GrammarResultData {
  correctedText: string;
  corrections: GrammarCorrection[];
  score: number;
  summary: string;
}

export interface CodeHelperInput {
  task: string;
  language: string;
  code?: string | undefined;
  action: "generate" | "debug" | "explain" | "optimize" | "convert";
  targetLanguage?: string | undefined;
}

export interface CodeHelperResultData {
  code: string;
  language: string;
  explanation: string;
  complexity?:
    | {
        time?: string | undefined;
        space?: string | undefined;
      }
    | undefined;
  improvements?: string[] | undefined;
}

export interface SqlHelperInput {
  prompt: string;
  dialect: "PostgreSQL" | "MySQL" | "SQLite" | "Oracle";
  schema?: string | undefined;
  action: "generate" | "explain" | "optimize" | "convert";
  targetDialect?: "PostgreSQL" | "MySQL" | "SQLite" | "Oracle" | undefined;
}

export interface SqlHelperResultData {
  query: string;
  dialect: string;
  explanation: string;
  tablesReferenced?: string[] | undefined;
}

export interface ResumeInput {
  action: "build" | "analyze" | "cover-letter";
  role: string;
  experienceLevel: string;
  skills: string;
  summary?: string | undefined;
  jobDescription?: string | undefined;
  companyName?: string | undefined;
}

export interface ResearchInput {
  query: string;
  depth: "Quick Overview" | "Deep Literature Synthesis";
  citationStyle: "APA" | "MLA" | "IEEE" | "Chicago";
}

export interface ResearchResultData {
  title: string;
  executiveSummary: string;
  sections: Array<{ heading: string; content: string }>;
  citations: Array<{
    index: number;
    title: string;
    url?: string | undefined;
    author?: string | undefined;
    year?: string | undefined;
  }>;
  consensus: string;
}

export interface ImageQAInput {
  imageBase64: string;
  mimeType: string;
  question: string;
}

export interface ImageGenInput {
  prompt: string;
  style:
    "Photorealistic" | "Digital Art" | "Cyberpunk Obsidian" | "Cinematic 3D" | "Minimalist Vector";
  aspectRatio: "1:1" | "16:9" | "9:16" | "4:3";
}
