import { useEffect, useState, type KeyboardEvent } from 'react'
import { AlertCircle, Loader2, RotateCcw, ScanSearch, Sparkles, X } from 'lucide-react'
import {
  predict,
  predictEnsemble,
  fetchModels,
  ApiError,
  type EnsembleResult,
  type ModelName,
  type PredictResponse,
} from '../lib/api'
import { waitForBackend } from '../lib/health'
import { highlightTerms } from '../lib/highlight'
import { MODEL_ORDER, modelLabel } from '../lib/models'
import EnsembleResults from './EnsembleResults'
import ResultCard from './ResultCard'
import SectionHeading from './SectionHeading'

const SAMPLES = [
  {
    label: 'Routine policy update',
    text: 'The Ministry of Finance announced today that the quarterly budget review will proceed as scheduled next month, with department heads submitting reports by the 15th.',
  },
  {
    label: 'Sensational claim',
    text: 'BREAKING: Scientists confirm the moon is secretly made of cheese, government has covered up the truth for decades, anonymous insider reveals.',
  },
  {
    label: 'Local news brief',
    text: 'City council voted 6-2 Tuesday evening to approve funding for the downtown library renovation, with construction expected to begin in spring.',
  },
]

const MAX_CHARS = 20000
const ALL = 'all'
type Mode = typeof ALL | ModelName
type Phase = 'idle' | 'waking' | 'analyzing'
type Outcome =
  | { kind: 'ensemble'; results: EnsembleResult[] }
  | { kind: 'single'; result: PredictResponse; latencyMs: number }

