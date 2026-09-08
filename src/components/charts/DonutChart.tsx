import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme';
import { useApp, useMotionScale } from '../../state';
import { arcLength, arcPath } from './geometry';
import { useCountUp } from '../surfaces';
import type { Slice } from '../../data';

const APath = Animated.createAnimatedComponent(Path);

/**
 * Project Focus Distribution.
 * Segments draw on in sequence; tapping one lifts it out of the ring and
 * writes its share into the middle. The whole ring breathes very slowly.
 */
export function DonutChart({
  slices,
  size = 190,
  selected,
  trigger = 0,
  startAngle,
}: {
  slices: Slice[];
  size?: number;
  selected: string | null;
  trigger?: number;
  /** where the first slice begins, degrees from 12 o'clock */
  startAngle?: number;
}) {
  const stroke = size * 0.108;
  const r = size / 2 - stroke / 2 - 1;
  const c = size / 2;
  const total = slices.reduce((a, s) => a + s.value, 0);
  const gapDeg = 4.2;
  const begin = startAngle ?? -(slices[0].value / total) * 360;

  const scale = useMotionScale();
  const breathe = useSharedValue(0);
  useEffect(() => {
    if (scale === 0) {
      breathe.value = 0;
      return;
    }
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 5200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [scale, breathe]);

  const spin = useAnimatedStyle(() => ({
    transform: [{ rotate: `${(breathe.value - 0.5) * 3}deg` }, { scale: 1 + breathe.value * 0.012 }],
  }));

  const active = slices.find((s) => s.id === selected) ?? null;
  const last = React.useRef(active);
  if (active) last.current = active;
  const shown = active ?? last.current;
  const pct = useCountUp(shown?.value ?? 0, 620, `${shown?.id}-${trigger}`, scale !== 0);

  const reveal = useSharedValue(0);
  useEffect(() => {
    reveal.value = withTiming(active ? 1 : 0, { duration: 220 });
  }, [active, reveal]);
  const centreStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ scale: 0.86 + reveal.value * 0.14 }],
  }));

  let cursor = begin;
  return (
    <View style={{ width: size, height: size }}>
      <Animated.View style={[StyleSheet.absoluteFill, spin]}>
        <Svg width={size} height={size}>
          {slices.map((sl, i) => {
            const span = (sl.value / total) * 360;
            const a0 = cursor + gapDeg / 2;
            const a1 = cursor + span - gapDeg / 2;
            cursor += span;
            return (
              <Segment
                key={sl.id}
                cx={c}
                cy={c}
                r={r}
                a0={a0}
                a1={a1}
                stroke={stroke}
                color={sl.color}
                delay={220 + i * 130}
                trigger={trigger}
                state={selected == null ? 'idle' : selected === sl.id ? 'on' : 'off'}
              />
            );
          })}
        </Svg>
      </Animated.View>

      <Animated.View pointerEvents="none" style={[s.center, centreStyle]}>
        <Text style={[s.pct, { color: shown?.color ?? colors.text }]}>{Math.round(pct)}%</Text>
        <Text numberOfLines={2} style={s.label}>
          {shown?.label ?? ''}
        </Text>
      </Animated.View>
    </View>
  );
}

function Segment({
  cx, cy, r, a0, a1, stroke, color, delay, trigger, state,
}: {
  cx: number; cy: number; r: number; a0: number; a1: number; stroke: number;
  color: string; delay: number; trigger: number; state: 'idle' | 'on' | 'off';
}) {
  const d = arcPath(cx, cy, r, a0, a1);
  const L = arcLength(r, a1 - a0);
  const p = useSharedValue(0);
  const emphasis = useSharedValue(0);
  const scale = useMotionScale();

  useEffect(() => {
    if (scale === 0) {
      p.value = 1;
      return;
    }
    p.value = 0;
    p.value = withDelay(
      delay * scale,
      withTiming(1, { duration: 780 * scale, easing: Easing.out(Easing.cubic) }),
    );
  }, [delay, trigger, scale, p]);

  useEffect(() => {
    emphasis.value = withTiming(state === 'on' ? 1 : state === 'off' ? -1 : 0, { duration: 240 });
  }, [state, emphasis]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: L * (1 - p.value),
    strokeWidth: stroke * (1 + Math.max(0, emphasis.value) * 0.34),
    opacity: 1 + Math.min(0, emphasis.value) * 0.7,
  }));

  const glowProps = useAnimatedProps(() => ({
    strokeDashoffset: L * (1 - p.value),
    opacity: Math.max(0, emphasis.value) * 0.3,
  }));

  return (
    <>
      <APath
        d={d}
        stroke={color}
        strokeWidth={stroke * 2.1}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${L} ${L}`}
        animatedProps={glowProps}
      />
      <APath
        d={d}
        stroke={color}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${L} ${L}`}
        animatedProps={animatedProps}
      />
    </>
  );
}

const s = StyleSheet.create({
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 26 },
  pct: { fontSize: 26, fontWeight: '700', letterSpacing: -0.6 },
  label: { fontSize: 10.5, color: colors.textFaint, textAlign: 'center', marginTop: 2 },
});
