import React from 'react';
import Svg, {
  Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop, Text as SvgText,
} from 'react-native-svg';

export type DockGlyphId =
  | 'finder' | 'launchpad' | 'safari' | 'messages' | 'mail' | 'maps' | 'photos'
  | 'facetime' | 'calendar' | 'contacts' | 'reminders' | 'notes' | 'music'
  | 'appletv' | 'podcasts' | 'news' | 'settings' | 'sentient'
  | 'chrome' | 'phone' | 'appstore'
  | 'textedit' | 'preview' | 'spotify' | 'folder' | 'document' | 'trash';

/**
 * Dock artwork. Each icon is a self-contained 100x100 drawing so it reads at
 * dock scale the way the real macOS icons do — layered fills, not line glyphs.
 * `bleed: false` icons (folder, document, trash) sit free on the bar with no tile.
 */
export const BLEEDLESS: DockGlyphId[] = ['folder', 'document', 'trash'];

export function DockGlyph({ id, size }: { id: DockGlyphId; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {art(id)}
    </Svg>
  );
}

const grad = (id: string, from: string, to: string, vertical = true) => (
  <Defs>
    <LinearGradient id={id} x1="0" y1="0" x2={vertical ? '0' : '1'} y2={vertical ? '1' : '0'}>
      <Stop offset="0" stopColor={from} />
      <Stop offset="1" stopColor={to} />
    </LinearGradient>
  </Defs>
);

const Tile = ({ fill }: { fill: string }) => <Rect x={0} y={0} width={100} height={100} fill={fill} />;

