export type Balance = {
  asset: string; // e.g. BTC
  free: number; // available amount
  locked?: number; // optional locked amount
};

export type ExchangeCredential = {
  exchange: string; // 'binance' | 'coinbase' | 'upbit' | ...
  apiKey: string;
  apiSecret: string;
};

export type Connector = {
  id: string;
  displayName: string;
  getBalances: (cred: ExchangeCredential) => Promise<Balance[]>;
};

