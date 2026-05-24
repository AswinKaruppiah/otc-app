import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

/**
 * ScreenBackground — Navy Blue & Black theme powered by NativeWind
 *   Base: #050608  (near-black)
 *   ① Bottom-centre navy glow
 *   ② Top-right deep navy glow
 *   ③ Top-left navy glow
 */
export default function ScreenBackground({ children, style }) {
  return (
    <View className="flex-1 bg-[#050608]" style={style}>
      {/* ① Bottom-centre navy glow */}
      <LinearGradient
        colors={["rgba(15,52,120,0.55)", "rgba(15,52,120,0)"]}
        locations={[0, 0.6]}
        start={{ x: 0.5, y: 1.0 }}
        end={{ x: 0.5, y: 0.2 }}
        className="absolute inset-0"
      />

      {/* ② Top-right deep navy glow */}
      <LinearGradient
        colors={["rgba(10,35,90,0.40)", "rgba(10,35,90,0)"]}
        locations={[0, 0.55]}
        start={{ x: 0.9, y: 0.8 }}
        end={{ x: 0.2, y: 0.1 }}
        className="absolute inset-0"
      />

      {/* ③ Top-left navy glow */}
      <LinearGradient
        colors={["rgba(15,52,120,0.40)", "rgba(15,52,120,0)"]}
        locations={[0, 0.55]}
        start={{ x: 0.1, y: 0.2 }}
        end={{ x: 0.8, y: 0.9 }}
        className="absolute inset-0"
      />

      {children}
    </View>
  );
}
