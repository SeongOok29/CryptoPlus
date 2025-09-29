import { krw, pct, signColor } from '@/lib/format';

type ChipProps = {
  variant: 'up' | 'down';
  label: string;
  abs: number;
  pct: number;
};

export function Chip({ variant, label, abs, pct: percent }: ChipProps) {
  const chipClass = variant === 'up' ? 'chip chip--up' : 'chip chip--down';
  const colorClass = signColor(percent);

  return (
    <div className={chipClass}>
      <span>{label}</span>
      <span className={`font-semibold ${colorClass}`}>{krw(abs)}</span>
      <span className={`font-semibold ${colorClass}`}>{pct(percent)}</span>
    </div>
  );
}
