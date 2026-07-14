import { useState } from "react";
import { View } from "react-native";
import TransactionsHeader from "./TransactionsHeader";
import TransactionList from "./TransactionList";

export default function TransactionsOverview() {
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    search: "",
    status: null,
    dateFrom: null,
    dateTo: null,
  });

  const handleSearchSubmit = (val) => {
    setFilters((prev) => ({ ...prev, search: val }));
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
    setFilters({
      search: "",
      status: null,
      dateFrom: null,
      dateTo: null,
    });
  };

  return (
    <View className="flex-1 w-full">
      {/* Header component with search, title and filter icon */}
      <TransactionsHeader
        totalCount={totalCount}
        search={filters.search}
        onSearchSubmit={handleSearchSubmit}
        currentStatus={filters.status}
        currentDateFrom={filters.dateFrom ? filters.dateFrom.split("T")[0] : ""}
        currentDateTo={filters.dateTo ? filters.dateTo.split("T")[0] : ""}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* List of transactions */}
      <View>
        <TransactionList
          search={filters.search}
          status={filters.status}
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          onCountChange={setTotalCount}
        />
      </View>
    </View>
  );
}
