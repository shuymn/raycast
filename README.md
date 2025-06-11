# Raycast Scripts

A collection of personal Raycast script commands.

## Setup

1. Clone this repository
2. Install [Raycast](https://raycast.com/)
3. Add scripts to Raycast:
   - Open Raycast preferences
   - Navigate to Extensions → Script Commands
   - Add script directory or individual scripts

## Scripts

### Translate

Translates text to English using Claude AI for use with Claude Code.

**Setup:**

1. Copy `.env.example` to `.env` in the translate package
2. Add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

**Usage:**

- Select text in any application
- Run the translate command via Raycast
- Translated text is automatically copied to clipboard

## Requirements

- [Deno](https://deno.land/) runtime
- Raycast app
- API keys for respective services (see individual script documentation)

## Development

Scripts are organized in the `packages/` directory. Each script is a standalone Deno TypeScript file
with Raycast metadata headers.

### Available Commands

```bash
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

# Run all CI checks
deno task ci

# Pre-commit checks
deno task pre-commit
```

### Creating a New Script

1. Create a new directory under `packages/`
2. Add your TypeScript file with proper Raycast headers
3. Include necessary permissions in the shebang line
4. Add any required environment variables to `.env.example`

### CI/CD

This project uses GitHub Actions for continuous integration. All code must pass formatting, linting, type checking, and Raycast header verification before merging.
