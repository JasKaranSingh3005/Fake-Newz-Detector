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
      <Header />
      <main>
        <Hero />
        <Detector />
        <Benchmarks />
        <HowItWorks />
        <Models />
        <About />
      </main>
      <Footer />
    </div>
  )
}
