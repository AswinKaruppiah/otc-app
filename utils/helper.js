import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SecureStore from "./secureStore";

/**
 * Sanitizes input to allow only digits and a single decimal point
 * with at most two decimal places.
 */
export const sanitizeAmount = (val) => {
  if (!val) return "";
  const sanitized = val.replace(/[^0-9.]/g, "");
  const parts = sanitized.split(".");
  let clean = parts[0];
  if (parts.length > 1) {
    clean += "." + parts.slice(1).join("").slice(0, 2);
  }
  return clean;
};

/**
 * Formats a raw numeric string with thousand separator commas
 * for display readability, while preserving active typing states (like trailing dots).
 */
export const formatNumber = (val) => {
  if (!val) return "";
  const parts = val.split(".");
  // Add commas to the integer part
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (parts.length > 1) {
    return integerPart + "." + parts[1].slice(0, 2);
  }
  return integerPart;
};

/**
 * Returns the initials of a name, up to two letters.
 * Defaults to "U" if name is falsy.
 */
export const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Checks if a given error or its sub-errors indicate an authentication failure.
 */
export const isUnauthenticatedError = (error) => {
  const errors = error?.errors || error?.graphQLErrors || [];
  const hasUnauth = errors.some(
    (e) =>
      e?.extensions?.code === "UNAUTHENTICATED" ||
      e?.message?.includes("UNAUTHENTICATED") ||
      e?.message?.includes("Authentication required")
  );

  return (
    hasUnauth ||
    error?.message?.includes("UNAUTHENTICATED") ||
    error?.message?.includes("Authentication required")
  );
};

/**
 * Clear user session: Google sign out, delete SecureStore tokens, clear and reset Apollo store.
 */
export const clearAuthSession = async (client, middleware) => {
  try {
    await GoogleSignin.signOut().catch((e) => {
      console.log("GoogleSignin.signOut non-fatal or user not logged in:", e);
    });
  } catch (e) {
    console.warn("Failed Google SignOut:", e);
  }

  try {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("accessTokenExpiration");
  } catch (e) {
    console.error("Failed SecureStore token deletion:", e);
  }

  if (middleware && typeof middleware === "function") {
    try {
      await middleware();
    } catch (e) {
      console.error("Error executing clearAuthSession middleware:", e);
    }
  }

  if (client) {
    try {
      await client.clearStore();
    } catch (e) {
      const isAbort = e?.name === "AbortError" || e?.message?.toLowerCase().includes("abort");
      if (!isAbort && !isUnauthenticatedError(e)) {
        console.warn("Apollo clearStore error:", e);
      }
    }
  }
};

/**
 * Masks a bank account number to show only the last 4 digits.
 * If no account number is provided, optionally returns a default fallback mask.
 */
export const maskAccountNumber = (accountNumber, fallback = "**** 8821") => {
  if (!accountNumber) return fallback;
  // If the account number is already masked, return it
  if (accountNumber.startsWith("****")) return accountNumber;
  return `**** ${accountNumber.slice(-4)}`;
};


