import { Chip } from '@/components/chip';
import { Sparkline } from '@/components/sparkline';
import { krw, pct, signColor } from '@/lib/format';

type DailyDelta = {
  abs: number;
  pct: number;
  dir: 'up' | 'down';
};

type SummaryData = {
  total: number;
  deltaDay: DailyDelta;
  roiPct: number;
  weekly: { abs: number; pct: number };
  monthly: { abs: number; pct: number };
  spot: { exchange: string; value: number; status: string };
  trend?: number[];
};

type SummaryCardProps = {
  data: SummaryData;
};

const DEFAULT_TREND = [0.2, 0.35, 0.32, 0.4, 0.55, 0.6, 0.75];

export function SummaryCard({ data }: SummaryCardProps) {
  const daySign = data.deltaDay.dir === 'down' ? -Math.abs(data.deltaDay.pct) : Math.abs(data.deltaDay.pct);
  const dayColor = signColor(daySign);
  const trend = data.trend && data.trend.length > 0 ? data.trend : DEFAULT_TREND; // TODO: replace with real sparkline data
  const exchangeInitial = data.spot.exchange ? data.spot.exchange.charAt(0).toUpperCase() : '?';

  return (
    <section className="portfolio-card">
      <div className="summary-card__grid">
        <div className="summary-card__text">
          <span className="text-text-secondary text-sm">총 자산</span>
          <p className="summary-card__value">{krw(data.total)}</p>
          <div className="summary-card__delta">
            <span className={`font-medium ${dayColor}`}>
              {krw(data.deltaDay.abs)} ({pct(data.deltaDay.pct)})
            </span>
            <span className="text-text-secondary text-sm">오늘</span>
          </div>
          <span className="summary-card__roi">누적 수익률 {pct(data.roiPct)}</span>
        </div>
        <Sparkline points={trend} />
      </div>

      <div className="summary-card__chips">
        <Chip variant="down" label="주간" abs={data.weekly.abs} pct={data.weekly.pct} />
        <Chip variant="up" label="월간" abs={data.monthly.abs} pct={data.monthly.pct} />
      </div>

      <div className="summary-card__detail">
        <div className="summary-card__detail-left">
          <span className="summary-card__exchange-icon">{exchangeInitial}</span>
          <div className="summary-card__detail-meta">
            <strong>세부 자산</strong>
            <span className="muted-xs">
              {data.spot.exchange} · {data.spot.status}
            </span>
          </div>
        </div>
        <div className="summary-card__detail-right">
          <div className="summary-card__detail-values">
            <strong>{krw(data.spot.value)}</strong>
            <span className="muted-xs">스팟</span>
          </div>
          <span className="summary-card__chevron" aria-hidden="true">
            ›
          </span>
        </div>
      </div>

      <div className="summary-card__actions">
        <button type="button" className="portfolio-ghost-button">
          더보기
        </button>
      </div>
    </section>
  );
}
