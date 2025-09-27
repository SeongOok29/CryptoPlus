import type { Balance } from '@/lib/connectors/types';

export function BalanceTable({ title, data }: { title: string; data: Balance[] }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>자산</th>
            <th>수량</th>
          </tr>
        </thead>
        <tbody>
          {data.map((b) => (
            <tr key={b.asset}>
              <td>{b.asset}</td>
              <td>{b.free}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

