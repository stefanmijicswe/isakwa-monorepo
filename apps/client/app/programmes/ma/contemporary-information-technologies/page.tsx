import { Header } from "../../../components/Header"
import { Footer } from "../../../components/Footer"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Separator } from "../../../../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"

export default function ContemporaryInformationTechnologiesMA() {
  const curriculum = {
    firstYear: [
      { name: "Advanced Information Systems", ects: 6, semester: "1st" },
      { name: "Cloud Computing and Architecture", ects: 6, semester: "1st" },
      { name: "Cybersecurity and Digital Forensics", ects: 6, semester: "1st" },
      { name: "Internet of Things (IoT)", ects: 6, semester: "1st" },
      { name: "Research Methods in IT", ects: 6, semester: "1st" },
      { name: "Artificial Intelligence and Machine Learning", ects: 6, semester: "2nd" },
      { name: "Blockchain and Distributed Systems", ects: 6, semester: "2nd" },
      { name: "Master's Thesis in Information Technologies", ects: 18, semester: "2nd" }
    ]
  }

  const careerOpportunities = [
    {
      title: "IT Systems Architect",
      description: "Design and implement complex information technology systems and infrastructure solutions.",
      skills: ["System Architecture", "Infrastructure Design", "Technical Leadership"]
    },
    {
      title: "Cybersecurity Specialist",
      description: "Protect organizations from digital threats and implement security measures.",
      skills: ["Security Analysis", "Threat Detection", "Risk Management"]
    },
    {
      title: "Cloud Solutions Engineer",
      description: "Develop and manage cloud-based applications and infrastructure.",
      skills: ["Cloud Platforms", "DevOps", "Infrastructure as Code"]
    },
    {
      title: "IoT Development Manager",
      description: "Lead development of Internet of Things solutions and connected systems.",
      skills: ["IoT Technologies", "Embedded Systems", "Project Management"]
    },
    {
      title: "AI/ML Engineer",
      description: "Develop and deploy artificial intelligence and machine learning solutions.",
      skills: ["Machine Learning", "AI Development", "Model Deployment"]
    },
    {
      title: "Digital Transformation Consultant",
      description: "Guide organizations through technology modernization and digital transformation.",
      skills: ["Change Management", "Technology Strategy", "Business Analysis"]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-6 bg-blue-50 border-blue-200 text-blue-700">
                Master's Programme
              </Badge>
              <h1 className="text-5xl font-bold text-slate-900 mb-6">
                Contemporary Information Technologies
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                An intensive one-year programme that prepares you for leadership roles in modern information technology.
                Master cutting-edge technologies including AI, IoT, cybersecurity, and cloud computing.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>60 ECTS Credits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>1 Year Duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>English Language</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">
                    About the Programme
                  </h2>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    Our Contemporary Information Technologies Master's programme provides comprehensive 
                    training in the latest IT innovations, emerging technologies, and digital transformation strategies.
                  </p>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    You'll learn to design modern IT systems, implement cybersecurity measures, develop AI solutions,
                    and lead digital transformation initiatives in organizations.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Modern IT Systems
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Emerging Technologies
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Digital Innovation
                    </Badge>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Key Learning Outcomes</h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Design and implement modern information systems</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Develop and deploy AI and IoT solutions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Implement cybersecurity and risk management strategies</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Lead digital transformation initiatives</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Apply research methods to technology challenges</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Separator className="my-20" />

              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Career Opportunities
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Graduates are prepared for senior technical and leadership positions in technology companies,
                  IT consulting firms, and organizations undergoing digital transformation.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                {careerOpportunities.map((career, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg text-slate-900">{career.title}</CardTitle>
                      <CardDescription className="text-slate-600">
                        {career.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {career.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="my-20" />

              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Full Curriculum
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Our comprehensive curriculum spans one year and covers all essential aspects of contemporary
                  information technologies and digital innovation.
                </p>
              </div>

              <Tabs defaultValue="first-year" className="w-full">
                <TabsList className="grid w-full grid-cols-1 mb-8">
                  <TabsTrigger value="first-year">Year 1</TabsTrigger>
                </TabsList>

                <TabsContent value="first-year">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-4">First Semester (30 ECTS)</h3>
                      <div className="space-y-3">
                        {curriculum.firstYear.filter(course => course.semester === "1st").map((course, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-700">{course.name}</span>
                            <Badge variant="outline">{course.ects} ECTS</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-4">Second Semester (30 ECTS)</h3>
                      <div className="space-y-3">
                        {curriculum.firstYear.filter(course => course.semester === "2nd").map((course, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-700">{course.name}</span>
                            <Badge variant="outline">{course.ects} ECTS</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="text-center mt-16">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3">
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
