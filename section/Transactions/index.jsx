import { useState } from "react";
import { View } from "react-native";
import { useQuery } from "@apollo/client/react";
import { LIST_ORDERS } from "../../apollo/query";
import TransactionsHeader from "./TransactionsHeader";
import TransactionList from "./TransactionList";

export default function TransactionsOverview() {
  const [filters, setFilters] = useState({
    search: "",
    status: null,
    dateFrom: null,
    dateTo: null,
  });

  const queryVariables = {
    page: 1,
    limit: 10,
  };
  if (filters.search) queryVariables.search = filters.search;
  if (filters.status) queryVariables.status = [filters.status];
  if (filters.dateFrom && filters.dateTo) {
    queryVariables.dateFrom = filters.dateFrom;
    queryVariables.dateTo = filters.dateTo;
  }

  const { data, loading, error } = useQuery(LIST_ORDERS, {
    variables: queryVariables,
  });

  const totalCount = data?.listOrders?.total || 0;
  const ordersList = data?.listOrders?.items || [];
  const hasActiveFilters = !!filters.search || !!filters.status || (!!filters.dateFrom && !!filters.dateTo);

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
        loading={loading}
      />

      {/* List of transactions */}
      <View>
        <TransactionList
          ordersList={ordersList}
          loading={loading}
          error={error}
          hasActiveFilters={hasActiveFilters}
        />
      </View>
    </View>
  );
}
