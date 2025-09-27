import type { Balance, Connector, ExchangeCredential } from './types';

const coinbase: Connector = {
  id: 'coinbase',
  displayName: 'Coinbase',
  async getBalances(_cred: ExchangeCredential): Promise<Balance[]> {
    // TODO: implement Coinbase API (Advanced Trade) auth + accounts endpoint
    return [
      { asset: 'ETH', free: 1.5 },
      { asset: 'USDC', free: 1200 },
    ];
  },
};

export default coinbase;

