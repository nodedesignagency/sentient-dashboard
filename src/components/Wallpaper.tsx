import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useDrift } from './motion';

const BLOBS = [
  { size: 420, color: 'rgba(96,160,110,0.16)', x: [-40, 60], y: [40, 140], ms: 17000, d: 0 },
  { size: 340, color: 'rgba(190,150,90,0.14)', x: [220, 120], y: [-30, 60], ms: 21000, d: 1500 },
  { size: 500, color: 'rgba(60,110,150,0.12)', x: [90, -60], y: [260, 180], ms: 25000, d: 3000 },
];

/** Blurred desktop picture plus very slow ambient drift, so nothing sits still. */
export function Wallpaper() {
  const ken = useDrift(30000);
  const kenStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 1.06 + ken.value * 0.05 },
      { translateX: (ken.value - 0.5) * 18 },
      { translateY: (ken.value - 0.5) * 12 },
    ],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[StyleSheet.absoluteFill, kenStyle]}>
        <Image
          source={require('../../assets/wallpaper.png')}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      </Animated.View>
      {BLOBS.map((b, i) => (
        <Blob key={i} {...b} />
      ))}
      <LinearGradient
        colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0.55)']}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

function Blob({
  size, color, x, y, ms, d,
}: { size: number; color: string; x: number[]; y: number[]; ms: number; d: number }) {
  const t = useDrift(ms, d);
  const a = useAnimatedStyle(() => ({
    transform: [
      { translateX: x[0] + (x[1] - x[0]) * t.value },
      { translateY: y[0] + (y[1] - y[0]) * t.value },
      { scale: 0.92 + t.value * 0.18 },
    ],
    opacity: 0.6 + t.value * 0.4,
  }));
  return (
    <Animated.View
      style={[
        { position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        a,
      ]}
    />
  );
}
