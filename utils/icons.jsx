import Svg, { Path, Circle, Rect, G } from "react-native-svg";

export function ThinArrowDown({ size = 28, color = "#baffd8", strokeWidth = 1.2 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4v16m0 0l-6-6m6 6l6-6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ReachedEndIcon({ size = 20, color = "#baffd8" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function DesertDuneSVG({ size = 240 }) {
  return (
    <Svg width={size} height={size * 0.5} viewBox="0 0 320 160" fill="none">
      {/* 1. Light Grey Sun Disk */}
      <Circle cx="118" cy="58" r="21" fill="#ECECEC" />

      {/* 2. Sand Dune (Back Layer / Shaded Valley & Right Peak) */}
      <Path
        d="M 65 145 C 88 145, 112 97, 128 97 C 150 97, 168 122, 198 104 C 220 90, 248 125, 275 145 Z"
        fill="#E0E0E0"
      />

      {/* 3. Sand Dune (Front Layer / Light Face & S-Ridge) */}
      <Path
        d="M 65 145 C 88 145, 112 97, 128 97 C 144 116, 154 135, 175 138 C 200 142, 240 144, 275 145 L 65 145 Z"
        fill="#F3F3F3"
      />

      {/* 4. Left Muted Background Cactus */}
      <G opacity={0.4}>
        <Rect x="50" y="122" width="6" height="23" rx="3" fill="#baffd8" />
        <Path d="M 44 130 C 44 135, 50 135, 50 135" stroke="#baffd8" strokeWidth="2.8" strokeLinecap="round" />
        <Rect x="42.5" y="127" width="3" height="6" rx="1.5" fill="#baffd8" />
        <Path d="M 56 132 C 61 132, 61 137, 61 137" stroke="#baffd8" strokeWidth="2.8" strokeLinecap="round" />
      </G>

      {/* 5. Foreground Cactus (Warm Amber Accent) */}
      <G>
        <Rect x="230" y="104" width="10" height="42" rx="5" fill="#FFA033" />
        <Path d="M 220 118 C 220 130, 230 130, 230 130" stroke="#FFA033" strokeWidth="5" strokeLinecap="round" />
        <Rect x="217.5" y="113" width="5" height="11" rx="2.5" fill="#FFA033" />
        <Path d="M 240 110 C 248 110, 248 122, 240 122" stroke="#FFA033" strokeWidth="5" strokeLinecap="round" />
      </G>
    </Svg>
  );
}
