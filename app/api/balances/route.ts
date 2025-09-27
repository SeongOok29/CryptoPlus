import { NextResponse } from 'next/server';
import { CONNECTORS } from '@/lib/connectors';
import type { ExchangeCredential } from '@/lib/connectors/types';
import { aggregateBalances } from '@/utils/aggregate';

type RequestBody = {
  accounts: ExchangeCredential[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    if (!body?.accounts || !Array.isArray(body.accounts)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const balancesByExchange: Record<string, any[]> = {};
    for (const cred of body.accounts) {
      const connector = CONNECTORS[cred.exchange];
      if (!connector) {
        return NextResponse.json({ error: `Unsupported exchange: ${cred.exchange}` }, { status: 400 });
      }
      const balances = await connector.getBalances(cred);
      balancesByExchange[cred.exchange] = balances;
    }

    const aggregated = aggregateBalances(balancesByExchange);
    return NextResponse.json({ balancesByExchange, aggregated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}

