"use client";
import { useMemo, useState, type ReactNode } from 'react';
import { DollarSign } from 'lucide-react';
import BinanceLogo from '@/assets/exchanges/binance.svg';
import CoinbaseLogo from '@/assets/exchanges/coinbase.svg';
import UpbitLogo from '@/assets/exchanges/upbit.svg';
import { AssetCard } from '@/components/AssetCard';
import { BalanceTable } from '@/components/BalanceTable';
import { BottomNav } from '@/components/BottomNav';
import { ExchangeConnectionCard, type ExchangeOption } from '@/components/ExchangeConnectionCard';
import { TokenListItem } from '@/components/TokenListItem';
import { CONNECTORS } from '@/lib/connectors';
import type { Balance } from '@/lib/connectors/types';
import type { StaticImageData } from 'next/image';
import { formatCurrency } from '@/lib/format';

type Cred = { exchange: string; apiKey: string; apiSecret: string };

type BalancesResponse = {
  balancesByExchange: Record<string, Balance[]>;
  aggregated: Balance[];
};

const EXCHANGE_LOGOS: Record<string, StaticImageData> = {
  binance: BinanceLogo,
  coinbase: CoinbaseLogo,
  upbit: UpbitLogo,
};

const PRICE_TABLE: Record<string, number> = {
  BTC: 99_000_000,
  ETH: 3_500_000,
  USDT: 1_350,
  USDC: 1_350,
  KRW: 1,
  SOL: 148_000,
  PEPE: 3,
};

const TOKEN_ICONS: Record<string, ReactNode> = {
  BTC: '₿',
  ETH: 'Ξ',
  USDT: '₮',
  USDC: 'Ⓤ',
  SOL: '◎',
  PEPE: '🐸',
  KRW: '₩',
};

const DEFAULT_SUMMARY = {
  total: 27_126_500,
  change: { amount: 326_400, percent: 3.1 },
  weekly: { amount: -312_400, percent: -0.3 },
  monthly: { amount: 1_100_320, percent: 1.0 },
  detail: {
    exchange: 'Binance',
    value: 21_367_900,
    status: 'API 연결',
    logo: BinanceLogo,
  },
  trend: [0.35, 0.42, 0.46, 0.51, 0.58, 0.62, 0.7],
};

const DEFAULT_TOKENS = [
  { name: 'Pepe', exchange: 'Binance', invested: 152_315, amountLabel: '412개', value: 1_523_150, changePercent: 1000, logo: '🐸' },
  { name: '비트코인', exchange: 'Upbit', invested: 130_000, amountLabel: '0.0001개', value: 390_000, changePercent: 300, logo: '₿' },
  { name: '솔라나', exchange: 'Binance', invested: 2_360_180, amountLabel: '12개', value: 3_123_427, changePercent: 23.1, logo: '◎' },
];

const EXCHANGE_OPTIONS: ExchangeOption[] = Object.values(CONNECTORS)
  .map((connector) => {
    const Logo = EXCHANGE_LOGOS[connector.id];
    if (!Logo) return null;
    return { id: connector.id, name: connector.displayName, logo: Logo };
  })
  .filter((item): item is ExchangeOption => item !== null);

const upsertCredential = (list: Cred[], cred: Cred) => {
  const idx = list.findIndex((item) => item.exchange === cred.exchange);
  if (idx === -1) return [...list, cred];
  const next = [...list];
  next[idx] = cred;
  return next;
};

async function requestBalances(accounts: Cred[]): Promise<BalancesResponse> {
  const res = await fetch('/api/balances', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accounts }),
  });
  const data = (await res.json()) as BalancesResponse & { error?: string };
  if (!res.ok) {
    throw new Error(data?.error || '자산을 불러오지 못했습니다.');
  }
  return data;
}

const estimateValue = (balance: Balance) => {
  const price = PRICE_TABLE[balance.asset.toUpperCase()] ?? 1;
  return (balance.free + (balance.locked ?? 0)) * price;
};

const getExchangeDisplayName = (exchangeId: string) => CONNECTORS[exchangeId]?.displayName ?? exchangeId;

const buildAmountLabel = (asset: string, amount: number) => {
  if (asset.toUpperCase() === 'KRW') {
    return formatCurrency(Math.round(amount));
  }
  if (amount >= 1) {
    return `${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}개`;
  }
  return `${amount.toFixed(4)}개`;
};

const getVariant = (value: number): 'up' | 'down' => (value >= 0 ? 'up' : 'down');

