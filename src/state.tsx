import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { lanes as seedLanes, type Lane } from './data';
import { colors } from './theme';

export type TabKey = 'home' | 'chat' | 'settings';

type Settings = {
  reduceMotion: boolean;
  hapticsOn: boolean;
  liveClock: boolean;
  ambient: boolean;
  /** 0.6 = brisk, 1 = designed pace, 1.6 = slow/demo */
  motionScale: number;
  accent: string;
};

type Ctx = {
  settings: Settings;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  tab: TabKey;
  setTab: (t: TabKey) => void;
  /** bumping this replays every chart entrance animation */
  replay: number;
  reanalyze: () => void;
  analyzing: boolean;
  lanes: Lane[];
  toggleCommitment: (laneId: string, itemId: string) => void;
  resetCommitments: () => void;
  tap: (style?: 'light' | 'medium' | 'success') => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    reduceMotion: false,
    hapticsOn: true,
    liveClock: true,
    ambient: true,
    motionScale: 1,
    accent: colors.sky,
  });
  const [tab, setTab] = useState<TabKey>('home');
  const [replay, setReplay] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [lanes, setLanes] = useState<Lane[]>(seedLanes);

  const tap = useCallback(
    (style: 'light' | 'medium' | 'success' = 'light') => {
      if (!settings.hapticsOn || Platform.OS === 'web') return;
      if (style === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      else
        Haptics.impactAsync(
          style === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light,
        ).catch(() => {});
    },
    [settings.hapticsOn],
  );

  const setSetting = useCallback<Ctx['setSetting']>((key, value) => {
    setSettings((s) => ({ ...s, [key]: value }));
  }, []);

  const reanalyze = useCallback(() => {
    setAnalyzing(true);
    setReplay((r) => r + 1);
    setTimeout(() => setAnalyzing(false), 1500);
  }, []);

  const toggleCommitment = useCallback((laneId: string, itemId: string) => {
    setLanes((ls) =>
      ls.map((l) =>
        l.id !== laneId
          ? l
          : { ...l, items: l.items.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) },
      ),
    );
  }, []);

  const resetCommitments = useCallback(() => setLanes(seedLanes), []);

  const value = useMemo(
    () => ({
      settings, setSetting, tab, setTab, replay, reanalyze, analyzing,
      lanes, toggleCommitment, resetCommitments, tap,
    }),
    [settings, setSetting, tab, replay, reanalyze, analyzing, lanes, toggleCommitment, resetCommitments, tap],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}

/** Convenience: duration/delay scaling that respects the Reduce Motion switch. */
export function useMotionScale() {
  const { settings } = useApp();
  return settings.reduceMotion ? 0 : settings.motionScale;
}
