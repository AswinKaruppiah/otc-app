import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Select } from "heroui-native";
import { WITHDRAWAL_STATUS_TABS as TABS } from "../../../utils/constants";

/**
 * WithdrawHistoryHeader — Header with Title, Count badge, and HeroUI Filter Select dropdown.
 */
export default function WithdrawHistoryHeader({
  count = 0,
  activeTab = "",
  onSelectTab,
}) {
  const activeTabObj = TABS.find((t) => t.value === activeTab) || TABS[0];

  return (
    <View className="flex-row items-center justify-between mb-4 pl-1">
      {/* Title & Count Badge */}
      <View className="flex-row items-center gap-2">
        <Text className="font-noir font-semibold text-sm text-white">
          Transaction History
        </Text>
        {count > 0 && (
          <View className="bg-white/10 border border-white/10 rounded-full px-2 py-0.5">
            <Text className="font-noir text-[10px] text-gray-300">
              {count}
            </Text>
          </View>
        )}
      </View>

      {/* HeroUI Native Select Dropdown */}
      <Select
        presentation="bottom-sheet"
        value={{ value: activeTab, label: activeTabObj.label }}
        onValueChange={(option) => {
          if (option && !Array.isArray(option)) {
            onSelectTab(option.value || "");
          }
        }}
      >
        <Select.Trigger variant="unstyled" asChild>
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/10"
          >
            <Text className="font-noir text-xs font-medium text-noirMint">
              {activeTabObj.label}
            </Text>
            <Feather name="chevron-down" size={13} color="#baffd8" />
          </TouchableOpacity>
        </Select.Trigger>
        <Select.Portal>
          <Select.Overlay className="bg-black/80" />
          <Select.Content
            presentation="bottom-sheet"
            contentContainerClassName="p-6 pb-10"
          >
            <Select.ListLabel className="text-base text-white font-noir-bold mb-4">
              Filter Transactions
            </Select.ListLabel>
            {TABS.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                label={opt.label}
                className="flex-row items-center justify-between py-3.5"
              >
                {({ isSelected }) => (
                  <View className="flex-row items-center justify-between w-full">
                    <Text
                      className={`font-noir text-sm ${isSelected ? "text-noirMint font-bold" : "text-gray-300 font-medium"
                        }`}
                    >
                      {opt.label}
                    </Text>
                    {isSelected && <Feather name="check" size={16} color="#baffd8" />}
                  </View>
                )}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Portal>
      </Select>
    </View>
  );
}
