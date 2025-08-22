import { Header } from "../../components/Header"
import { Footer } from "../../components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import Link from "next/link"

const programs = {
  undergraduate: [
    {
      name: "Software and Data Engineering",
      description: "A comprehensive program that combines software engineering principles with data science fundamentals.",
      duration: "4 years",
      credits: "240 ECTS"
    }
  ],
  master: [
    {
      name: "Software and Data Engineering",
      description: "Advanced studies in software development and data analysis for complex systems.",
      duration: "2 years",
      credits: "60 ECTS"
    },
    {
      name: "Data Science",
      description: "Specialized program focusing on advanced data analysis, machine learning, and statistical modeling.",
      duration: "2 years",
      credits: "60 ECTS"
    }
  ],
  phd: [
    {
      name: "Intelligent Software Engineering",
      description: "Research-focused program exploring AI-driven software development and intelligent systems.",
      duration: "3-4 years",
      credits: "180 ECTS"
    }
  ]
}

const dean = {
  name: "Prof. Dr. Milan Petrović",
  title: "Dean of the Technical Faculty",
  email: "dean.fts@harvox.edu",
  phone: "+381 11 123 4568",
  office: "Room 301, Building A",
  bio: "Professor Petrović is a distinguished researcher in software engineering with over 20 years of experience in academia and industry. He has published more than 100 scientific papers and led numerous research projects in intelligent systems and software architecture."
}

export default function TechnicalFacultyPage() {
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
                Technical Faculty
              </h1>
              <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
                From civil to mechanical engineering, we develop practical problem-solvers and innovative thinkers 
                who shape the future of technology and infrastructure.
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
                      The Technical Faculty at Harvox University is dedicated to excellence in engineering education, 
                      research, and innovation. Our programs combine theoretical knowledge with practical applications, preparing 
                      students for successful careers in the rapidly evolving technical landscape.
                    </p>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      We emphasize hands-on learning, industry partnerships, and cutting-edge research in areas such as software 
                      engineering, data science, and intelligent systems. Our faculty members are experienced professionals and 
                      researchers who bring real-world expertise to the classroom.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                      <div className="text-center group">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-3xl">👥</span>
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">950+</div>
                        <div className="text-slate-600 font-medium">Students</div>
                      </div>
                      <div className="text-center group">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-3xl">👨‍🏫</span>
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">25+</div>
                        <div className="text-slate-600 font-medium">Faculty Members</div>
                      </div>
                      <div className="text-center group">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-3xl">🔬</span>
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">15+</div>
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
                    <CardDescription className="text-slate-700 font-semibold text-lg">Dean of the Technical Faculty</CardDescription>
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
                            <Button variant="outline" className="w-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 rounded-lg h-10 cursor-default">
                              Learn More
                            </Button>
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
                            <Button variant="outline" className="w-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 rounded-lg h-10 cursor-default">
                              Learn More
                            </Button>
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
                            <Button variant="outline" className="w-full border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 rounded-lg h-10 cursor-default">
                              Learn More
                            </Button>
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
                    Ready to Start Your Technical Journey?
                  </h3>
                  <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                    Join our community of innovators and problem-solvers. Discover which program aligns with your 
                    career goals and start building your future in technical sciences.
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
