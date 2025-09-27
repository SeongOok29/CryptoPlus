import type { Balance, Connector, ExchangeCredential } from './types';

const upbit: Connector = {
  id: 'upbit',
  displayName: 'Upbit',
  async getBalances(_cred: ExchangeCredential): Promise<Balance[]> {
    // TODO: implement JWT auth and /v1/accounts
    return [
      { asset: 'BTC', free: 0.02 },
      { asset: 'KRW', free: 1500000 },
    ];
  },
};

export default upbit;

