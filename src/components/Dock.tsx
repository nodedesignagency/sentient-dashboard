import React from 'react';
import { Platform, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Icon } from './Icon';
import { dockApps } from '../data';
import { useApp } from '../state';

const GAP = 6;
const PAD = 10;
const RANGE = 2.4; // how many neighbours the cursor magnifies

/**
 * macOS dock. Drag along it and the icons magnify the way a real dock does
 * under the pointer; tapping one makes it bounce and opens the matching view.
 */
export function Dock() {
  const { width } = useWindowDimensions();
  const cursor = useSharedValue(-9999);
  const engaged = useSharedValue(0);
  const { setTab, tap } = useApp();

  const n = dockApps.length;
  const avail = Math.min(width * 0.95, 980) - PAD * 2;
  const base = Math.max(28, Math.min(42, (avail - (n - 1) * GAP) / n));
  const slot = base + GAP;

  const pan = Gesture.Pan()
    .minDistance(0)
    .onBegin((e) => {
      cursor.value = e.x;
      engaged.value = withTiming(1, { duration: 120 });
    })
    .onUpdate((e) => {
      cursor.value = e.x;
    })
    .onFinalize(() => {
      engaged.value = withTiming(0, { duration: 240 });
    });

  const open = (id: string) => {
    tap('medium');
    if (id === 'sentient' || id === 'finder') setTab('home');
    if (id === 'messages') setTab('chat');
    if (id === 'settings') setTab('settings');
  };

  return (
    <View style={s.wrap} pointerEvents="box-none">
      <BlurView
        intensity={38}
        tint="dark"
        experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
        style={s.dock}
      >
        <GestureDetector gesture={pan}>
          <View style={[s.row, { gap: GAP, height: base + 26 }]}>
            {dockApps.map((app, i) => (
              <DockIcon
                key={app.id}
                app={app}
                index={i}
                base={base}
                slot={slot}
                cursor={cursor}
                engaged={engaged}
                onOpen={open}
              />
            ))}
          </View>
        </GestureDetector>
      </BlurView>
    </View>
  );
}

function DockIcon({
  app, index, base, slot, cursor, engaged, onOpen,
}: {
  app: (typeof dockApps)[number];
  index: number;
  base: number;
  slot: number;
  cursor: SharedValue<number>;
  engaged: SharedValue<number>;
  onOpen: (id: string) => void;
}) {
  const bounce = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    const center = PAD + index * slot + base / 2;
    const dist = Math.abs(cursor.value - center) / slot;
    const falloff = Math.max(0, 1 - dist / RANGE);
    const mag = falloff * falloff * engaged.value;
    const jump = -Math.sin(bounce.value * Math.PI) * base * 0.6;
    return {
      transform: [{ translateY: -mag * base * 0.45 + jump }, { scale: 1 + mag * 0.5 }],
    };
  });

  const press = () => {
    bounce.value = 0;
    bounce.value = withSequence(
      withTiming(1, { duration: 320 }),
      withTiming(0, { duration: 0 }),
      withDelay(50, withTiming(1, { duration: 270 })),
      withTiming(0, { duration: 0 }),
    );
    onOpen(app.id);
  };

  const glyph = Math.max(14, base * 0.48);

  return (
    <Animated.View style={[{ width: base, alignItems: 'center' }, style]}>
      <Pressable onPress={press} accessibilityRole="button" accessibilityLabel={app.name} style={{ alignItems: 'center' }}>
        <LinearGradient
          colors={app.colors}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={[s.icon, { width: base, height: base, borderRadius: base * 0.26 }]}
        >
          <Icon
            name={app.icon}
            size={glyph}
            color={isLight(app.colors[0]) ? 'rgba(20,22,24,0.82)' : '#FFFFFF'}
            strokeWidth={1.8}
          />
        </LinearGradient>
        <View style={[s.dot, { opacity: app.running ? 1 : 0 }]} />
      </Pressable>
    </Animated.View>
  );
}

function isLight(hex: string) {
  const v = parseInt(hex.replace('#', ''), 16);
  const [r, g, b] = [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  return (r * 299 + g * 587 + b * 114) / 1000 > 190;
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', paddingBottom: 8 },
  dock: {
    borderRadius: 20,
    paddingHorizontal: PAD,
    paddingTop: 6,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(48,50,49,0.30)',
  },
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 5 },
      default: {},
    }),
  },
  dot: { width: 3.5, height: 3.5, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.75)', marginTop: 4 },
});
