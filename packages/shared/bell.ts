import type { SpawnOptions } from "./spawn.ts";

export async function bell({ signal }: SpawnOptions): Promise<void> {
  const proc = Bun.spawn(["afplay", "/System/Library/Sounds/Hero.aiff"], { signal });

  const code = await proc.exited.catch(() => proc.exitCode ?? 1);

  if (code !== 0) {
    throw new Error(`Failed to play sound: ${code}`);
  }

  return;
}
