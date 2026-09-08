import React, { useEffect } from 'react';
import { Pressable, StyleProp, ViewStyle, PressableProps } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { motion } from '../theme';
import { useApp, useMotionScale } from '../state';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Staggered entrance. `trigger` re-runs the animation when it changes,
 * which is how the "Re-analyze" button replays the whole dashboard.
 */
export function Reveal({
  delay = 0,
  distance = 16,
  from = 'bottom',
  trigger = 0,
  style,
  children,
}: {
  delay?: number;
  distance?: number;
  from?: 'bottom' | 'left' | 'right' | 'scale';
  trigger?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const p = useSharedValue(0);
  const scale = useMotionScale();

  useEffect(() => {
    if (scale === 0) {
      p.value = 1;
      return;
    }
    p.value = 0;
    p.value = withDelay(delay * scale, withSpring(1, motion.soft));
  }, [delay, scale, trigger, p]);

  const a = useAnimatedStyle(() => {
    const o = interpolate(p.value, [0, 0.65], [0, 1], Extrapolation.CLAMP);
    const d = (1 - p.value) * distance;
    const t =
      from === 'bottom' ? [{ translateY: d }]
      : from === 'left' ? [{ translateX: -d }]
      : from === 'right' ? [{ translateX: d }]
      : [{ scale: interpolate(p.value, [0, 1], [0.92, 1]) }];
    return { opacity: o, transform: t as any };
  });

  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

/** Pressable that springs down on touch — used for every tappable surface. */
export function Squish({
  to = 0.97,
  lift = 0,
  style,
  children,
  onPress,
  haptic = 'light',
  ...rest
}: PressableProps & {
  to?: number;
  lift?: number;
  style?: StyleProp<ViewStyle>;
  haptic?: 'light' | 'medium' | 'success' | 'none';
  children: React.ReactNode;
}) {
  const s = useSharedValue(1);
  const { tap } = useApp();
  const a = useAnimatedStyle(() => ({
    transform: [{ scale: s.value }, { translateY: (1 - s.value) * -lift * 20 }],
  }));
  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        s.value = withSpring(to, motion.press);
        rest.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        s.value = withSpring(1, motion.bouncy);
        rest.onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic !== 'none') tap(haptic);
        onPress?.(e);
      }}
      style={[style, a]}
    >
      {children}
    </AnimatedPressable>
  );
}

/** Slow infinite float — used for the ambient wallpaper blobs. */
export function useDrift(durationMs: number, delayMs = 0) {
  const v = useSharedValue(0);
  const { settings } = useApp();
  useEffect(() => {
    if (settings.reduceMotion || !settings.ambient) {
      v.value = 0.5;
      return;
    }
    v.value = 0;
    v.value = withDelay(
      delayMs,
      withTiming(1, { duration: durationMs, easing: Easing.inOut(Easing.sin) }),
    );
    const id = setInterval(() => {
      v.value = withTiming(v.value > 0.5 ? 0 : 1, {
        duration: durationMs,
        easing: Easing.inOut(Easing.sin),
      });
    }, durationMs);
    return () => clearInterval(id);
  }, [durationMs, delayMs, settings.reduceMotion, settings.ambient, v]);
  return v;
}
