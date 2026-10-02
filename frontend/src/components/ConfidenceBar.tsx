interface Props {
  pct: number | null
  tone: 'real' | 'fake' | 'warn'
  label?: string
}

const TONE = { real: 'bg-real', fake: 'bg-fake', warn: 'bg-warn' }

export default function ConfidenceBar({ pct, tone, label = 'Confidence' }: Props) {
  if (pct === null) {
    return <p className="text-xs text-ink-faint">No probability score for this model</p>
  }

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-xs">
        <span className="text-ink-faint">{label}</span>
        <span className="font-mono font-medium text-ink">{pct}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-drawer"
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`h-full rounded-full animate-grow ${TONE[tone]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
