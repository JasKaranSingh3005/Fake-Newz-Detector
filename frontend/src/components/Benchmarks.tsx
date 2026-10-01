import { EVAL_METRICS, CORPUS } from '../lib/evalMetrics'
import predictors from '../lib/lexicalPredictors.json'

export default function Benchmarks() {
  const realPct = Math.round((CORPUS.real / CORPUS.total) * 100)

  return (
    <section id="benchmarks" className="px-6 py-20 border-t border-rule bg-canvas">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs tracking-widest text-ink-faint uppercase mb-2">Evaluation Suite</p>
        <h2 className="text-3xl font-serif font-semibold text-ink">Model Benchmarks</h2>
        <p className="mt-2 text-ink-soft text-sm max-w-xl">
          Measured on a held-out 20% test split ({EVAL_METRICS[0].real.support + EVAL_METRICS[0].fake.support}{' '}
          articles) via <code className="font-mono text-xs bg-drawer px-1 py-0.5 rounded">src/evaluate.py</code>.
          Real output, not estimated.
        </p>

        {/* Metrics table */}
        <div className="mt-8 overflow-x-auto rounded-lg border border-rule-strong bg-paper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-rule bg-drawer">
                <th className="text-left font-mono text-[11px] uppercase tracking-wide text-ink-faint px-4 py-3">
                  Model
                </th>
                <th className="text-right font-mono text-[11px] uppercase tracking-wide text-ink-faint px-4 py-3">
                  Accuracy
                </th>
                <th className="text-right font-mono text-[11px] uppercase tracking-wide text-ink-faint px-4 py-3">
                  F1
                </th>
                <th className="text-right font-mono text-[11px] uppercase tracking-wide text-ink-faint px-4 py-3">
                  ROC-AUC
                </th>
                <th className="text-right font-mono text-[11px] uppercase tracking-wide text-ink-faint px-4 py-3">
                  Precision (Fake)
                </th>
                <th className="text-right font-mono text-[11px] uppercase tracking-wide text-ink-faint px-4 py-3">
                  Recall (Fake)
                </th>
              </tr>
            </thead>
            <tbody>
              {EVAL_METRICS.map((m, i) => (
                <tr key={m.name} className={i !== EVAL_METRICS.length - 1 ? 'border-b border-rule' : ''}>
                  <td className="px-4 py-3 font-medium text-ink">{m.name}</td>
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

        {/* Corpus composition */}
        <div className="mt-6 grid sm:grid-cols-[auto_1fr] gap-6 items-center rounded-lg border border-rule-strong bg-paper p-6">
          <div
            className="w-24 h-24 rounded-full shrink-0"
            style={{
              background: `conic-gradient(rgb(var(--c-real)) 0% ${realPct}%, rgb(var(--c-fake)) ${realPct}% 100%)`,
            }}
            aria-hidden="true"
          />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint mb-1">
              Cleaned Corpus Composition
            </p>
            <p className="text-sm text-ink">
              <span className="font-semibold text-real">{CORPUS.real.toLocaleString()} real</span> /{' '}
              <span className="font-semibold text-fake">{CORPUS.fake.toLocaleString()} fake</span> —{' '}
              {CORPUS.total.toLocaleString()} articles total ({realPct}% / {100 - realPct}% split)
            </p>
          </div>
        </div>

        {/* Lexical predictors */}
        <div className="mt-6 grid sm:grid-cols-2 gap-5">
          <div className="rounded-lg border border-rule-strong bg-paper p-5">
            <p className="font-mono text-[11px] uppercase tracking-wide text-fake mb-3">
              Top terms pushing toward FAKE
            </p>
            <ul className="space-y-1.5">
              {predictors.logistic_regression.fake.slice(0, 8).map((t) => (
                <li key={t.term} className="flex justify-between text-sm">
                  <span className="text-ink font-mono">{t.term}</span>
                  <span className="text-ink-faint font-mono text-xs">+{t.weight}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-rule-strong bg-paper p-5">
            <p className="font-mono text-[11px] uppercase tracking-wide text-real mb-3">
              Top terms pushing toward REAL
            </p>
            <ul className="space-y-1.5">
              {predictors.logistic_regression.real.slice(0, 8).map((t) => (
                <li key={t.term} className="flex justify-between text-sm">
                  <span className="text-ink font-mono">{t.term}</span>
                  <span className="text-ink-faint font-mono text-xs">{t.weight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-faint max-w-xl">
          Extracted directly from the trained Logistic Regression model's coefficients. Note the model's strongest
          "real" signal is literally the word <em>reuters</em> appearing in the text — a reminder these scores
          reflect source-attribution patterns in the training corpus, not verified fact-checking.
        </p>
      </div>
    </section>
  )
}
