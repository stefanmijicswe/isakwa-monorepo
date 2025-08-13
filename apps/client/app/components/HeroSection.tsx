import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Singidunum
                </span>
              </h1>
              <h2 className="text-3xl lg:text-4xl font-semibold text-slate-700">
                <span className="bg-yellow-300 px-2 py-1 rounded">Private University</span>
              </h2>
            </div>

            <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-lg">
              To advance, adapt and accelerate careers through innovative education and cutting-edge research.
            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-[280px] h-16 flex items-center justify-center">
                    Request a Call Back
                  </Button>
                  <Button variant="outline" size="lg" className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-6 text-lg rounded-xl transition-all duration-300 w-[280px] h-16 flex items-center justify-center">
                    Explore Programs
                  </Button>
                </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">15,000+</div>
                <div className="text-slate-600 text-sm">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">200+</div>
                <div className="text-slate-600 text-sm">Academic Programs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-slate-600 text-sm">Employment Rate</div>
              </div>
            </div>
          </div>

                        <div className="relative">
                <div className="w-full h-[600px] relative rounded-3xl shadow-2xl overflow-hidden">
                  <Image
                    src="/studentHeader.jpg"
                    alt="Student at Singidunum University"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
        </div>
      </div>
    </section>
  )
} 