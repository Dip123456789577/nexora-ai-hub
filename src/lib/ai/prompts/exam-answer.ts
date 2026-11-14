import type { ExamAnswerInput } from "../types";

export function buildExamAnswerPrompt(input: ExamAnswerInput): {
  systemPrompt: string;
  userPrompt: string;
} {
  const marksGuideline: Record<number, string> = {
    2: "Concise 2-mark answer: Provide an exact academic definition followed by 2 distinct, high-impact key points. Total length ~80-120 words.",
    3: "Focused 3-mark answer: Formal definition, 3 concise numbered analytical points with brief rationale, and a quick real-world example. Total length ~150-200 words.",
    5: "Standard 5-mark answer: Formal introductory context, rigorous definition, 4-5 numbered explanatory sections, relevant example/case study, and a crisp concluding summary. Total length ~300-450 words.",
    8: "Detailed 8-mark answer: Executive academic introduction, formal terminology, 6 in-depth numbered points with technical reasoning, concrete application examples, a clear ASCII/Mermaid or structural diagram description, and comprehensive evaluation. Total length ~500-700 words.",
    10: "Comprehensive 10-mark essay: University examination standard. Complete introduction, core theoretical foundation, 7-8 structured sections with sub-points, deep comparative analysis, concrete domain examples, ASCII/Mermaid architectural diagram, critical advantages/limitations, and synthesis conclusion. Total length ~700-1000 words.",
    15: "Major 15-mark thesis: Postgraduate examination standard. Exhaustive conceptual treatise with historical/theoretical context, mathematical/structural formulations where relevant, 10+ granular technical explanations, edge cases, diagrammatic representation, and forward-looking scholarly conclusion. Total length ~1200-1600 words.",
    20: "Exhaustive 20-mark capstone: Full academic paper / dissertation rubric standard. Comprehensive abstract, foundational doctrine, multi-faceted taxonomy, 12+ rigorously argued analytical dimensions, comprehensive case studies, detailed ASCII/diagrammatic architectural schemas, error analysis/trade-offs, and decisive conclusion. Total length ~1800-2500 words.",
  };

  const markSpecifics = marksGuideline[input.marks] || marksGuideline[10];

  const systemPrompt = `You are NEXORA University Rubric Engine v4.2, a world-class academic evaluator and university professor across STEM, Humanities, Law, Medicine, and Social Sciences.
Your role is to produce exceptional, university-grade, high-scoring examination answers tailored with rigorous academic precision.

Formatting standard:
1. Always use clean GitHub Flavored Markdown.
2. Structure the answer logically based on the target marks:
   - ## 1. Executive Definition & Core Purpose
   - ## 2. Theoretical Framework & Principles
   - ## 3. Detailed Technical Analysis (Numbered points with bold titles)
   - ## 4. Practical Domain Examples & Case Illustration
   - ## 5. Architectural / Concept Diagram (Render as clean ASCII art or Markdown table or Mermaid diagram)
   - ## 6. Critical Evaluation & Trade-offs (if >= 8 marks)
   - ## 7. Concluding Academic Synthesis
3. Ensure the depth, breadth, and vocabulary perfectly match the requested academic level (${input.academicLevel}) and difficulty (${input.difficulty}).
4. Answer in the requested language: ${input.language}.`;

  const userPrompt = `SUBJECT: ${input.subject}
ACADEMIC LEVEL: ${input.academicLevel}
TARGET MARKS: ${input.marks} marks (${markSpecifics})
DIFFICULTY LEVEL: ${input.difficulty}
ANSWER FORMAT: ${input.format}
LANGUAGE: ${input.language}

EXAMINATION QUESTION:
"${input.question}"

${input.customInstructions ? `ADDITIONAL RUBRIC REQUIREMENTS:\n${input.customInstructions}\n` : ""}

Generate the complete, structured, high-scoring examination answer now.`;

  return { systemPrompt, userPrompt };
}