function art(id: DockGlyphId) {
  switch (id) {
    case 'finder':
      return (
        <G>
          {grad('fnA', '#4EA8F0', '#1E7FD8')}
          <Tile fill="url(#fnA)" />
          <Path d="M50 0h50v100H50z" fill="#F4F7FA" />
          <Path d="M50 0h50v100H50z" fill="#E8EEF4" opacity={0.5} />
          <Rect x={28} y={30} width={7} height={17} rx={3.5} fill="#123A5E" />
          <Rect x={65} y={30} width={7} height={17} rx={3.5} fill="#123A5E" />
          <Path d="M26 62c7 9 15 13 24 13s17-4 24-13" stroke="#123A5E" strokeWidth={5.5} fill="none" strokeLinecap="round" />
        </G>
      );

    case 'launchpad': {
      const cells = [
        ['#F2564D', '#F0913C', '#F4C63D'],
        ['#5BC55F', '#3FA9F5', '#8D6BF0'],
        ['#EF6BA8', '#34C7C0', '#9AA1AC'],
      ];
      return (
        <G>
          {grad('lpA', '#FBFBFD', '#D9DBE0')}
          <Tile fill="url(#lpA)" />
          {cells.map((row, r) =>
            row.map((c, i) => (
              <Rect
                key={`${r}-${i}`}
                x={17 + i * 25}
                y={17 + r * 25}
                width={16}
                height={16}
                rx={4.5}
                fill={c}
              />
            )),
          )}
        </G>
      );
    }

    case 'safari':
      return (
        <G>
          {grad('sfA', '#FDFDFE', '#DDE2E8')}
          <Tile fill="url(#sfA)" />
          <Circle cx={50} cy={50} r={37} fill="#2E9BE8" />
          <Circle cx={50} cy={50} r={31} fill="#F6F9FC" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return (
              <Path
                key={i}
                d={`M${50 + 28 * Math.sin(a)} ${50 - 28 * Math.cos(a)} L${50 + 24 * Math.sin(a)} ${50 - 24 * Math.cos(a)}`}
                stroke="#9AA6B2"
                strokeWidth={1.6}
                strokeLinecap="round"
              />
            );
          })}
          <Path d="M70 30 46 46 30 70l24-16z" fill="#DDE1E6" />
          <Path d="M70 30 50 50l4.5 4.5z" fill="#FF5347" />
          <Path d="M70 30 50 50l-4.5-4.5z" fill="#F5271A" />
          <Circle cx={50} cy={50} r={2.6} fill="#FFFFFF" />
        </G>
      );

    case 'messages':
      return (
        <G>
          {grad('msA', '#6EE87C', '#12BC2E')}
          <Tile fill="url(#msA)" />
          <Path
            d="M50 21c-17.5 0-31 11.4-31 25.5 0 7.9 4.3 15 11 19.6-.8 4.6-3.2 8.6-6.6 11.6 5.9-.6 11.5-2.8 16.3-6.2 3.3.9 6.8 1.4 10.3 1.4 17.5 0 31-11.4 31-25.5S67.5 21 50 21Z"
            fill="#FFFFFF"
          />
        </G>
      );

    case 'mail':
      return (
        <G>
          {grad('mlA', '#54B9FF', '#0B6FE4')}
          <Tile fill="url(#mlA)" />
          <Rect x={16} y={30} width={68} height={41} rx={7} fill="#FFFFFF" />
          <Path d="M19 35 50 55l31-20" stroke="#BFD8F0" strokeWidth={4} fill="none" strokeLinejoin="round" />
        </G>
      );

    case 'maps':
      return (
        <G>
          <Tile fill="#EFE9D8" />
          <Path d="M0 0h46L20 44 0 38z" fill="#8FD08A" />
          <Path d="M62 0h38v30L70 40z" fill="#A5DC96" />
          <Path d="M0 72l36-12 34 16 30-8v32H0z" fill="#7EC2E8" />
          <Path d="M-4 46 42 28l26 24 40-10" stroke="#FFFFFF" strokeWidth={9} fill="none" />
          <Path d="M-4 46 42 28l26 24 40-10" stroke="#F0B93C" strokeWidth={4} fill="none" />
          <Circle cx={50} cy={50} r={20} fill="#1F6FE0" />
          <Path d="M50 37 62 63 50 56 38 63z" fill="#FFFFFF" />
        </G>
      );

    case 'photos': {
      const petals = ['#F2564D', '#F5943C', '#F4CE3D', '#7ED321', '#2FC4B2', '#3FA9F5', '#8D6BF0', '#EF5BA8'];
      return (
        <G>
          <Tile fill="#FDFDFD" />
          {petals.map((c, i) => {
            const a = i * 45;
            return (
              <Ellipse
                key={i}
                cx={50}
                cy={34}
                rx={11}
                ry={19}
                fill={c}
                opacity={0.82}
                transform={`rotate(${a} 50 50)`}
              />
            );
          })}
        </G>
      );
    }

    case 'facetime':
      return (
        <G>
          {grad('ftA', '#63E871', '#0FB92B')}
          <Tile fill="url(#ftA)" />
          <Rect x={18} y={33} width={44} height={34} rx={9} fill="#FFFFFF" />
          <Path d="m66 46 17-10v28l-17-10z" fill="#FFFFFF" />
        </G>
      );

    case 'calendar':
      return (
        <G>
          <Tile fill="#FFFFFF" />
          <SvgText x={50} y={30} fontSize={19} fontWeight="700" fill="#F5453C" textAnchor="middle">
            SEP
          </SvgText>
          <SvgText x={50} y={78} fontSize={46} fontWeight="400" fill="#2B2C2E" textAnchor="middle">
            8
          </SvgText>
        </G>
      );

    case 'contacts':
      return (
        <G>
          {grad('ctA', '#CFA173', '#7E5730')}
          <Tile fill="url(#ctA)" />
          <Rect x={16} y={12} width={62} height={76} rx={5} fill="#FAF7F2" />
          <Circle cx={47} cy={41} r={12} fill="#B08A63" />
          <Path d="M28 78c0-11 8.5-19 19-19s19 8 19 19z" fill="#B08A63" />
          <Rect x={80} y={20} width={7} height={11} rx={2} fill="#F2564D" />
          <Rect x={80} y={35} width={7} height={11} rx={2} fill="#F4C63D" />
          <Rect x={80} y={50} width={7} height={11} rx={2} fill="#5BC55F" />
          <Rect x={80} y={65} width={7} height={11} rx={2} fill="#3FA9F5" />
        </G>
      );

    case 'reminders':
      return (
        <G>
          <Tile fill="#FDFDFE" />
          {[
            ['#F5453C', 28],
            ['#F0913C', 50],
            ['#3FA9F5', 72],
          ].map(([c, y]) => (
            <G key={y as number}>
              <Circle cx={26} cy={y as number} r={7.5} fill="none" stroke={c as string} strokeWidth={3.5} />
              <Circle cx={26} cy={y as number} r={3} fill={c as string} />
              <Rect x={41} y={(y as number) - 3} width={36} height={6} rx={3} fill="#D7DADF" />
            </G>
          ))}
        </G>
      );

    case 'notes':
      return (
        <G>
          <Tile fill="#FCFCFA" />
          <Rect x={0} y={0} width={100} height={23} fill="#F5CE4B" />
          <Rect x={0} y={20} width={100} height={3} fill="#E0B93F" />
          {[38, 52, 66, 80].map((y, i) => (
            <Rect key={y} x={16} y={y} width={i === 3 ? 40 : 68} height={4.5} rx={2.2} fill="#DBDCDE" />
          ))}
        </G>
      );

    case 'music':
      return (
        <G>
          {grad('muA', '#FC6076', '#E00E38')}
          <Tile fill="url(#muA)" />
          <Path
            d="M42 68V33l30-6v33"
            stroke="#FFFFFF"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Ellipse cx={34} cy={69} rx={11} ry={9} fill="#FFFFFF" />
          <Ellipse cx={64} cy={62} rx={11} ry={9} fill="#FFFFFF" />
        </G>
      );

    case 'appletv':
      return (
        <G>
          <Tile fill="#0B0B0D" />
          <Path
            d="M52.5 40.5c0-4.2 3.4-6.1 3.6-6.3-2-2.9-5-3.3-6.1-3.3-2.6-.3-5.1 1.5-6.4 1.5s-3.4-1.5-5.5-1.5c-2.8 0-5.5 1.7-6.9 4.3-3 5.2-.8 12.9 2.1 17.1 1.4 2.1 3.1 4.4 5.3 4.3 2.1-.1 2.9-1.4 5.4-1.4s3.2 1.4 5.5 1.3c2.3 0 3.7-2.1 5.1-4.2 1.6-2.4 2.3-4.7 2.3-4.8-.1 0-4.4-1.7-4.4-6.8Zm-4.2-13.3c1.1-1.4 1.9-3.3 1.7-5.2-1.7.1-3.7 1.1-4.9 2.5-1 1.2-1.9 3.2-1.7 5 1.9.2 3.8-.9 4.9-2.3Z"
            fill="#FFFFFF"
          />
          <SvgText x={70} y={57} fontSize={30} fontWeight="700" fill="#FFFFFF" textAnchor="middle">
            tv
          </SvgText>
        </G>
      );

    case 'podcasts':
      return (
        <G>
          {grad('pcA', '#D07BF5', '#8B27D6')}
          <Tile fill="url(#pcA)" />
          <Path d="M24 52a26 26 0 1 1 52 0" stroke="#FFFFFF" strokeWidth={5.5} fill="none" opacity={0.5} strokeLinecap="round" />
          <Path d="M34 56a16 16 0 1 1 32 0" stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.75} strokeLinecap="round" />
          <Circle cx={50} cy={48} r={9.5} fill="#FFFFFF" />
          <Path d="M50 61c-6.5 0-10.5 3-10.5 6 0 4.6 2.2 14.5 4.4 16.4 1.6 1.3 10.6 1.3 12.2 0 2.2-1.9 4.4-11.8 4.4-16.4 0-3-4-6-10.5-6Z" fill="#FFFFFF" />
        </G>
      );

    case 'news':
      return (
        <G>
          <Tile fill="#FFFFFF" />
          {grad('nwA', '#FF5A7A', '#E8123F')}
          <Path
            d="M26 76V24h13l22 31V24h13v52H61L39 45v31z"
            fill="url(#nwA)"
          />
        </G>
      );

    case 'settings':
      return (
        <G>
          {grad('stA', '#A6ADB5', '#565C64')}
          <Tile fill="url(#stA)" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Rect
              key={i}
              x={44}
              y={11}
              width={12}
              height={20}
              rx={3}
              fill="#F1F3F5"
              transform={`rotate(${i * 45} 50 50)`}
            />
          ))}
          <Circle cx={50} cy={50} r={30} fill="#F1F3F5" />
          <Circle cx={50} cy={50} r={12} fill="#6B7178" />
        </G>
      );

    case 'sentient':
      return (
        <G>
          {grad('seA', '#132436', '#070C12')}
          <Tile fill="url(#seA)" />
          {grad('seB', '#CBE8FF', '#1A6FD6')}
          <Circle cx={50} cy={50} r={28} fill="url(#seB)" />
          <Ellipse cx={41} cy={39} rx={9} ry={7} fill="#FFFFFF" opacity={0.72} />
        </G>
      );

    case 'textedit':
      return (
        <G>
          <Tile fill="#FCFCFC" />
          {[30, 43, 56, 69].map((y, i) => (
            <Rect key={y} x={14} y={y} width={i === 3 ? 38 : 60} height={4} rx={2} fill="#D5D7DA" />
          ))}
          <Path d="M74 16 88 30 44 74l-17 4 4-17z" fill="#EDEFF2" stroke="#9BA1A8" strokeWidth={2.4} />
          <Path d="M74 16 88 30l-7 7-14-14z" fill="#5D646C" />
        </G>
      );

    case 'preview':
      return (
        <G>
          <Tile fill="#EAF1F7" />
          <Rect x={12} y={16} width={62} height={46} rx={4} fill="#BFE0F5" />
          <Circle cx={30} cy={30} r={6} fill="#FBE28A" />
          <Path d="M14 60 34 38l16 16 12-10 12 16z" fill="#7FB96E" />
          <Circle cx={62} cy={62} r={19} fill="none" stroke="#4A5058" strokeWidth={6} />
          <Circle cx={62} cy={62} r={15} fill="#CFE6F5" opacity={0.5} />
          <Path d="m76 76 12 12" stroke="#4A5058" strokeWidth={8} strokeLinecap="round" />
        </G>
      );

    case 'spotify':
      return (
        <G>
          <Tile fill="#0C0C0C" />
          <Circle cx={50} cy={50} r={33} fill="#1DB954" />
          <Path d="M33 41c11-3.5 25-2.5 34 3" stroke="#0C0C0C" strokeWidth={6} fill="none" strokeLinecap="round" />
          <Path d="M35 52c9-2.8 20-2 28 2.6" stroke="#0C0C0C" strokeWidth={5} fill="none" strokeLinecap="round" />
          <Path d="M37 62c7-2.2 15.5-1.6 22 2" stroke="#0C0C0C" strokeWidth={4} fill="none" strokeLinecap="round" />
        </G>
      );

    case 'folder':
      return (
        <G>
          {grad('fdA', '#8FD8FA', '#3FA9E8')}
          {grad('fdB', '#67C6F5', '#2C93DC')}
          <Path d="M6 26a5 5 0 0 1 5-5h24l8 9h46a5 5 0 0 1 5 5v10H6z" fill="url(#fdB)" />
          <Path d="M6 35h88v40a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5z" fill="url(#fdA)" />
        </G>
      );

    case 'document':
      return (
        <G>
          <Path d="M18 8h44l20 20v64a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z" fill="#FDFDFD" stroke="#C7CACE" strokeWidth={2} />
          <Path d="M62 8v20h20z" fill="#DFE2E6" />
          {[40, 50, 60, 70, 80].map((y, i) => (
            <Rect key={y} x={24} y={y} width={i === 4 ? 26 : 48} height={3.4} rx={1.7} fill="#B9BDC3" />
          ))}
        </G>
      );

    case 'trash':
      return (
        <G>
          <Path d="M34 16h32v5H34z" fill="#B7BCC2" />
          <Path d="M24 24h52l-5 66a6 6 0 0 1-6 5.5H35a6 6 0 0 1-6-5.5z" fill="#D6DADE" opacity={0.92} />
          <Path d="M24 24h52l-1 12H25z" fill="#E9ECEF" />
          {[38, 50, 62].map((x) => (
            <Rect key={x} x={x} y={40} width={4} height={45} rx={2} fill="#BEC3C9" opacity={0.85} />
          ))}
        </G>
      );

    case 'chrome':
      return (
        <G>
          <Tile fill="#FDFDFD" />
          <Circle cx={50} cy={50} r={34} fill="#F5F5F6" />
          <Path d="M50 16a34 34 0 0 1 29.5 17H50a17 17 0 0 0-15 8.9L20.6 27A34 34 0 0 1 50 16Z" fill="#EA4335" />
          <Path d="M20.6 27 35 41.9A17 17 0 0 0 42 63.4L27.4 79.6A34 34 0 0 1 20.6 27Z" fill="#34A853" />
          <Path d="M79.5 33A34 34 0 0 1 27.4 79.6L42 63.4a17 17 0 0 0 23-22.4Z" fill="#FBBC05" />
          <Circle cx={50} cy={50} r={14} fill="#4285F4" />
          <Circle cx={50} cy={50} r={10.5} fill="#FDFDFD" opacity={0.15} />
        </G>
      );

    case 'phone':
      return (
        <G>
          {grad('phA', '#6BE879', '#12B92C')}
          <Tile fill="url(#phA)" />
          <Path
            d="M32 22c4 0 6 1 8 5l4 8c1.6 3.2.8 5-1.6 7l-3.4 3c-1.6 1.4-1.8 2.6-.8 4.6a44 44 0 0 0 11.6 11.6c2 1 3.2.8 4.6-.8l3-3.4c2-2.4 3.8-3.2 7-1.6l8 4c4 2 5 4 5 8 0 5.4-4.6 10-11 10-19 0-45-26-45-45 0-6.4 4.6-11 10-11Z"
            fill="#FFFFFF"
          />
        </G>
      );

    case 'appstore':
      return (
        <G>
          {grad('asA', '#2FB6FF', '#0A64E8')}
          <Tile fill="url(#asA)" />
          <Path d="M38 26 62 68" stroke="#FFFFFF" strokeWidth={6.5} strokeLinecap="round" />
          <Path d="M62 26 38 68" stroke="#FFFFFF" strokeWidth={6.5} strokeLinecap="round" />
          <Path d="M26 55h48" stroke="#FFFFFF" strokeWidth={6.5} strokeLinecap="round" />
          <Path d="M31 68 27 75" stroke="#FFFFFF" strokeWidth={6.5} strokeLinecap="round" />
        </G>
      );

    default:
      return <Tile fill="#8A9098" />;
  }
}
