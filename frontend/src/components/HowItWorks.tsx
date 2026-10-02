import { FileText, Sparkles, Hash, CheckCircle2 } from 'lucide-react'
import SectionHeading from './SectionHeading'

const STEPS = [
  { icon: FileText, title: 'Submit article', desc: 'Text comes in via the web app or the REST API.' },
  { icon: Sparkles, title: 'Preprocessing', desc: 'Lowercased and stripped of links, HTML, and punctuation.' },
  { icon: Hash, title: 'TF-IDF vectorization', desc: 'Text is converted into weighted term-frequency features.' },
  { icon: CheckCircle2, title: 'Model prediction', desc: 'Each classifier votes independently on the label.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-rule px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Pipeline"
          title="How it works"
          description="A classic, transparent NLP pipeline — no black-box LLM. Every prediction can be traced to the words in your text."
          center
        />

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-xl border border-rule bg-paper p-6 shadow-drawer">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-xs text-ink-faint">0{i + 1}</span>
              </div>
              <h3 className="mt-5 font-semibold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
