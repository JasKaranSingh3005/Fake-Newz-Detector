import { useState } from 'react'
import { Loader2, X, Sparkles } from 'lucide-react'
import { predictEnsemble, ApiError, type EnsembleResult } from '../lib/api'
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

export default function Detector() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<EnsembleResult[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setError(null)
    setResults(null)
    if (!text.trim()) {
      setError('Please enter some text to analyze.')
      return
    }
    setLoading(true)
    try {
      const res = await predictEnsemble(text)
      setResults(res)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setText('')
    setResults(null)
    setError(null)
  }

  const handleSample = (sampleText: string) => {
    setText(sampleText)
    setResults(null)
    setError(null)
  }

  const fakeVotes = results?.filter((r) => r.label === 'FAKE').length ?? 0
  const validResults = results?.filter((r) => !r.error) ?? []
  const consensus =
    validResults.length > 0
      ? fakeVotes > validResults.length / 2
        ? 'FAKE'
        : fakeVotes === validResults.length / 2
          ? 'SPLIT'
          : 'REAL'
      : null

  const terms = text ? highlightTerms(text) : []
  const hasHighlights = terms.some((t) => t.direction)

  return (
    <section id="detector" className="px-6 py-20 border-t border-rule bg-paper">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs tracking-widest text-ink-faint uppercase mb-2">Forensic Workbench</p>
        <h2 className="text-3xl font-serif font-semibold text-ink">Analyze a News Story</h2>
        <p className="mt-2 text-ink-soft text-sm">
          Paste a headline or article below. All three models run independently and in parallel.
        </p>

        <div className="mt-8 rounded-lg border border-rule-strong bg-paper shadow-drawer p-6">
          <label htmlFor="article-text" className="sr-only">
            Article text
          </label>
          <textarea
            id="article-text"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Paste a headline or article here..."
            disabled={loading}
            rows={8}
            className="w-full resize-none rounded border border-rule-strong text-ink placeholder-ink-faint p-4 text-sm leading-relaxed font-sans focus:outline-none focus:border-primary disabled:opacity-60"
          />

          <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-ink-faint">
            <span>
              {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} CHARS
            </span>
            {text && (
              <button
                onClick={handleClear}
                disabled={loading}
                className="inline-flex items-center gap-1 hover:text-ink transition-colors focus-ring rounded-sm"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                CLEAR
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSample(s.text)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide px-3 py-1.5 rounded border border-rule-strong text-ink-soft hover:text-ink hover:border-primary transition-colors focus-ring disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                {s.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-ink-faint">
            Sample text for demonstration only — not a guarantee of the actual label.
          </p>

          {hasHighlights && (
            <div className="mt-5 rounded border border-rule bg-drawer px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint mb-2">
                Lexical Signal Highlights (Logistic Regression coefficients)
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
              <div className="mt-2 flex gap-4 font-mono text-[10px] text-ink-faint">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-fake-bg border-b-2 border-fake inline-block" /> pushes toward FAKE
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-real-bg border-b-2 border-real inline-block" /> pushes toward REAL
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
            {loading ? 'Running tri-model scan…' : 'Run Verification Scan'}
          </button>

          {error && (
            <div role="alert" className="mt-4 rounded border border-warn bg-warn-bg px-4 py-3 text-sm text-warn">
              {error}
            </div>
          )}

          {results && consensus && (
            <div className="mt-6 animate-[fadeIn_0.3s_ease-out]">
              <style>{`
                @keyframes fadeIn { from { opacity:0; transform:translateY(6px);} to {opacity:1; transform:translateY(0);} }
                @media (prefers-reduced-motion: reduce) { .animate-\\[fadeIn_0\\.3s_ease-out\\] { animation: none; } }
              `}</style>

              <div
                className={`rounded-lg border p-5 ${
                  consensus === 'FAKE'
                    ? 'border-fake/30 bg-fake-bg'
                    : consensus === 'REAL'
                      ? 'border-real/30 bg-real-bg'
                      : 'border-warn/30 bg-warn-bg'
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3
                    className={`font-mono text-sm font-semibold tracking-wide ${
                      consensus === 'FAKE' ? 'text-fake' : consensus === 'REAL' ? 'text-real' : 'text-warn'
                    }`}
                  >
                    {fakeVotes}/{validResults.length} MODELS FLAG FAKE
                  </h3>
                  <span className="font-mono text-xs text-ink-faint">
                    CONSENSUS: {consensus === 'SPLIT' ? 'NO MAJORITY' : consensus}
                  </span>
                </div>
                <p className="mt-2 text-xs text-ink-soft">
                  Machine-learning predictions are probabilistic and can be wrong. This tool does not independently
                  verify facts or sources.
                </p>
              </div>

              <div className="mt-3 divide-y divide-rule border border-rule rounded-lg overflow-hidden">
                {results.map((r) => (
                  <div key={r.model_used} className="flex items-center justify-between gap-4 px-4 py-3 bg-paper">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{MODEL_LABELS[r.model_used] || r.model_used}</p>
                      {r.error ? (
                        <p className="text-xs text-fake mt-0.5">{r.error}</p>
                      ) : (
                        <p className="font-mono text-[11px] text-ink-faint mt-0.5">
                          {r.confidence !== null ? `${Math.round(r.confidence * 100)}% confidence` : 'no confidence score'} ·{' '}
                          {r.latencyMs}ms
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
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
