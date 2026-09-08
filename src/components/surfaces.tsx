import React, { useEffect, useRef, useState } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, type as t } from '../theme';
import { Icon, type IconName } from './Icon';

export const Hairline = ({ style }: { style?: StyleProp<ViewStyle> }) => (
  <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: colors.hairline }, style]} />
);

/** The big translucent group in the design ("Focus and Pattern Insights"). */
export function Panel({
  title,
  right,
  children,
  style,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[s.panel, style]}>
      <View style={s.panelHead}>
        <Text style={t.sectionLabel}>{title}</Text>
        <View style={{ flex: 1 }} />
        {right}
      </View>
      <Hairline />
      <View style={s.panelBody}>{children}</View>
    </View>
  );
}

/** A metric card: icon chip + title, hairline, then body. */
export function Card({
  icon,
  title,
  right,
  children,
  style,
  bodyStyle,
}: {
  icon: IconName;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  bodyStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[s.card, style]}>
      <View style={s.cardHead}>
        <View style={s.chip}>
          <Icon name={icon} size={14} color={colors.text} />
        </View>
        <Text style={t.cardTitle}>{title}</Text>
        <View style={{ flex: 1 }} />
        {right}
      </View>
      <Hairline />
      <View style={[s.cardBody, bodyStyle]}>{children}</View>
    </View>
  );
}

export const Swatch = ({ color, size = 10 }: { color: string; size?: number }) => (
  <View style={{ width: size, height: size, borderRadius: 2, backgroundColor: color }} />
);

/** Eased count-up used by the gauges, the donut centre and the stat rows. */
export function useCountUp(target: number, duration = 900, trigger: unknown = 0, enabled = true) {
  const [n, setN] = useState(enabled ? 0 : target);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (!enabled) {
      setN(target);
      return;
    }
    const start = Date.now();
    const tick = () => {
      const k = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setN(target * eased);
      if (k < 1) raf.current = requestAnimationFrame(tick);
    };
    setN(0);
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [target, duration, trigger, enabled]);
  return n;
}

const s = StyleSheet.create({
  panel: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.panel,
    overflow: 'hidden',
  },
  panelHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: colors.panelHead,
  },
  panelBody: { padding: 12, gap: 12 },
  card: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: colors.cardHead,
  },
  chip: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  cardBody: { padding: 14 },
});
