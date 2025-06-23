import { bell } from "./bell.ts";

type NotifyOptions = {
  title: string;
  message: string;
  sound?: boolean;
};

export async function notify(
  { title, message, sound: withSound = false }: NotifyOptions,
): Promise<void> {
  const command = new Deno.Command("osascript", {
    args: ["-e", `display notification "${message}" with title "${title}"`],
  });
  const process = command.spawn();
  const status = await process.status;
  if (!status.success) {
    throw new Error(`Failed to send notification: ${status.code}`);
  }
  if (withSound) {
    await bell();
  }
}
