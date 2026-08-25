import { View } from "react-native";
import { ExchangeCard } from "./Exchange";
import { Button } from "heroui-native";
import PageContainer from "../../components/PageContainer";

/**
 * Home/Index Screen — Main dashboard of the Quotex application.
 * Rebuilt using the premium Noir theme colors and typography:
 *   - Base Font:  (Noir-Regular) /  (Noir-Medium)
 *   - Cards Color: bg-noirCard (#1d282d)
 *   - Accents: text-noirMint / bg-noirMint (#baffd8), text-noirCyan / bg-noirCyan (#96dded)
 */

export default function HomeOverview() {
  return (
    <PageContainer>
      <View className="w-full">
        <ExchangeCard />
      </View>
    </PageContainer>
  );
}
