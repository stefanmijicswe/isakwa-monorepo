import { Header } from "./components/Header"
import { HeroSection } from "./components/HeroSection"
import { ProgramsSection } from "./components/ProgramsSection"
import { FeaturesSection } from "./components/FeaturesSection"
import { CTASection } from "./components/CTASection"
import { Footer } from "./components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProgramsSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
