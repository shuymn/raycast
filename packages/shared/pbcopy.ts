import { info } from "./log.ts";
import type { SpawnOptions } from "./spawn.ts";

export async function pbcopy(data: string, { signal }: SpawnOptions): Promise<void> {
  const proc = Bun.spawn(["pbcopy"], {
    stdin: "pipe",
    env: { ...process.env, LANG: "en_US.UTF-8" },
    signal,
  });

  const enc = new TextEncoder();
  proc.stdin.write(enc.encode(data));
  proc.stdin.flush(); // send buffered data
  proc.stdin.end(); // close the input stream

  const code = await proc.exited.catch(() => proc.exitCode ?? 1);

  if (code !== 0) {
    throw new Error(`pbcopy failed with code ${code}`);
  }

  info("Copied to clipboard");

  return;
}