export default function Detector() {
  const [text, setText] = useState('')
  const [mode, setMode] = useState<Mode>(ALL)
  const [models, setModels] = useState<ModelName[]>(MODEL_ORDER)
  const [phase, setPhase] = useState<Phase>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loading = phase !== 'idle'

  // Use the backend's /models list when reachable; fall back to the known three.
  useEffect(() => {
    let active = true
    waitForBackend()
      .then((ok) => (ok ? fetchModels() : null))
      .then((list) => {
        const known = list?.filter((m): m is ModelName => (MODEL_ORDER as string[]).includes(m))
        if (active && known?.length) setModels(known)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!loading) return
    setElapsed(0)
    const id = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [loading])

  const handleAnalyze = async () => {
    setError(null)
    setOutcome(null)
    if (!text.trim()) {
      setError('Please enter some text to analyze.')
      return
    }

    // Render's free tier sleeps; wake it with the health endpoint first so the
    // prediction request isn't spent waiting on a cold start and timing out.
    setPhase('waking')
    await waitForBackend()
    setPhase('analyzing')

    try {
      if (mode === ALL) {
        const results = await predictEnsemble(text)
        const failed = results.filter((r) => r.error)
        if (failed.length === results.length) throw new ApiError(failed[0].error!)
        setOutcome({ kind: 'ensemble', results })
      } else {
        const start = performance.now()
        const result = await predict(text, mode)
        setOutcome({ kind: 'single', result, latencyMs: Math.round(performance.now() - start) })
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setPhase('idle')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !loading && text.trim()) {
      e.preventDefault()
      handleAnalyze()
    }
  }

  const reset = (next = '') => {
    setText(next)
    setOutcome(null)
    setError(null)
  }

  const terms = text ? highlightTerms(text) : []
  const hasHighlights = terms.some((t) => t.direction)
  const modeOptions: { value: Mode; label: string }[] = [
    { value: ALL, label: 'Compare all' },
    ...models.map((m) => ({ value: m, label: modelLabel(m) })),
  ]

  return (
    <section id="detector" className="border-b border-rule bg-paper/40 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Detector"
          title="Analyze a news story"
          description="Paste a headline or full article. Run every model side by side, or pick a single classifier."
        />

        <div className="mt-10 overflow-hidden rounded-2xl border border-rule bg-paper shadow-modal">
          <fieldset className="border-b border-rule px-4 py-3 sm:px-6">
            <legend className="sr-only">Model selection</legend>
            <div className="flex gap-1 overflow-x-auto rounded-lg bg-drawer p-1">
              {modeOptions.map((opt) => (
                <label key={opt.value} className="shrink-0 grow">
                  <input
                    type="radio"
                    name="model"
                    value={opt.value}
                    checked={mode === opt.value}
                    onChange={() => setMode(opt.value)}
                    disabled={loading}
                    className="peer sr-only"
                  />
                  <span className="block cursor-pointer whitespace-nowrap rounded-md px-3 py-1.5 text-center text-sm font-medium text-ink-soft transition-colors hover:text-ink peer-checked:bg-paper peer-checked:text-ink peer-checked:shadow-drawer peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-primary peer-disabled:cursor-not-allowed">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="p-4 sm:p-6">
            <label htmlFor="article-text" className="sr-only">
              Article text
            </label>
            <textarea
              id="article-text"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={handleKeyDown}
              placeholder="Paste a headline or article here…"
              disabled={loading}
              rows={9}
              className="min-h-[220px] w-full resize-y rounded-xl border border-rule-strong bg-canvas p-4 text-[15px] leading-relaxed text-ink placeholder:text-ink-faint transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:opacity-60"
            />

            <div className="mt-2 flex items-center justify-between text-xs text-ink-faint">
              <span className="font-mono">
                {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </span>
              {text && (
                <button
                  type="button"
                  onClick={() => reset()}
                  disabled={loading}
                  className="inline-flex items-center gap-1 rounded-sm px-1 hover:text-ink focus-ring disabled:opacity-50"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  Clear
                </button>
              )}
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-ink-faint">Try an example</p>
              <div className="flex flex-wrap gap-2">
                {SAMPLES.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => reset(s.text)}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 rounded-full border border-rule-strong px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-primary hover:text-ink focus-ring disabled:opacity-50"
                  >
                    <Sparkles className="h-3 w-3 text-primary" aria-hidden="true" />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {hasHighlights && (
              <div className="mt-5 rounded-xl border border-rule bg-drawer/60 p-4">
                <p className="mb-2 text-xs font-medium text-ink-faint">
                  Lexical signals (Logistic Regression coefficients)
                </p>
                <p className="max-h-40 overflow-y-auto text-sm leading-relaxed text-ink">
                  {terms.map((t, i) =>
                    t.direction ? (
                      <mark
                        key={i}
                        className={`rounded-sm border-b-2 text-ink ${
                          t.direction === 'fake' ? 'border-fake bg-fake-bg' : 'border-real bg-real-bg'
                        }`}
                      >
                        {t.word}
                      </mark>
                    ) : (
                      <span key={i}>{t.word}</span>
                    ),
                  )}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-ink-faint">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm border-b-2 border-fake bg-fake-bg" aria-hidden="true" />
                    pushes toward FAKE
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm border-b-2 border-real bg-real-bg" aria-hidden="true" />
                    pushes toward REAL
                  </span>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="hidden text-xs text-ink-faint sm:block">
                <kbd className="rounded border border-rule-strong px-1.5 py-0.5 font-mono">Ctrl</kbd> +{' '}
                <kbd className="rounded border border-rule-strong px-1.5 py-0.5 font-mono">Enter</kbd> to analyze
              </p>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                aria-busy={loading}
                className="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-fg shadow-drawer transition-colors hover:bg-primary-hover focus-ring disabled:cursor-not-allowed disabled:bg-rule-strong disabled:text-ink-faint disabled:shadow-none sm:min-w-48"
              >
                {loading ? (
                  <>
                    <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/15 to-transparent" aria-hidden="true" />
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    {phase === 'waking' ? 'Connecting…' : 'Analyzing…'}
                  </>
                ) : (
                  <>
                    <ScanSearch className="h-4 w-4" aria-hidden="true" />
                    Analyze News
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="border-t border-rule bg-canvas/50 p-4 sm:p-6" aria-live="polite">
            {loading ? (
              <LoadingState phase={phase} elapsed={elapsed} ensemble={mode === ALL} />
            ) : error ? (
              <div role="alert" className="animate-fade-up flex items-start gap-3 rounded-xl border border-fake/30 bg-fake-bg/60 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-fake" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">Analysis failed</p>
                  <p className="mt-0.5 text-sm text-ink-soft">{error}</p>
                </div>
                {text.trim() && (
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-rule-strong bg-paper px-3 py-1.5 text-xs font-medium text-ink hover:bg-drawer focus-ring"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    Retry
                  </button>
                )}
              </div>
            ) : outcome?.kind === 'ensemble' ? (
              <EnsembleResults results={outcome.results} />
            ) : outcome?.kind === 'single' ? (
              <ResultCard result={outcome.result} latencyMs={outcome.latencyMs} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-drawer text-ink-faint">
        <ScanSearch className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-3 text-sm font-medium text-ink">No analysis yet</p>
      <p className="mt-1 max-w-xs text-sm text-ink-faint">Paste an article or pick an example, then run the analysis.</p>
    </div>
  )
}

function LoadingState({ phase, elapsed, ensemble }: { phase: Phase; elapsed: number; ensemble: boolean }) {
  const coldStart = phase === 'waking' && elapsed >= 3
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-ink">
            {phase === 'waking'
              ? coldStart
                ? 'Waking up the ML server…'
                : 'Connecting to the ML server…'
              : ensemble
                ? 'Running all models in parallel…'
                : 'Running prediction…'}
          </p>
          {coldStart && (
            <p className="mt-0.5 text-xs text-ink-faint">
              The backend sleeps when idle on Render&apos;s free tier. First requests can take up to a minute — {elapsed}s
              elapsed.
            </p>
          )}
        </div>
      </div>
      <div className={`grid gap-3 ${ensemble ? 'md:grid-cols-3' : ''}`} aria-hidden="true">
        {Array.from({ length: ensemble ? 3 : 1 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-rule bg-paper p-4">
            <div className="h-3 w-1/2 animate-pulse rounded bg-drawer" />
            <div className="h-2.5 w-full animate-pulse rounded bg-drawer" />
            <div className="h-2 w-3/4 animate-pulse rounded bg-drawer" />
          </div>
        ))}
      </div>
    </div>
  )
}
