import type { SpawnOptions } from "./spawn";

export async function pbpaste({ signal }: SpawnOptions): Promise<string> {
  const proc = Bun.spawn(["pbpaste"], {
    stdout: "pipe",
    env: { ...process.env, LANG: "en_US.UTF-8" },
    signal,
  });

  const stdoutPromise = proc.stdout ? new Response(proc.stdout).text() : Promise.resolve("");
  const text = await stdoutPromise;

  const exitCode = await proc.exited.catch(() => proc.exitCode ?? 1);

  if (exitCode !== 0) {
    throw new Error(`pbpaste failed with code ${exitCode}`);
  }

  return text;
}
