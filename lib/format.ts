export const krw = (value: number): string => `${value.toLocaleString('ko-KR')}원`;

export const pct = (value: number): string => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

export const signColor = (value: number): string => (value >= 0 ? 'text-accent-red' : 'text-accent-blue');
