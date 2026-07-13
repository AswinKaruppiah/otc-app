import { useEffect } from "react";
import { FlatList } from "react-native";
import { useQuery } from "@apollo/client/react";
import { LIST_ORDERS } from "../../apollo/query";
import TransactionCard from "./TransactionCard";

export default function TransactionList({ search, status, dateFrom, dateTo, onCountChange }) {
  const { data, loading, refetch } = useQuery(LIST_ORDERS, {
    variables: {
      search: search || null,
      status: status || null,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      page: 1,
      limit: 50,
    },
    fetchPolicy: "network-only",
  });

  const ordersList = data?.listOrders?.items || [];
  const totalCount = data?.listOrders?.total || 0;

  useEffect(() => {
    if (onCountChange) {
      onCountChange(totalCount);
    }
  }, [totalCount, onCountChange]);

  return (
    <FlatList
      data={ordersList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TransactionCard item={item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    />
  );
}
