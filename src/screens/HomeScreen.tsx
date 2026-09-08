import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, motion, radius, type as t } from '../theme';
import { Card, Hairline, Panel, Swatch, useCountUp } from '../components/surfaces';
import { Reveal, Squish } from '../components/motion';
import { Icon } from '../components/Icon';
import { ArcGauge } from '../components/charts/ArcGauge';
import { DonutChart } from '../components/charts/DonutChart';
import { channels, distribution, insights, optimizations, peakFocus } from '../data';
import { useApp, useMotionScale } from '../state';

export function HomeScreen() {
  const { width } = useWindowDimensions();
  const { replay, analyzing, reanalyze, lanes, toggleCommitment } = useApp();

  const cols = width >= 1080 ? 3 : width >= 720 ? 2 : 1;
  const [ring, setRing] = useState<string | null>(null);
  const [slice, setSlice] = useState<string | null>(null);

  const total = lanes.reduce((a, l) => a + l.items.length, 0);
  const done = lanes.reduce((a, l) => a + l.items.filter((i) => i.done).length, 0);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={s.scroll}
      showsVerticalScrollIndicator={false}
    >
      <Reveal delay={0} trigger={replay}>
        <View style={s.topRow}>
          <View style={s.crumbs}>
            <Icon name="chevronLeft" size={17} color={colors.textFaint} />
            <Icon name="chevronRight" size={17} color={colors.textDim} />
            <Text style={[t.title, { marginLeft: 8 }]}>Home</Text>
          </View>
          <ReanalyzeButton busy={analyzing} onPress={reanalyze} />
        </View>
      </Reveal>

      <Reveal delay={80} trigger={replay}>
        <Panel title="Focus and Pattern Insights">
          <View style={[s.row, cols === 1 && s.rowStack]}>
            <Reveal delay={160} trigger={replay} style={cols === 3 ? s.flex1 : cols === 2 ? s.half : s.full}>
              <Card icon="clock" title="Peak Focus Times" style={{ flex: 1 }}>
                <View style={cols >= 2 ? s.gaugeRow : s.gaugeStack}>
                  <View style={s.gaugeBox}>
                    <ArcGauge
                      rings={peakFocus.map((p) => ({ id: p.id, value: p.value, color: p.color }))}
                      size={cols === 3 ? 196 : 216}
                      selected={ring}
                      trigger={replay}
                    />
                  </View>
                  <View style={s.legendCol}>
                    {peakFocus.map((p, i) => (
                      <Squish
                        key={p.id}
                        to={0.98}
                        onPress={() => setRing((r) => (r === p.id ? null : p.id))}
                        style={[s.legendRow, ring === p.id && s.legendRowOn]}
                      >
                        <View style={s.legendHead}>
                          <Swatch color={p.color} />
                          <Text style={t.bodyDim} numberOfLines={1}>{p.range}</Text>
                        </View>
                        <PercentLine
                          value={p.value}
                          suffix="% Focused Work"
                          trigger={replay}
                          delay={i * 120}
                        />
                        {ring === p.id && (
                          <Text style={[t.meta, { marginTop: 3 }]} numberOfLines={1}>{p.note}</Text>
                        )}
                      </Squish>
                    ))}
                  </View>
                </View>
              </Card>
            </Reveal>

            <Reveal delay={240} trigger={replay} style={cols === 3 ? s.flex1 : cols === 2 ? s.half : s.full}>
              <Card icon="board" title="Project Focus Distribution" style={{ flex: 1 }}>
                <View style={cols >= 2 ? s.gaugeRow : s.gaugeStack}>
                  <View style={s.gaugeBox}>
                    <DonutChart
                      slices={distribution}
                      size={cols === 3 ? 140 : 172}
                      selected={slice}
                      trigger={replay}
                    />
                  </View>
                  <View style={[s.legendCol, { gap: 9, justifyContent: 'center' }]}>
                    {distribution.map((d) => (
                      <Squish
                        key={d.id}
                        to={0.98}
                        onPress={() => setSlice((x) => (x === d.id ? null : d.id))}
                        style={[s.sliceRow, slice === d.id && s.legendRowOn]}
                      >
                        <Swatch color={d.color} />
                        <Text
                          style={[t.body, { flexShrink: 1, fontSize: cols === 3 ? 12.5 : 13 }]}
                          numberOfLines={1}
                        >
                          {d.label}{' '}
                          <Text style={[t.bodyDim, { fontSize: cols === 3 ? 12.5 : 13 }]}>({d.value}%)</Text>
                        </Text>
                      </Squish>
                    ))}
                  </View>
                </View>
              </Card>
            </Reveal>

            <Reveal delay={320} trigger={replay} style={cols === 3 ? s.flex1 : cols === 2 ? s.full : s.full}>
              <Card icon="comm" title="Communication Patterns" style={{ flex: 1 }}>
                <View style={{ gap: 14 }}>
                  {channels.map((c, i) => (
                    <Reveal key={c.id} delay={420 + i * 90} trigger={replay}>
                      <View style={s.channelRow}>
                        <LinearGradient
                          colors={c.tint}
                          start={{ x: 0.2, y: 0 }}
                          end={{ x: 0.8, y: 1 }}
                          style={s.channelIcon}
                        >
                          <Icon name={c.icon} size={14} color="rgba(255,255,255,0.92)" />
                        </LinearGradient>
                        <View style={{ flex: 1 }}>
                          <Text style={t.bodyDim}>{c.name}</Text>
                          <Text style={t.body} numberOfLines={2}>{c.detail}</Text>
                        </View>
                      </View>
                    </Reveal>
                  ))}
                </View>
              </Card>
            </Reveal>
          </View>

          <View style={[s.row, cols === 1 && s.rowStack]}>
            <Reveal delay={420} trigger={replay} style={cols === 1 ? s.full : s.flex1}>
              <BulletCard icon="clock" title="Insights" items={insights} trigger={replay} tint={colors.sky} />
            </Reveal>
            <Reveal delay={480} trigger={replay} style={cols === 1 ? s.full : s.flex1}>
              <BulletCard icon="gear" title="Optimizations" items={optimizations} trigger={replay} tint={colors.lime} />
            </Reveal>
          </View>
        </Panel>
      </Reveal>

      <Reveal delay={560} trigger={replay}>
        <Panel
          title="Commitment Tracker"
          right={<Progress done={done} total={total} />}
        >
          <View style={[s.row, cols === 1 && s.rowStack]}>
            {lanes.map((lane, li) => (
              <Reveal
                key={lane.id}
                delay={620 + li * 90}
                trigger={replay}
                style={cols === 3 ? s.flex1 : cols === 2 ? s.half : s.full}
              >
                <View style={s.lane}>
                  <View style={s.laneHead}>
                    <View style={[s.laneBar, { backgroundColor: lane.color }]} />
                    <Text style={t.strong}>{lane.label}</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={t.meta}>{lane.items.filter((i) => !i.done).length} open</Text>
                  </View>
                  <View style={{ gap: 8 }}>
                    {lane.items.map((item) => (
                      <CommitmentRow
                        key={item.id}
                        title={item.title}
                        meta={item.meta}
                        done={item.done}
                        color={lane.color}
                        onToggle={() => toggleCommitment(lane.id, item.id)}
                      />
                    ))}
                  </View>
                </View>
              </Reveal>
            ))}
          </View>
        </Panel>
      </Reveal>

      <View style={{ height: 18 }} />
    </ScrollView>
  );
}

