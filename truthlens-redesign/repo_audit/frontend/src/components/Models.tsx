const MODELS = [
  {
    name: 'Logistic Regression',
    tag: 'baseline',
    description: 'A TF-IDF based linear classifier and the baseline model in this project.',
  },
  {
    name: 'Random Forest',
    tag: 'ensemble',
    description: 'An ensemble-based classifier capable of learning nonlinear relationships in the text features.',
  },
  {
    name: 'Passive Aggressive',
    tag: 'online learning',
    description: 'An online-learning classifier commonly used for large-scale text classification.',
  },
]

export default function Models() {
  return (
    <section className="px-6 py-20 border-t border-rule bg-paper">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-serif font-semibold text-ink text-center">Three Models</h2>
        <p className="mt-2 text-ink-soft text-center text-sm max-w-lg mx-auto">
          Each runs independently on every submission. See{' '}
          <a href="#benchmarks" className="text-primary underline underline-offset-2">
            Model Benchmarks
          </a>{' '}
          for real accuracy, precision, and recall figures.
        </p>

        <div className="mt-10 grid sm:grid-cols-3 gap-5">
          {MODELS.map((m) => (
            <div key={m.name} className="rounded-lg border border-rule-strong bg-canvas p-6">
              <span className="inline-block font-mono text-[11px] text-primary border border-primary/30 rounded-full px-2.5 py-0.5">
                {m.tag}
              </span>
              <h3 className="mt-3 font-semibold text-ink">{m.name}</h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
