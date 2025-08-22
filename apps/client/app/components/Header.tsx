import Link from "next/link"
import { Button } from "../../components/ui/button"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, NavigationMenuLink, navigationMenuTriggerStyle } from "../../components/ui/navigation-menu"
import Image from "next/image"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/50" style={{ zIndex: 9999 }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
                        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
                <Image src="/logos/logo.svg" alt="Harvox Logo" width={40} height={40} />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-semibold text-slate-900">
                    Harvox
                  </h1>
                  <p className="text-xs text-slate-500">University</p>
                </div>
              </Link>

          <NavigationMenu className="hidden lg:flex z-50 relative">
            <NavigationMenuList className="space-x-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-slate-700 hover:text-blue-600 hover:bg-slate-50 px-4 py-2 rounded-lg transition-all duration-200">
                  EXPLORE
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
                          <Link href="/faculties/informatics-computing-faculty" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-sm">IT</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Information Technologies</div>
                                <p className="text-xs text-slate-600">Modern computing systems & software development</p>
                              </div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="/faculties/informatics-computing-faculty" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <span className="text-green-600 font-bold text-sm">AI</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Applied Artificial Intelligence</div>
                                <p className="text-xs text-slate-600">Intelligent systems & machine learning</p>
                              </div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="/faculties/business-faculty" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                <span className="text-purple-600 font-bold text-sm">BE</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Business Economics</div>
                                <p className="text-xs text-slate-600">Business principles & economic theory</p>
                              </div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="/faculties/technical-faculty" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                <span className="text-orange-600 font-bold text-sm">SE</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Software & Data Engineering</div>
                                <p className="text-xs text-slate-600">Software engineering & data science</p>
                              </div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="/faculties/tourism-hospitality-faculty" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                                <span className="text-red-600 font-bold text-sm">TH</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Tourism & Hospitality</div>
                                <p className="text-xs text-slate-600">Tourism management & hospitality operations</p>
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
                          <Link href="/faculties/informatics-computing-faculty" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                <span className="text-purple-600 font-bold text-sm">IT</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Contemporary Information Technologies</div>
                                <p className="text-xs text-slate-600">Cutting-edge computing & cloud systems</p>
                              </div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="/faculties/business-faculty" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                                <span className="text-red-600 font-bold text-sm">BE</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Business Economics</div>
                                <p className="text-xs text-slate-600">Economic analysis & business strategy</p>
                              </div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="/faculties/technical-faculty" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-bold text-sm">DS</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Data Science</div>
                                <p className="text-xs text-slate-600">Advanced data analysis & machine learning</p>
                              </div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="/faculties/tourism-hospitality-faculty" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-sm">TH</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Business Systems in Tourism</div>
                                <p className="text-xs text-slate-600">Tourism business models & hospitality systems</p>
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
                <NavigationMenuTrigger className="text-slate-700 hover:text-blue-600 hover:bg-slate-50 px-4 py-2 rounded-lg transition-all duration-200">
                  FACULTIES
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[500px] p-6 bg-white border border-slate-200 rounded-lg shadow-lg">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          <h3 className="text-base font-semibold text-slate-900">Technical Faculties</h3>
                        </div>
                        <div className="space-y-3">
                          <NavigationMenuLink asChild>
                            <Link href="/faculties/informatics-computing-faculty" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                  <span className="text-blue-600 font-bold text-sm">IC</span>
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Informatics & Computing</div>
                                  <p className="text-xs text-slate-600">Computer Science & IT</p>
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/faculties/technical-faculty" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                                  <span className="text-green-600 font-bold text-sm">TF</span>
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Technical Faculty</div>
                                  <p className="text-xs text-slate-600">Engineering & Technology</p>
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                          <h3 className="text-base font-semibold text-slate-900">Business & Hospitality</h3>
                        </div>
                        <div className="space-y-3">
                          <NavigationMenuLink asChild>
                            <Link href="/faculties/business-faculty" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                  <span className="text-purple-600 font-bold text-sm">BF</span>
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Business Faculty</div>
                                  <p className="text-xs text-slate-600">Management & Economics</p>
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link href="/faculties/tourism-hospitality-faculty" className="group block rounded-lg p-3 hover:bg-slate-50 transition-all duration-200">
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                  <span className="text-orange-600 font-bold text-sm">TH</span>
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">Tourism & Hospitality</div>
                                  <p className="text-xs text-slate-600">Hospitality Management</p>
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </div>
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