import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, motion } from '../theme';
import { Icon, type IconName } from './Icon';
import { Squish } from './motion';
import { useApp, useMotionScale, type TabKey } from '../state';

const NAV: Array<{ key: TabKey; icon: IconName }> = [
  { key: 'home', icon: 'home' },
  { key: 'chat', icon: 'chat' },
  { key: 'settings', icon: 'gear' },
];

const ITEM = 46;
const GAP = 6;

/** Left rail with the glossy orb and a pill that slides to the active item. */
export function Sidebar({ vertical = true }: { vertical?: boolean }) {
  const { tab, setTab, settings } = useApp();
  const index = NAV.findIndex((n) => n.key === tab);
  const pos = useSharedValue(index);

  useEffect(() => {
    pos.value = withSpring(index, motion.snappy);
  }, [index, pos]);

  const pill = useAnimatedStyle(() =>
    vertical
      ? { transform: [{ translateY: pos.value * (ITEM + GAP) }] }
      : { transform: [{ translateX: pos.value * (ITEM + GAP) }] },
  );

  return (
    <View style={[s.rail, vertical ? s.railV : s.railH]}>
      {vertical && (
        <>
          <View style={s.orbWrap}>
            <Orb size={30} />
          </View>
          <View style={s.railDivider} />
        </>
      )}
      <View style={[s.items, vertical ? { flexDirection: 'column' } : { flexDirection: 'row' }]}>
        <Animated.View
          style={[
            s.pill,
            { width: ITEM, height: ITEM, backgroundColor: settings.accent + '26', borderColor: settings.accent + '59' },
            pill,
          ]}
        />
        {NAV.map((n) => (
          <Squish
            key={n.key}
            to={0.88}
            onPress={() => setTab(n.key)}
            style={[s.item, { width: ITEM, height: ITEM }]}
            accessibilityRole="button"
            accessibilityLabel={n.key}
          >
            <Icon
              name={n.icon}
              size={19}
              color={tab === n.key ? colors.text : colors.textFaint}
              strokeWidth={tab === n.key ? 1.9 : 1.6}
            />
          </Squish>
        ))}
      </View>
    </View>
  );
}

/** The blue sphere from the design — a slow, living gradient. */
export function Orb({ size = 30 }: { size?: number }) {
  const pulse = useSharedValue(0);
  const scale = useMotionScale();

  useEffect(() => {
    if (scale === 0) {
      pulse.value = 0.5;
      return;
    }
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [scale, pulse]);

  const halo = useAnimatedStyle(() => ({
    opacity: 0.18 + pulse.value * 0.3,
    transform: [{ scale: 1.25 + pulse.value * 0.3 }],
  }));
  const body = useAnimatedStyle(() => ({ transform: [{ scale: 1 + pulse.value * 0.035 }] }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={[
          { position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: '#4FA8F5' },
          halo,
        ]}
      />
      <Animated.View style={body}>
        <LinearGradient
          colors={['#BFE4FF', '#57A9F6', '#1A6FD6']}
          locations={[0, 0.45, 1]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}
        >
          <View
            style={{
              position: 'absolute',
              top: size * 0.13,
              left: size * 0.17,
              width: size * 0.34,
              height: size * 0.26,
              borderRadius: size * 0.2,
              backgroundColor: 'rgba(255,255,255,0.75)',
            }}
          />
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  rail: { alignItems: 'center' },
  railV: {
    width: 68,
    paddingTop: 14,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.hairline,
    backgroundColor: colors.sidebar,
  },
  railH: {
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
    backgroundColor: 'rgba(9,11,10,0.75)',
  },
  orbWrap: { height: 52, alignItems: 'center', justifyContent: 'center' },
  railDivider: {
    height: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginHorizontal: 14,
    backgroundColor: colors.hairline,
    marginBottom: 12,
  },
  items: { gap: GAP },
  item: { alignItems: 'center', justifyContent: 'center' },
  pill: {
    position: 'absolute',
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.10)',
  },
});
