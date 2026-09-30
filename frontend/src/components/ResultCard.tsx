import { CheckCircle2, AlertTriangle } from 'lucide-react'
import type { PredictResponse } from '../lib/api'

const MODEL_LABELS: Record<string, string> = {
  logistic_regression: 'Logistic Regression',
  random_forest: 'Random Forest',
  passive_aggressive: 'Passive Aggressive',
}

export default function ResultCard({ result }: { result: PredictResponse }) {
  const isReal = result.label === 'REAL'
  const pct = result.confidence !== null ? Math.round(result.confidence * 100) : null

  return (
    <div
      className={`mt-6 rounded-xl border p-6 animate-[resultIn_0.35s_ease-out] ${
        isReal ? 'border-real/30 bg-real/5' : 'border-fake/30 bg-fake/5'
      }`}
      role="status"
      aria-live="polite"
    >
      <style>{`
        @keyframes resultIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[resultIn_0\\.35s_ease-out\\] { animation: none; }
        }
      `}</style>

      <div className="flex items-start gap-4">
        {/* Icon + text both communicate status — not color alone */}
        {isReal ? (
          <CheckCircle2 className="w-7 h-7 text-real shrink-0 mt-0.5" aria-hidden="true" />
        ) : (
          <AlertTriangle className="w-7 h-7 text-fake shrink-0 mt-0.5" aria-hidden="true" />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h3 className={`text-xl font-bold ${isReal ? 'text-real' : 'text-fake'}`}>
              {isReal ? 'REAL NEWS' : 'FAKE NEWS'}
            </h3>
            {pct !== null && <ConfidenceRing pct={pct} isReal={isReal} />}
          </div>

          <p className="mt-2 text-sm text-slate-300">
            {isReal
              ? 'The selected model classified this text as real based on learned textual patterns.'
              : 'This model classified the text as potentially misleading or fabricated. Verify important claims using trusted sources.'}
          </p>

          <p className="mt-3 text-xs text-slate-500">
            Model used: <span className="text-slate-400">{MODEL_LABELS[result.model_used] || result.model_used}</span>
            {pct !== null && (
              <>
                {' · '}Confidence: <span className="text-slate-400">{pct}%</span>
              </>
            )}
          </p>

          <p className="mt-4 text-xs text-slate-500 border-t border-white/10 pt-3">
            Machine-learning predictions are probabilistic and can be wrong. This tool does not independently verify
            facts or sources. Confidence reflects the model's prediction probability, not factual certainty.
          </p>
        </div>
      </div>
    </div>
  )
}

function ConfidenceRing({ pct, isReal }: { pct: number; isReal: boolean }) {
  const r = 18
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - pct / 100)
  const color = isReal ? '#1FA97D' : '#E5484D'

  return (
    <div className="relative w-12 h-12" aria-hidden="true">
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 24 24)"
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white">
        {pct}%
      </span>
    </div>
  )
}
