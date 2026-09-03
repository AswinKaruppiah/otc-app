import React from "react";
import { View, Text } from "react-native";

/**
 * ProfileMenuGroup — Visual grouped card containing labeled menu items.
 */
export default function ProfileMenuGroup({ title, children }) {
  return (
    <View className="w-full mb-5">
      {title ? (
        <Text className="text-[11px] font-noir font-medium uppercase tracking-wider text-gray-400 mb-2 pl-2">
          {title}
        </Text>
      ) : null}
      <View className="w-full bg-noirCard border border-white/[0.06] rounded-3xl p-1.5 overflow-hidden">
        {children}
      </View>
    </View>
  );
}
