import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { accents, colors, motion, radius, type as t } from '../theme';
import { Hairline, Panel } from '../components/surfaces';
import { Reveal, Squish } from '../components/motion';
import { Icon } from '../components/Icon';
import { useApp } from '../state';

const SPEEDS: Array<{ label: string; value: number }> = [
  { label: 'Brisk', value: 0.6 },
  { label: 'Designed', value: 1 },
  { label: 'Cinematic', value: 1.7 },
];

export function SettingsScreen() {
  const { settings, setSetting, resetCommitments, reanalyze, tap } = useApp();

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <Reveal>
        <View style={s.header}>
          <Icon name="chevronLeft" size={17} color={colors.textFaint} />
          <Icon name="chevronRight" size={17} color={colors.textDim} />
          <Text style={[t.title, { marginLeft: 8 }]}>Settings</Text>
        </View>
      </Reveal>

      <Reveal delay={70}>
        <Panel title="Motion">
          <Row
            label="Reduce motion"
            hint="Skip entrances, gauges snap to value"
            value={settings.reduceMotion}
            onChange={(v) => setSetting('reduceMotion', v)}
          />
          <Hairline />
          <Row
            label="Ambient background"
            hint="Slow drift behind the window"
            value={settings.ambient}
            onChange={(v) => setSetting('ambient', v)}
          />
          <Hairline />
          <Row
            label="Live clock"
            hint="Menu bar ticks every second"
            value={settings.liveClock}
            onChange={(v) => setSetting('liveClock', v)}
          />
          <Hairline />
          <Row
            label="Haptics"
            hint="Feedback on taps and completions"
            value={settings.hapticsOn}
            onChange={(v) => setSetting('hapticsOn', v)}
          />
          <Hairline />
          <View style={s.block}>
            <Text style={t.body}>Animation pace</Text>
            <Text style={[t.meta, { marginBottom: 10 }]}>Scales every entrance and chart sweep</Text>
            <Segmented
              options={SPEEDS.map((x) => x.label)}
              index={SPEEDS.findIndex((x) => x.value === settings.motionScale)}
              onChange={(i) => {
                tap();
                setSetting('motionScale', SPEEDS[i].value);
              }}
            />
          </View>
        </Panel>
      </Reveal>

      <Reveal delay={140}>
        <Panel title="Appearance">
          <View style={s.block}>
            <Text style={t.body}>Accent</Text>
            <Text style={[t.meta, { marginBottom: 12 }]}>Used by the nav indicator and the assistant</Text>
            <View style={s.swatches}>
              {accents.map((c) => (
                <AccentSwatch
                  key={c}
                  color={c}
                  active={settings.accent === c}
                  onPress={() => {
                    tap();
                    setSetting('accent', c);
                  }}
                />
              ))}
            </View>
          </View>
        </Panel>
      </Reveal>

      <Reveal delay={210}>
        <Panel title="Data">
          <Squish
            to={0.985}
            onPress={() => {
              resetCommitments();
              reanalyze();
            }}
            style={s.action}
          >
            <Icon name="refresh" size={15} color={colors.text} />
            <View style={{ flex: 1 }}>
              <Text style={t.body}>Reset the demo</Text>
              <Text style={t.meta}>Restore every commitment and replay the dashboard</Text>
            </View>
            <Icon name="chevronRight" size={15} color={colors.textFaint} />
          </Squish>
        </Panel>
      </Reveal>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

function Row({
  label, hint, value, onChange,
}: { label: string; hint: string; value: boolean; onChange: (v: boolean) => void }) {
  const { tap } = useApp();
  return (
    <Pressable
      onPress={() => {
        tap();
        onChange(!value);
      }}
      style={s.row}
    >
      <View style={{ flex: 1 }}>
        <Text style={t.body}>{label}</Text>
        <Text style={t.meta}>{hint}</Text>
      </View>
      <Switch value={value} />
    </Pressable>
  );
}

function Switch({ value }: { value: boolean }) {
  const v = useSharedValue(value ? 1 : 0);
  useEffect(() => {
    v.value = withSpring(value ? 1 : 0, motion.snappy);
  }, [value, v]);

  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(v.value, [0, 1], ['rgba(255,255,255,0.10)', colors.lime]),
  }));
  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: v.value * 18 }] }));

  return (
    <Animated.View style={[s.track, track]}>
      <Animated.View style={[s.thumb, thumb]} />
    </Animated.View>
  );
}

function Segmented({
  options, index, onChange,
}: { options: string[]; index: number; onChange: (i: number) => void }) {
  const pos = useSharedValue(Math.max(0, index));
  const [w, setW] = React.useState(0);

  useEffect(() => {
    pos.value = withSpring(Math.max(0, index), motion.snappy);
  }, [index, pos]);

  const seg = w / options.length;
  const pill = useAnimatedStyle(() => ({
    transform: [{ translateX: pos.value * seg }],
    width: seg,
  }));

  return (
    <View style={s.segment} onLayout={(e) => setW(e.nativeEvent.layout.width - 6)}>
      {w > 0 && <Animated.View style={[s.segPill, pill]} />}
      {options.map((o, i) => (
        <Pressable key={o} onPress={() => onChange(i)} style={s.segItem}>
          <Text style={[t.meta, index === i && { color: colors.text, fontWeight: '600' }]}>{o}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function AccentSwatch({ color, active, onPress }: { color: string; active: boolean; onPress: () => void }) {
  const v = useSharedValue(active ? 1 : 0);
  useEffect(() => {
    v.value = withTiming(active ? 1 : 0, { duration: 220 });
  }, [active, v]);
  const ring = useAnimatedStyle(() => ({
    opacity: v.value,
    transform: [{ scale: 0.8 + v.value * 0.2 }],
  }));
  const dot = useAnimatedStyle(() => ({ transform: [{ scale: 1 + v.value * 0.1 }] }));
  return (
    <Squish to={0.9} onPress={onPress} style={s.swatchWrap} haptic="none">
      <Animated.View style={[s.swatchRing, { borderColor: color }, ring]} />
      <Animated.View style={[s.swatch, { backgroundColor: color }, dot]} />
    </Squish>
  );
}

const s = StyleSheet.create({
  scroll: { padding: 14, gap: 14, width: '100%', maxWidth: 820, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 4, paddingVertical: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 4, paddingVertical: 12 },
  block: { paddingHorizontal: 4, paddingVertical: 12 },
  track: { width: 40, height: 22, borderRadius: 11, padding: 2, justifyContent: 'center' },
  thumb: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#F7F9F8' },
  segment: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  segPill: {
    position: 'absolute',
    top: 3,
    left: 3,
    bottom: 3,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  segItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  swatches: { flexDirection: 'row', gap: 14 },
  swatchWrap: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  swatchRing: { position: 'absolute', width: 34, height: 34, borderRadius: 17, borderWidth: 1.5 },
  swatch: { width: 20, height: 20, borderRadius: 10 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 4, paddingVertical: 12 },
});
