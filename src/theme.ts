import { Platform } from 'react-native';

/**
 * Palette sampled directly from the Figma frame
 * (FOCUS & PATTERNS INSIGHTS — node 1:141).
 */
export const colors = {
  rose: '#F43F5E',
  sky: '#00A9EF',
  amber: '#E7B20D',
  lime: '#A2E70D',
  purple: '#B943EF',

  desktop: '#0A0C0A',
  window: 'rgba(14,16,15,0.82)',
  windowSolid: '#0E100F',
  sidebar: 'rgba(9,11,10,0.55)',

  panel: 'rgba(255,255,255,0.028)',
  panelHead: 'rgba(255,255,255,0.045)',
  card: 'rgba(255,255,255,0.022)',
  cardHead: 'rgba(255,255,255,0.05)',
  raised: 'rgba(255,255,255,0.06)',

  hairline: 'rgba(255,255,255,0.08)',
  hairlineSoft: 'rgba(255,255,255,0.05)',

  text: '#F2F4F3',
  textDim: '#9AA0A0',
  textFaint: '#6E7474',
  track: '#1A1C1B',
} as const;

export const accents = [colors.rose, colors.sky, colors.amber, colors.lime, colors.purple];

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 } as const;
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 } as const;

/** SF Pro / Roboto-ish stack — matches the macOS type in the design. */
export const font = Platform.select({
  ios: { regular: 'System', medium: 'System', semibold: 'System' },
  default: { regular: 'sans-serif', medium: 'sans-serif-medium', semibold: 'sans-serif-medium' },
})!;

export const type = {
  title: { fontSize: 22, fontWeight: '700' as const, color: colors.text, letterSpacing: -0.3 },
  sectionLabel: { fontSize: 14, fontWeight: '400' as const, color: colors.textDim, letterSpacing: 0.1 },
  cardTitle: { fontSize: 14, fontWeight: '600' as const, color: colors.text, letterSpacing: -0.1 },
  body: { fontSize: 13, fontWeight: '400' as const, color: colors.text },
  bodyDim: { fontSize: 13, fontWeight: '400' as const, color: colors.textDim },
  strong: { fontSize: 14, fontWeight: '700' as const, color: colors.text, letterSpacing: -0.2 },
  meta: { fontSize: 12, fontWeight: '400' as const, color: colors.textFaint },
};

/** Motion vocabulary — one place so every surface animates with the same feel. */
export const motion = {
  soft: { damping: 18, stiffness: 140, mass: 0.9 },
  snappy: { damping: 20, stiffness: 260, mass: 0.7 },
  bouncy: { damping: 11, stiffness: 220, mass: 0.8 },
  press: { damping: 24, stiffness: 480, mass: 0.5 },
};
