import { Header } from "../../../components/Header"
import { Footer } from "../../../components/Footer"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Separator } from "../../../../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"

export default function TourismManagementPhD() {
  const curriculum = {
    firstYear: [
      { name: "Advanced Tourism Theory and Research", ects: 6, semester: "1st" },
      { name: "Tourism Policy and Governance", ects: 6, semester: "1st" },
      { name: "Sustainable Tourism Development", ects: 6, semester: "1st" },
      { name: "Tourism Economics and Markets", ects: 6, semester: "1st" },
      { name: "Research Methodology in Tourism", ects: 6, semester: "1st" },
      { name: "International Tourism Management", ects: 6, semester: "2nd" },
      { name: "Tourism Marketing and Consumer Behavior", ects: 6, semester: "2nd" },
      { name: "Tourism Innovation and Technology", ects: 6, semester: "2nd" },
      { name: "Tourism Planning and Destination Management", ects: 6, semester: "2nd" },
      { name: "Advanced Statistical Analysis for Tourism", ects: 6, semester: "2nd" }
    ],
    secondYear: [
      { name: "Tourism and Hospitality Systems", ects: 6, semester: "3rd" },
      { name: "Cultural Tourism and Heritage Management", ects: 6, semester: "3rd" },
      { name: "Tourism Entrepreneurship and Business Models", ects: 6, semester: "3rd" },
      { name: "Tourism Crisis Management and Resilience", ects: 6, semester: "3rd" },
      { name: "Tourism and Environmental Sustainability", ects: 6, semester: "3rd" },
      { name: "Digital Tourism and Smart Destinations", ects: 6, semester: "4th" },
      { name: "Tourism Finance and Investment", ects: 6, semester: "4th" },
      { name: "Tourism Law and Ethics", ects: 6, semester: "4th" },
      { name: "Tourism and Social Impact", ects: 6, semester: "4th" },
      { name: "Advanced Tourism Research Seminar", ects: 6, semester: "4th" }
    ],
    thirdYear: [
      { name: "Tourism Strategy and Leadership", ects: 6, semester: "5th" },
      { name: "Tourism Quality Management and Standards", ects: 6, semester: "5th" },
      { name: "Tourism and Regional Development", ects: 6, semester: "5th" },
      { name: "Tourism and Digital Transformation", ects: 6, semester: "5th" },
      { name: "Tourism Research Project Development", ects: 6, semester: "5th" },
      { name: "Thesis Writing and Completion", ects: 12, semester: "6th" },
      { name: "Research Presentation and Defense Preparation", ects: 6, semester: "6th" },
      { name: "Final Thesis Defense", ects: 6, semester: "6th" },
      { name: "Academic Publication and Dissemination", ects: 6, semester: "6th" }
    ]
  }

  const careerOpportunities = [
    {
      title: "Tourism Research Professor",
      description: "Lead academic research and teach tourism management at universities worldwide.",
      skills: ["Academic Research", "Teaching", "Academic Leadership"]
    },
    {
      title: "Tourism Policy Director",
      description: "Develop and implement tourism policies for government and international organizations.",
      skills: ["Policy Development", "Strategic Planning", "Government Relations"]
    },
    {
      title: "Tourism Strategy Consultant",
      description: "Provide strategic consulting services to tourism organizations and destinations.",
      skills: ["Strategic Consulting", "Business Strategy", "Industry Analysis"]
    },
    {
      title: "Tourism Research Director",
      description: "Lead research initiatives in tourism organizations and think tanks.",
      skills: ["Research Leadership", "Project Management", "Industry Research"]
    },
    {
      title: "International Tourism Advisor",
      description: "Advise international organizations on tourism development and management.",
      skills: ["International Relations", "Development Strategy", "Cross-cultural Communication"]
    },
    {
      title: "Tourism Innovation Leader",
      description: "Lead innovation and digital transformation in tourism organizations.",
      skills: ["Innovation Management", "Digital Transformation", "Technology Strategy"]
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
                Tourism Management
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                A comprehensive three-year programme that prepares you for leadership roles in tourism research,
                policy development, and strategic management across the global tourism industry.
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
                    Our Tourism Management PhD programme provides comprehensive training in advanced tourism research,
                    policy development, and strategic management for academic and industry leadership positions.
                  </p>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    You'll learn to conduct cutting-edge tourism research, develop tourism policies, lead strategic initiatives,
                    and contribute to the advancement of tourism knowledge and practice worldwide.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Tourism Research
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Policy Development
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Strategic Management
                    </Badge>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Key Learning Outcomes</h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Conduct advanced research in tourism management and policy</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Develop and implement tourism policies and strategies</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Lead sustainable tourism development initiatives</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Manage tourism organizations and destinations strategically</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Contribute to academic and industry knowledge advancement</span>
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
                  Graduates are prepared for senior academic and industry leadership positions in tourism research,
                  policy development, and strategic management worldwide.
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
                  Our comprehensive curriculum spans three years and covers all essential aspects of tourism research,
                  policy development, and strategic management.
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
