import type { Balance } from '@/lib/connectors/types';

export function aggregateBalances(balancesByExchange: Record<string, Balance[]>): Balance[] {
  const map = new Map<string, number>();
  for (const arr of Object.values(balancesByExchange)) {
    for (const b of arr) {
      const prev = map.get(b.asset) ?? 0;
      map.set(b.asset, prev + b.free + (b.locked ?? 0));
    }
  }
  return Array.from(map.entries())
    .map(([asset, total]) => ({ asset, free: total }))
    .sort((a, b) => (a.asset < b.asset ? -1 : 1));
}

