'use client';

import './portfolio.css';

import { BottomNav } from '@/components/bottom-nav';
import { MoversCard, type Mover } from '@/components/movers-card';
import { SummaryCard } from '@/components/summary-card';

const summaryData = {
  total: 27_126_500,
  deltaDay: { abs: 326_400, pct: 3.1, dir: 'up' as const },
  roiPct: 32,
  weekly: { abs: -312_400, pct: -0.3 },
  monthly: { abs: 1_100_320, pct: 1.0 },
  spot: { exchange: '바이낸스', value: 21_367_900, status: 'API 연결' },
  trend: [0.25, 0.4, 0.35, 0.52, 0.6, 0.7, 0.82],
};

const moversData: Mover[] = [
  { name: 'Pepe', exchange: '바이낸스', invested: 152_315, amount: '412개', value: 1_523_150, gainPct: 1000, logo: '🐸' },
  { name: '비트코인', exchange: '업비트', invested: 130_000, amount: '0.0001개', value: 390_000, gainPct: 300, logo: '₿' },
  { name: '솔라나', exchange: '바이낸스', invested: 2_360_180, amount: '12개', value: 3_123_427, gainPct: 23.1, logo: '◎' },
];

export default function PortfolioPage() {
  // TODO: replace mocked summary/mover data with live portfolio state once available
  return (
    <div className="portfolio-screen min-h-dvh bg-ink text-text-primary px-5 pb-24">
      <header className="portfolio-header">
        <h1 className="portfolio-title">포트폴리오</h1>
        <span className="portfolio-icon" aria-hidden="true">
          $
        </span>
      </header>

      <SummaryCard data={summaryData} />
      <MoversCard items={moversData} />

      <BottomNav active="자산" />
    </div>
  );
}
