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

