import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, motion, radius, type as t } from '../theme';
import { Icon } from '../components/Icon';
import { Orb } from '../components/Sidebar';
import { Reveal, Squish } from '../components/motion';
import { chatSuggestions, seedChat } from '../data';
import { useApp, useMotionScale } from '../state';

type Msg = { id: string; from: 'me' | 'ai'; text: string };

const REPLIES = [
  'Pulled the last 30 days: your 9:00-11:30 block is the only window that never drops below 85%.',
  'I can hold 9-11:30 as a no-meeting block and push status syncs to 2:00. Say the word and I will send the invites.',
  'Three interruptions came from the same Slack channel this week. Muting it during focus blocks buys back roughly 40 minutes a day.',
  'Design System work took 35% of your time. It is also where your focus scores are highest, so that split looks healthy.',
];

export function ChatScreen() {
  const { settings } = useApp();
  const [msgs, setMsgs] = useState<Msg[]>(seedChat);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const scroller = useRef<ScrollView>(null);
  const replyIndex = useRef(0);

  const toEnd = useCallback(() => {
    requestAnimationFrame(() => scroller.current?.scrollToEnd({ animated: true }));
  }, []);

  useEffect(toEnd, [msgs, typing, toEnd]);

  const send = (text: string) => {
    const body = text.trim();
    if (!body) return;
    setDraft('');
    setMsgs((m) => [...m, { id: `me-${Date.now()}`, from: 'me', text: body }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [
        ...m,
        { id: `ai-${Date.now()}`, from: 'ai', text: REPLIES[replyIndex.current++ % REPLIES.length] },
      ]);
    }, 1100);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={s.header}>
        <Icon name="chevronLeft" size={17} color={colors.textFaint} />
        <Icon name="chevronRight" size={17} color={colors.textDim} />
        <Text style={[t.title, { marginLeft: 8 }]}>Assistant</Text>
        <View style={{ flex: 1 }} />
        <View style={s.live}>
          <LiveDot />
          <Text style={t.meta}>Watching today</Text>
        </View>
      </View>

      <ScrollView
        ref={scroller}
        style={{ flex: 1 }}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {msgs.map((m, i) => (
          <Bubble key={m.id} msg={m} index={i} />
        ))}
        {typing && <Typing />}
      </ScrollView>

      <View style={s.suggestions}>
        {chatSuggestions.map((q, i) => (
          <Reveal key={q} delay={120 + i * 70} from="right" distance={10}>
            <Squish to={0.95} onPress={() => send(q)} style={s.chip}>
              <Icon name="sparkle" size={11} color={colors.textDim} />
              <Text style={t.meta}>{q}</Text>
            </Squish>
          </Reveal>
        ))}
      </View>

      <View style={s.composer}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={() => send(draft)}
          placeholder="Ask about your focus, commitments or calendar…"
          placeholderTextColor={colors.textFaint}
          style={s.input}
          returnKeyType="send"
        />
        <Squish
          to={0.9}
          haptic="medium"
          onPress={() => send(draft)}
          style={[s.send, { backgroundColor: draft.trim() ? settings.accent : colors.raised }]}
        >
          <Icon name="send" size={15} color={draft.trim() ? '#0B0D0C' : colors.textFaint} strokeWidth={1.9} />
        </Squish>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bubble({ msg, index }: { msg: Msg; index: number }) {
  const mine = msg.from === 'me';
  const p = useSharedValue(0);
  const scale = useMotionScale();

  useEffect(() => {
    if (scale === 0) {
      p.value = 1;
      return;
    }
    p.value = 0;
    p.value = withDelay(Math.min(index, 6) * 70 * scale, withSpring(1, motion.soft));
  }, [index, scale, p]);

  const a = useAnimatedStyle(() => ({
    opacity: Math.min(1, p.value * 1.6),
    transform: [
      { translateY: (1 - p.value) * 14 },
      { translateX: (1 - p.value) * (mine ? 16 : -16) },
      { scale: 0.94 + p.value * 0.06 },
    ],
  }));

  return (
    <Animated.View style={[s.bubbleRow, mine && { justifyContent: 'flex-end' }, a]}>
      {!mine && (
        <View style={s.avatar}>
          <Orb size={22} />
        </View>
      )}
      <View style={[s.bubble, mine ? s.mine : s.theirs]}>
        <Text style={[t.body, { lineHeight: 19 }]}>{msg.text}</Text>
      </View>
    </Animated.View>
  );
}

function Typing() {
  return (
    <View style={s.bubbleRow}>
      <View style={s.avatar}>
        <Orb size={22} />
      </View>
      <View style={[s.bubble, s.theirs, s.typing]}>
        {[0, 1, 2].map((i) => (
          <TypingDot key={i} delay={i * 160} />
        ))}
      </View>
    </View>
  );
}

function TypingDot({ delay }: { delay: number }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 380, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 380, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, v]);
  const a = useAnimatedStyle(() => ({
    opacity: 0.35 + v.value * 0.65,
    transform: [{ translateY: -v.value * 4 }],
  }));
  return <Animated.View style={[s.typingDot, a]} />;
}

function LiveDot() {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withRepeat(
      withSequence(withTiming(1, { duration: 1100 }), withTiming(0, { duration: 1100 })),
      -1,
      false,
    );
  }, [v]);
  const a = useAnimatedStyle(() => ({ opacity: 0.45 + v.value * 0.55, transform: [{ scale: 1 + v.value * 0.35 }] }));
  return <Animated.View style={[s.liveDot, a]} />;
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 18, paddingVertical: 14, width: '100%', maxWidth: 900, alignSelf: 'center' },
  live: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.lime },
  list: { paddingHorizontal: 16, paddingBottom: 12, gap: 12, width: '100%', maxWidth: 900, alignSelf: 'center' },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 9 },
  avatar: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  theirs: {
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderColor: colors.hairline,
    borderBottomLeftRadius: 6,
  },
  mine: {
    backgroundColor: 'rgba(0,169,239,0.18)',
    borderColor: 'rgba(0,169,239,0.35)',
    borderBottomRightRadius: 6,
  },
  typing: { flexDirection: 'row', gap: 5, paddingVertical: 13 },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textDim },
  suggestions: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 10, flexWrap: 'wrap', width: '100%', maxWidth: 900, alignSelf: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 14,
    paddingBottom: 14,
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    height: 42,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    color: colors.text,
    fontSize: 13.5,
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
  },
  send: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
});
