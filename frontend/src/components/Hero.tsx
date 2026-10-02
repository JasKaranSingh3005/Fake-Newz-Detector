import { ArrowRight } from 'lucide-react'
import { CORPUS, EVAL_METRICS } from '../lib/evalMetrics'

const bestAccuracy = Math.max(...EVAL_METRICS.map((m) => m.accuracy))

const STATS = [
  { value: `${(bestAccuracy * 100).toFixed(1)}%`, label: 'Best test accuracy' },
  { value: `${Math.round(CORPUS.total / 1000)}k`, label: 'Training articles' },
  { value: String(EVAL_METRICS.length), label: 'Independent models' },
]

export default function Hero() {
  return (
    <section id="top" className="relative border-b border-rule px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-12">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary md:col-span-3 md:pt-4">
            01 / WELFake classifier
          </p>
          <div className="md:col-span-9">
            <h1 className="text-balance text-5xl font-extrabold leading-[0.95] tracking-tighter text-ink sm:text-7xl lg:text-8xl">
              Can you trust what you read?
            </h1>
            <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">
              Paste any headline or article and three machine-learning classifiers will independently assess whether it
              reads like real or fabricated news.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#detector"
                className="inline-flex items-center justify-between gap-6 bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-wider text-primary-fg transition-colors hover:bg-primary-hover focus-ring"
              >
                Analyze News
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center border-2 border-ink px-6 py-4 text-sm font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-canvas focus-ring"
              >
                How It Works
              </a>
            </div>
          </div>
        </div>

        <dl className="mt-20 grid grid-cols-3 border-t-2 border-ink">
          {STATS.map((s, i) => (
            <div key={s.label} className={`flex flex-col-reverse gap-2 py-6 ${i > 0 ? 'border-l border-rule pl-4 sm:pl-6' : ''}`}>
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">{s.label}</dt>
              <dd className="text-3xl font-bold tracking-tighter text-ink sm:text-5xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
