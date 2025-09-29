import { krw, pct } from '@/lib/format';

export type Mover = {
  name: string;
  exchange: string;
  invested: number;
  amount: string;
  value: number;
  gainPct: number;
  logo?: React.ReactNode;
};

type MoversCardProps = {
  items: Mover[];
};

export function MoversCard({ items }: MoversCardProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="portfolio-card">
      <header className="portfolio-header">
        <h2 className="text-lg font-semibold">많이 오른 토큰</h2>
      </header>
      <div className="divider-line" />
      <ul className="movers-card__list">
        {items.map((item) => (
          <li key={`${item.exchange}-${item.name}`} className="mover-row">
            <div className="mover-row__logo" aria-hidden="true">
              {item.logo ?? item.name.charAt(0)}
            </div>
            <div className="mover-row__meta">
              <strong>{item.name}</strong>
              <span className="text-text-secondary text-sm">
                {item.exchange} · {item.amount}
              </span>
            </div>
            <div className="mover-row__values">
              <div className="mover-value">
                <span className="muted-xs">투자금액</span>
                <strong>{krw(item.invested)}</strong>
              </div>
              <div className="mover-value">
                <span className="muted-xs">평가가치</span>
                <strong>{krw(item.value)}</strong>
              </div>
              <span className="mover-row__gain">{pct(item.gainPct)}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
