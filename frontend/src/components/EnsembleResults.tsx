import { AlertTriangle, CheckCircle2, Scale, XCircle } from 'lucide-react'
import type { EnsembleResult } from '../lib/api'
import { explain, modelLabel } from '../lib/models'
import ConfidenceBar from './ConfidenceBar'

export default function EnsembleResults({ results }: { results: EnsembleResult[] }) {
  const valid = results.filter((r) => !r.error)
  const fakeVotes = valid.filter((r) => r.label === 'FAKE').length
  const consensus = fakeVotes > valid.length / 2 ? 'FAKE' : fakeVotes === valid.length / 2 ? 'SPLIT' : 'REAL'
  const majority = consensus === 'SPLIT' ? null : valid.filter((r) => r.label === consensus)
  const scored = (majority ?? []).filter((r) => r.confidence !== null)
  const avgPct = scored.length
    ? Math.round((scored.reduce((s, r) => s + (r.confidence ?? 0), 0) / scored.length) * 100)
    : null

  const tone = consensus === 'FAKE' ? 'fake' : consensus === 'REAL' ? 'real' : 'warn'
  const Icon = consensus === 'FAKE' ? AlertTriangle : consensus === 'REAL' ? CheckCircle2 : Scale
  const toneClasses = {
    real: 'border-real/30 bg-real-bg/60',
    fake: 'border-fake/30 bg-fake-bg/60',
    warn: 'border-warn/30 bg-warn-bg/60',
  }[tone]
  const textTone = { real: 'text-real', fake: 'text-fake', warn: 'text-warn' }[tone]

  return (
    <div className="animate-fade-up space-y-5">
      <div className={`rounded-xl border p-5 sm:p-6 ${toneClasses}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper/70 ${textTone}`}>
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">Consensus verdict</p>
              <h3 className={`text-2xl font-semibold tracking-tight ${textTone}`}>
                {consensus === 'SPLIT' ? 'No majority' : consensus === 'FAKE' ? 'Likely Fake' : 'Likely Real'}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                <span className="font-semibold text-ink">
                  {fakeVotes} of {valid.length}
                </span>{' '}
                models flagged this as fake.
              </p>
            </div>
          </div>
          <div className="w-full sm:w-56">
            {consensus === 'SPLIT' ? (
              <ConfidenceBar pct={50} tone="warn" label="Model agreement" />
            ) : (
              <ConfidenceBar pct={avgPct} tone={tone} label="Avg. confidence" />
            )}
          </div>
        </div>
        <p className="mt-4 border-t border-rule pt-4 text-xs leading-relaxed text-ink-soft">
          Machine-learning predictions are probabilistic and can be wrong. This tool analyzes writing patterns — it
          does not independently verify facts or sources.
        </p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Model comparison</h3>
        <ul className="grid gap-3 md:grid-cols-3">
          {results.map((r) => (
            <ModelCard key={r.model_used} result={r} />
          ))}
        </ul>
      </div>
    </div>
  )
}

function ModelCard({ result: r }: { result: EnsembleResult }) {
  if (r.error) {
    return (
      <li className="rounded-xl border border-rule bg-paper p-4">
        <p className="text-sm font-semibold text-ink">{modelLabel(r.model_used)}</p>
        <p className="mt-3 flex items-start gap-2 text-xs text-fake">
          <XCircle className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
          {r.error}
        </p>
      </li>
    )
  }

  const isReal = r.label === 'REAL'
  const pct = r.confidence !== null ? Math.round(r.confidence * 100) : null

  return (
    <li className="flex flex-col rounded-xl border border-rule bg-paper p-4 shadow-drawer">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-ink">{modelLabel(r.model_used)}</p>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isReal ? 'bg-real-bg text-real' : 'bg-fake-bg text-fake'
          }`}
        >
          {r.label}
        </span>
      </div>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-soft">{explain(r.label, pct)}</p>
      <div className="mt-4">
        <ConfidenceBar pct={pct} tone={isReal ? 'real' : 'fake'} />
      </div>
      <p className="mt-3 font-mono text-[11px] text-ink-faint">{r.latencyMs} ms</p>
    </li>
  )
}
