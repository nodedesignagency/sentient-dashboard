# Sentient — Focus & Pattern Insights

A working, animated build of the macOS "Focus and Pattern Insights" dashboard
([Figma frame](https://www.figma.com/design/KaRMcZwlNov9Lg11SWEgem/Untitled?node-id=1-141)),
built with Expo + React Native so it runs in **Expo Go** on a real device.

## Run it

```bash
npm install
npm start          # scan the QR code with Expo Go
npm run tunnel     # use this if your phone is not on the same Wi-Fi
npm run web        # same app in a browser, desktop layout
```

Requires Expo Go for **SDK 57**.

## Why React Native and not Swift

SwiftUI would give a marginally more native feel (system materials, `matchedGeometryEffect`),
but it cannot run in Expo Go and needs a Mac with Xcode. Every animation here runs on
Reanimated's UI thread rather than through the JS bridge, so it stays at display refresh rate
even while the list is scrolling.

## Layout

The desktop chrome is reproduced at tablet/desktop widths and collapses gracefully on a phone:

| width | layout |
| --- | --- |
| ≥ 1080 | 3-column dashboard, left rail, dock |
| 720–1079 | 2-column dashboard |
| < 780 | full-bleed window, sidebar becomes a bottom rail, dock hidden below 640 |

## What moves

Everything below is driven by `react-native-reanimated` on the UI thread.

**Entrance**
- Window boots in with a spring (scale + rise), wallpaper does a slow Ken Burns drift
- Every panel, card and row reveals on a stagger; the whole sequence replays on **Re-analyze**

**Charts**
- *Peak Focus Times* — three concentric half-gauges sweep in on a stagger via animated `strokeDashoffset`
- *Project Focus Distribution* — five donut segments draw on in sequence; the ring breathes on a 10s cycle
- Selecting a legend row thickens that arc, adds a glow, dims the rest, and counts the number up in the middle

**Interaction**
- Sidebar pill springs between Home / Assistant / Settings; screens cross-fade
- Dock magnifies under your finger as you drag along it (real macOS falloff curve) and bounces on tap
- Commitments toggle done: strike-through wipes across, the row dims, a check scales in, the tracker bar fills
- Assistant has a live typing indicator, spring-in bubbles and working suggestion chips
- Menu bar clock ticks; menus open real dropdowns
- Insight bullets pulse; the ambient background blobs drift continuously

**Controls** (Settings)
- Reduce motion, ambient background, live clock, haptics
- Animation pace — Brisk / Designed / Cinematic — scales every entrance and sweep
- Accent colour, and a reset that restores the commitments and replays the dashboard

## Structure

```
App.tsx                    providers + root
src/Shell.tsx              desktop shell: wallpaper, menu bar, window, dock
src/state.tsx              settings, tab, commitments, replay trigger
src/theme.ts               palette sampled from the Figma frame, motion presets
src/data.ts                dashboard content
src/components/            Icon, Sidebar, MenuBar, Dock, Wallpaper, surfaces, motion
src/components/charts/     ArcGauge, DonutChart, geometry helpers
src/screens/               Home, Chat, Settings
```

## Notes

- The gauge arcs are drawn from the real percentages (92 / 87 / 92). The Figma frame shows the
  three rings at visibly different lengths, which does not match the labels next to them, so the
  data wins here.
- The wallpaper and app icon are generated stand-ins for the photo in the frame — no licensed
  asset is checked in.
