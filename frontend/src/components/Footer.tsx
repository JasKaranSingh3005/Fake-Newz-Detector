const GITHUB_URL = 'https://github.com/JasKaranSingh3005/fake-newz-detector'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Footer() {
  return (
    <footer className="px-6 py-12 border-t border-rule bg-canvas">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm font-semibold text-ink font-serif">TruthLens — Editorial Intelligence</p>
        <p className="mt-1 text-xs text-ink-faint">Built with FastAPI, scikit-learn and modern web technologies.</p>

        <div className="mt-4 flex justify-center gap-5 font-mono text-xs">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-ink-soft hover:text-ink transition-colors focus-ring rounded-sm">
            GITHUB
          </a>
          <a href={`${API_URL}/docs`} target="_blank" rel="noopener noreferrer" className="text-ink-soft hover:text-ink transition-colors focus-ring rounded-sm">
            API DOCS
          </a>
        </div>

        <p className="mt-6 text-[11px] text-ink-faint max-w-md mx-auto leading-relaxed">
          This tool provides probabilistic ML classifications and does not independently verify factual claims.
        </p>
      </div>
    </footer>
  )
}
