// Utility functions for formatting financial data
 
export function formatCurrency(value) {

  if (value == null) return '₹0.00';

  return `₹${Number(value).toLocaleString('en-IN', {

    minimumFractionDigits: 2,

    maximumFractionDigits: 2

  })}`;

}
 
export function formatNumber(value) {

  if (value == null) return '0';

  return Number(value).toLocaleString('en-IN');

}

 