import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

/**
 * ScreenBackground — Obsidian black theme powered by NativeWind
 *   Base: #111418  (noirBg)
 *   ① Bottom-centre mint green glow
 *   ② Top-right deep cyan glow
 *   ③ Top-left mint/cyan glow
 */
export default function ScreenBackground({ children, style }) {
  return (
    <View className="flex-1 bg-noirBg" style={style}>
      {/* ① Bottom-centre mint glow */}
      <LinearGradient
        colors={["rgba(186, 255, 216, 0.06)", "rgba(186, 255, 216, 0)"]}
        locations={[0, 0.6]}
        start={{ x: 0.5, y: 1.0 }}
        end={{ x: 0.5, y: 0.2 }}
        className="absolute inset-0"
      />

      {/* ② Top-right deep cyan glow */}
      <LinearGradient
        colors={["rgba(150, 221, 237, 0.04)", "rgba(150, 221, 237, 0)"]}
        locations={[0, 0.55]}
        start={{ x: 0.9, y: 0.8 }}
        end={{ x: 0.2, y: 0.1 }}
        className="absolute inset-0"
      />

      {/* ③ Top-left mint glow */}
      <LinearGradient
        colors={["rgba(186, 255, 216, 0.03)", "rgba(186, 255, 216, 0)"]}
        locations={[0, 0.55]}
        start={{ x: 0.1, y: 0.2 }}
        end={{ x: 0.8, y: 0.9 }}
        className="absolute inset-0"
      />

      {children}
    </View>
  );
}

