#!/bin/bash
set -e

for script in packages/**/*.sh; do
  # Skip files in packages/shared directory
  if [[ "$script" == packages/shared/* ]]; then
    continue
  fi

  echo "Verifying $script"

  if ! grep -q '@raycast.schemaVersion' "$script"; then
    echo "Error: Missing @raycast.schemaVersion in $script"
    exit 1
  fi

  if ! grep -q '@raycast.title' "$script"; then
    echo "Error: Missing @raycast.title in $script"
    exit 1
  fi

  if ! grep -q '@raycast.mode' "$script"; then
    echo "Error: Missing @raycast.mode in $script"
    exit 1
  fi
done
