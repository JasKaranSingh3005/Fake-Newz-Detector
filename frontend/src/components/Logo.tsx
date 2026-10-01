// Colors use theme tokens (fill-*/stroke-* resolve to the CSS variables), so the logo follows light/dark.
// Light-mode values are identical to the original hex colors.
export default function Logo({ className = 'h-9' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="TruthLens">
      <g transform="translate(4, 4)">
        <circle cx="16" cy="16" r="14" strokeWidth="2.5" className="stroke-ink fill-[#F0F3FF] dark:fill-drawer" />
        <circle cx="16" cy="16" r="10" strokeWidth="1.5" strokeDasharray="2 2" className="stroke-real" />
        <line x1="16" y1="4" x2="16" y2="8" strokeWidth="2" strokeLinecap="round" className="stroke-ink" />
        <line x1="16" y1="24" x2="16" y2="28" strokeWidth="2" strokeLinecap="round" className="stroke-ink" />
        <line x1="4" y1="16" x2="8" y2="16" strokeWidth="2" strokeLinecap="round" className="stroke-ink" />
        <line x1="24" y1="16" x2="28" y2="16" strokeWidth="2" strokeLinecap="round" className="stroke-ink" />
        <path d="M16 11 L20 16 L16 21 L12 16 Z" className="fill-ink" />
        <circle cx="16" cy="16" r="1.5" className="fill-[#10B981] dark:fill-real" />
      </g>
      <text x="44" y="24" fontFamily="'Newsreader', Georgia, serif" fontSize="20" fontWeight="700" letterSpacing="-0.02em" className="fill-ink">
        Truth<tspan className="fill-real">Lens</tspan>
      </text>
      <text x="45" y="33" fontFamily="'Inter', sans-serif" fontSize="7.5" fontWeight="600" letterSpacing="0.12em" className="fill-ink-faint">
        EDITORIAL INTELLIGENCE
      </text>
    </svg>
  )
}
