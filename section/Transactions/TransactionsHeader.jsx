import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import FilterSheet from "./FilterSheet";

export default function TransactionsHeader({
  totalCount = 0,
  search = "",
  onSearchSubmit,
  currentStatus,
  currentDateFrom,
  currentDateTo,
  onApplyFilters,
  onClearFilters,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchVal, setSearchVal] = useState(search);
  const hasActiveFilters = !!currentStatus || !!currentDateFrom || !!currentDateTo;

  // Sync internal search field when parent search is cleared or changed externally
  useEffect(() => {
    setSearchVal(search);
  }, [search]);

  return (
    <View className="w-full pb-4">
      {/* Top Row: Title, Count & Filter Button */}
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-3xl text-noirText font-noir font-bold tracking-tight">
            Order's History
          </Text>
          <Text className="text-sm text-gray-400 font-noir mt-1">
            {totalCount} Trades
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsFilterOpen(true)}
          className="w-10 h-10 items-center justify-center relative"
          activeOpacity={0.7}
        >
          <Feather name="sliders" size={25} color="#baffd8" />
          {hasActiveFilters && (
            <View className="absolute top-1 right-1 w-2.5 h-2.5 bg-noirMint border border-[#111418] rounded-full" />
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Row: Search Bar */}
      <View className="flex-1 flex-row items-center bg-white/5 border border-white/[0.08] rounded-full py-1.5 pl-4 pr-1.5 gap-2.5">
        <TextInput
          value={searchVal}
          onChangeText={setSearchVal}
          onSubmitEditing={() => onSearchSubmit(searchVal)}
          placeholder="Search..."
          placeholderTextColor="rgba(255, 255, 255, 0.3)"
          className="flex-1 text-[15px] text-noirText font-noir p-0 m-0"
          style={{ paddingVertical: 0 }}
        />
        <TouchableOpacity
          onPress={() => onSearchSubmit(searchVal)}
          className="bg-noirMint w-10 h-10 rounded-full items-center justify-center"
          activeOpacity={0.8}
        >
          <Feather name="search" size={18} color="#111418" />
        </TouchableOpacity>
      </View>

      {/* Filter Bottom Sheet */}
      <FilterSheet
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        currentStatus={currentStatus}
        currentDateFrom={currentDateFrom}
        currentDateTo={currentDateTo}
        onApply={onApplyFilters}
        onClear={onClearFilters}
      />
    </View>
  );
}
