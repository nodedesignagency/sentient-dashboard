import type { ImageSourcePropType } from 'react-native';
import type { DockGlyphId } from './components/DockIcons';

/**
 * Real macOS icons, when they have been extracted from this machine.
 * Populated by `npm run icons:mac`; empty here so the repo bundles anywhere
 * and ships none of Apple's artwork.
 */
export const dockAssets: Partial<Record<DockGlyphId, ImageSourcePropType>> = {};
