"use client";
import { useState } from 'react';
import BinanceLogo from '@/assets/exchanges/binance.svg';
import CoinbaseLogo from '@/assets/exchanges/coinbase.svg';
import UpbitLogo from '@/assets/exchanges/upbit.svg';
import { BalanceTable } from '@/components/BalanceTable';
import { ExchangeConnectionCard, type ExchangeOption } from '@/components/ExchangeConnectionCard';
import { PortfolioSummaryCard } from '@/components/PortfolioSummaryCard';
import { CONNECTORS } from '@/lib/connectors';
import type { Balance } from '@/lib/connectors/types';

type Cred = { exchange: string; apiKey: string; apiSecret: string };

type BalancesResponse = {
  balancesByExchange: Record<string, Balance[]>;
  aggregated: Balance[];
};

const EXCHANGE_LOGOS: Record<string, ExchangeOption['Logo']> = {
  binance: BinanceLogo,
  coinbase: CoinbaseLogo,
  upbit: UpbitLogo,
};

const EXCHANGE_OPTIONS: ExchangeOption[] = Object.values(CONNECTORS)
  .map((connector) => {
    const Logo = EXCHANGE_LOGOS[connector.id];
    if (!Logo) return null;
    return { id: connector.id, name: connector.displayName, Logo };
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

  const connectedExchangeIds = Array.from(new Set(creds.map((cred) => cred.exchange)));

  return (
    <div className="page">
      <div className="stack" style={{ gap: '1.5rem' }}>
        <p className="muted">여러 거래소의 자산을 한 번에 모아보는 프로토타입입니다.</p>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="cards-grid">
          <PortfolioSummaryCard
            aggregated={aggregated}
            loading={loading}
            onRefresh={handleRefresh}
            hasConnections={creds.length > 0}
          />
          <ExchangeConnectionCard
            exchanges={EXCHANGE_OPTIONS}
            onConnect={handleConnect}
            busy={loading}
            connectedExchangeIds={connectedExchangeIds}
          />
        </div>
        <div className="stack" style={{ gap: '1rem' }}>
          {Object.entries(byExchange).map(([exchangeId, balances]) => (
            <BalanceTable key={exchangeId} title={`거래소: ${exchangeId}`} data={balances} />
          ))}
          <BalanceTable title="총합" data={aggregated} />
        </div>
      </div>
    </div>
  );
}