export default function Page() {
  const [creds, setCreds] = useState<Cred[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [byExchange, setByExchange] = useState<Record<string, Balance[]>>({});
  const [aggregated, setAggregated] = useState<Balance[]>([]);

  const syncBalances = async (accounts: Cred[]) => {
    if (accounts.length === 0) {
      setByExchange({});
      setAggregated([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await requestBalances(accounts);
      setByExchange(data.balancesByExchange || {});
      setAggregated(data.aggregated || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : '오류가 발생했습니다';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (cred: Cred) => {
    const next = upsertCredential(creds, cred);
    await syncBalances(next);
    setCreds(next);
  };

  const handleRefresh = () => {
    if (creds.length === 0) return;
    void syncBalances(creds).catch(() => undefined);
  };

  const connectedExchangeIds = useMemo(() => Array.from(new Set(creds.map((cred) => cred.exchange))), [creds]);
  const exchangeEntries = useMemo(
    () => Object.entries(byExchange).filter(([, balances]) => balances && balances.length > 0),
    [byExchange],
  );

  const totalValue = useMemo(() => aggregated.reduce((acc, item) => acc + estimateValue(item), 0), [aggregated]);

  const summary = useMemo(() => {
    if (totalValue <= 0) {
      return DEFAULT_SUMMARY;
    }
    const roundedTotal = Math.round(totalValue);
    const changeAmount = Math.round(roundedTotal * 0.012);
    const weeklyAmount = Math.round(roundedTotal * -0.004);
    const monthlyAmount = Math.round(roundedTotal * 0.009);
    const topExchangeEntry = exchangeEntries
      .map(([exchangeId, balances]) => ({
        exchangeId,
        value: balances.reduce((acc, item) => acc + estimateValue(item), 0),
      }))
      .sort((a, b) => b.value - a.value)[0];

    const detailLogo = topExchangeEntry ? EXCHANGE_LOGOS[topExchangeEntry.exchangeId] ?? BinanceLogo : DEFAULT_SUMMARY.detail.logo;
    return {
      total: roundedTotal,
      change: { amount: changeAmount, percent: (changeAmount / roundedTotal) * 100 },
      weekly: { amount: weeklyAmount, percent: (weeklyAmount / roundedTotal) * 100 },
      monthly: { amount: monthlyAmount, percent: (monthlyAmount / roundedTotal) * 100 },
      detail: {
        exchange: topExchangeEntry ? getExchangeDisplayName(topExchangeEntry.exchangeId) : DEFAULT_SUMMARY.detail.exchange,
        value: topExchangeEntry ? Math.round(topExchangeEntry.value) : DEFAULT_SUMMARY.detail.value,
        status: topExchangeEntry ? 'API 연결' : DEFAULT_SUMMARY.detail.status,
        logo: detailLogo,
      },
      trend: [0.32, 0.38, 0.43, 0.5, 0.58, 0.64, 0.72],
    } as typeof DEFAULT_SUMMARY;
  }, [totalValue, exchangeEntries]);

  const tokenItems = useMemo(() => {
    if (aggregated.length === 0) {
      return DEFAULT_TOKENS;
    }
    return aggregated
      .map((item) => {
        const value = estimateValue(item);
        const invested = value * 0.72;
        const changePercent = invested === 0 ? 0 : ((value - invested) / invested) * 100;
        const exchangeId = exchangeEntries.find(([, balances]) => balances.some((balance) => balance.asset === item.asset))?.[0];
        return {
          name: item.asset,
          exchange: exchangeId ? getExchangeDisplayName(exchangeId) : '보유 자산',
          invested,
          amountLabel: buildAmountLabel(item.asset, item.free),
          value,
          changePercent,
          logo: TOKEN_ICONS[item.asset.toUpperCase()] ?? item.asset.charAt(0),
        };
      })
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5);
  }, [aggregated, exchangeEntries]);

  const periods = useMemo(
    () => [
      { label: '주간', amount: summary.weekly.amount, percent: summary.weekly.percent, variant: getVariant(summary.weekly.amount) },
      { label: '월간', amount: summary.monthly.amount, percent: summary.monthly.percent, variant: getVariant(summary.monthly.amount) },
    ],
    [summary.weekly.amount, summary.weekly.percent, summary.monthly.amount, summary.monthly.percent],
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1 className="app-title">포트폴리오</h1>
          <p className="app-subtitle">보유 자산과 수익률을 한눈에 확인하세요.</p>
        </div>
        <button type="button" className="icon-button" aria-label="화폐 단위 변경">
          <DollarSign size={20} />
        </button>
      </header>

      {error && <div className="notice notice--error">{error}</div>}

      <AssetCard
        total={summary.total}
        change={summary.change}
        trend={summary.trend}
        periods={periods}
        detail={summary.detail}
      />

      <section className="token-section">
        <div className="section-heading">
          <h2 className="section-title">많이 오른 토큰</h2>
          <span className="section-subtitle">가장 큰 상승률을 기록한 자산입니다.</span>
        </div>
        <ul className="token-list">
          {tokenItems.map((token) => (
            <TokenListItem
              key={`${token.exchange}-${token.name}`}
              name={token.name}
              exchange={token.exchange}
              invested={Math.round(token.invested)}
              amountLabel={token.amountLabel}
              value={Math.round(token.value)}
              changePercent={token.changePercent}
              logo={token.logo}
            />
          ))}
        </ul>
      </section>

      <section className="card-surface">
        <div className="section-heading">
          <h2 className="section-title">거래소 연동</h2>
          <span className="section-subtitle">API 키를 통해 거래소 자산을 동기화하세요.</span>
        </div>
        <ExchangeConnectionCard
          exchanges={EXCHANGE_OPTIONS}
          onConnect={handleConnect}
          busy={loading}
          connectedExchangeIds={connectedExchangeIds}
        />
      </section>

      <section className="card-surface">
        <div className="section-heading">
          <h2 className="section-title">자산 상세</h2>
          <span className="section-subtitle">거래소별 잔고를 확인하세요.</span>
        </div>
        <div className="tables-grid">
          {exchangeEntries.map(([exchangeId, balances]) => (
            <BalanceTable key={exchangeId} title={`${getExchangeDisplayName(exchangeId)}`} data={balances} />
          ))}
          {aggregated.length > 0 && <BalanceTable title="총합" data={aggregated} />}
        </div>
      </section>

      <footer className="app-footer">
        <div className="footer-meta">
          <span>총 자산</span>
          <strong>{formatCurrency(summary.total)}</strong>
        </div>
      </footer>

      <BottomNav active="자산" />
    </div>
  );
}
