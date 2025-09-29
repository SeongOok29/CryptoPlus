import { formatCurrency, formatPercent, trendClassName } from '@/lib/format';

type TokenListItemProps = {
  name: string;
  exchange: string;
  invested: number;
  amountLabel: string;
  value: number;
  changePercent: number;
  logo?: React.ReactNode;
};

export function TokenListItem({ name, exchange, invested, amountLabel, value, changePercent, logo }: TokenListItemProps) {
  const changeClass = trendClassName(changePercent);

  return (
    <li className="token-item">
      <div className="token-item__left">
        <div className="token-item__logo" aria-hidden="true">
          {logo ?? name.charAt(0)}
        </div>
        <div className="token-item__meta">
          <span className="token-item__name">{name}</span>
          <span className="token-item__sub">{exchange} · {amountLabel}</span>
        </div>
      </div>
      <div className="token-item__center">
        <span className="token-item__label">투자금액</span>
        <span className="token-item__value">{formatCurrency(invested)}</span>
      </div>
      <div className="token-item__right">
        <span className="token-item__label">평가가치</span>
        <span className="token-item__value">{formatCurrency(value)}</span>
        <span className={`token-item__change ${changeClass}`}>{formatPercent(changePercent)}</span>
      </div>
    </li>
  );
}
