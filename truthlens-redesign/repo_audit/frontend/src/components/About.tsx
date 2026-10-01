import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const TECH = [
  { label: 'Frontend', value: 'React + TypeScript' },
  { label: 'Backend', value: 'FastAPI' },
  { label: 'Machine Learning', value: 'scikit-learn' },
  { label: 'Feature Extraction', value: 'TF-IDF' },
  { label: 'Models', value: 'Logistic Regression, Random Forest, Passive Aggressive' },
  { label: 'Serialization', value: 'joblib' },
  { label: 'Containerization', value: 'Docker' },
]

export default function About() {
  const [open, setOpen] = useState(false)

  return (
    <section id="about" className="px-6 py-20 border-t border-rule bg-paper">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-serif font-semibold text-ink text-center">The WELFake Dataset</h2>
        <p className="mt-4 text-ink-soft text-sm leading-relaxed text-center">
          Approximately 72,000 raw articles, merged from four sources: Kaggle, McIntire, Reuters, and BuzzFeed
          Political. After cleaning, the training corpus used for these models contains 63,121 articles. This
          breadth helps reduce overfitting to any single source's writing style, but as shown in Model Benchmarks,
          the model has also picked up on source-attribution words themselves — it does not independently verify
          facts.
        </p>

        <div className="mt-10 rounded-lg border border-rule-strong bg-canvas overflow-hidden">
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="tech-details"
            className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-semibold text-ink focus-ring"
          >
            Technical Details
            <ChevronDown
              className={`w-4 h-4 text-ink-faint transition-transform ${open ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
          {open && (
            <div id="tech-details" className="px-6 pb-5 border-t border-rule">
              <dl className="mt-4 space-y-2.5">
                {TECH.map((item) => (
                  <div key={item.label} className="flex justify-between gap-4 text-sm">
                    <dt className="text-ink-faint">{item.label}</dt>
                    <dd className="text-ink text-right">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
