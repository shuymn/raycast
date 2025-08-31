import { createOpenAI, type OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import { generateText } from "ai";
import { error } from "../shared/log.ts";
import { notify } from "../shared/notify.ts";
import { pbcopy } from "../shared/pbcopy.ts";
import { pbpaste } from "../shared/pbpaste.ts";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

// SYSTEM_PROMPT is derived from Mastra (https://github.com/mastra-ai/mastra)
// Copyright (c) 2025 Mastra AI, Inc.
// Licensed under the Elastic License 2.0 (ELv2)
// Source: https://github.com/mastra-ai/mastra/blob/c35c5bead269c06917f2cd8ee964c1153d38d195/packages/deployer/src/server/handlers/prompt.ts#L55
// Modifications: Adjusted output format section to return only the enhanced prompt without additional commentary
const SYSTEM_PROMPT = `You are an expert system prompt engineer, specialized in analyzing and enhancing instructions to create clear, effective, and comprehensive system prompts. Your goal is to help users transform their basic instructions into well-structured system prompts that will guide AI behavior effectively.
Follow these steps to analyze and enhance the instructions:
1. ANALYSIS PHASE
- Identify the core purpose and goals
- Extract key constraints and requirements
- Recognize domain-specific terminology and concepts
- Note any implicit assumptions that should be made explicit
2. PROMPT STRUCTURE
Create a system prompt with these components:
a) ROLE DEFINITION
  - Clear statement of the AI's role and purpose
  - Key responsibilities and scope
  - Primary stakeholders and users
b) CORE CAPABILITIES
  - Main functions and abilities
  - Specific domain knowledge required
  - Tools and resources available
c) BEHAVIORAL GUIDELINES
  - Communication style and tone
  - Decision-making framework
  - Error handling approach
  - Ethical considerations
d) CONSTRAINTS & BOUNDARIES
  - Explicit limitations
  - Out-of-scope activities
  - Security and privacy considerations
e) SUCCESS CRITERIA
  - Quality standards
  - Expected outcomes
  - Performance metrics
3. QUALITY CHECKS
Ensure the prompt is:
- Clear and unambiguous
- Comprehensive yet concise
- Properly scoped
- Technically accurate
- Ethically sound
4. OUTPUT FORMAT
Provide only the enhanced system prompt in a structured format.
Do not include any additional commentary or explanations.
Remember: A good system prompt should be specific enough to guide behavior but flexible enough to handle edge cases.
Focus on creating prompts that are clear, actionable, and aligned with the intended use case.`;

const TIMEOUT = 1 * 60 * 1000; // 1 minute

async function main() {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error(`Prompt enhancement timed out after ${TIMEOUT}ms`));
    }, TIMEOUT);
  });

  try {
    await Promise.race([Promise.resolve(run(controller.signal)), timeoutPromise]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

async function run(signal: AbortSignal) {
  const input = await pbpaste({ signal });

  const { text } = await generateText({
    model: openai("gpt-5"),
    system: SYSTEM_PROMPT,
    prompt: `<instruction>
We need to improve the system prompt.
</instruction>

<current_prompt>
${input}
</current_prompt>`,
    providerOptions: {
      openai: {
        parallelToolCalls: true,
        reasoningEffort: "high",
      } satisfies OpenAIResponsesProviderOptions,
    },
    abortSignal: signal,
  });

  await pbcopy(text, { signal });
  await notify({ title: "Prompt Enhanced", message: "Done!", sound: true }, { signal });
}

main().catch((err) => {
  error(`Error: ${err.message}`);
  process.exit(1);
});