function PercentLine({
  value, suffix, trigger, delay,
}: { value: number; suffix: string; trigger: number; delay: number }) {
  const scale = useMotionScale();
  const n = useCountUp(value, 900, `${trigger}-${delay}`, scale !== 0);
  return (
    <Text style={[t.strong, { marginTop: 2 }]}>
      {Math.round(n)}
      {suffix}
    </Text>
  );
}

function BulletCard({
  icon, title, items, trigger, tint,
}: { icon: 'clock' | 'gear'; title: string; items: string[]; trigger: number; tint: string }) {
  return (
    <Card icon={icon} title={title} bodyStyle={{ paddingVertical: 12 }}>
      <View style={{ gap: 12 }}>
        {items.map((text, i) => (
          <Reveal key={text} delay={520 + i * 90} trigger={trigger} from="left" distance={10}>
            <View style={s.bullet}>
              <PulseDot color={tint} delay={i * 400} />
              <Text style={[t.body, { flex: 1 }]}>{text}</Text>
            </View>
          </Reveal>
        ))}
      </View>
    </Card>
  );
}

function PulseDot({ color, delay }: { color: string; delay: number }) {
  const v = useSharedValue(0);
  const scale = useMotionScale();
  useEffect(() => {
    if (scale === 0) {
      v.value = 0;
      return;
    }
    const id = setTimeout(() => {
      v.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1400, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 1400, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      );
    }, delay);
    return () => clearTimeout(id);
  }, [delay, scale, v]);
  const halo = useAnimatedStyle(() => ({ opacity: 0.5 - v.value * 0.45, transform: [{ scale: 1 + v.value * 1.5 }] }));
  return (
    <View style={s.dotWrap}>
      <Animated.View style={[s.dotHalo, { backgroundColor: color }, halo]} />
      <View style={[s.dot, { backgroundColor: color }]} />
    </View>
  );
}

