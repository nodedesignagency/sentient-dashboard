import React, { useEffect } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, motion, radius } from './theme';
import { Wallpaper } from './components/Wallpaper';
import { MenuBar } from './components/MenuBar';
import { Dock } from './components/Dock';
import { Sidebar } from './components/Sidebar';
import { HomeScreen } from './screens/HomeScreen';
import { ChatScreen } from './screens/ChatScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { useApp, useMotionScale } from './state';

export function Shell() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { tab } = useApp();
  const scale = useMotionScale();

  const desktop = width >= 780 && height >= 480;
  const showDock = width >= 640;

  const boot = useSharedValue(0);
  useEffect(() => {
    if (scale === 0) {
      boot.value = 1;
      return;
    }
    boot.value = 0;
    boot.value = withDelay(120, withSpring(1, motion.soft));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const windowStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, boot.value * 1.4),
    transform: [
      { scale: 0.955 + boot.value * 0.045 },
      { translateY: (1 - boot.value) * 26 },
    ],
  }));

  const margin = desktop ? Math.min(64, width * 0.055) : 0;

  return (
    <View style={s.root}>
      <Wallpaper />

      <View style={{ paddingTop: insets.top }}>
        <MenuBar compact={!desktop} />
      </View>

      <View
        style={[
          s.stage,
          desktop
            ? { paddingHorizontal: margin, paddingTop: 22, paddingBottom: 10 }
            : { paddingHorizontal: 0, paddingTop: 0 },
        ]}
      >
        <Animated.View
          style={[
            s.window,
            desktop ? s.windowDesktop : s.windowCompact,
            windowStyle,
          ]}
        >
          <BlurView
            intensity={Platform.OS === 'android' ? 28 : 44}
            tint="dark"
            experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
            style={StyleSheet.absoluteFill}
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.window }]} />

          <View style={{ flex: 1, flexDirection: desktop ? 'row' : 'column' }}>
            {desktop && <Sidebar vertical />}
            <View style={{ flex: 1 }}>
              <ScreenHost tab={tab} />
            </View>
            {!desktop && (
              <View style={{ paddingBottom: showDock ? 0 : Math.max(insets.bottom, 6) }}>
                <Sidebar vertical={false} />
              </View>
            )}
          </View>
        </Animated.View>
      </View>

      {showDock && (
        <View style={{ paddingBottom: Math.max(insets.bottom, 6) }}>
          <Dock />
        </View>
      )}
    </View>
  );
}

/** Crossfades between views with a small directional slide. */
function ScreenHost({ tab }: { tab: string }) {
  const p = useSharedValue(0);
  const scale = useMotionScale();

  useEffect(() => {
    if (scale === 0) {
      p.value = 1;
      return;
    }
    p.value = 0;
    p.value = withTiming(1, { duration: 320 });
  }, [tab, scale, p]);

  const a = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ translateY: (1 - p.value) * 10 }, { scale: 0.99 + p.value * 0.01 }],
  }));

  return (
    <Animated.View key={tab} style={[{ flex: 1 }, a]}>
      {tab === 'home' ? <HomeScreen /> : tab === 'chat' ? <ChatScreen /> : <SettingsScreen />}
    </Animated.View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.desktop },
  stage: { flex: 1 },
  window: { flex: 1, overflow: 'hidden' },
  windowDesktop: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.13)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.55, shadowRadius: 34, shadowOffset: { width: 0, height: 18 } },
      android: { elevation: 24 },
      default: {},
    }),
  },
  windowCompact: { borderRadius: 0 },
});
