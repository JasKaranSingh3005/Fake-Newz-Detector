import Header from './components/Header'
import Hero from './components/Hero'
import Detector from './components/Detector'
import Benchmarks from './components/Benchmarks'
import Models from './components/Models'
import HowItWorks from './components/HowItWorks'
import About from './components/About'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <a
        href="#detector"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to detector
      </a>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Detector />
        <Benchmarks />
        <Models />
        <About />
      </main>
      <Footer />
    </div>
  )
}
