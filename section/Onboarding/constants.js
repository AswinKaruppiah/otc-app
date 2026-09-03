export const TURNOVER_OPTIONS = [
  { key: "below-50k", label: "Below ₹50,000" },
  { key: "50k-1l", label: "₹50,000 – ₹1,00,000" },
  { key: "1l-5l", label: "₹1,00,000 – ₹5,00,000" },
  { key: "above-5l", label: "Above ₹5,00,000" },
];

export const ACCOUNT_TYPE_OPTIONS = [
  {
    key: "individual",
    label: "Individual Account",
    description: "Personal trading, instant DigiLocker KYC, and fast bank withdrawals.",
    icon: "user",
    disabled: false,
    badge: "Personal",
    color: "#baffd8",
  },
  {
    key: "corporate",
    label: "Business Account",
    description: "Institutional OTC desk, higher volume limits, and company invoicing.",
    icon: "briefcase",
    disabled: false,
    badge: "Corporate",
    color: "#96dded",
  },
];
