export const formatMoney = (amount) => {
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Return '$0.00' if the amount is not a valid number
  if (isNaN(numAmount)) {
    return '$0.00';
  }

  // Convert to fixed 2 decimal places and add commas for thousands
  return '$' + numAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};
