import Link from "next/link"
import { Button } from "../../components/ui/button"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "../../components/ui/navigation-menu"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
                        <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-semibold text-slate-900">
                    Singidunum
                  </h1>
                  <p className="text-xs text-slate-500">University</p>
                </div>
              </div>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="space-x-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-slate-700 hover:text-blue-600 hover:bg-slate-50 px-4 py-2 rounded-lg transition-all duration-200">
                  EXPLORE FPA
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-900">Undergraduate</h3>
                      <ul className="space-y-2">
                        <li><Link href="#" className="block p-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-all duration-200">Computer Science</Link></li>
                        <li><Link href="#" className="block p-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-all duration-200">Business Administration</Link></li>
                        <li><Link href="#" className="block p-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-all duration-200">Engineering</Link></li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-900">Graduate</h3>
                      <ul className="space-y-2">
                        <li><Link href="#" className="block p-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-all duration-200">MBA</Link></li>
                        <li><Link href="#" className="block p-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-all duration-200">Data Science</Link></li>
                        <li><Link href="#" className="block p-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-all duration-200">Cybersecurity</Link></li>
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-slate-700 hover:text-blue-600 hover:bg-slate-50 px-4 py-2 rounded-lg transition-all duration-200">
                  ADMISSIONS
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[300px] p-6">
                    <ul className="space-y-2">
                      <li><Link href="#" className="block p-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-all duration-200">Requirements</Link></li>
                      <li><Link href="#" className="block p-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-all duration-200">Application Process</Link></li>
                      <li><Link href="#" className="block p-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-all duration-200">Financial Aid</Link></li>
                      <li><Link href="#" className="block p-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-all duration-200">International Students</Link></li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#" className="group inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200">
                  ACADEMICS
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#" className="group inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200">
                  STUDENT LIFE
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

                           <div className="flex items-center space-x-4">
                   <Link href="/auth/login">
                     <Button variant="outline" className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 px-6 py-3 rounded-lg transition-all duration-300">
                       LOGIN
                     </Button>
                   </Link>
                   <Link href="/auth/register">
                     <Button variant="outline" className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 px-6 py-3 rounded-lg transition-all duration-300">
                       REGISTER
                     </Button>
                   </Link>
                   <Button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                     CONTACT US
                   </Button>
                 </div>
        </div>
      </div>
    </header>
  )
} 