import Nav from './components/Nav'
import Hero from './components/Hero'
import Downloader from './components/Downloader'
import { Steps, Platforms, Footer } from './components/Misc'

export default function App() {
  return (
    <div className="relative z-[1] max-w-[860px] mx-auto px-4 sm:px-6 lg:px-7 font-sans">
      <Nav />
      <Hero />
      <Downloader />
      <Steps />
      <Platforms />
      <Footer />
    </div>
  )
}
