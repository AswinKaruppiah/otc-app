/**
 * Order Status Constants and UI Theme Styles
 */

export const ORDER_STATUS = {
  CREATED: "created",
  PENDING_PAYMENT: "pending_payment",
  PARTIAL_PAID: "partial_paid",
  PAYMENT_SUBMITTED: "payment_submitted",
  PAYMENT_VERIFIED: "payment_verified",
  APPROVED: "approved",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  REJECTED: "rejected",
  EXPIRED: "expired",
  FAILED: "failed",
};

export const ORDER_STATUS_STYLES = {
  created: {
    label: "Created",
    bg: "rgba(147, 197, 253, 0.15)",
    color: "#93c5fd",
  },
  pending_payment: {
    label: "Pending Payment",
    bg: "rgba(255, 193, 7, 0.15)",
    color: "#ffc107",
  },
  partial_paid: {
    label: "Partially Paid",
    bg: "rgba(251, 146, 60, 0.15)",
    color: "#fb923c",
  },
  payment_submitted: {
    label: "Payment Submitted",
    bg: "rgba(167, 139, 250, 0.15)",
    color: "#a78bfa",
  },
  payment_verified: {
    label: "Payment Verified",
    bg: "rgba(56, 189, 248, 0.15)",
    color: "#38bdf8",
  },
  approved: {
    label: "Approved",
    bg: "rgba(52, 211, 153, 0.15)",
    color: "#34d399",
  },
  completed: {
    label: "Completed",
    bg: "rgba(186, 255, 216, 0.15)",
    color: "#baffd8",
  },
  cancelled: {
    label: "Cancelled",
    bg: "rgba(156, 163, 175, 0.15)",
    color: "#9ca3af",
  },
  rejected: {
    label: "Rejected",
    bg: "rgba(239, 68, 68, 0.15)",
    color: "#ef4444",
  },
  expired: {
    label: "Expired",
    bg: "rgba(244, 63, 94, 0.15)",
    color: "#f43f5e",
  },
  failed: {
    label: "Failed",
    bg: "rgba(255, 90, 90, 0.15)",
    color: "#ff5a5a",
  },
};

export const DEFAULT_STATUS_STYLE = {
  label: "Unknown",
  bg: "rgba(255, 255, 255, 0.08)",
  color: "#9ca3af",
};

/**
 * Utility helper to get status styling configuration dynamically
 * Handles uppercase/lowercase strings and formats unknown status fallback labels.
 */
export const getOrderStatusStyle = (status) => {
  if (!status) return DEFAULT_STATUS_STYLE;
  const key = String(status).toLowerCase();
  return (
    ORDER_STATUS_STYLES[key] || {
      label: String(status)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      bg: "rgba(255, 255, 255, 0.08)",
      color: "#9ca3af",
    }
  );
};
