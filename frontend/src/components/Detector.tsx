import { useState } from 'react'
import { Loader2, X, Sparkles } from 'lucide-react'
import { predict, ApiError, type ModelName, type PredictResponse } from '../lib/api'
import ResultCard from './ResultCard'

const MODELS: { value: ModelName; label: string }[] = [
  { value: 'logistic_regression', label: 'Logistic Regression' },
  { value: 'random_forest', label: 'Random Forest' },
  { value: 'passive_aggressive', label: 'Passive Aggressive' },
]

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

export default function Detector() {
  const [text, setText] = useState('')
  const [model, setModel] = useState<ModelName>('logistic_regression')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setError(null)
    setResult(null)

    if (!text.trim()) {
      setError('Please enter some text to analyze.')
      return
    }

    setLoading(true)
    try {
      const res = await predict(text, model)
      setResult(res)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setText('')
    setResult(null)
    setError(null)
  }

  const handleSample = (sampleText: string) => {
    setText(sampleText)
    setResult(null)
    setError(null)
  }

  return (
    <section id="detector" className="px-6 py-24 border-t border-white/5">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">Analyze a News Story</h2>
        <p className="mt-2 text-slate-400 text-center text-sm">
          Paste a headline or article body below and choose a model.
        </p>

        <div className="mt-8 rounded-xl border border-white/10 bg-navy-900/60 backdrop-blur-sm p-6 shadow-glass">
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
            className="w-full resize-none rounded-lg bg-navy-950 border border-white/10 text-slate-200 placeholder-slate-500 p-4 text-sm leading-relaxed focus-ring disabled:opacity-60"
          />

          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>
              {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
            </span>
            {text && (
              <button
                onClick={handleClear}
                disabled={loading}
                className="inline-flex items-center gap-1 hover:text-slate-300 transition-colors focus-ring rounded-sm"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                Clear
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSample(s.text)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20 transition-colors focus-ring disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                {s.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-slate-600">
            Sample text for demonstration only — not a guarantee of the actual label.
          </p>

          <div className="mt-6">
            <label htmlFor="model-select" className="block text-xs font-medium text-slate-400 mb-2">
              Prediction Model
            </label>
            <select
              id="model-select"
              value={model}
              onChange={(e) => setModel(e.target.value as ModelName)}
              disabled={loading}
              className="w-full sm:w-auto rounded-lg bg-navy-950 border border-white/10 text-slate-200 text-sm px-3 py-2.5 focus-ring disabled:opacity-60"
            >
              {MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-accent hover:bg-accent-light disabled:bg-navy-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors focus-ring"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            {loading ? 'Analyzing…' : 'Analyze Article'}
          </button>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-warn"
            >
              {error}
            </div>
          )}

          {result && <ResultCard result={result} />}
        </div>
      </div>
    </section>
  )
}
