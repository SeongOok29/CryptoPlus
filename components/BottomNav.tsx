import { Wallet2, UserRound } from 'lucide-react';

type BottomNavProps = {
  active: '자산' | '프로필';
};

const NAV_ITEMS = [
  { id: '자산' as const, label: '자산', icon: <Wallet2 size={18} /> },
  { id: '프로필' as const, label: '프로필', icon: <UserRound size={18} /> },
];

export function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="하단 내비게이션">
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === active;
        return (
          <button key={item.id} type="button" className={`bottom-nav__item${isActive ? ' is-active' : ''}`} aria-current={isActive ? 'page' : undefined}>
            <span className="bottom-nav__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
