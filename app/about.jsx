import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function About() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <StatusBar style="light" />

      {/* Header Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>💱 CurrenSea</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>About</Text>
      <Text style={styles.subtitle}>
        Your smart currency companion for seamless conversions on the go.
      </Text>

      {/* Cards */}
      <View style={styles.card}>
        <Text style={styles.cardIcon}>🌍</Text>
        <Text style={styles.cardTitle}>150+ Currencies</Text>
        <Text style={styles.cardDesc}>
          Real-time exchange rates from around the world, always up to date.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardIcon}>⚡</Text>
        <Text style={styles.cardTitle}>Instant Conversions</Text>
        <Text style={styles.cardDesc}>
          Blazing fast calculations with live market data at your fingertips.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardIcon}>📊</Text>
        <Text style={styles.cardTitle}>Rate History</Text>
        <Text style={styles.cardDesc}>
          Track how currencies have moved over time with beautiful charts.
        </Text>
      </View>

      {/* Version Info */}
      <Text style={styles.version}>Version 1.0.0 • Made with ❤️</Text>

      {/* Back Link */}
      <Link href="/" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>← Back to Home</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  badge: {
    backgroundColor: "#2e7d5e",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
  },
  badgeText: {
    color: "#a8f0d4",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#9ba3af",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 36,
    maxWidth: 300,
  },
  card: {
    width: "100%",
    backgroundColor: "#1e2227",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2e333a",
    alignItems: "flex-start",
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: "#9ba3af",
    lineHeight: 20,
  },
  version: {
    color: "#555c66",
    fontSize: 13,
    marginTop: 12,
    marginBottom: 28,
  },
  button: {
    backgroundColor: "#2e7d5e",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
