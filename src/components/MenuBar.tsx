import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, motion } from '../theme';
import { Icon, type IconName } from './Icon';
import { menus } from '../data';
import { useApp } from '../state';

const MENU_ITEMS: Record<string, string[]> = {
  Finder: ['About Sentient', 'Settings…', 'Hide Sentient'],
  File: ['New Focus Block', 'Export Report…', 'Close Window'],
  Edit: ['Undo', 'Redo', 'Find…'],
  View: ['Show Sidebar', 'Enter Full Screen'],
  Go: ['Home', 'Assistant', 'Settings'],
  Window: ['Minimise', 'Zoom', 'Bring All to Front'],
  Help: ['Sentient Help', 'Keyboard Shortcuts'],
};

export function MenuBar({ compact = false }: { compact?: boolean }) {
  const { settings, tap } = useApp();
  const [now, setNow] = useState(new Date());
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!settings.liveClock) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [settings.liveClock]);

  const stamp = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
    + '  ' + now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  return (
    <View style={[s.bar, compact && { paddingHorizontal: 12 }]}>
      <Pressable onPress={() => { tap(); setOpen(null); }} style={s.apple} hitSlop={6}>
        <Icon name="apple" size={14} color={colors.text} />
      </Pressable>
      <Text style={[s.item, s.appName]}>Sentient</Text>

      {!compact &&
        menus.slice(1).map((m) => (
          <MenuButton
            key={m}
            label={m}
            open={open === m}
            onToggle={() => {
              tap();
              setOpen((o) => (o === m ? null : m));
            }}
          />
        ))}

      <View style={{ flex: 1 }} />

      <View style={s.tray}>
        <View style={s.trayOrb} />
        {(['wifi', 'search', 'user', 'sliders'] as IconName[]).map((n) => (
          <Pressable key={n} onPress={() => tap()} hitSlop={6} style={s.trayBtn}>
            <Icon name={n} size={13} color="rgba(242,244,243,0.85)" strokeWidth={1.5} />
          </Pressable>
        ))}
        <Text style={s.clock}>{stamp}</Text>
      </View>

      {open && (
        <Animated.View
          entering={FadeIn.duration(120)}
          exiting={FadeOut.duration(90)}
          style={[s.dropdown, { left: dropdownLeft(open) }]}
        >
          {MENU_ITEMS[open].map((label) => (
            <Pressable
              key={label}
              onPress={() => {
                tap();
                setOpen(null);
              }}
              style={({ pressed }) => [s.dropItem, pressed && s.dropItemOn]}
            >
              <Text style={s.dropText}>{label}</Text>
            </Pressable>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

function dropdownLeft(label: string) {
  const i = menus.slice(1).indexOf(label);
  return 96 + i * 52;
}

function MenuButton({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  const hl = useSharedValue(0);
  useEffect(() => {
    hl.value = withTiming(open ? 1 : 0, { duration: 130 });
  }, [open, hl]);
  const a = useAnimatedStyle(() => ({
    backgroundColor: `rgba(255,255,255,${0.14 * hl.value})`,
    transform: [{ scale: withSpring(open ? 1.04 : 1, motion.press) }],
  }));
  return (
    <Pressable onPress={onToggle} hitSlop={4}>
      <Animated.View style={[s.menuChip, a]}>
        <Text style={s.item}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  bar: {
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 2,
    backgroundColor: 'rgba(0,0,0,0.62)',
    zIndex: 40,
  },
  apple: { paddingHorizontal: 6, paddingVertical: 4 },
  menuChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
  item: { fontSize: 12.5, color: 'rgba(242,244,243,0.92)' },
  appName: { fontWeight: '700', paddingHorizontal: 8 },
  tray: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  trayOrb: { width: 11, height: 11, borderRadius: 6, backgroundColor: '#3E9CF3' },
  trayBtn: { padding: 2 },
  clock: { fontSize: 12.5, color: 'rgba(242,244,243,0.92)', marginLeft: 2 },
  dropdown: {
    position: 'absolute',
    top: 28,
    minWidth: 190,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(30,32,31,0.96)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } },
      android: { elevation: 12 },
      default: {},
    }),
  },
  dropItem: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 5, marginHorizontal: 4 },
  dropItemOn: { backgroundColor: 'rgba(62,156,243,0.55)' },
  dropText: { fontSize: 12.5, color: colors.text },
});
