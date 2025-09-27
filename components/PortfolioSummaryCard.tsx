import type { Balance } from '@/lib/connectors/types';

const COLORS = [
  '#6366f1',
  '#22c55e',
  '#f97316',
  '#ec4899',
  '#14b8a6',
  '#f59e0b',
  '#8b5cf6',
];

type Props = {
  aggregated: Balance[];
  loading: boolean;
  onRefresh: () => void;
  hasConnections: boolean;
};

export function PortfolioSummaryCard({ aggregated, loading, onRefresh, hasConnections }: Props) {
  const positiveBalances = aggregated.filter((b) => b.free > 0);
  const total = positiveBalances.reduce((acc, item) => acc + item.free, 0);

  const segments = positiveBalances.map((item, index) => {
    const percentage = total === 0 ? 0 : (item.free / total) * 100;
    return {
      ...item,
      percentage,
      color: COLORS[index % COLORS.length],
    };
  });

  let gradientStops = 'var(--chart-empty, #e5e7eb) 0 100%';
  if (segments.length > 0) {
    let cumulative = 0;
    const parts: string[] = [];
    segments.forEach((segment) => {
      const start = cumulative;
      const end = cumulative + segment.percentage;
      parts.push(`${segment.color} ${start}% ${end}%`);
      cumulative = end;
    });
    gradientStops = parts.join(', ');
  }

  return (
    <div className="card portfolio-card">
      <div className="card-header">
        <div>
          <h2>자산 현황</h2>
          <p className="muted">연동된 거래소의 자산을 한눈에 확인하세요.</p>
        </div>
        <button onClick={onRefresh} disabled={loading || !hasConnections}>
          {loading ? '조회 중…' : '새로고침'}
        </button>
      </div>

      {loading && total === 0 && (
        <p className="muted">자산 정보를 불러오는 중입니다…</p>
      )}

      {!loading && segments.length === 0 && (
        <div className="portfolio-empty">
          <p className="muted">연결된 자산이 없습니다. 거래소를 연동해 자산 기록을 불러와보세요.</p>
        </div>
      )}

      {segments.length > 0 && (
        <div className="portfolio-visual">
          <div className="portfolio-chart" style={{ background: `conic-gradient(${gradientStops})` }}>
            <div className="portfolio-chart__inner">
              <span className="portfolio-chart__total">{total.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
              <span className="portfolio-chart__label">총 보유량</span>
            </div>
          </div>
          <ul className="asset-list">
            {segments.map((segment) => (
              <li key={segment.asset}>
                <span className="asset-color" style={{ backgroundColor: segment.color }} />
                <div className="asset-meta">
                  <strong>{segment.asset}</strong>
                  <span className="muted">{segment.percentage.toFixed(1)}%</span>
                </div>
                <span className="asset-amount">{segment.free.toLocaleString(undefined, { maximumFractionDigits: 8 })}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

