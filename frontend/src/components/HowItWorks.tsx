import { FileText, Sparkles, Hash, CheckCircle2 } from 'lucide-react'

const STEPS = [
  { icon: FileText, title: 'Submit article', desc: 'Text comes in via the web app or API.' },
  { icon: Sparkles, title: 'Preprocessing', desc: 'Lowercased, stripped of links, HTML, and punctuation.' },
  { icon: Hash, title: 'TF-IDF vectorization', desc: 'Text converted into weighted term features.' },
  { icon: CheckCircle2, title: 'Model prediction', desc: 'The chosen classifier returns a label and confidence.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">How It Works</h2>
        <p className="mt-2 text-slate-400 text-center text-sm">
          Text preprocessing and TF-IDF vectorization feed a trained classifier.
        </p>

        <div className="mt-12 grid sm:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative text-center">
              {i < STEPS.length - 1 && (
                <div
                  className="hidden sm:block absolute top-6 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px bg-white/10"
                  aria-hidden="true"
                />
              )}
              <div className="relative w-12 h-12 mx-auto rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
                <step.icon className="w-5 h-5 text-accent-light" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white">{step.title}</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
