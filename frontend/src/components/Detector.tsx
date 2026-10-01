import { useEffect, useRef, useState } from 'react'
import { Loader2, X, Sparkles, WifiOff } from 'lucide-react'
import { predictEnsemble, checkHealth, ApiError, type EnsembleResult } from '../lib/api'
import { highlightTerms } from '../lib/highlight'

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

const MODEL_LABELS: Record<string, string> = {
  logistic_regression: 'Logistic Regression',
  random_forest: 'Random Forest',
  passive_aggressive: 'Passive Aggressive',
}

const MAX_CHARS = 20000
const MIN_WORDS = 15

type Backend = 'waking' | 'ready' | 'offline'

export default function Detector() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<EnsembleResult[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [backend, setBackend] = useState<Backend>('waking')
  const resultsRef = useRef<HTMLDivElement>(null)

  // Wake the free-tier backend as soon as the page loads, so the first scan isn't the one that pays for the cold start.
  const wake = () => {
    setBackend('waking')
    checkHealth().then((ok) => setBackend(ok ? 'ready' : 'offline'))
  }
  useEffect(wake, [])

  useEffect(() => {
    if (!results) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    resultsRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' })
  }, [results])

  const handleAnalyze = async () => {
    if (loading) return
    setError(null)
    setResults(null)
    if (!text.trim()) {
      setError('Paste a headline or article to analyze.')
      return
    }
    setLoading(true)
    try {
      setResults(await predictEnsemble(text))
      setBackend('ready')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = (next = '') => {
    setText(next)
    setResults(null)
    setError(null)
  }

  const words = text.trim().split(/\s+/).filter(Boolean).length
  const tooShort = words > 0 && words < MIN_WORDS

  const valid = results?.filter((r) => !r.error) ?? []
  const n = valid.length
  const fakeVotes = valid.filter((r) => r.label === 'FAKE').length
  const verdict = n === 0 ? null : fakeVotes * 2 > n ? 'FAKE' : fakeVotes * 2 === n ? 'SPLIT' : 'REAL'
  const unanimous = n > 0 && (fakeVotes === 0 || fakeVotes === n)
  const headline =
    verdict === 'FAKE'
      ? `${fakeVotes} of ${n} models flag this as fake`
      : verdict === 'REAL'
        ? `${n - fakeVotes} of ${n} models read this as real`
        : `Models disagree: ${fakeVotes} fake, ${n - fakeVotes} real`

  const terms = text ? highlightTerms(text) : []
  const hasHighlights = terms.some((t) => t.direction)

  const tone = {
    FAKE: { text: 'text-fake', panel: 'border-fake/30 bg-fake-bg' },
    REAL: { text: 'text-real', panel: 'border-real/30 bg-real-bg' },
    SPLIT: { text: 'text-warn', panel: 'border-warn/30 bg-warn-bg' },
  }

  return (
    <section id="detector" className="px-6 py-20 border-t border-rule bg-paper">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif font-semibold text-ink">Analyze a news story</h2>
        <p className="mt-2 text-ink-soft text-sm max-w-xl">
          Paste a headline or article. Three models score it independently, and you see where they agree and where they
          don&apos;t.
        </p>

        {backend === 'waking' && (
          <p role="status" className="mt-5 flex items-center gap-2 text-xs text-ink-soft">
            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            Starting the analysis server. This can take up to a minute after a quiet period.
          </p>
        )}
        {backend === 'offline' && (
          <div role="alert" className="mt-5 flex items-center justify-between gap-3 rounded border border-warn bg-warn-bg px-4 py-3 text-sm text-warn">
            <span className="inline-flex items-center gap-2">
              <WifiOff className="w-4 h-4" aria-hidden="true" />
              The analysis server isn&apos;t responding.
            </span>
            <button onClick={wake} className="font-semibold underline focus-ring rounded-sm">
              Try again
            </button>
          </div>
        )}

        <div className="mt-6 rounded-lg border border-rule-strong bg-paper shadow-drawer p-6">
          <label htmlFor="article-text" className="sr-only">
            Article text
          </label>
          <textarea
            id="article-text"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAnalyze()
            }}
            placeholder="Paste a headline or article here…"
            disabled={loading}
            rows={8}
            aria-describedby="text-meta"
            className="w-full resize-y rounded border border-rule-strong text-ink placeholder-ink-faint p-4 text-sm leading-relaxed font-sans focus:outline-none focus:border-primary disabled:opacity-60"
          />

          <div id="text-meta" className="mt-2 flex items-center justify-between gap-3 text-xs text-ink-faint">
            <span className="tabular">
              {words.toLocaleString()} words · {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
            </span>
            {text && (
              <button
                onClick={() => reset()}
                disabled={loading}
                className="inline-flex items-center gap-1 hover:text-ink transition-colors focus-ring rounded-sm"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                Clear
              </button>
            )}
          </div>
          {tooShort && (
            <p className="mt-1 text-xs text-warn">
              Short text gives less reliable results. A full paragraph works best.
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <button
                key={s.label}
                onClick={() => reset(s.text)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-rule-strong text-ink-soft hover:text-ink hover:border-primary transition-colors focus-ring disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                {s.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-ink-faint">
            Samples are for demonstration only and don&apos;t guarantee a particular label.
          </p>

          {hasHighlights && (
            <div className="mt-5 rounded border border-rule bg-drawer px-4 py-3">
              <p className="text-xs font-medium text-ink-soft mb-2">
                Words that moved the Logistic Regression score
              </p>
              <p className="text-sm leading-relaxed text-ink">
                {terms.map((t, i) =>
                  t.direction === 'fake' ? (
                    <span key={i} className="bg-fake-bg border-b-2 border-fake rounded-sm">
                      {t.word}
                    </span>
                  ) : t.direction === 'real' ? (
                    <span key={i} className="bg-real-bg border-b-2 border-real rounded-sm">
                      {t.word}
                    </span>
                  ) : (
                    <span key={i}>{t.word}</span>
                  )
                )}
              </p>
              <div className="mt-2 flex gap-4 text-[11px] text-ink-faint">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-fake-bg border-b-2 border-fake inline-block" /> toward fake
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-real-bg border-b-2 border-real inline-block" /> toward real
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded bg-primary hover:bg-primary-hover disabled:bg-rule disabled:text-ink-faint disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors focus-ring"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            {loading ? 'Analyzing with 3 models…' : 'Analyze text'}
          </button>
          <p className="mt-2 text-center text-[11px] text-ink-faint hidden sm:block">or press Ctrl/⌘ + Enter</p>

          {error && (
            <div role="alert" className="mt-4 rounded border border-warn bg-warn-bg px-4 py-3 text-sm text-warn">
              {error}
            </div>
          )}

          <div ref={resultsRef} aria-live="polite">
            {results && n === 0 && (
              <div role="alert" className="mt-6 rounded border border-warn bg-warn-bg px-4 py-3 text-sm text-warn rise">
                No model returned a result. {results[0]?.error ?? 'Please try again.'}
              </div>
            )}

            {results && verdict && (
              <div className="mt-6 rise">
                <div className={`rounded-lg border p-5 ${tone[verdict].panel}`}>
                  <h3 className={`text-lg font-serif font-semibold ${tone[verdict].text}`}>{headline}</h3>

                  {/* one segment per model, so agreement is visible at a glance */}
                  <div className="mt-3 flex gap-1.5" role="img" aria-label={headline}>
                    {valid.map((r) => (
                      <span
                        key={r.model_used}
                        title={`${MODEL_LABELS[r.model_used] ?? r.model_used}: ${r.label}`}
                        className={`h-2 flex-1 rounded-full ${r.label === 'FAKE' ? 'bg-fake' : 'bg-real'}`}
                      />
                    ))}
                  </div>

                  <p className="mt-3 text-xs text-ink-soft">
                    {unanimous
                      ? 'All models agree, but agreement is not proof. '
                      : 'Disagreement means the text is borderline for these models. Treat the result as inconclusive. '}
                    Predictions are probabilistic and do not verify facts or sources.
                  </p>
                </div>

                <ul className="mt-3 divide-y divide-rule border border-rule rounded-lg overflow-hidden">
                  {results.map((r) => (
                    <li key={r.model_used} className="px-4 py-3 bg-paper">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink">{MODEL_LABELS[r.model_used] || r.model_used}</p>
                          {r.error ? (
                            <p className="text-xs text-fake mt-0.5">{r.error}</p>
                          ) : (
                            <p className="text-xs text-ink-faint mt-0.5 tabular">
                              {r.confidence !== null ? `${Math.round(r.confidence * 100)}% confidence` : 'No confidence score'}
                              {' · '}
                              {r.latencyMs} ms
                            </p>
                          )}
                        </div>
                        {!r.error && (
                          <span
                            className={`shrink-0 font-mono text-xs font-semibold px-2.5 py-1 rounded border ${
                              r.label === 'FAKE'
                                ? 'text-fake border-fake/40 bg-fake-bg'
                                : 'text-real border-real/40 bg-real-bg'
                            }`}
                          >
                            {r.label}
                          </span>
                        )}
                      </div>
                      {!r.error && r.confidence !== null && (
                        <div className="mt-2 h-1 rounded-full bg-rule overflow-hidden" aria-hidden="true">
                          <div
                            className={`h-full grow ${r.label === 'FAKE' ? 'bg-fake' : 'bg-real'}`}
                            style={{ width: `${Math.round(r.confidence * 100)}%` }}
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
