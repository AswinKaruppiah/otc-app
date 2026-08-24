import Svg, { Path } from "react-native-svg";

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
