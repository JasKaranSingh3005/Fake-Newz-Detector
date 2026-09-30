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
    <section id="about" className="px-6 py-24 border-t border-white/5">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">The WELFake Dataset</h2>
        <p className="mt-4 text-slate-400 text-sm leading-relaxed text-center">
          The project's README documents a dataset of approximately 72,000 articles, merged from four sources:
          Kaggle, McIntire, Reuters, and BuzzFeed Political. This breadth helps reduce overfitting to any single
          source's writing style, but it does not make the detector universally accurate — it reflects the patterns
          present in this specific corpus.
        </p>

        <div className="mt-10 rounded-xl border border-white/10 bg-navy-900/50 overflow-hidden">
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="tech-details"
            className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-semibold text-white focus-ring"
          >
            Technical Details
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
          {open && (
            <div id="tech-details" className="px-6 pb-5 border-t border-white/10">
              <dl className="mt-4 space-y-2.5">
                {TECH.map((item) => (
                  <div key={item.label} className="flex justify-between gap-4 text-sm">
                    <dt className="text-slate-500">{item.label}</dt>
                    <dd className="text-slate-300 text-right">{item.value}</dd>
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
