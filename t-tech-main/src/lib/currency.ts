// Currency utilities for Ghana cedis (GHS)

/**
 * Format amount in Ghana cedis
 */
export function formatCurrency(amount: number): string {
  return `GH₵${amount.toLocaleString('en-GH', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
}

/**
 * Parse currency string to number (removes GH₵ symbol and formatting)
 */
export function parseCurrency(currencyString: string): number {
  const cleaned = currencyString.replace(/GH₵|,/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Validate currency amount
 */
export function isValidCurrency(amount: number): boolean {
  return !isNaN(amount) && amount >= 0 && amount < 1000000; // Max GHS 1M
}

/**
 * Currency constants for Ghana
 */
export const CURRENCY = {
  code: 'GHS',
  symbol: 'GH₵',
  name: 'Ghana Cedi',
  minAmount: 0.01,
  maxAmount: 999999.99,
} as const;