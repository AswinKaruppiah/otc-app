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

/**
 * Formats a bank account number by grouping digits into chunks of 4 separated by spaces.
 */
export const formatAccountNumber = (accountNumber) => {
  if (!accountNumber) return "";
  const cleaned = String(accountNumber).replace(/[-\s]/g, "");
  return cleaned.replace(/(.{4})/g, "$1 ").trim();
};

/**
 * Checks if a file is an image based on its mimeType or file extension.
 */
export const isImageFile = (f) => {
  if (!f) return false;
  if (f.mimeType?.startsWith("image/")) return true;
  const ext = f.name?.split(".").pop()?.toLowerCase();
  return ["png", "jpg", "jpeg"].includes(ext);
};

/**
 * Formats a file size in bytes to a human-readable string (B, KB, MB).
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

/**
 * Returns UTR field details (label and placeholder) dynamically based on the payment/transfer type.
 */
export const getUtrDetails = (paymentType) => {
  switch (paymentType) {
    case "UPI":
      return {
        label: "UPI Reference / Transaction ID",
        placeholder: "e.g. 12-digit transaction number",
      };
    case "IMPS":
      return {
        label: "Reference Number / UTR",
        placeholder: "e.g. 12-digit IMPS reference",
      };
    case "NEFT":
      return {
        label: "UTR Number (NEFT)",
        placeholder: "e.g. N123456789012345",
      };
    case "RTGS":
      return {
        label: "UTR Number (RTGS)",
        placeholder: "e.g. R123456789012345",
      };
    default:
      return {
        label: "UTR Number",
        placeholder: "e.g. Reference/UTR Number",
      };
  }
};
/**
 * Formats a Date object or ISO string to 'MMM D, YYYY' format (e.g. Jul 13, 2026).
 */
export const formatDate = (date) => {
  const dateObj = date ? new Date(date) : new Date();
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Masks a string showing first N and last N characters, e.g. "abcd...wxyz"
 */
export const maskText = (text, visibleLen = 4) => {
  if (!text) return "";
  const str = String(text);
  if (str.length <= visibleLen * 2) return str;
  return `${str.slice(0, visibleLen)}...${str.slice(-visibleLen)}`;
};
