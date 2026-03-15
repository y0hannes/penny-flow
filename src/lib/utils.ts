export const formatStealthAmount = (amount: number, symbol: string, stealthMode: boolean) => {
  if (stealthMode) {
    return `${symbol}••••`;
  }
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
