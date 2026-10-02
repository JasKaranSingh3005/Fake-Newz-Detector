import { EVAL_METRICS, CORPUS } from '../lib/evalMetrics'
import predictors from '../lib/lexicalPredictors.json'
import SectionHeading from './SectionHeading'

const bestAccuracy = Math.max(...EVAL_METRICS.map((m) => m.accuracy))

export default function Benchmarks() {
  const realPct = Math.round((CORPUS.real / CORPUS.total) * 100)
  const testSize = EVAL_METRICS[0].real.support + EVAL_METRICS[0].fake.support

  return (
    <section id="benchmarks" className="border-b border-rule px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Statistics"
          title="Model benchmarks"
          description={
            <>
              Measured on a held-out 20% test split ({testSize.toLocaleString()} articles) via{' '}
              <code className="rounded bg-drawer px-1.5 py-0.5 font-mono text-xs text-ink">src/evaluate.py</code>.
              Real output, not estimated.
            </>
          }
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {EVAL_METRICS.map((m) => {
            const best = m.accuracy === bestAccuracy
            return (
              <div
                key={m.name}
                className={`rounded-xl border bg-paper p-5 shadow-drawer ${best ? 'border-primary/50' : 'border-rule'}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">{m.name}</p>
                  {best && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      Top accuracy
                    </span>
                  )}
                </div>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-ink">
                  {(m.accuracy * 100).toFixed(2)}
                  <span className="text-lg text-ink-faint">%</span>
                </p>
                <p className="text-xs text-ink-faint">Accuracy</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-drawer" aria-hidden="true">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${m.accuracy * 100}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-rule bg-paper">
          <table className="w-full min-w-[560px] text-sm">
            <caption className="sr-only">Detailed evaluation metrics per model</caption>
            <thead>
              <tr className="border-b border-rule bg-drawer/60 text-xs text-ink-faint">
                <th scope="col" className="px-4 py-3 text-left font-medium">Model</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Accuracy</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">F1</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">ROC-AUC</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Precision (Fake)</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Recall (Fake)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {EVAL_METRICS.map((m) => (
                <tr key={m.name} className="transition-colors hover:bg-drawer/40">
                  <th scope="row" className="px-4 py-3 text-left font-medium text-ink">{m.name}</th>
                  <td className="px-4 py-3 text-right font-mono text-ink">{(m.accuracy * 100).toFixed(2)}%</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-soft">{m.f1.toFixed(3)}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-soft">{m.rocAuc.toFixed(3)}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-soft">{m.fake.precision.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-soft">{m.fake.recall.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="flex items-center gap-5 rounded-xl border border-rule bg-paper p-5">
            <div
              className="h-20 w-20 shrink-0 rounded-full"
              style={{
                background: `conic-gradient(rgb(var(--real)) 0% ${realPct}%, rgb(var(--fake)) ${realPct}% 100%)`,
                mask: 'radial-gradient(circle, transparent 52%, black 53%)',
                WebkitMask: 'radial-gradient(circle, transparent 52%, black 53%)',
              }}
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-medium text-ink-faint">Cleaned corpus</p>
              <p className="mt-1 text-sm text-ink">
                <span className="font-semibold text-real">{CORPUS.real.toLocaleString()} real</span>
                {' · '}
                <span className="font-semibold text-fake">{CORPUS.fake.toLocaleString()} fake</span>
              </p>
              <p className="mt-0.5 text-xs text-ink-faint">
                {CORPUS.total.toLocaleString()} articles ({realPct}% / {100 - realPct}%)
              </p>
            </div>
          </div>

          <TermList title="Top terms pushing toward FAKE" tone="fake" terms={predictors.logistic_regression.fake} plus />
          <TermList title="Top terms pushing toward REAL" tone="real" terms={predictors.logistic_regression.real} />
        </div>

        <p className="mt-4 max-w-2xl text-xs leading-relaxed text-ink-faint">
          Terms are extracted directly from the trained Logistic Regression coefficients. The strongest &quot;real&quot;
          signal is literally the word <em>reuters</em> — a reminder these scores reflect source-attribution patterns in
          the training corpus, not verified fact-checking.
        </p>
      </div>
    </section>
  )
}

function TermList({
  title,
  tone,
  terms,
  plus,
}: {
  title: string
  tone: 'real' | 'fake'
  terms: { term: string; weight: number }[]
  plus?: boolean
}) {
  return (
    <div className="rounded-xl border border-rule bg-paper p-5">
      <p className={`mb-3 text-xs font-semibold ${tone === 'fake' ? 'text-fake' : 'text-real'}`}>{title}</p>
      <ul className="flex flex-wrap gap-1.5">
        {terms.slice(0, 8).map((t) => (
          <li
            key={t.term}
            className={`rounded-md px-2 py-1 font-mono text-xs ${tone === 'fake' ? 'bg-fake-bg text-fake' : 'bg-real-bg text-real'}`}
          >
            {t.term}{' '}
            <span className="opacity-70">
              {plus ? '+' : ''}
              {t.weight}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
