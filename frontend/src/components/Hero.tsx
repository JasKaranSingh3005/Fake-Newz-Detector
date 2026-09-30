import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-20 pb-28 px-6">
      {/* subtle ambient glow, not a stock image */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-8" aria-hidden="true">
          <PulseGrid />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
          Can you trust what you read?
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          Analyze news headlines and articles using machine-learning models trained on the WELFake dataset.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <a
            href="#detector"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent hover:bg-accent-light text-white font-semibold text-sm transition-colors focus-ring"
          >
            Analyze News
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/15 hover:border-white/30 text-slate-200 font-semibold text-sm transition-colors focus-ring"
          >
            How It Works
          </a>
        </div>
      </div>
    </section>
  )
}

/** A small animated grid of pulsing nodes — stands in for "AI visual" without stock imagery. */
function PulseGrid() {
  const cells = Array.from({ length: 9 })
  return (
    <div className="grid grid-cols-3 gap-2">
      {cells.map((_, i) => (
        <span
          key={i}
          className="w-3 h-3 rounded-full bg-accent/70"
          style={{
            animation: `pulseDot 2.4s ease-in-out ${(i % 3) * 0.25 + Math.floor(i / 3) * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          span { animation: none !important; opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
