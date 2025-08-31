import { bell } from "./bell.ts";
import type { SpawnOptions } from "./spawn.ts";

type NotifyOptions = {
  title: string;
  message: string;
  sound?: boolean;
};

export async function notify(
  { title, message, sound: withSound = false }: NotifyOptions,
  { signal }: SpawnOptions,
): Promise<void> {
  const proc = Bun.spawn(["osascript", "-e", `display notification "${message}" with title "${title}"`], { signal });

  const code = await proc.exited.catch(() => proc.exitCode ?? 1);

  if (code !== 0) {
    throw new Error(`Failed to send notification: ${code}`);
  }

  if (withSound) {
    await bell({ signal });
  }

  return;
}
