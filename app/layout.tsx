import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cryptoplus Prototype',
  description: 'Aggregate crypto balances across exchanges',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <header style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
          <h1 style={{ margin: 0 }}>Cryptoplus</h1>
        </header>
        <main style={{ padding: '1rem', maxWidth: 960, margin: '0 auto' }}>{children}</main>
      </body>
    </html>
  );
}

