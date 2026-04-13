#!/usr/bin/env bash
# Sync version from package.json → extension manifests
# Run automatically via npm prepack to prevent version drift.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PKG_VERSION=$(node -p "require('$ROOT_DIR/package.json').version")
EXT_FILES=(
  "$ROOT_DIR/gemini-extension.json"
  "$ROOT_DIR/extensions/oh-my-gemini/gemini-extension.json"
)

for EXT_FILE in "${EXT_FILES[@]}"; do
  if [ ! -f "$EXT_FILE" ]; then
    echo "Skipping missing extension manifest: $EXT_FILE" >&2
    continue
  fi

  EXT_VERSION=$(node -p "require('$EXT_FILE').version")

  if [ "$PKG_VERSION" != "$EXT_VERSION" ]; then
    node -e "
      const fs = require('fs');
      const ext = JSON.parse(fs.readFileSync('$EXT_FILE', 'utf8'));
      ext.version = '$PKG_VERSION';
      fs.writeFileSync('$EXT_FILE', JSON.stringify(ext, null, 2) + '\n');
    "
    echo "Synced $(basename "$(dirname "$EXT_FILE")")/$(basename "$EXT_FILE") version: $EXT_VERSION → $PKG_VERSION" >&2
  else
    echo "$(basename "$(dirname "$EXT_FILE")")/$(basename "$EXT_FILE") version already in sync: $PKG_VERSION" >&2
  fi
done
