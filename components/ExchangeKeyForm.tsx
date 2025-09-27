"use client";
import { useMemo } from 'react';
import { SUPPORTED_EXCHANGES } from '@/lib/connectors';

type Cred = { exchange: string; apiKey: string; apiSecret: string };

export default function ExchangeKeyForm({
  creds,
  onChange,
  onAdd,
}: {
  creds: Cred[];
  onChange: (i: number, patch: Partial<Cred>) => void;
  onAdd: () => void;
}) {
  const options = useMemo(() => SUPPORTED_EXCHANGES, []);
  return (
    <div className="stack card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <strong>API 연결</strong>
        <button onClick={onAdd}>+ 추가</button>
      </div>
      {creds.length === 0 && <div className="muted">아직 추가된 거래소가 없습니다.</div>}
      {creds.map((c, i) => (
        <div className="row" key={i} style={{ flexWrap: 'wrap' }}>
          <select value={c.exchange} onChange={(e) => onChange(i, { exchange: e.target.value })}>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
          <input
            placeholder="API Key"
            value={c.apiKey}
            onChange={(e) => onChange(i, { apiKey: e.target.value })}
            style={{ minWidth: 220 }}
          />
          <input
            placeholder="API Secret"
            value={c.apiSecret}
            onChange={(e) => onChange(i, { apiSecret: e.target.value })}
            style={{ minWidth: 280 }}
          />
        </div>
      ))}
      <p className="muted" style={{ marginTop: 0 }}>
        프로토타입에서는 키를 서버에 저장하지 않고 요청 시에만 사용합니다.
      </p>
    </div>
  );
}

