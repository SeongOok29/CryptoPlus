type BottomNavProps = {
  active: '자산' | '프로필';
};

const ITEMS: Array<{ id: '자산' | '프로필'; label: string; icon: string }> = [
  { id: '자산', label: '자산', icon: '💰' },
  { id: '프로필', label: '프로필', icon: '👤' },
];

export function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="하단 내비게이션">
      {ITEMS.map((item) => {
        const isActive = item.id === active;
        return (
          <button key={item.id} type="button" className={`bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`} aria-current={isActive ? 'page' : undefined}>
            <span aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
