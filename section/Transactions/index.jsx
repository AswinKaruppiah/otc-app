import { useState } from "react";
import { View, RefreshControl } from "react-native";
import { useQuery } from "@apollo/client/react";
import { LIST_ORDERS } from "../../apollo/query";
import TransactionsHeader from "./components/TransactionsHeader";
import TransactionList from "./components/TransactionList";
import PageContainer from "../../components/PageContainer";
import { useScreenPadding } from "../../context/ScrollContext";

export default function TransactionsOverview() {
  const { paddingTop } = useScreenPadding();
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

  const { data, loading, error, fetchMore, networkStatus, refetch } = useQuery(LIST_ORDERS, {
    variables: queryVariables,
    notifyOnNetworkStatusChange: true,
  });

  const isFetchingMore = loadingMore || networkStatus === 3;
  const isRefreshing = networkStatus === 4;
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

  const handleRefresh = async () => {
    setPage(1);
    try {
      await refetch({
        ...queryVariables,
        page: 1,
      });
    } catch (e) {
      console.error("Error refreshing transactions:", e);
    }
  };

  const handleLoadMore = async () => {
    if (isFetchingMore || ordersList.length >= totalCount) return;
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
    <PageContainer
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor="#baffd8"
          colors={["#baffd8"]}
          progressBackgroundColor="#181e25"
          progressViewOffset={paddingTop - 10}
        />
      }
    >
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
      <TransactionList
        ordersList={ordersList}
        loading={loading}
        error={error}
        hasActiveFilters={hasActiveFilters}
        hasMore={hasMore}
        loadingMore={isFetchingMore}
        onLoadMore={handleLoadMore}
      />
    </PageContainer>
  );
}
