import { View } from "react-native";
import { useRouter } from "expo-router";
import { ExchangeCard } from "./Exchange";

/**
 * Home/Index Screen — Main dashboard of the CurrenSea application.
 * Rebuilt using the premium Noir theme colors and typography:
 *   - Base Font:  (Noir-Regular) /  (Noir-Medium)
 *   - Cards Color: bg-noirCard (#1d282d)
 *   - Accents: text-noirMint / bg-noirMint (#baffd8), text-noirCyan / bg-noirCyan (#96dded)
 */

export default function HomeOverview() {
  const router = useRouter();

  const quickActions = [
    {
      name: "Withdraw",
      route: "/withdraw",
      icon: "arrow-down-right",
      color: "#baffd8",
    },
    { name: "Bank", route: "/bank", icon: "briefcase", color: "#96dded" },
    {
      name: "Activity",
      route: "/transactions",
      icon: "repeat",
      color: "#ffffff",
    },
    { name: "Profile", route: "/profile", icon: "user", color: "#ffffff" },
  ];

  return (
    <View className="w-full">
      <ExchangeCard />
    </View>
  );
}
