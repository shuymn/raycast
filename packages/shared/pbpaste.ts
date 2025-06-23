export async function pbpaste(): Promise<string> {
  const command = new Deno.Command("pbpaste", {
    stdout: "piped",
    env: { ...Deno.env.toObject(), LANG: "en_US.UTF-8" },
  });
  const process = command.spawn();
  const output = await process.output();
  return new TextDecoder().decode(output.stdout);
}
