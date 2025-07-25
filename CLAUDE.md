# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Project Overview

This is a Raycast script commands repository using Deno as the runtime. Scripts are organized in a
monorepo structure under the `packages/` directory.

## Development Commands

Scripts are executed directly via Deno with required permissions:

```bash
# Run a script (example with translate.ts)
deno run --allow-net --allow-env --allow-run --env packages/translate/translate.ts

# Format code
deno task fmt

# Check formatting
deno task fmt:check

# Run linter
deno task lint

# Type check all scripts
deno task check

# Verify Raycast headers
deno task verify

# Run all CI checks locally
deno task ci

# Format, lint, and check before commit
deno task pre-commit
```

## Architecture

- **Structure**: Monorepo with individual script packages in `packages/`
- **Runtime**: Deno with TypeScript
- **Script Format**: Each script must include Raycast metadata header and proper shebang
- **Environment**: Scripts can use `.env` files for configuration (API keys, etc.)

## Raycast Script Requirements

Each script must start with:

```bash
#!/usr/bin/env deno run --allow-net --allow-env --allow-run --env
```

Followed by Raycast metadata:

```typescript
// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title [Script Title]
// @raycast.mode [compact|fullOutput|silent]
```

## Current Scripts

- **translate**: Translates text to English using Anthropic's Claude API, copies to clipboard

## CI/CD

GitHub Actions CI runs on all pushes to main and pull requests. The same checks can be run locally using deno tasks.
