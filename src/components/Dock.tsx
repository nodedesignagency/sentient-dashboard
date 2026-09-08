import React from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { BLEEDLESS, DockGlyph } from './DockIcons';
import { dockAssets } from '../dockAssets';
import { dockItems, type DockEntry } from '../data';
import { useApp } from '../state';

const GAP = 5;
const PAD = 8;
const SEP = 11;
const RANGE = 2.4; // how many neighbours the cursor magnifies

/**
 * macOS dock: light frosted bar, full-art app tiles, separators before the
 * documents and trash groups. Drag along it and the icons magnify under your
 * finger with the real falloff; tapping one bounces it.
 */
export function Dock() {
  const { width } = useWindowDimensions();
  const cursor = useSharedValue(-9999);
  const engaged = useSharedValue(0);
  const { setTab, tap } = useApp();

  const apps = dockItems.filter((d) => d.kind === 'app').length;
  const seps = dockItems.length - apps;
  const avail = Math.min(width * 0.96, 1080) - PAD * 2;
  const base = Math.max(26, Math.min(44, (avail - (dockItems.length - 1) * GAP - seps * SEP) / apps));

  // left edge of each entry, so magnification can measure real distances
  const offsets: number[] = [];
  let x = PAD;
  for (const item of dockItems) {
    offsets.push(x);
    x += (item.kind === 'sep' ? SEP : base) + GAP;
  }

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

  const open = (item: Extract<DockEntry, { kind: 'app' }>) => {
    tap('medium');
    if (item.opens) setTab(item.opens);
  };

  return (
    <View style={s.wrap} pointerEvents="box-none">
      <BlurView
        intensity={Platform.OS === 'android' ? 30 : 55}
        tint="dark"
        experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
        style={[s.dock, { borderRadius: base * 0.42 }]}
      >
        <GestureDetector gesture={pan}>
          <View style={[s.row, { gap: GAP, height: base + 22 }]}>
            {dockItems.map((item, i) =>
              item.kind === 'sep' ? (
                <View key={`sep-${i}`} style={[s.sep, { height: base * 0.78, width: SEP }]}>
                  <View style={s.sepLine} />
                </View>
              ) : (
                <DockTile
                  key={item.id}
                  item={item}
                  left={offsets[i]}
                  base={base}
                  slot={base + GAP}
                  cursor={cursor}
                  engaged={engaged}
                  onOpen={open}
                />
              ),
            )}
          </View>
        </GestureDetector>
      </BlurView>
    </View>
  );
}

function DockTile({
  item, left, base, slot, cursor, engaged, onOpen,
}: {
  item: Extract<DockEntry, { kind: 'app' }>;
  left: number;
  base: number;
  slot: number;
  cursor: SharedValue<number>;
  engaged: SharedValue<number>;
  onOpen: (item: Extract<DockEntry, { kind: 'app' }>) => void;
}) {
  const bounce = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    const dist = Math.abs(cursor.value - (left + base / 2)) / slot;
    const falloff = Math.max(0, 1 - dist / RANGE);
    const mag = falloff * falloff * engaged.value;
    const jump = -Math.sin(bounce.value * Math.PI) * base * 0.6;
    return { transform: [{ translateY: -mag * base * 0.45 + jump }, { scale: 1 + mag * 0.5 }] };
  });

  const press = () => {
    bounce.value = 0;
    bounce.value = withSequence(
      withTiming(1, { duration: 320 }),
      withTiming(0, { duration: 0 }),
      withDelay(50, withTiming(1, { duration: 270 })),
      withTiming(0, { duration: 0 }),
    );
    onOpen(item);
  };

  const real = dockAssets[item.id];
  // an extracted Apple icon already carries its own shape and shadow
  const bleeds = !real && !BLEEDLESS.includes(item.id);

  return (
    <Animated.View style={[{ width: base, alignItems: 'center' }, style]}>
      <Pressable onPress={press} accessibilityRole="button" accessibilityLabel={item.name} style={{ alignItems: 'center' }}>
        <View style={[{ width: base, height: base }, bleeds && [s.tile, { borderRadius: base * 0.2237 }]]}>
          {real ? (
            <Image source={real} style={{ width: base, height: base }} resizeMode="contain" />
          ) : (
            <DockGlyph id={item.id} size={base} />
          )}
          {item.badge != null && (
            <View style={[s.badge, { minWidth: base * 0.36, height: base * 0.36, borderRadius: base * 0.18 }]}>
              <Text style={[s.badgeText, { fontSize: base * 0.22 }]}>{item.badge}</Text>
            </View>
          )}
        </View>
        <View style={[s.dot, { opacity: item.running ? 1 : 0 }]} />
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', paddingBottom: 6 },
  dock: {
    paddingHorizontal: PAD,
    paddingTop: 5,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.24)',
    // matches the real dock slab: a pale frosted layer, not a dark one
    backgroundColor: 'rgba(132,136,140,0.28)',
  },
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  tile: {
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.34, shadowRadius: 5, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 5 },
      default: {},
    }),
  },
  sep: { justifyContent: 'center', alignItems: 'center' },
  sepLine: { width: StyleSheet.hairlineWidth, height: '78%', backgroundColor: 'rgba(255,255,255,0.4)' },
  dot: { width: 3.5, height: 3.5, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.62)', marginTop: 4 },
  badge: {
    position: 'absolute',
    top: -3,
    right: -4,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  badgeText: { color: '#FFFFFF', fontWeight: '700' },
});
