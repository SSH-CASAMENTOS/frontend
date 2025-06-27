export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('pt-BR');
};

export const formatDateTime = (date: Date | string): string => {
  return new Date(date).toLocaleString('pt-BR');
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
