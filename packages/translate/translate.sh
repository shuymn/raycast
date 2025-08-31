#!/usr/bin/env bash
set -Eeu -o pipefail

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Translate
# @raycast.mode silent

# Optional parameters:
# @raycast.icon 📜
# @raycast.argument1 { "type": "text", "placeholder": "Text to translate", "optional": false }

export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

bun run translate.ts "$1"
