import { FileText, Sparkles, Hash, CheckCircle2 } from 'lucide-react'

const STEPS = [
  { icon: FileText, title: 'Submit article', desc: 'Text comes in via the web app or API.' },
  { icon: Sparkles, title: 'Preprocessing', desc: 'Lowercased, stripped of links, HTML, and punctuation.' },
  { icon: Hash, title: 'TF-IDF vectorization', desc: 'Text converted into weighted term features.' },
  { icon: CheckCircle2, title: 'Model prediction', desc: 'All three classifiers vote independently.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-20 border-t border-rule bg-canvas">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-serif font-semibold text-ink text-center">How It Works</h2>
        <p className="mt-2 text-ink-soft text-center text-sm">
          Text preprocessing and TF-IDF vectorization feed three independent classifiers.
        </p>

        <div className="mt-12 grid sm:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative text-center">
              {i < STEPS.length - 1 && (
                <div
                  className="hidden sm:block absolute top-6 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px bg-rule-strong"
                  aria-hidden="true"
                />
              )}
              <div className="relative w-12 h-12 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <step.icon className="w-5 h-5 text-accent" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-xs text-ink-soft leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
