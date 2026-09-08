import React from 'react';
import Svg, { Path, Circle, Rect, G, Line, Polyline } from 'react-native-svg';

export type IconName =
  | 'clock' | 'board' | 'comm' | 'mail' | 'slack' | 'calendar'
  | 'home' | 'chat' | 'gear' | 'chevronLeft' | 'chevronRight'
  | 'apple' | 'wifi' | 'search' | 'user' | 'sliders' | 'orb'
  | 'refresh' | 'check' | 'send' | 'sparkle' | 'grid' | 'compass'
  | 'pin' | 'flower' | 'video' | 'list' | 'note' | 'music' | 'tv'
  | 'podcast' | 'news' | 'smile' | 'trash' | 'bolt' | 'plus';

type Props = { name: IconName; size?: number; color?: string; strokeWidth?: number };

export function Icon({ name, size = 16, color = '#F2F4F3', strokeWidth = 1.6 }: Props) {
  const s = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G>{glyph(name, s, color)}</G>
    </Svg>
  );
}

function glyph(name: IconName, s: any, color: string) {
  switch (name) {
    case 'clock':
      return (<><Circle cx={12} cy={12} r={8.5} {...s} /><Path d="M12 7.5V12l3 1.8" {...s} /></>);
    case 'board':
      return (<><Rect x={3.5} y={4.5} width={17} height={13} rx={2.5} {...s} /><Path d="M8 13.5v-2M12 13.5V9M16 13.5v-3.2" {...s} /><Path d="M9 20.5h6" {...s} /></>);
    case 'comm':
      return (<><Rect x={4} y={4} width={16} height={16} rx={4} {...s} /><Circle cx={9.5} cy={10} r={1.15} fill={color} stroke="none" /><Circle cx={14.5} cy={10} r={1.15} fill={color} stroke="none" /><Path d="M9 14.6c1 .9 1.9 1.3 3 1.3s2-.4 3-1.3" {...s} /></>);
    case 'mail':
      return (<><Rect x={3} y={5.5} width={18} height={13} rx={2.5} {...s} /><Path d="M3.8 7.4 12 13l8.2-5.6" {...s} /></>);
    case 'slack':
      return (
        <Path
          d="M9.4 4.2v9.4M14.6 10.4v9.4M4.2 14.6h9.4M10.4 9.4h9.4"
          {...s}
          strokeWidth={2.4}
        />
      );
    case 'calendar':
      return (<><Rect x={3.5} y={5} width={17} height={15} rx={3} {...s} /><Path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" {...s} /></>);
    case 'home':
      return (<><Path d="M4 10.4 12 4l8 6.4V19a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 19z" {...s} /><Path d="M9.6 16.4h4.8" {...s} /></>);
    case 'chat':
      return <Path d="M20.5 11.6c0 4-3.8 7.2-8.5 7.2a9.8 9.8 0 0 1-2.6-.35L4.2 20.4l1.5-3.4A6.9 6.9 0 0 1 3.5 11.6c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.2Z" {...s} />;
    case 'gear':
      return (
        <>
          <Circle cx={12} cy={12} r={3} {...s} />
          <Path
            d="M18.7 14.6a1.5 1.5 0 0 0 .3 1.65l.05.06a1.8 1.8 0 1 1-2.55 2.55l-.06-.06a1.5 1.5 0 0 0-1.65-.3 1.5 1.5 0 0 0-.9 1.37v.17a1.8 1.8 0 1 1-3.6 0v-.09a1.5 1.5 0 0 0-.98-1.37 1.5 1.5 0 0 0-1.65.3l-.06.06A1.8 1.8 0 1 1 5.05 16.4l.06-.06a1.5 1.5 0 0 0 .3-1.65 1.5 1.5 0 0 0-1.37-.9h-.17a1.8 1.8 0 1 1 0-3.6h.09a1.5 1.5 0 0 0 1.37-.98 1.5 1.5 0 0 0-.3-1.65l-.06-.06A1.8 1.8 0 1 1 7.6 5.05l.06.06a1.5 1.5 0 0 0 1.65.3h.07a1.5 1.5 0 0 0 .9-1.37v-.17a1.8 1.8 0 1 1 3.6 0v.09a1.5 1.5 0 0 0 .9 1.37 1.5 1.5 0 0 0 1.65-.3l.06-.06a1.8 1.8 0 1 1 2.55 2.55l-.06.06a1.5 1.5 0 0 0-.3 1.65v.07a1.5 1.5 0 0 0 1.37.9h.17a1.8 1.8 0 1 1 0 3.6h-.09a1.5 1.5 0 0 0-1.37.9Z"
            {...s}
            strokeWidth={1.35}
          />
        </>
      );
    case 'chevronLeft':
      return <Path d="M14.5 5.5 8 12l6.5 6.5" {...s} strokeWidth={2} />;
    case 'chevronRight':
      return <Path d="M9.5 5.5 16 12l-6.5 6.5" {...s} strokeWidth={2} />;
    case 'apple':
      return <Path d="M16.1 12.6c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.15-2.7.8-3.4.8s-1.8-.8-2.9-.78c-1.5.02-2.9.87-3.6 2.2-1.6 2.7-.4 6.8 1.1 9 .75 1.1 1.6 2.3 2.8 2.26 1.1-.05 1.5-.72 2.9-.72 1.3 0 1.7.72 2.9.7 1.2-.02 2-1.1 2.7-2.2.86-1.3 1.2-2.5 1.2-2.6-.03-.01-2.4-.9-2.4-3.6ZM13.9 5.6c.6-.75 1-1.8.9-2.85-.9.04-2 .6-2.6 1.35-.55.65-1.05 1.7-.9 2.7 1 .08 2-.5 2.6-1.2Z" fill={color} stroke="none" />;
    case 'wifi':
      return (<><Path d="M2.8 8.9a14 14 0 0 1 18.4 0M6 12.2a9.3 9.3 0 0 1 12 0M9.2 15.5a4.6 4.6 0 0 1 5.6 0" {...s} strokeWidth={1.8} /><Circle cx={12} cy={19} r={1.2} fill={color} stroke="none" /></>);
    case 'search':
      return (<><Circle cx={11} cy={11} r={6.5} {...s} strokeWidth={1.8} /><Path d="m16 16 4.2 4.2" {...s} strokeWidth={1.8} /></>);
    case 'user':
      return (<><Circle cx={12} cy={8.6} r={3.9} {...s} /><Path d="M4.8 20.2a7.6 7.6 0 0 1 14.4 0" {...s} /></>);
    case 'sliders':
      return (<><Path d="M4 8h10M18 8h2M4 16h4M12 16h8" {...s} strokeWidth={1.8} /><Circle cx={16} cy={8} r={2} {...s} strokeWidth={1.8} /><Circle cx={10} cy={16} r={2} {...s} strokeWidth={1.8} /></>);
    case 'orb':
      return (<><Circle cx={12} cy={12} r={7.5} fill={color} stroke="none" /><Circle cx={9.6} cy={9.4} r={2.3} fill="rgba(255,255,255,0.65)" stroke="none" /></>);
    case 'refresh':
      return (<><Path d="M20 12a8 8 0 1 1-2.6-5.9" {...s} strokeWidth={1.9} /><Polyline points="20,3.6 20,7.6 16,7.6" {...s} strokeWidth={1.9} /></>);
    case 'check':
      return <Path d="m5 12.6 4.6 4.6L19 6.8" {...s} strokeWidth={2.2} />;
    case 'send':
      return <Path d="M21 3 10.5 13.5M21 3l-6.6 18-3.9-7.5L3 9.6 21 3Z" {...s} />;
    case 'sparkle':
      return <Path d="M12 3.2 13.7 9l5.8 1.7-5.8 1.7L12 18.2 10.3 12.4 4.5 10.7 10.3 9 12 3.2Z" fill={color} stroke="none" />;
    case 'grid':
      return (<><Rect x={4} y={4} width={6.4} height={6.4} rx={2} fill={color} stroke="none" /><Rect x={13.6} y={4} width={6.4} height={6.4} rx={2} fill={color} stroke="none" /><Rect x={4} y={13.6} width={6.4} height={6.4} rx={2} fill={color} stroke="none" /><Rect x={13.6} y={13.6} width={6.4} height={6.4} rx={2} fill={color} stroke="none" /></>);
    case 'compass':
      return (<><Circle cx={12} cy={12} r={8.6} {...s} strokeWidth={1.8} /><Path d="m15.6 8.4-2 5.2-5.2 2 2-5.2 5.2-2Z" fill={color} stroke="none" /></>);
    case 'pin':
      return (<><Path d="M12 21s6.4-6.1 6.4-10.4A6.4 6.4 0 1 0 5.6 10.6C5.6 14.9 12 21 12 21Z" {...s} /><Circle cx={12} cy={10.3} r={2.3} {...s} /></>);
    case 'flower':
      return (<><Circle cx={12} cy={7.6} r={3.3} fill={color} stroke="none" opacity={0.9} /><Circle cx={16.4} cy={13.6} r={3.3} fill={color} stroke="none" opacity={0.75} /><Circle cx={7.6} cy={13.6} r={3.3} fill={color} stroke="none" opacity={0.75} /><Circle cx={12} cy={16.4} r={3} fill={color} stroke="none" opacity={0.6} /></>);
    case 'video':
      return (<><Rect x={3} y={6.4} width={12.6} height={11.2} rx={3} {...s} /><Path d="m16.6 11 4.4-2.8v7.6L16.6 13z" {...s} /></>);
    case 'list':
      return (<><Circle cx={6} cy={7.5} r={1.5} fill={color} stroke="none" /><Circle cx={6} cy={12} r={1.5} fill={color} stroke="none" /><Circle cx={6} cy={16.5} r={1.5} fill={color} stroke="none" /><Path d="M10.5 7.5H19M10.5 12H19M10.5 16.5H19" {...s} strokeWidth={1.8} /></>);
    case 'note':
      return (<><Rect x={4.5} y={3.5} width={15} height={17} rx={2.6} {...s} /><Path d="M8.4 8.6h7.2M8.4 12.2h7.2M8.4 15.8h4.4" {...s} /></>);
    case 'music':
      return (<><Path d="M9.4 17.4V6.6l9-1.8v10.4" {...s} /><Circle cx={7.1} cy={17.6} r={2.4} {...s} /><Circle cx={16.1} cy={15.6} r={2.4} {...s} /></>);
    case 'tv':
      return (<><Rect x={3} y={5} width={18} height={12.4} rx={2.6} {...s} /><Path d="M8.5 20.4h7" {...s} /></>);
    case 'podcast':
      return (<><Circle cx={12} cy={9.2} r={3.2} {...s} /><Path d="M8 15.6a5.4 5.4 0 0 1 8 0M12 12.8v7.6" {...s} /></>);
    case 'news':
      return (<><Rect x={3.4} y={5} width={17.2} height={14} rx={2.4} {...s} /><Path d="M7 9h5.4v4H7zM15 9h2.4M15 12h2.4M7 15.6h10.4" {...s} /></>);
    case 'smile':
      return (<><Circle cx={12} cy={12} r={8.6} {...s} /><Circle cx={9.4} cy={10.2} r={1.15} fill={color} stroke="none" /><Circle cx={14.6} cy={10.2} r={1.15} fill={color} stroke="none" /><Path d="M8.6 14.4c.9 1.1 2.1 1.7 3.4 1.7s2.5-.6 3.4-1.7" {...s} /></>);
    case 'trash':
      return (<><Path d="M4.6 6.6h14.8M9.4 6.6V4.8h5.2v1.8M6.6 6.6l1 12.6h8.8l1-12.6" {...s} /></>);
    case 'bolt':
      return <Path d="M13.4 2.6 4.8 13.4h5.6L10.6 21.4l8.6-10.8h-5.6l-.2-8Z" fill={color} stroke="none" />;
    case 'plus':
      return <Path d="M12 5v14M5 12h14" {...s} strokeWidth={2} />;
    default:
      return <Circle cx={12} cy={12} r={8} {...s} />;
  }
}
