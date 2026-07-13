import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_ORDER } from "../apollo/mutation";
import { LIST_ORDERS } from "../apollo/query";
import * as SecureStore from "../utils/secureStore";
import { useToast } from "heroui-native";
import { haptic } from "../utils/haptics";

/**
 * Uploads a payment proof file to the GraphQL server.
 * Handles React Native specific FormData file formatting.
 */
const uploadPaymentProof = async ({ file, amount, title, orderId, utr }) => {
  const formData = new FormData();

  // 1️⃣ operations
  formData.append(
    "operations",
    JSON.stringify({
      query: `
        mutation AddPaymentProof($input: AddPaymentInput!) {
          addPaymentProof(input: $input) {
            id
            paymentIndex
            amount
            currency
            screenshotKey
            submittedAt
            status
          }
        }
      `,
      variables: {
        input: {
          orderId,
          currency: "INR",
          amount: parseFloat(amount),
          screenshot: null, // IMPORTANT
          title,
          utr
        },
      },
    })
  );

  // 2️⃣ map
  formData.append(
    "map",
    JSON.stringify({
      "0": ["variables.input.screenshot"],
    })
  );

  const token = await SecureStore.getItemAsync("accessToken");

  // 3️⃣ file in React Native format
  formData.append("0", {
    uri: file.uri,
    name: file.name || `screenshot_${Date.now()}.${file.uri.split(".").pop() || "jpg"}`,
    type: file.mimeType || (file.name?.endsWith(".pdf") ? "application/pdf" : "image/jpeg"),
  });

  const serverUrl = process.env.EXPO_PUBLIC_GRAPHQL_API_URL;

  // 4️⃣ fetch request
  const res = await fetch(serverUrl, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "apollo-require-preflight": "true",
    },
  });

  if (!res.ok) {
    throw new Error(`Upload failed with status ${res.status}`);
  }

  const data = await res.json();
  if (data.errors && data.errors.length > 0) {
    throw new Error(data.errors[0].message);
  }
  return data;
};


/**
 * Custom hook to handle order placement and payment proof upload flow.
 */
export function usePaymentUpload() {
  const [proofsList, setProofsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [createOrder] = useMutation(CREATE_ORDER, {
    update(cache, { data: { createOrder: newOrder } }) {
      if (!newOrder) return;
      try {
        const queryOptions = {
          query: LIST_ORDERS,
          variables: { status: ["PENDING"] },
        };
        const existingData = cache.readQuery(queryOptions);
        if (existingData && existingData.listOrders) {
          cache.writeQuery({
            ...queryOptions,
            data: {
              listOrders: {
                ...existingData.listOrders,
                total: (existingData.listOrders.total || 0) + 1,
              },
            },
          });
        }
      } catch (e) {
        console.error("Error updating Apollo cache directly:", e);
      }
    },
  });

  const handleUpload = async ({ userBankId, inrAmount, usdtAmount, exchangeRate, onSuccess }) => {
    if (proofsList.length === 0) return;
    haptic.medium();
    setIsLoading(true);

    try {
      // 1️⃣ Create Order in backend
      const orderResponse = await createOrder({
        variables: {
          input: {
            side: "buy",
            rate: parseFloat(String(exchangeRate).replace(/,/g, "")),
            fiatCurrency: "INR",
            amountRequested: parseFloat(String(inrAmount).replace(/,/g, "")),
            cryptoAmountEstimated: parseFloat(String(usdtAmount).replace(/,/g, "")),
            fee: parseFloat(String(inrAmount).replace(/,/g, "")) * 0.01,
            userBankId: userBankId,
          },
        },
      });

      const resolvedOrderId = orderResponse?.data?.createOrder?.id;
      if (!resolvedOrderId) {
        throw new Error("Order creation failed. No order ID returned.");
      }

      // 2️⃣ Upload all payment proofs
      const uploadPromises = proofsList.map((proof) =>
        uploadPaymentProof({
          file: proof,
          amount: parseFloat(proof.amount),
          title: proof.title,
          orderId: resolvedOrderId,
          utr: proof.utr,
        })
      );

      await Promise.all(uploadPromises);

      haptic.success();
      toast.show({
        label: "Order Placed",
        description: "Your order has been placed and payment proofs uploaded successfully.",
        variant: "success",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Order submission error:", error);
      haptic.error();
      toast.show({
        label: "Submission Failed",
        description: error.message || "Failed to place order or upload proofs. Please try again.",
        variant: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    proofsList,
    setProofsList,
    isLoading,
    handleUpload,
  };
}
