import Link from "next/link"
import { Header } from "../../components/Header"
import { Footer } from "../../components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"

const programs = {
  undergraduate: [
    {
      name: "Tourism, Hospitality and Food Economics",
      description: "Master the fundamentals of tourism management, hospitality operations, and food service economics for the global market.",
      duration: "4 years",
      credits: "240 ECTS",
      link: "/faculties/tourism-hospitality-faculty/tourism-hospitality-food"
    }
  ],
  master: [
    {
      name: "Business Systems in Tourism and Hospitality",
      description: "Advanced studies in tourism business models, hospitality management systems, and strategic planning for the industry.",
      duration: "2 years",
      credits: "60 ECTS",
      link: "/faculties/tourism-hospitality-faculty/business-systems"
    }
  ],
  phd: [
    {
      name: "Tourism Management",
      description: "Research-focused program exploring sustainable tourism, destination management, and innovative hospitality strategies.",
      duration: "3-4 years",
      credits: "180 ECTS",
      link: "/faculties/tourism-hospitality-faculty/tourism-management"
    }
  ]
}

const dean = {
  name: "Prof. Dr. Jelena Nikolić",
  title: "Dean of the Faculty of Tourism and Hospitality Management",
  email: "dean.fth@singidunum.edu",
  phone: "+381 11 123 4571",
  office: "Room 505, Building D",
  bio: "Professor Nikolić is a distinguished expert in tourism management and hospitality economics with over 19 years of experience in academia and industry. She has published extensively on sustainable tourism and has led numerous research projects in hospitality management and destination development."
}

export default function TourismHospitalityFacultyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="text-center mb-24">
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
                Faculty of Tourism and Hospitality Management
              </h1>
              <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
                From destination management to luxury hospitality, we develop service leaders and tourism innovators 
                who shape the future of global travel and hospitality experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
              <div className="lg:col-span-2">
                <Card className="border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-3xl overflow-hidden">
                  <CardHeader className="pb-8">
                    <CardTitle className="text-3xl text-slate-900 font-bold">About Our Faculty</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-lg">
                      The Faculty of Tourism and Hospitality Management at Singidunum University is committed to excellence in hospitality education, 
                      research, and innovation. Our programs combine theoretical knowledge with practical applications, preparing 
                      students for successful careers in the dynamic global tourism and hospitality industry.
                    </p>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      We emphasize experiential learning, industry partnerships, and cutting-edge research in areas such as tourism management, 
                      hospitality operations, and food service economics. Our faculty members are experienced professionals and 
                      researchers who bring real-world expertise to the classroom.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                      <div className="text-center group">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-3xl">👥</span>
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">650+</div>
                        <div className="text-slate-600 font-medium">Students</div>
                      </div>
                      <div className="text-center group">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-3xl">👨‍🏫</span>
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">22+</div>
                        <div className="text-slate-600 font-medium">Faculty Members</div>
                      </div>
                      <div className="text-center group">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-3xl">🔬</span>
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">12+</div>
                        <div className="text-slate-600 font-medium">Research Projects</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-3xl overflow-hidden sticky top-8">
                  <CardHeader className="text-center pb-8">
                    <div className="w-28 h-28 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-5xl">👨‍🏫</span>
                    </div>
                    <CardTitle className="text-2xl text-slate-900 font-bold">{dean.name}</CardTitle>
                    <CardDescription className="text-slate-700 font-semibold text-lg">{dean.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 text-center">
                    <p className="text-slate-600 leading-relaxed text-base">{dean.bio}</p>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-center justify-center space-x-3 p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-600 text-lg">📧</span>
                        <span className="text-slate-700 font-medium">{dean.email}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-3 p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-600 text-lg">📞</span>
                        <span className="text-slate-700 font-medium">{dean.phone}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-3 p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-600 text-lg">🏢</span>
                        <span className="text-slate-700 font-medium">{dean.office}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-16">
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
                  Study Programmes
                </h2>
                
                <div className="space-y-24">
                  <div>
                    <div className="flex items-center justify-center mb-16">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mr-6">
                        <span className="text-2xl font-bold text-slate-700">1</span>
                      </div>
                      <h3 className="text-3xl font-bold text-slate-800">Undergraduate Study Programmes</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {programs.undergraduate.map((program, index) => (
                        <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden flex flex-col">
                          <div className="h-2 bg-gradient-to-r from-slate-200 to-slate-300"></div>
                          <CardHeader className="pb-8">
                            <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300 font-bold">
                              {program.name}
                            </CardTitle>
                            <CardDescription className="text-slate-600 text-base leading-relaxed">
                              {program.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="mt-auto pt-6">
                            <div className="flex justify-between items-center text-sm text-slate-500 font-medium mb-4">
                              <span>Duration: {program.duration}</span>
                              <span>{program.credits}</span>
                            </div>
                            <Link href={program.link}>
                              <Button variant="outline" className="w-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 rounded-lg h-10">
                                Learn More
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-center mb-16">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mr-6">
                        <span className="text-2xl font-bold text-slate-700">2</span>
                      </div>
                      <h3 className="text-3xl font-bold text-slate-800">Master Study Programmes</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {programs.master.map((program, index) => (
                        <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden flex flex-col">
                          <div className="h-2 bg-gradient-to-r from-slate-200 to-slate-300"></div>
                          <CardHeader className="pb-8">
                            <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300 font-bold">
                              {program.name}
                            </CardTitle>
                            <CardDescription className="text-slate-600 text-base leading-relaxed">
                              {program.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="mt-auto pt-6">
                            <div className="flex justify-between items-center text-sm text-slate-500 font-medium mb-4">
                              <span>Duration: {program.duration}</span>
                              <span>{program.credits}</span>
                            </div>
                            <Link href={program.link}>
                              <Button variant="outline" className="w-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 rounded-lg h-10">
                                Learn More
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-center mb-16">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mr-6">
                        <span className="text-2xl font-bold text-slate-700">3</span>
                      </div>
                      <h3 className="text-3xl font-bold text-slate-800">PhD Study Programmes</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {programs.phd.map((program, index) => (
                        <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden flex flex-col">
                          <div className="h-2 bg-gradient-to-r from-slate-200 to-slate-300"></div>
                          <CardHeader className="pb-8">
                            <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300 font-bold">
                              {program.name}
                            </CardTitle>
                            <CardDescription className="text-slate-600 text-base leading-relaxed">
                              {program.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="mt-auto pt-6">
                            <div className="flex justify-between items-center text-sm text-slate-500 font-medium mb-4">
                              <span>Duration: {program.duration}</span>
                              <span>{program.credits}</span>
                            </div>
                            <Link href={program.link}>
                              <Button variant="outline" className="w-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 rounded-lg h-10">
                                Learn More
                              </Button>
                              </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-24 text-center">
              <Card className="border-0 bg-white shadow-2xl rounded-3xl max-w-5xl mx-auto overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-slate-200 to-slate-300"></div>
                <CardContent className="p-16">
                  <h3 className="text-4xl font-bold text-slate-900 mb-8">
                    Ready to Start Your Hospitality Journey?
                  </h3>
                  <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                    Join our community of hospitality professionals and tourism innovators. Discover which program aligns with your 
                    career goals and start building your future in the exciting world of tourism and hospitality management.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link href="/faculties">
                      <Button variant="outline" size="lg" className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:-translate-y-1">
                        View All Faculties
                      </Button>
                    </Link>
                    <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
