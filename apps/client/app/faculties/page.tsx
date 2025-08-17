import Link from "next/link"
import { Header } from "../components/Header"
import { Footer } from "../components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"

const faculties = [
  {
    id: 1,
    name: "Faculty of Business",
    shortName: "FOB",
    description: "Empowering future business leaders with cutting-edge knowledge in management, economics, and entrepreneurship. Our programs combine theoretical foundations with practical applications.",
    undergraduatePrograms: ["BA in English Studies", "Business Economics"],
    masterPrograms: ["Business Economics", "MA in Applied English Language Studies"],
    phdPrograms: ["Contemporary Business Decision Making"],
    students: 1200,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: 2,
    name: "Faculty of Informatics and Computing",
    shortName: "FIC",
    description: "Shaping the digital future through innovative programs in computer science, software engineering, and information technology. We prepare students for the rapidly evolving tech industry.",
    undergraduatePrograms: ["Information Technologies", "Applied Artificial Intelligence"],
    masterPrograms: ["Contemporary Information Technologies"],
    phdPrograms: ["Advanced Security Systems"],
    students: 800,
    color: "from-purple-500 to-purple-600"
  },
  {
    id: 3,
    name: "Technical Faculty",
    shortName: "TF",
    description: "Building tomorrow's infrastructure with comprehensive engineering programs. From civil to mechanical engineering, we develop practical problem-solvers and innovative thinkers.",
    undergraduatePrograms: ["Software and Data Engineering"],
    masterPrograms: ["Software and Data Engineering", "Data Science"],
    phdPrograms: ["Intelligent Software Engineering"],
    students: 950,
    color: "from-green-500 to-green-600"
  },
  {
    id: 4,
    name: "Faculty of Tourism and Hospitality Management",
    shortName: "FTHM",
    description: "Creating exceptional experiences in the global tourism and hospitality industry. Our programs blend business acumen with service excellence and cultural understanding.",
    undergraduatePrograms: ["Tourism, Hospitality and Food Economics"],
    masterPrograms: ["Business Systems in Tourism and Hospitality"],
    phdPrograms: ["Tourism Management"],
    students: 650,
    color: "from-orange-500 to-orange-600"
  }
]

export default function FacultiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-20">
              <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-0 px-4 py-2 text-sm">
                Our Academic Structure
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Discover Our Faculties
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Explore our four specialized faculties, each designed to provide cutting-edge education 
                and prepare you for success in your chosen field.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {faculties.map((faculty) => (
                <Card key={faculty.id} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white shadow-lg hover:shadow-2xl overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${faculty.color}`}></div>
                  <CardHeader className="pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-lg font-bold text-slate-700">{faculty.shortName}</span>
                      </div>
                      <Badge variant="outline" className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 text-slate-700">
                        {faculty.students}+ Students
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-blue-600 transition-colors duration-300">
                      {faculty.name}
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 leading-relaxed">
                      {faculty.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {faculty.undergraduatePrograms && (
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-3 text-sm">Undergraduate Study Programmes:</h4>
                          <div className="flex flex-wrap gap-2">
                            {faculty.undergraduatePrograms.map((program, index) => (
                              <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                                {program}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {faculty.masterPrograms && (
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-3 text-sm">Master Study Programmes:</h4>
                          <div className="flex flex-wrap gap-2">
                            {faculty.masterPrograms.map((program, index) => (
                              <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                                {program}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {faculty.phdPrograms && (
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-3 text-sm">PhD Study Programmes:</h4>
                          <div className="flex flex-wrap gap-2">
                            {faculty.phdPrograms.map((program, index) => (
                              <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                                {program}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                        <Link href={
                          faculty.shortName === "FOB" ? "/faculties/business-faculty" :
                          faculty.shortName === "FIC" ? "/faculties/informatics-computing-faculty" :
                          faculty.shortName === "TF" ? "/faculties/technical-faculty" :
                          faculty.shortName === "FTHM" ? "/faculties/tourism-hospitality-faculty" : "#"
                        }>
                          <Badge variant="default" className={`bg-gradient-to-r ${faculty.color} text-white border-0 cursor-pointer hover:opacity-90 transition-opacity duration-200`}>
                            Learn More
                          </Badge>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-12 shadow-2xl border border-slate-100 max-w-4xl mx-auto text-center">
              <h3 className="text-3xl font-bold text-slate-900 mb-6">
                Ready to Choose Your Path?
              </h3>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Each faculty offers unique opportunities and specialized knowledge. 
                Discover which one aligns with your passions and career goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge variant="default" className="text-base px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                  🎯 95% Employment Rate
                </Badge>
                <Badge variant="secondary" className="text-base px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
                  🌟 Industry Partnerships
                </Badge>
                <Badge variant="outline" className="text-base px-6 py-3 border-2 border-slate-300 text-slate-700 bg-white">
                  💼 Internship Programs
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
