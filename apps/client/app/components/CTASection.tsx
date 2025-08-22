import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"

export function CTASection() {
  return (
    <section className="py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Ready to Transform Your Future?
          </h2>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students who have already discovered their potential at Harvox University.
            Your future starts here.
          </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
                <Button
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-slate-100 px-12 py-6 text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 w-[280px] h-16 flex items-center justify-center"
                >
                  Start Application
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-slate-900 hover:bg-white hover:text-slate-900 px-12 py-6 text-lg rounded-2xl transition-all duration-500 transform hover:-translate-y-2 w-[280px] h-16 flex items-center justify-center"
                >
                  Contact Admissions
                </Button>
              </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">
              Stay Updated
            </h3>
            <p className="text-white/80 mb-8">
              Get the latest news about programs, events, and opportunities.
            </p>
                            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                  <Input
                    placeholder="Enter your email address"
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent rounded-xl h-12 border-2"
                  />
                  <Button 
                    size="default"
                    className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl px-8 transition-all duration-300 h-12 border-2 border-white"
                  >
                    Subscribe
                  </Button>
                </div>
          </div>
        </div>
      </div>
    </section>
  )
} 