import { useState } from "react";
import { View } from "react-native";
import TransactionsHeader from "./TransactionsHeader";
import TransactionList from "./TransactionList";

export default function TransactionsOverview() {
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    searchVal: "",
    activeSearch: "",
    status: null,
    dateFrom: null,
    dateTo: null,
  });

  const handleSearchSubmit = () => {
    setFilters((prev) => ({ ...prev, activeSearch: prev.searchVal }));
  };

  const handleApplyFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      status: newFilters.status,
      dateFrom: newFilters.dateFrom,
      dateTo: newFilters.dateTo,
    }));
  };

  const handleClearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      status: null,
      dateFrom: null,
      dateTo: null,
    }));
  };

  return (
    <View className="flex-1 w-full">
      {/* Header component with search, title and filter icon */}
      <TransactionsHeader
        totalCount={totalCount}
        searchVal={filters.searchVal}
        onSearchChange={(val) => setFilters((prev) => ({ ...prev, searchVal: val }))}
        onSearchPress={handleSearchSubmit}
        currentStatus={filters.status}
        currentDateFrom={filters.dateFrom ? filters.dateFrom.split("T")[0] : ""}
        currentDateTo={filters.dateTo ? filters.dateTo.split("T")[0] : ""}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* List of transactions */}
      <View>
        <TransactionList
          search={filters.activeSearch}
          status={filters.status}
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          onCountChange={setTotalCount}
        />
      </View>
    </View>
  );
}
