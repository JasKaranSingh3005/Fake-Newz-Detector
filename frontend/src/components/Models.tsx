import { GitBranch, Trees, Zap } from 'lucide-react'
import SectionHeading from './SectionHeading'

const MODELS = [
  {
    icon: GitBranch,
    name: 'Logistic Regression',
    tag: 'Baseline',
    description: 'A TF-IDF based linear classifier and the baseline model in this project. Fully interpretable coefficients.',
  },
  {
    icon: Trees,
    name: 'Random Forest',
    tag: 'Ensemble',
    description: 'An ensemble of decision trees capable of learning nonlinear relationships in the text features.',
  },
  {
    icon: Zap,
    name: 'Passive Aggressive',
    tag: 'Online learning',
    description: 'An online-learning classifier commonly used for large-scale, streaming text classification.',
  },
]

export default function Models() {
  return (
    <section className="border-b border-rule bg-paper/40 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Features"
          title="Three independent models"
          description="Each classifier runs on every submission, so you can see where they agree — and where they don't."
          center
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {MODELS.map((m) => (
            <article key={m.name} className="rounded-xl border border-rule bg-paper p-6 shadow-drawer">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <m.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-5 text-xs font-medium text-ink-faint">{m.tag}</p>
              <h3 className="mt-1 font-semibold text-ink">{m.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
