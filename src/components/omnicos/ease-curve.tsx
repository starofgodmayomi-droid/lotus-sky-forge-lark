import { ease } from "../../../OMNICOS/03_OMEGA/verifier.ts";

export function EaseCurve({ t }: { t: number }) {
  const steps = 48;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const x = i / steps;
    const y = ease(x);
    const px = (x * 100).toFixed(2);
    const py = (100 - y * 100).toFixed(2);
    d += `${i === 0 ? "M" : "L"}${px},${py} `;
  }
  const mx = t * 100;
  const my = 100 - ease(t) * 100;

  return (
    <svg viewBox="0 0 100 100" className="h-16 w-full" role="img" aria-label="Ease curve from sprout to wilt">
      <line x1="0" y1="100" x2="100" y2="100" stroke="var(--color-line)" strokeWidth="1" />
      <path d={d.trim()} fill="none" stroke="var(--color-biolume)" strokeWidth="1.75" vectorEffect="non-scaling-stroke" />
      <circle cx={mx} cy={my} r="2.4" fill="var(--color-iris)" />
    </svg>
  );
}
