import { Box, Code2, Cpu, Database, FileCode, Package, Server } from 'lucide-react'
import SectionHeading from './SectionHeading'

const TECH = [
  { icon: Code2, label: 'Frontend', value: 'React + TypeScript + Vite' },
  { icon: Server, label: 'Backend', value: 'FastAPI on Render' },
  { icon: Cpu, label: 'Machine learning', value: 'scikit-learn' },
  { icon: FileCode, label: 'Features', value: 'TF-IDF vectorization' },
  { icon: Package, label: 'Serialization', value: 'joblib' },
  { icon: Box, label: 'Containerization', value: 'Docker' },
]

export default function About() {
  return (
    <section id="about" className="px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading eyebrow="About" title="The WELFake dataset" />
          <div className="mt-5 space-y-4 leading-relaxed text-ink-soft">
            <p>
              Approximately 72,000 raw articles, merged from four sources: Kaggle, McIntire, Reuters, and BuzzFeed
              Political. After cleaning, the training corpus contains 63,121 articles.
            </p>
            <p>
              This breadth helps reduce overfitting to any single source&apos;s writing style — but as the benchmarks
              show, the models also pick up on source-attribution words themselves. TruthLens classifies writing
              patterns; it does not independently verify facts.
            </p>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink-soft">
            <Database className="h-4 w-4 text-primary" aria-hidden="true" />
            63,121 cleaned articles · 80/20 train/test split
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Technology</h3>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {TECH.map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-xl border border-rule bg-paper p-4">
                <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-ink-faint">{item.label}</dt>
                  <dd className="text-sm font-medium text-ink">{item.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
