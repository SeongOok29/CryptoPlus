import type { Connector } from './types';
import binance from './binance';
import coinbase from './coinbase';
import upbit from './upbit';

export const CONNECTORS: Record<string, Connector> = {
  [binance.id]: binance,
  [coinbase.id]: coinbase,
  [upbit.id]: upbit,
};

export const SUPPORTED_EXCHANGES = Object.values(CONNECTORS).map((c) => ({
  id: c.id,
  name: c.displayName,
}));

