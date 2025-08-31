# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Project Overview

This is a Raycast script commands repository using Bun as the runtime. Scripts are organized in a
monorepo structure under the `packages/` directory.

## Development Commands

Scripts are executed directly via Bun:

```bash
# Run a script (example with translate.ts)
bun packages/translate/translate.ts "hello"

# Format code
bun run fmt

# Check formatting
bun run fmt:check

# Run linter
bun run lint

# Type check all scripts
bun run typecheck

# Verify Raycast headers
bun run verify

# Run all CI checks locally
bun run ci

# Format, lint, and check before commit
bun run pre-commit
```

## Architecture

- **Structure**: Monorepo with individual script packages in `packages/`
- **Runtime**: Bun with TypeScript
- **Script Format**: Each script must include Raycast metadata header and proper shebang
- **Environment**: Scripts can use `.env` files for configuration (API keys, etc.)

## Raycast Script Requirements

Each script must start with:

```bash
#!/usr/bin/env bun
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

GitHub Actions CI runs on all pushes to main and pull requests. The same checks can be run locally using Bun scripts.
