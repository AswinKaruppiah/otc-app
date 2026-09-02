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

export const TIMELINE_STEP_CONFIG = {
  pending: {
    iconName: "clock",
    circleBg: "bg-white/5 border border-white/20",
    iconColor: "rgba(255, 255, 255, 0.4)",
    titleColor: "text-gray-400",
    lineColor: "bg-white/25",
  },
  completed: {
    iconName: "check",
    circleBg: "bg-noirMint/10 border border-noirMint",
    iconColor: "#baffd8",
    titleColor: "text-noirMint",
    lineColor: "bg-noirMint/50",
  },
  active: {
    iconName: "loader",
    circleBg: "bg-noirMint border border-noirMint",
    iconColor: "#060E0B",
    titleColor: "text-noirMint",
    lineColor: "bg-noirMint/50",
  },
  rejected: {
    iconName: "x",
    circleBg: "bg-red-500/10 border border-red-500/40",
    iconColor: "#ef4444",
    titleColor: "text-red-400",
    lineColor: "bg-red-500/40",
  },
};

/**
 * Withdrawal History Status Filter Tabs
 */
export const WITHDRAWAL_STATUS_TABS = [
  { label: "All Status", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Failed", value: "failed" },
];

/**
 * Withdrawal History Item Status UI Configuration
 * Synchronized with backend Mongoose WithdrawalTransaction model & Fystack SDK webhooks:
 * ('pending', 'processing', 'completed', 'confirmed', 'success', 'executing', 'executed', 'failed', 'cancelled', 'canceled', 'rejected', 'approval_pending')
 */
export const WITHDRAWAL_STATUS_CONFIG = {
  completed: {
    label: "Completed",
    textClass: "text-noirMint",
    bgClass: "bg-noirMint/10 border-noirMint/25",
    iconName: "check-circle",
    iconColor: "#baffd8",
  },
  confirmed: {
    label: "Completed",
    textClass: "text-noirMint",
    bgClass: "bg-noirMint/10 border-noirMint/25",
    iconName: "check-circle",
    iconColor: "#baffd8",
  },
  success: {
    label: "Completed",
    textClass: "text-noirMint",
    bgClass: "bg-noirMint/10 border-noirMint/25",
    iconName: "check-circle",
    iconColor: "#baffd8",
  },
  processing: {
    label: "Processing",
    textClass: "text-noirCyan",
    bgClass: "bg-noirCyan/10 border-noirCyan/25",
    iconName: "refresh-cw",
    iconColor: "#96dded",
  },
  executing: {
    label: "Processing",
    textClass: "text-noirCyan",
    bgClass: "bg-noirCyan/10 border-noirCyan/25",
    iconName: "refresh-cw",
    iconColor: "#96dded",
  },
  executed: {
    label: "Processing",
    textClass: "text-noirCyan",
    bgClass: "bg-noirCyan/10 border-noirCyan/25",
    iconName: "refresh-cw",
    iconColor: "#96dded",
  },
  pending: {
    label: "Pending",
    textClass: "text-amber-400",
    bgClass: "bg-amber-500/10 border-amber-500/25",
    iconName: "clock",
    iconColor: "#fbbf24",
  },
  approval_pending: {
    label: "Approval Pending",
    textClass: "text-amber-400",
    bgClass: "bg-amber-500/10 border-amber-500/25",
    iconName: "clock",
    iconColor: "#fbbf24",
  },
  awaiting_approval: {
    label: "Awaiting Approval",
    textClass: "text-amber-400",
    bgClass: "bg-amber-500/10 border-amber-500/25",
    iconName: "clock",
    iconColor: "#fbbf24",
  },
  failed: {
    label: "Failed",
    textClass: "text-red-400",
    bgClass: "bg-red-500/10 border-red-500/25",
    iconName: "alert-circle",
    iconColor: "#f87171",
  },
  rejected: {
    label: "Rejected",
    textClass: "text-red-400",
    bgClass: "bg-red-500/10 border-red-500/25",
    iconName: "x-circle",
    iconColor: "#f87171",
  },
  cancelled: {
    label: "Cancelled",
    textClass: "text-gray-400",
    bgClass: "bg-white/5 border-white/10",
    iconName: "x-circle",
    iconColor: "#9ca3af",
  },
  canceled: {
    label: "Cancelled",
    textClass: "text-gray-400",
    bgClass: "bg-white/5 border-white/10",
    iconName: "x-circle",
    iconColor: "#9ca3af",
  },
};

/**
 * Safely resolves withdrawal status config with graceful fallback for unmapped statuses
 */
export const getWithdrawalStatusConfig = (status) => {
  if (!status) return WITHDRAWAL_STATUS_CONFIG.pending;
  const key = String(status).toLowerCase().trim();
  return (
    WITHDRAWAL_STATUS_CONFIG[key] || {
      label: String(status)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      textClass: "text-gray-300",
      bgClass: "bg-white/5 border-white/10",
      iconName: "info",
      iconColor: "#9ca3af",
    }
  );
};

