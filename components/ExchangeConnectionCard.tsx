"use client";
import Image from 'next/image';
import { useMemo, useState, type FormEvent } from 'react';
import type { StaticImageData } from 'next/image';

export type ExchangeOption = {
  id: string;
  name: string;
  logo: StaticImageData;
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
  const panelClassName = `connection-panel${expanded ? ' is-expanded' : ''}`;

  return (
    <div className={panelClassName} data-expanded={expanded}>
      <div className="connection-panel__header">
        <div>
          <h3>API 연결 관리</h3>
          <p>API Key 인증으로 자산을 동기화하세요.</p>
        </div>
        <button className="surface-button" onClick={handleConnectClick} disabled={busy && !expanded}>
          {expanded ? '닫기' : '자산 연결하기'}
        </button>
      </div>

      {hasConnections && !expanded && (
        <div className="connection-panel__badges">
          {connectedExchangeIds.map((id) => {
            const exchange = exchanges.find((item) => item.id === id);
            return (
              <span key={id} className="connection-panel__badge">
                {exchange?.name ?? id}
              </span>
            );
          })}
        </div>
      )}

      {expanded && (
        <div className="connection-panel__body">
          {!selected && (
            <div className="connection-panel__grid">
              {exchanges.map((exchange) => {
                const isConnected = connectedExchangeIds.includes(exchange.id);
                const isSelected = selectedId === exchange.id;
                return (
                  <button
                    key={exchange.id}
                    className={`connection-panel__exchange${isSelected ? ' is-selected' : ''}`}
                    type="button"
                    onClick={() => handleExchangeClick(exchange.id)}
                    disabled={busy && !selected}
                  >
                    <span className="connection-panel__exchange-meta">
                      <Image src={exchange.logo} alt={`${exchange.name} 로고`} width={32} height={32} />
                      <span>{exchange.name}</span>
                    </span>
                    {isConnected && <span className="connection-panel__exchange-badge">연동됨</span>}
                  </button>
                );
              })}
            </div>
          )}

          {selected && (
            <form className="connection-panel__form" onSubmit={handleSubmit}>
              <div className="connection-panel__form-header">
                <div>
                  <strong>{selected.name} API Key 연결</strong>
                  <p>거래소에서 발급 받은 읽기 전용 키를 입력하세요.</p>
                </div>
                <button type="button" onClick={onReset} className="text-button">
                  다른 거래소 선택
                </button>
              </div>
              <label className="connection-panel__field">
                <span>API Key</span>
                <input value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="발급받은 API Key" autoFocus />
              </label>
              <label className="connection-panel__field">
                <span>API Secret</span>
                <input
                  value={apiSecret}
                  onChange={(event) => setApiSecret(event.target.value)}
                  placeholder="발급받은 API Secret"
                  type="password"
                />
              </label>
              {localError && <p className="connection-panel__error">{localError}</p>}
              <div className="connection-panel__actions">
                <button type="button" className="surface-button surface-button--ghost" onClick={() => setExpanded(false)} disabled={submitting}>
                  취소
                </button>
                <button type="submit" className="surface-button" disabled={submitting || busy}>
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
