"use client";
import { useState } from 'react';
import ExchangeKeyForm from '@/components/ExchangeKeyForm';
import { BalanceTable } from '@/components/BalanceTable';
import type { Balance } from '@/lib/connectors/types';

type Cred = { exchange: string; apiKey: string; apiSecret: string };

export default function Page() {
  const [creds, setCreds] = useState<Cred[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [byExchange, setByExchange] = useState<Record<string, Balance[]>>({});
  const [aggregated, setAggregated] = useState<Balance[]>([]);

  const onAdd = () => {
    setCreds((prev) => [...prev, { exchange: 'binance', apiKey: '', apiSecret: '' }]);
  };

  const onChange = (i: number, patch: Partial<Cred>) => {
    setCreds((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  };

  const onFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/balances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accounts: creds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch');
      setByExchange(data.balancesByExchange || {});
      setAggregated(data.aggregated || []);
    } catch (e: any) {
      setError(e?.message || '오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack">
      <p className="muted">여러 거래소의 자산을 한 번에 모아보는 프로토타입입니다.</p>
      <ExchangeKeyForm creds={creds} onChange={onChange} onAdd={onAdd} />
      <div className="row">
        <button onClick={onFetch} disabled={loading || creds.length === 0}>
          {loading ? '조회 중…' : '자산 조회'}
        </button>
        {error && <span style={{ color: 'crimson' }}>{error}</span>}
      </div>
      {Object.entries(byExchange).map(([ex, arr]) => (
        <BalanceTable key={ex} title={`거래소: ${ex}`} data={arr} />
      ))}
      <BalanceTable title="총합" data={aggregated} />
    </div>
  );
}

