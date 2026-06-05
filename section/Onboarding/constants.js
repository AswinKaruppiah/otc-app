export const TURNOVER_OPTIONS = [
  { key: "below-$50k", label: "Below $50,000" },
  { key: "$50k-$1l", label: "$50,000 – $1,00,000" },
  { key: "$1l-$5l", label: "$1,00,000 – $5,00,000" },
  { key: "above-$5l", label: "Above $5,00,000" },
];

export const ACCOUNT_TYPE_OPTIONS = [
  {
    key: "corporate",
    label: "Business Account",
    description: "Corporate trading, higher transaction limits, and institution features.",
    icon: "briefcase",
    disabled: false,
  },
  {
    key: "individual",
    label: "Individual Account",
    description: "Personal trading, fast verification, and quick withdrawals.",
    icon: "user",
    disabled: true,
    soon: true,
  },
];
