import Link from "next/link"
import { Button } from "../../components/ui/button"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, NavigationMenuLink, navigationMenuTriggerStyle } from "../../components/ui/navigation-menu"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/50" style={{ zIndex: 9999 }}>
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

          <NavigationMenu className="hidden lg:flex z-50 relative">
            <NavigationMenuList className="space-x-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-slate-700 hover:text-blue-600 hover:bg-slate-50 px-4 py-2 rounded-lg transition-all duration-200">
                  EXPLORE FPA
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[500px] gap-6 p-6 md:w-[600px] md:grid-cols-2 lg:w-[700px] bg-white border border-slate-200 rounded-lg shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <h3 className="text-base font-semibold text-slate-900">Undergraduate Programs</h3>
                      </div>
                      <div className="space-y-3">
                        <NavigationMenuLink asChild>
                          <Link href="#" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-sm">CS</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Computer Science</div>
                                <p className="text-xs text-slate-600">Programming, AI & Software Development</p>
                              </div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="#" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <span className="text-green-600 font-bold text-sm">BA</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Business Administration</div>
                                <p className="text-xs text-slate-600">Management, Finance & Strategy</p>
                              </div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="#" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                <span className="text-orange-600 font-bold text-sm">EN</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Engineering</div>
                                <p className="text-xs text-slate-600">Technical Innovation & Design</p>
                              </div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                        <h3 className="text-base font-semibold text-slate-900">Graduate Programs</h3>
                      </div>
                      <div className="space-y-3">
                        <NavigationMenuLink asChild>
                          <Link href="#" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                <span className="text-purple-600 font-bold text-sm">MBA</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Master of Business Administration</div>
                                <p className="text-xs text-slate-600">Executive Leadership & Strategic Management</p>
                              </div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="#" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                                <span className="text-red-600 font-bold text-sm">DS</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Data Science</div>
                                <p className="text-xs text-slate-600">Machine Learning & Analytics</p>
                              </div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="#" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-bold text-sm">CS</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Cybersecurity</div>
                                <p className="text-xs text-slate-600">Information Security & Digital Defense</p>
                              </div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-slate-700 hover:text-blue-600 hover:bg-slate-50 px-4 py-2 rounded-lg transition-all duration-200">
                  ADMISSIONS
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] p-6 bg-white border border-slate-200 rounded-lg shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <h3 className="text-base font-semibold text-slate-900">Admissions</h3>
                      </div>
                      <div className="space-y-3">
                        <NavigationMenuLink asChild>
                          <Link href="#" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-sm">📋</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Requirements</div>
                                <p className="text-xs text-slate-600">Academic prerequisites and qualifications</p>
                              </div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="#" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <span className="text-green-600 font-bold text-sm">📝</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Application Process</div>
                                <p className="text-xs text-slate-600">Step-by-step application guide</p>
                              </div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="#" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <span className="text-yellow-600 font-bold text-sm">💰</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Financial Aid</div>
                                <p className="text-xs text-slate-600">Scholarships and funding options</p>
                              </div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="#" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                <span className="text-purple-600 font-bold text-sm">🌍</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">International Students</div>
                                <p className="text-xs text-slate-600">Support for global students</p>
                              </div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="#" className="text-slate-700 hover:text-blue-600">
                    ACADEMICS
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="#" className="text-slate-700 hover:text-blue-600">
                    STUDENT LIFE
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center space-x-4">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
              CONTACT US
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 