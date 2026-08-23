/**
 * Currency and Number Formatter for Indian Rupees (INR / ₹)
 * Ensures standard representation e.g. ₹40,000, ₹5,500, ₹1,250
 */
export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  const rounded = Math.round(amount);
  return `₹${rounded.toLocaleString('en-IN')}`;
}

export function formatINRWithSign(amount: number): string {
  const sign = amount >= 0 ? '+' : '-';
  const abs = Math.abs(Math.round(amount));
  return `${sign}₹${abs.toLocaleString('en-IN')}`;
}
