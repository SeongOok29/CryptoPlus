import type { Balance, Connector, ExchangeCredential } from './types';

// Mocked connector for prototype; replace with real REST/HMAC calls server-side
const binance: Connector = {
  id: 'binance',
  displayName: 'Binance',
  async getBalances(_cred: ExchangeCredential): Promise<Balance[]> {
    // TODO: implement signed requests to /api/v3/account
    return [
      { asset: 'BTC', free: 0.1234 },
      { asset: 'USDT', free: 2500 },
    ];
  },
};

export default binance;

