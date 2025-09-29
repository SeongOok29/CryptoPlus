import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import { formatCurrency, formatPercent, trendClassName } from '@/lib/format';

export type PeriodStat = {
  label: string;
  amount: number;
  percent: number;
  variant: 'up' | 'down';
};

type DetailAsset = {
  exchange: string;
  value: number;
  status: string;
  logo: StaticImageData;
};

type AssetCardProps = {
  total: number;
  change: { amount: number; percent: number };
  trend: number[];
  periods: PeriodStat[];
  detail: DetailAsset;
};

const buildChartData = (points: number[]) =>
  points.map((value, index) => ({ index, value }));

export function AssetCard({ total, change, trend, periods, detail }: AssetCardProps) {
  const chartData = buildChartData(trend);
  const changeClass = trendClassName(change.amount);

  return (
    <section className="asset-card">
      <div className="asset-card__top">
        <div className="asset-card__summary">
          <span className="asset-card__label">총 자산</span>
          <strong className="asset-card__value">{formatCurrency(total)}</strong>
          <span className={`asset-card__change ${changeClass}`}>
            어제보다 {formatCurrency(change.amount)} ({formatPercent(change.percent)})
          </span>
        </div>
        <div className="asset-card__chart">
          <ResponsiveContainer width="100%" height={88}>
            <LineChart data={chartData} margin={{ top: 6, bottom: 6, left: 0, right: 0 }}>
              <Line type="monotone" dataKey="value" stroke="#FF4D4D" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="asset-card__periods">
        {periods.map((period) => {
          const className = period.variant === 'up' ? 'pill pill--up' : 'pill pill--down';
          const textClass = trendClassName(period.amount);
          return (
            <button key={period.label} type="button" className={className} aria-pressed={false}>
              <span>{period.label}</span>
              <span className={`pill__metric ${textClass}`}>
                {formatCurrency(period.amount)} · {formatPercent(period.percent)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="asset-card__detail">
        <div className="asset-card__detail-left">
          <span className="asset-card__logo">
            <Image src={detail.logo} alt={`${detail.exchange} 로고`} width={40} height={40} />
          </span>
          <div className="asset-card__detail-meta">
            <span className="asset-card__detail-title">{detail.exchange}</span>
            <span className="asset-card__detail-sub">{detail.status}</span>
          </div>
        </div>
        <div className="asset-card__detail-right">
          <strong className="asset-card__detail-value">{formatCurrency(detail.value)}</strong>
          <ChevronRight size={18} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
