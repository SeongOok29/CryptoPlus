type SparklineProps = {
  points?: number[];
};

const WIDTH = 120;
const HEIGHT = 28;

const buildPath = (points?: number[]) => {
  if (!points || points.length === 0) {
    return `0,${HEIGHT / 2} ${WIDTH},${HEIGHT / 2}`;
  }
  const clamped = points.map((value) => {
    if (Number.isNaN(value)) return 0;
    return Math.min(Math.max(value, 0), 1);
  });
  if (clamped.length === 1) {
    const y = HEIGHT - clamped[0] * HEIGHT;
    return `0,${y} ${WIDTH},${y}`;
  }
  const step = WIDTH / (clamped.length - 1);
  return clamped
    .map((value, index) => {
      const x = step * index;
      const y = HEIGHT - value * HEIGHT;
      return `${x},${y}`;
    })
    .join(' ');
};

export function Sparkline({ points }: SparklineProps) {
  const path = buildPath(points);
  return (
    <svg className="sparkline" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-hidden="true">
      <polyline points={path} fill="none" stroke="var(--accent-red)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
