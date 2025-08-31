#!/usr/bin/env bash
set -Eeu -o pipefail

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Prompt Enhancer
# @raycast.mode silent

# Optional parameters:
# @raycast.icon 🛠️

export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

bun run enhance-prompt.ts
