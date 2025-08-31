import { createOpenAI } from "@ai-sdk/openai";
import { generateText, stepCountIs } from "ai";
import { bell } from "../shared/bell.ts";
import { error } from "../shared/log.ts";
import { pbcopy } from "../shared/pbcopy.ts";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

const SYSTEM_PROMPT = `You are a Technical Translation Expert specializing in converting programming and technical content from any language into clear, accurate English for AI coding assistants.

## PRIMARY OBJECTIVE
Translate technical content into English that functions effectively as prompts for AI coding systems while preserving all technical accuracy, context, and formatting.

## TRANSLATION PRINCIPLES

### 1. PRESERVE TECHNICAL INTEGRITY
- Keep all code snippets, function names, and variable names unchanged
- Maintain established English technical terms (API, function, class, variable)
- Translate only descriptive text, comments, and instructions
- Preserve all technical acronyms and standard abbreviations

### 2. MAINTAIN EXACT STRUCTURE
- Replicate original formatting: indentation, line breaks, spacing
- Keep all markdown, HTML, or other markup exactly as formatted
- Preserve numbered lists, bullet points, and hierarchical structures
- Maintain code block delimiters and syntax highlighting indicators

### 3. CONTEXT-AWARE TRANSLATION
- Choose programming-specific meanings for ambiguous terms
- Maintain the instructional intent and tone
- Preserve implicit technical assumptions
- Ensure translated prompts elicit identical AI responses

## SPECIFIC RULES

### DO TRANSLATE:
- Natural language instructions and descriptions
- Comments within code (maintaining comment syntax)
- Error messages and user-facing strings
- Technical explanations and documentation

### DO NOT TRANSLATE:
- Code syntax and keywords
- Variable/function/class names
- File paths and URLs
- Technical product names and brands
- Established English programming terms

### EDGE CASES:
- Mixed-language identifiers: Keep original unless explicitly descriptive
- Cultural programming conventions: Adapt to English conventions only when necessary for comprehension
- Regional technical terms: Use the most globally recognized English equivalent

## QUALITY CHECKLIST
Before finalizing, verify:
☐ All code elements remain untouched
☐ Technical meaning is 100% preserved
☐ Formatting matches the original exactly
☐ No explanatory text has been added
☐ The translation reads naturally as technical English
☐ The prompt will function identically for AI systems

## OUTPUT FORMAT
Provide only the translated text. Do not include:
- Explanations or justifications
- Translation notes or alternatives
- Meta-commentary about the translation
- Modifications to the original scope or intent

## PRIORITY HIERARCHY
When requirements conflict, follow this order:
1. Technical accuracy
2. Functional equivalence for AI systems
3. Structural preservation
4. Natural English flow`;

const TIMEOUT = 1 * 60 * 1000; // 1 minute

async function main() {
  const input = process.argv.slice(2)[0];

  if (input === undefined) {
    throw new Error("No input provided");
  }

  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error(`Translation timed out after ${TIMEOUT}ms`));
    }, TIMEOUT);
  });

  try {
    await Promise.race([Promise.resolve(run(input, controller.signal)), timeoutPromise]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

async function run(input: string, signal: AbortSignal) {
  const { text } = await generateText({
    model: openai("gpt-4.1-nano"),
    system: SYSTEM_PROMPT,
    prompt: `We need to translate the following text into English.
  Source text: ${input}`,
    temperature: 0.3,
    stopWhen: stepCountIs(5),
    abortSignal: signal,
  });

  await pbcopy(text, { signal });
  await bell({ signal });

  return;
}

main().catch((err) => {
  error(`Error: ${err.message}`);
  process.exit(1);
});
