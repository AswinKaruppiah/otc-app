import { useState } from "react";
import { View } from "react-native";
import TransactionsHeader from "./TransactionsHeader";
import TransactionList from "./TransactionList";

export default function TransactionsOverview() {
  const [searchVal, setSearchVal] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const handleSearchSubmit = () => {
    setActiveSearch(searchVal);
  };

  return (
    <View className="flex-1 w-full">
      {/* Header component with search, title and filter icon */}
      <TransactionsHeader
        totalCount={totalCount}
        searchVal={searchVal}
        onSearchChange={setSearchVal}
        onSearchPress={handleSearchSubmit}
        onFilterPress={() => {
          // No status filters applied
        }}
      />

      {/* List of transactions */}
      <View>
        <TransactionList
          search={activeSearch}
          onCountChange={setTotalCount}
        />
      </View>
    </View>
  );
}
