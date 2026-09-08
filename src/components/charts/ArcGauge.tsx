import React, { useEffect } from 'react';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme';
import { useMotionScale } from '../../state';
import { arcLength, arcPath } from './geometry';

const APath = Animated.createAnimatedComponent(Path);

export type Ring = { id: string; value: number; color: string };

/**
 * Three concentric half-gauges (Peak Focus Times).
 * Each ring sweeps in from the left with a staggered delay; selecting a
 * ring thickens it and dims the others.
 */
export function ArcGauge({
  rings,
  size = 260,
  selected,
  trigger = 0,
}: {
  rings: Ring[];
  size?: number;
  selected: string | null;
  trigger?: number;
}) {
  const stroke = size * 0.045;
  const gap = stroke * 1.6;
  const cx = size / 2;
  const outer = size / 2 - stroke / 2;
  const cy = outer + stroke / 2;
  const height = outer + stroke + 2;

  return (
    <Svg width={size} height={height} viewBox={`0 0 ${size} ${height}`}>
      {rings.map((ring, i) => {
        const r = outer - i * gap;
        return (
          <RingArc
            key={ring.id}
            cx={cx}
            cy={cy}
            r={r}
            stroke={stroke}
            color={ring.color}
            progress={ring.value / 100}
            delay={160 + i * 130}
            trigger={trigger}
            state={selected == null ? 'idle' : selected === ring.id ? 'on' : 'off'}
          />
        );
      })}
    </Svg>
  );
}

function RingArc({
  cx, cy, r, stroke, color, progress, delay, trigger, state,
}: {
  cx: number; cy: number; r: number; stroke: number; color: string;
  progress: number; delay: number; trigger: number; state: 'idle' | 'on' | 'off';
}) {
  const full = arcPath(cx, cy, r, -90, 90);
  const L = arcLength(r, 180);
  const p = useSharedValue(0);
  const emphasis = useSharedValue(0);
  const scale = useMotionScale();

  useEffect(() => {
    if (scale === 0) {
      p.value = progress;
      return;
    }
    p.value = 0;
    p.value = withDelay(
      delay * scale,
      withTiming(progress, { duration: 1150 * scale, easing: Easing.out(Easing.cubic) }),
    );
  }, [progress, delay, trigger, scale, p]);

  useEffect(() => {
    emphasis.value = withTiming(state === 'on' ? 1 : state === 'off' ? -1 : 0, { duration: 260 });
  }, [state, emphasis]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: L * (1 - p.value),
    strokeWidth: stroke * (1 + Math.max(0, emphasis.value) * 0.42),
    opacity: 1 + Math.min(0, emphasis.value) * 0.72,
  }));

  const glowProps = useAnimatedProps(() => ({
    strokeDashoffset: L * (1 - p.value),
    opacity: Math.max(0, emphasis.value) * 0.28,
  }));

  return (
    <>
      <Path d={full} stroke={colors.track} strokeWidth={stroke} strokeLinecap="round" fill="none" />
      <APath
        d={full}
        stroke={color}
        strokeWidth={stroke * 2.4}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${L} ${L}`}
        animatedProps={glowProps}
      />
      <APath
        d={full}
        stroke={color}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${L} ${L}`}
        animatedProps={animatedProps}
      />
    </>
  );
}
