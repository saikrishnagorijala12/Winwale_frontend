export const formatCurrency = (value?: number | null): string => {
  if (value === undefined || value === null) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};