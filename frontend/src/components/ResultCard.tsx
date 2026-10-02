import { CheckCircle2, AlertTriangle } from 'lucide-react'
import type { PredictResponse } from '../lib/api'
import { explain, modelLabel } from '../lib/models'
import ConfidenceBar from './ConfidenceBar'

interface Props {
  result: PredictResponse
  latencyMs?: number
}

export default function ResultCard({ result, latencyMs }: Props) {
  const isReal = result.label === 'REAL'
  const pct = result.confidence !== null ? Math.round(result.confidence * 100) : null
  const Icon = isReal ? CheckCircle2 : AlertTriangle

  return (
    <div
      className={`animate-fade-up rounded-xl border p-5 sm:p-6 ${
        isReal ? 'border-real/30 bg-real-bg/60' : 'border-fake/30 bg-fake-bg/60'
      }`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
            isReal ? 'bg-real/15 text-real' : 'bg-fake/15 text-fake'
          }`}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">Prediction</p>
          <h3 className={`text-2xl font-semibold tracking-tight ${isReal ? 'text-real' : 'text-fake'}`}>
            {isReal ? 'Likely Real' : 'Likely Fake'}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{explain(result.label, pct)}</p>
        </div>
      </div>

      <div className="mt-5">
        <ConfidenceBar pct={pct} tone={isReal ? 'real' : 'fake'} />
      </div>

      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-ink-faint">
        <span>Model: {modelLabel(result.model_used)}</span>
        {latencyMs !== undefined && <span>{latencyMs} ms</span>}
      </p>
    </div>
  )
}
