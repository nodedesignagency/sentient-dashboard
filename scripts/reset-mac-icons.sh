#!/usr/bin/env bash
# Drop the extracted Apple icons and go back to the drawn set.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
rm -f "$ROOT"/assets/dock/*.png
cat > "$ROOT/src/dockAssets.ts" <<'TS'
import type { ImageSourcePropType } from 'react-native';
import type { DockGlyphId } from './components/DockIcons';

/**
 * Real macOS icons, when they have been extracted from this machine.
 * Populated by `npm run icons:mac`; empty here so the repo bundles anywhere
 * and ships none of Apple's artwork.
 */
export const dockAssets: Partial<Record<DockGlyphId, ImageSourcePropType>> = {};
TS
echo "Reset to the drawn icon set. Restart with: npm start -- --clear"
