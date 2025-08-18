import { Header } from "../../../components/Header"
import { Footer } from "../../../components/Footer"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Separator } from "../../../../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"

export default function AdvancedSecuritySystemsPhD() {
  const curriculum = {
    firstYear: [
      { name: "Advanced Security Theory and Principles", ects: 6, semester: "1st" },
      { name: "Cybersecurity Fundamentals and Threats", ects: 6, semester: "1st" },
      { name: "Network Security and Architecture", ects: 6, semester: "1st" },
      { name: "Cryptography and Information Security", ects: 6, semester: "1st" },
      { name: "Research Methods in Security Systems", ects: 6, semester: "1st" },
      { name: "Physical Security Systems and Access Control", ects: 6, semester: "2nd" },
      { name: "Biometric Security and Authentication", ects: 6, semester: "2nd" },
      { name: "Security Risk Assessment and Management", ects: 6, semester: "2nd" },
      { name: "Security Policy and Governance", ects: 6, semester: "2nd" },
      { name: "Advanced Statistical Methods for Security", ects: 6, semester: "2nd" }
    ],
    secondYear: [
      { name: "Artificial Intelligence in Security Systems", ects: 6, semester: "3rd" },
      { name: "IoT Security and Smart Systems", ects: 6, semester: "3rd" },
      { name: "Cloud Security and Virtualization", ects: 6, semester: "3rd" },
      { name: "Mobile Security and Wireless Networks", ects: 6, semester: "3rd" },
      { name: "Security Testing and Penetration Testing", ects: 6, semester: "3rd" },
      { name: "Digital Forensics and Incident Response", ects: 6, semester: "4th" },
      { name: "Security Operations and Monitoring", ects: 6, semester: "4th" },
      { name: "Privacy and Data Protection", ects: 6, semester: "4th" },
      { name: "Security Compliance and Standards", ects: 6, semester: "4th" },
      { name: "Advanced Security Research Seminar", ects: 6, semester: "4th" }
    ],
    thirdYear: [
      { name: "Critical Infrastructure Security", ects: 6, semester: "5th" },
      { name: "Emerging Security Technologies", ects: 6, semester: "5th" },
      { name: "Security Architecture and Design", ects: 6, semester: "5th" },
      { name: "Security Innovation and Future Trends", ects: 6, semester: "5th" },
      { name: "Advanced Security Systems Research Project", ects: 6, semester: "5th" },
      { name: "Thesis Writing and Completion", ects: 12, semester: "6th" },
      { name: "Research Presentation and Defense Preparation", ects: 6, semester: "6th" },
      { name: "Final Thesis Defense", ects: 6, semester: "6th" },
      { name: "Academic Publication and Dissemination", ects: 6, semester: "6th" }
    ]
  }

  const careerOpportunities = [
    {
      title: "Security Systems Research Professor",
      description: "Lead academic research and teach advanced security systems at universities worldwide.",
      skills: ["Academic Research", "Teaching", "Academic Leadership"]
    },
    {
      title: "Chief Information Security Officer",
      description: "Lead cybersecurity strategy and security systems implementation in organizations.",
      skills: ["Cybersecurity Strategy", "Security Leadership", "Risk Management"]
    },
    {
      title: "Security Systems Architect",
      description: "Design and implement advanced security systems and architectures.",
      skills: ["System Architecture", "Security Design", "Technology Integration"]
    },
    {
      title: "Security Research Director",
      description: "Lead research initiatives in security organizations and technology companies.",
      skills: ["Research Leadership", "Security Innovation", "Technology Research"]
    },
    {
      title: "Security Technology Consultant",
      description: "Provide consulting services on advanced security systems and technologies.",
      skills: ["Security Consulting", "Technology Advisory", "System Implementation"]
    },
    {
      title: "Digital Forensics Expert",
      description: "Lead digital forensics investigations and incident response teams.",
      skills: ["Digital Forensics", "Incident Response", "Evidence Analysis"]
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
                PhD Programme
              </Badge>
              <h1 className="text-5xl font-bold text-slate-900 mb-6">
                Advanced Security Systems
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                A comprehensive three-year programme that prepares you for leadership roles in advanced security systems,
                cybersecurity, and digital protection across modern technological environments.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>180 ECTS Credits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>3 Years Duration</span>
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
                    Our Advanced Security Systems PhD programme provides comprehensive training in cutting-edge security technologies,
                    cybersecurity, and digital protection for academic and industry leadership positions.
                  </p>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    You'll learn to design advanced security systems, implement cybersecurity solutions, conduct security research,
                    and contribute to the advancement of security technology knowledge and practice worldwide.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Security Systems
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Cybersecurity
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Digital Protection
                    </Badge>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Key Learning Outcomes</h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Design and implement advanced security systems and architectures</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Develop cybersecurity strategies and risk management frameworks</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Lead digital forensics and incident response operations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Apply AI and emerging technologies to security systems</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Contribute to academic and industry security knowledge advancement</span>
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
                  Graduates are prepared for senior academic and industry leadership positions in advanced security systems,
                  cybersecurity, and digital protection worldwide.
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
                  Our comprehensive curriculum spans three years and covers all essential aspects of advanced security systems,
                  cybersecurity, and digital protection.
                </p>
              </div>

              <Tabs defaultValue="first-year" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="first-year">Year 1</TabsTrigger>
                  <TabsTrigger value="second-year">Year 2</TabsTrigger>
                  <TabsTrigger value="third-year">Year 3</TabsTrigger>
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

                <TabsContent value="second-year">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-4">Third Semester (30 ECTS)</h3>
                      <div className="space-y-3">
                        {curriculum.secondYear.filter(course => course.semester === "3rd").map((course, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-700">{course.name}</span>
                            <Badge variant="outline">{course.ects} ECTS</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-4">Fourth Semester (30 ECTS)</h3>
                      <div className="space-y-3">
                        {curriculum.secondYear.filter(course => course.semester === "4th").map((course, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-700">{course.name}</span>
                            <Badge variant="outline">{course.ects} ECTS</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="third-year">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-4">Fifth Semester (30 ECTS)</h3>
                      <div className="space-y-3">
                        {curriculum.thirdYear.filter(course => course.semester === "5th").map((course, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-700">{course.name}</span>
                            <Badge variant="outline">{course.ects} ECTS</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-4">Sixth Semester (30 ECTS)</h3>
                      <div className="space-y-3">
                        {curriculum.thirdYear.filter(course => course.semester === "6th").map((course, index) => (
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
