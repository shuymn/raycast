export async function bell(): Promise<void> {
  const command = new Deno.Command("afplay", { args: ["/System/Library/Sounds/Hero.aiff"] });
  const process = command.spawn();
  const status = await process.status;
  if (!status.success) {
    throw new Error(`Failed to play sound: ${status.code}`);
  }
}
