import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

/**
 * ScreenBackground — Navy Blue & Black theme
 *   Base: #050608  (near-black)
 *   ① Bottom-centre navy glow
 *   ② Top-right deep navy glow
 *   ③ Top-left navy glow
 */
export default function ScreenBackground({ children, style }) {
  return (
    <View style={[styles.root, style]}>
      {/* ① Bottom-centre navy glow */}
      <LinearGradient
        colors={["rgba(15,52,120,0.55)", "rgba(15,52,120,0)"]}
        locations={[0, 0.6]}
        start={{ x: 0.5, y: 1.0 }}
        end={{ x: 0.5, y: 0.2 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* ② Top-right deep navy glow */}
      <LinearGradient
        colors={["rgba(10,35,90,0.40)", "rgba(10,35,90,0)"]}
        locations={[0, 0.55]}
        start={{ x: 0.9, y: 0.8 }}
        end={{ x: 0.2, y: 0.1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* ③ Top-left navy glow */}
      <LinearGradient
        colors={["rgba(15,52,120,0.40)", "rgba(15,52,120,0)"]}
        locations={[0, 0.55]}
        start={{ x: 0.1, y: 0.2 }}
        end={{ x: 0.8, y: 0.9 }}
        style={StyleSheet.absoluteFillObject}
      />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#050608",
  },
});
