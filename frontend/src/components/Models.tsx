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
    <section id="models" className="px-6 py-24 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">Three Models</h2>
        <p className="mt-2 text-slate-400 text-center text-sm max-w-lg mx-auto">
          Each available at request time. None is presented as definitively better without evaluation data to back
          it.
        </p>

        <div className="mt-10 grid sm:grid-cols-3 gap-5">
          {MODELS.map((m) => (
            <div key={m.name} className="rounded-xl border border-white/10 bg-navy-900/50 p-6">
              <span className="inline-block text-[11px] font-mono text-accent-light border border-accent/30 rounded-full px-2.5 py-0.5">
                {m.tag}
              </span>
              <h3 className="mt-3 font-semibold text-white">{m.name}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">Evaluation metrics not currently available.</p>
      </div>
    </section>
  )
}
