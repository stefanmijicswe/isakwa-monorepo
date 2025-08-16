import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Separator } from "../../components/ui/separator"
import { Input } from "../../components/ui/input"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
                    <span className="text-slate-900 font-bold text-lg">S</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Singidunum
                    </h3>
                    <p className="text-sm text-slate-400">University</p>
                  </div>
                </div>
            <p className="text-slate-300 leading-relaxed">
              Empowering minds, shaping futures. Join our community of learners and innovators.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" className="h-10 w-10 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-300 hover:text-white transition-colors duration-200">Programs</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-white transition-colors duration-200">Admissions</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-white transition-colors duration-200">Student Life</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-white transition-colors duration-200">Research</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-white transition-colors duration-200">Alumni</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-300 hover:text-white transition-colors duration-200">Library</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-white transition-colors duration-200">Career Services</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-white transition-colors duration-200">Health Center</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-white transition-colors duration-200">IT Support</Link></li>
              <li><Link href="#" className="text-slate-300 hover:text-white transition-colors duration-200">Campus Map</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Stay Connected</h4>
            <p className="text-slate-300 leading-relaxed">
              Subscribe to our newsletter for updates and news.
            </p>
                            <div className="flex space-x-2 items-stretch">
                  <Input 
                    placeholder="Enter your email" 
                    className="flex-1 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-10 border-2" 
                  />
                  <Button 
                    size="default"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 transition-all duration-300 h-10 border-2 border-blue-600"
                  >
                    Subscribe
                  </Button>
                </div>
            <div className="space-y-2">
              <p className="text-slate-300 text-sm">
                <strong className="text-white">Contact:</strong><br />
                info@singidunum.edu<br />
                +381 11 123 4567
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-12 bg-slate-700" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-slate-400">
            © 2024 Singidunum University. All rights reserved.
          </div>
          <div className="flex space-x-8 text-sm text-slate-400">
            <Link href="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Accessibility</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 