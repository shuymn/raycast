#!/bin/bash
set -e

for script in packages/**/*.ts; do
  echo "Checking $script"
  deno check "$script"
done