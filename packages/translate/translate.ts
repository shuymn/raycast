#!/usr/bin/env deno run --allow-net --allow-env --allow-run --env

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Translate
// @raycast.mode silent

// Optional parameters:
// @raycast.icon 🤖
// @raycast.argument1 { "type": "text", "placeholder": "Text to translate", "optional": false }

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
                            `You are an expert translator specializing in technical and programming-related content. Your task is to translate the following text into English. This translation will be used as a prompt for Claude Code, an AI coding assistant. Therefore, accuracy and preservation of technical meaning are crucial.

Here is the text to be translated:

<source_text>
${text}。日本語で返答しなさい。
</source_text>

Provide your translation. Follow these guidelines:

1. Translate the text into clear, natural English.
2. Preserve any technical terms or coding-related jargon in their original form if they are commonly used in English programming contexts.
3. Maintain the original formatting, including line breaks and paragraph structure.
4. Do not add any explanations, comments, or additional context beyond the direct translation.

Remember, your translation will be used directly as a prompt for a coding agent, so ensure it's suitable for immediate use in that context.

Begin your analysis and translation now.`,
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
