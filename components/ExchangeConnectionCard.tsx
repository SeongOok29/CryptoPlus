"use client";
import { useMemo, useState, type FormEvent } from 'react';
import type { ComponentType, SVGProps } from 'react';

export type ExchangeOption = {
  id: string;
  name: string;
  Logo: ComponentType<SVGProps<SVGSVGElement>>;
};

type CredInput = {
  exchange: string;
  apiKey: string;
  apiSecret: string;
};

type Props = {
  exchanges: ExchangeOption[];
  onConnect: (cred: CredInput) => Promise<void>;
  busy: boolean;
  connectedExchangeIds: string[];
};

export function ExchangeConnectionCard({ exchanges, onConnect, busy, connectedExchangeIds }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selected = useMemo(() => exchanges.find((exchange) => exchange.id === selectedId) ?? null, [exchanges, selectedId]);

  const onReset = () => {
    setSelectedId(null);
    setApiKey('');
    setApiSecret('');
    setLocalError(null);
    setSubmitting(false);
  };

  const handleConnectClick = () => {
    setExpanded((prev) => !prev);
    if (expanded) onReset();
  };

  const handleExchangeClick = (exchangeId: string) => {
    setSelectedId(exchangeId);
    setLocalError(null);
    setApiKey('');
    setApiSecret('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    if (!apiKey.trim() || !apiSecret.trim()) {
      setLocalError('API Key와 Secret을 모두 입력해주세요.');
      return;
    }
    setSubmitting(true);
    setLocalError(null);
    try {
      await onConnect({ exchange: selected.id, apiKey: apiKey.trim(), apiSecret: apiSecret.trim() });
      setExpanded(false);
      onReset();
    } catch (error) {
      const message = error instanceof Error ? error.message : '연결에 실패했습니다.';
      setLocalError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const hasConnections = connectedExchangeIds.length > 0;

  return (
    <div className="card connection-card">
      <div className="card-header">
        <div>
          <h2>거래소 연동</h2>
          <p className="muted">API Key로 거래소를 연결하고 자산을 불러오세요.</p>
        </div>
        <button onClick={handleConnectClick} disabled={busy && !expanded}>
          {expanded ? '닫기' : '자산 연결하기'}
        </button>
      </div>

      {hasConnections && !expanded && (
        <div className="connected-badges">
          {connectedExchangeIds.map((id) => {
            const exchange = exchanges.find((item) => item.id === id);
            return (
              <span key={id} className="connected-badge">
                {exchange?.name ?? id}
              </span>
            );
          })}
        </div>
      )}

      {expanded && (
        <div className="connection-body">
          {!selected && (
            <div className="exchange-grid">
              {exchanges.map((exchange) => {
                const isConnected = connectedExchangeIds.includes(exchange.id);
                return (
                  <button
                    key={exchange.id}
                    className="exchange-button"
                    type="button"
                    onClick={() => handleExchangeClick(exchange.id)}
                    disabled={busy && !selected}
                  >
                    <span className="exchange-meta">
                      <exchange.Logo className="exchange-logo" aria-hidden />
                      <span>{exchange.name}</span>
                    </span>
                    {isConnected && <span className="exchange-badge">연동됨</span>}
                  </button>
                );
              })}
            </div>
          )}

          {selected && (
            <form className="stack" onSubmit={handleSubmit}>
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{selected.name} API Key 연결</strong>
                <button type="button" onClick={onReset} className="link-button">
                  다른 거래소 선택
                </button>
              </div>
              <label className="stack">
                <span className="muted">API Key</span>
                <input value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="발급받은 API Key" />
              </label>
              <label className="stack">
                <span className="muted">API Secret</span>
                <input
                  value={apiSecret}
                  onChange={(event) => setApiSecret(event.target.value)}
                  placeholder="발급받은 API Secret"
                  type="password"
                />
              </label>
              {localError && <p className="error-text">{localError}</p>}
              <div className="row" style={{ justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setExpanded(false)} disabled={submitting}>
                  취소
                </button>
                <button type="submit" disabled={submitting || busy}>
                  {submitting || busy ? '연결 중…' : '확인'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
