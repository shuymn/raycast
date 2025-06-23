export function info(message: string): void {
  Deno.stdout.writeSync(new TextEncoder().encode(`${message}\n`));
}

export function error(message: string): void {
  Deno.stderr.writeSync(new TextEncoder().encode(`${message}\n`));
}
