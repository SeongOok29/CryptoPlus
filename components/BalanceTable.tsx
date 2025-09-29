import type { Balance } from '@/lib/connectors/types';

export function BalanceTable({ title, data }: { title: string; data: Balance[] }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="table-card">
      <div className="table-card__header">
        <h3>{title}</h3>
      </div>
      <table className="table-card__table">
        <thead>
          <tr>
            <th scope="col">자산</th>
            <th scope="col">수량</th>
          </tr>
        </thead>
        <tbody>
          {data.map((balance) => (
            <tr key={balance.asset}>
              <td>{balance.asset}</td>
              <td>{balance.free}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
