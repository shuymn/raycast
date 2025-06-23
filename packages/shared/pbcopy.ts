import { info } from "./log.ts";

export async function pbcopy(data: string): Promise<void> {
  const command = new Deno.Command("pbcopy", {
    stdin: "piped",
    env: { ...Deno.env.toObject(), LANG: "en_US.UTF-8" },
  });
  const process = command.spawn();
  const writer = process.stdin.getWriter();
  await writer.write(new TextEncoder().encode(data));
  writer.releaseLock();
  await process.stdin.close();
  const result = await process.output();
  if (result.code !== 0) {
    throw new Error(`pbcopy failed with code ${result.code}`);
  }
  info("Copied to clipboard");
}
