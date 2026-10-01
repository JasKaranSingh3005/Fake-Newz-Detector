export default function Logo({ className = 'h-9' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="TruthLens">
      <g transform="translate(4, 4)">
        <circle cx="16" cy="16" r="14" stroke="#0B132B" strokeWidth="2.5" fill="#F0F3FF" />
        <circle cx="16" cy="16" r="10" stroke="#059669" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="16" y1="4" x2="16" y2="8" stroke="#0B132B" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="24" x2="16" y2="28" stroke="#0B132B" strokeWidth="2" strokeLinecap="round" />
        <line x1="4" y1="16" x2="8" y2="16" stroke="#0B132B" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="16" x2="28" y2="16" stroke="#0B132B" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 11 L20 16 L16 21 L12 16 Z" fill="#0B132B" />
        <circle cx="16" cy="16" r="1.5" fill="#10B981" />
      </g>
      <text x="44" y="24" fontFamily="'Newsreader', Georgia, serif" fontSize="20" fontWeight="700" fill="#0B132B" letterSpacing="-0.02em">
        Truth<tspan fill="#059669">Lens</tspan>
      </text>
      <text x="45" y="33" fontFamily="'Inter', sans-serif" fontSize="7.5" fontWeight="600" fill="#64748B" letterSpacing="0.12em">
        EDITORIAL INTELLIGENCE
      </text>
    </svg>
  )
}
