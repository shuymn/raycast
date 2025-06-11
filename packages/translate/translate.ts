#!/usr/bin/env deno run --allow-net --allow-env --allow-run --env

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Translate
// @raycast.mode silent

// Optional parameters:
// @raycast.icon 🤖
// @raycast.argument1 { "type": "text", "placeholder": "Text to translate", "optional": false }
// @raycast.argument2 { "type": "text", "placeholder": "🇯🇵", "optional": true }

import Anthropic from "npm:@anthropic-ai/sdk@0.53.0";

const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });

async function pbcopy(data: string) {
  const command = new Deno.Command("pbcopy", { stdin: "piped" });
  const process = command.spawn();
  const writer = process.stdin.getWriter();
  await writer.write(new TextEncoder().encode(data));
  writer.releaseLock();
  await process.stdin.close();
  const result = await process.output();
  if (result.code !== 0) {
    throw new Error(`pbcopy failed with code ${result.code}`);
  }
  console.log("Copied to clipboard");
}

async function main() {
  const text = Deno.args[0];
  const inJapanese = Deno.args[1] !== "";

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 20000,
    temperature: 1,
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text":
              `You are a Technical Translation Expert specializing in converting programming and technical content from any language into clear, accurate English for AI coding assistants.

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
4. Natural English flow

<source_text>
${text}${inJapanese ? "。 日本語で返答しなさい。" : ""}
</source_text>`,
          },
        ],
      },
    ],
  });

  if (msg.content[0].type !== "text") {
    throw new Error("Unexpected response type: " + msg.content[0].type);
  }

  const translatedText = msg.content[0].text.trim();
  await pbcopy(translatedText);
}

main().catch((err) => {
  console.error(err.message);
  Deno.exit(1);
});
