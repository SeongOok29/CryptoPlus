export const formatCurrency = (value: number): string => `${value.toLocaleString('ko-KR')}원`;

export const formatPercent = (value: number): string => {
  const sign = value > 0 ? '+' : value < 0 ? '' : '';
  return `${sign}${value.toFixed(1)}%`;
};

export const trendClassName = (value: number): string => (value >= 0 ? 'text-positive' : 'text-negative');
