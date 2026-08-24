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
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

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

  const { data, loading, error, fetchMore } = useQuery(LIST_ORDERS, {
    variables: queryVariables,
  });

  const totalCount = data?.listOrders?.total || 0;
  const ordersList = data?.listOrders?.items || [];
  const hasActiveFilters = !!filters.search || !!filters.status || (!!filters.dateFrom && !!filters.dateTo);

  const handleSearchSubmit = (val) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, search: val }));
  };

  const handleApplyFilters = (newFilters) => {
    setPage(1);
    setFilters((prev) => ({
      ...prev,
      status: newFilters.status,
      dateFrom: newFilters.dateFrom,
      dateTo: newFilters.dateTo,
    }));
  };

  const handleClearFilters = () => {
    setPage(1);
    setFilters({
      search: "",
      status: null,
      dateFrom: null,
      dateTo: null,
    });
  };

  const handleLoadMore = async () => {
    if (loadingMore || ordersList.length >= totalCount) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      await fetchMore({
        variables: {
          ...queryVariables,
          page: nextPage,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.listOrders) return prevResult;

          const existingIds = new Set(prevResult.listOrders?.items?.map((item) => item.id || item.orderId) || []);
          const newItems = (fetchMoreResult.listOrders?.items || []).filter(
            (item) => !existingIds.has(item.id || item.orderId)
          );

          return {
            listOrders: {
              ...fetchMoreResult.listOrders,
              total: fetchMoreResult.listOrders.total,
              items: [...(prevResult.listOrders?.items || []), ...newItems],
            },
          };
        },
      });
      setPage(nextPage);
    } catch (e) {
      console.error("Error fetching more transactions:", e);
    } finally {
      setLoadingMore(false);
    }
  };

  const hasMore = ordersList.length > 0 && ordersList.length < totalCount;

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
      <View className="flex-1">
        <TransactionList
          ordersList={ordersList}
          loading={loading}
          error={error}
          hasActiveFilters={hasActiveFilters}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={handleLoadMore}
        />
      </View>
    </View>
  );
}
