import Header from './components/Header'
import Hero from './components/Hero'
import Detector from './components/Detector'
import Models from './components/Models'
import HowItWorks from './components/HowItWorks'
import About from './components/About'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-navy-950 text-slate-100">
      <Header />
      <main>
        <Hero />
        <Detector />
        <HowItWorks />
        <Models />
        <About />
      </main>
      <Footer />
    </div>
  )
}
