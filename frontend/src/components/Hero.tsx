import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-20 pb-24 px-6 bg-canvas border-b border-rule">
      <div className="relative max-w-3xl mx-auto text-center">
        <p className="font-mono text-xs tracking-widest text-ink-faint uppercase mb-5">
          Investigative Fact Verification
        </p>
        <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-ink tracking-tight leading-[1.1]">
          Can you trust what you read?
        </h1>
        <p className="mt-5 text-lg text-ink-soft max-w-xl mx-auto leading-relaxed">
          Analyze news headlines and articles using machine-learning models trained on the WELFake dataset.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <a
            href="#detector"
            className="inline-flex items-center gap-2 px-6 py-3 rounded bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-colors focus-ring"
          >
            Analyze News
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3 rounded border border-rule-strong hover:border-primary text-ink-soft hover:text-ink font-semibold text-sm transition-colors focus-ring"
          >
            How It Works
          </a>
        </div>
      </div>
    </section>
  )
}
