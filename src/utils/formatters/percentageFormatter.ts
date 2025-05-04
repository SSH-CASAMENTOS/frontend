export const formatPercentage = (value: number, fractionDigits: number = 1): string => {
  return `${value.toFixed(fractionDigits)}%`;
};
