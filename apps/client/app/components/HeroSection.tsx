"use client"

import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import Image from "next/image"
import { useEffect, useState } from "react"

// Hook za animaciju brojčana
function useCountAnimation(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Smoother easing function (easeOutQuart)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(target * easeOutQuart)
      
      setCount(currentCount)
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    // Delay za početak animacije
    const timer = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate)
    }, 200)

    return () => {
      clearTimeout(timer)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [target, duration])

  return count
}

export function HeroSection() {
  // Animirane vrednosti
  const activeStudents = useCountAnimation(15000, 1500)
  const academicPrograms = useCountAnimation(200, 1300)
  const employmentRate = useCountAnimation(95, 1100)

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 lg:pt-12 lg:pb-32">
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
                <span className="bg-yellow-300 px-2 py-1 rounded">#1 University in Serbia</span>
              </h2>
            </div>

            <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-lg">
              To advance, adapt and accelerate careers through innovative education and cutting-edge research.
            </p>

            <div className="bg-gradient-to-r from-slate-50/80 to-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 shadow-xl overflow-hidden">
              <p className="text-xs font-semibold text-slate-400 mb-3 text-center tracking-wider uppercase">Trusted by Industry Leaders</p>
              <div className="relative h-12 flex items-center">
                <div className="flex animate-scroll-smooth space-x-12 items-center">
                  {/* First set of logos */}
                  <div className="flex items-center justify-center min-w-fit opacity-90 hover:opacity-100 transition-opacity duration-500">
                    <Image src="/logos/Microsoft_logo.svg" alt="Microsoft" width={100} height={24} className="object-contain max-h-6 filter grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  
                  <div className="flex items-center justify-center min-w-fit opacity-90 hover:opacity-100 transition-opacity duration-500">
                    <Image src="/logos/nvidia.svg" alt="NVIDIA" width={100} height={24} className="object-contain max-h-6 filter grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  
                  <div className="flex items-center justify-center min-w-fit opacity-90 hover:opacity-100 transition-opacity duration-500">
                    <Image src="/logos/Amazon_Web_Services_Logo.svg" alt="Amazon Web Services" width={100} height={24} className="object-contain max-h-6 filter grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  
                  <div className="flex items-center justify-center min-w-fit opacity-90 hover:opacity-100 transition-opacity duration-500">
                    <Image src="/logos/google-1-1.svg" alt="Google" width={100} height={24} className="object-contain max-h-6 filter grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  
                  <div className="flex items-center justify-center min-w-fit opacity-90 hover:opacity-100 transition-opacity duration-500">
                    <Image src="/logos/meta-color.svg" alt="Meta" width={100} height={24} className="object-contain max-h-6 filter grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  
                  <div className="flex items-center justify-center min-w-fit opacity-90 hover:opacity-100 transition-opacity duration-500">
                    <Image src="/logos/netflix-3.svg" alt="Netflix" width={100} height={24} className="object-contain max-h-6 filter grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  
                  <div className="flex items-center justify-center min-w-fit opacity-90 hover:opacity-100 transition-opacity duration-500">
                    <Image src="/logos/uber-2.svg" alt="Uber" width={100} height={24} className="object-contain max-h-6 filter grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  
                  {/* Duplicate set for seamless loop */}
                  <div className="flex items-center justify-center min-w-fit opacity-90 hover:opacity-100 transition-opacity duration-500">
                    <Image src="/logos/Microsoft_logo.svg" alt="Microsoft" width={100} height={24} className="object-contain max-h-6 filter grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  
                  <div className="flex items-center justify-center min-w-fit opacity-90 hover:opacity-100 transition-opacity duration-500">
                    <Image src="/logos/nvidia.svg" alt="NVIDIA" width={100} height={24} className="object-contain max-h-6 filter grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  
                  <div className="flex items-center justify-center min-w-fit opacity-90 hover:opacity-100 transition-opacity duration-500">
                    <Image src="/logos/Amazon_Web_Services_Logo.svg" alt="Amazon Web Services" width={100} height={24} className="object-contain max-h-6 filter grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  
                  <div className="flex items-center justify-center min-w-fit opacity-90 hover:opacity-100 transition-opacity duration-500">
                    <Image src="/logos/google-1-1.svg" alt="Google" width={100} height={24} className="object-contain max-h-6 filter grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  
                  <div className="flex items-center justify-center min-w-fit opacity-90 hover:opacity-100 transition-opacity duration-500">
                    <Image src="/logos/meta-color.svg" alt="Meta" width={100} height={24} className="object-contain max-h-6 filter grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  
                  <div className="flex items-center justify-center min-w-fit opacity-90 hover:opacity-100 transition-opacity duration-500">
                    <Image src="/logos/netflix-3.svg" alt="Netflix" width={100} height={24} className="object-contain max-h-6 filter grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  
                  <div className="flex items-center justify-center min-w-fit opacity-90 hover:opacity-100 transition-opacity duration-500">
                    <Image src="/logos/uber-2.svg" alt="Uber" width={100} height={24} className="object-contain max-h-6 filter grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                </div>
              </div>
            </div>

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
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {activeStudents.toLocaleString()}+
                </div>
                <div className="text-slate-600 text-sm">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {academicPrograms}+
                </div>
                <div className="text-slate-600 text-sm">Academic Programs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {employmentRate}%
                </div>
                <div className="text-slate-600 text-sm">Employment Rate</div>
              </div>
            </div>
          </div>

                        <div className="relative">
                <div className="w-full h-[600px] relative rounded-3xl shadow-2xl overflow-hidden">
                  <Image
                    src="/graduates.png"
                    alt="Graduates at Singidunum University"
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