function CommitmentRow({
  title, meta, done, color, onToggle,
}: { title: string; meta: string; done: boolean; color: string; onToggle: () => void }) {
  const v = useSharedValue(done ? 1 : 0);
  useEffect(() => {
    v.value = withSpring(done ? 1 : 0, motion.snappy);
  }, [done, v]);

  const box = useAnimatedStyle(() => ({ opacity: 1 - v.value * 0.45 }));
  const check = useAnimatedStyle(() => ({
    opacity: v.value,
    transform: [{ scale: 0.5 + v.value * 0.5 }],
  }));
  const strike = useAnimatedStyle(() => ({ width: `${v.value * 100}%` }));

  return (
    <Squish to={0.985} haptic="success" onPress={onToggle} style={s.itemPress}>
      <Animated.View style={[s.item, box]}>
        <View style={[s.itemIcon, done && { backgroundColor: color + '33', borderColor: color + '66' }]}>
          <Icon name={done ? 'check' : 'chat'} size={13} color={done ? color : colors.textDim} />
        </View>
        <View style={{ flex: 1 }}>
          <View>
            <Text style={t.strong} numberOfLines={2}>{title}</Text>
            <Animated.View style={[s.strike, strike]} />
          </View>
          <Text style={t.meta} numberOfLines={1}>
            {'• '}
            {done ? 'Cleared' : meta}
          </Text>
        </View>
        <Animated.View style={[s.itemCheck, { borderColor: color }, check]}>
          <Icon name="check" size={11} color={color} strokeWidth={2.6} />
        </Animated.View>
      </Animated.View>
    </Squish>
  );
}

function Progress({ done, total }: { done: number; total: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withSpring(total ? done / total : 0, motion.soft);
  }, [done, total, p]);
  const bar = useAnimatedStyle(() => ({ width: `${Math.max(0, Math.min(1, p.value)) * 100}%` }));
  return (
    <View style={s.progressWrap}>
      <Text style={t.meta}>
        {done} of {total} cleared
      </Text>
      <View style={s.progressTrack}>
        <Animated.View style={[s.progressFill, bar]} />
      </View>
    </View>
  );
}

function ReanalyzeButton({ busy, onPress }: { busy: boolean; onPress: () => void }) {
  const spin = useSharedValue(0);
  useEffect(() => {
    if (busy) {
      spin.value = 0;
      spin.value = withRepeat(withTiming(1, { duration: 900, easing: Easing.linear }), -1, false);
    } else {
      spin.value = withTiming(0, { duration: 200 });
    }
  }, [busy, spin]);
  const a = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value * 360}deg` }] }));
  return (
    <Squish to={0.94} haptic="medium" onPress={onPress} style={s.reanalyze}>
      <Animated.View style={a}>
        <Icon name="refresh" size={13} color={colors.text} />
      </Animated.View>
      <Text style={[t.body, { fontWeight: '600' }]}>{busy ? 'Analyzing…' : 'Re-analyze'}</Text>
    </Squish>
  );
}

const s = StyleSheet.create({
  scroll: { padding: 14, gap: 14 },
  topRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, paddingVertical: 6 },
  crumbs: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  reanalyze: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.raised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },

  row: { flexDirection: 'row', gap: 12, alignItems: 'stretch', flexWrap: 'wrap' },
  rowStack: { flexDirection: 'column' },
  flex1: { flex: 1, minWidth: 260 },
  half: { flexGrow: 1, flexBasis: '48%', minWidth: 260 },
  full: { width: '100%' },

  gaugeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  gaugeStack: { flexDirection: 'column', alignItems: 'center', gap: 14 },
  gaugeBox: { alignItems: 'center', justifyContent: 'center' },
  legendCol: { flex: 1, gap: 6, minWidth: 142 },
  legendRow: { paddingVertical: 5, paddingHorizontal: 6, borderRadius: 8 },
  legendRowOn: { backgroundColor: 'rgba(255,255,255,0.06)' },
  legendHead: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  sliceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 3, paddingHorizontal: 6, borderRadius: 8 },

  channelRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  channelIcon: {
    width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.16)',
  },

  bullet: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  dotWrap: { width: 12, height: 18, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 5, height: 5, borderRadius: 3 },
  dotHalo: { position: 'absolute', width: 5, height: 5, borderRadius: 3 },

  lane: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    backgroundColor: colors.card,
    padding: 12,
    gap: 10,
  },
  laneHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  laneBar: { width: 3, height: 14, borderRadius: 2 },
  itemPress: { borderRadius: 10 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairlineSoft,
  },
  itemIcon: {
    width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.12)',
  },
  strike: { position: 'absolute', top: '48%', left: 0, height: 1, backgroundColor: colors.textDim },
  itemCheck: {
    width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1.2,
  },

  progressWrap: { alignItems: 'flex-end', gap: 5 },
  progressTrack: { width: 92, height: 4, borderRadius: 2, backgroundColor: colors.track, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2, backgroundColor: colors.lime },
});
