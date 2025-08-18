import { Header } from "../../../components/Header"
import { Footer } from "../../../components/Footer"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Separator } from "../../../../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"

export default function InformationTechnologiesBA() {
  const curriculum = {
    firstYear: [
      { name: "Introduction to Information Technologies", ects: 6, semester: "1st" },
      { name: "Programming Fundamentals", ects: 6, semester: "1st" },
      { name: "Mathematics for IT", ects: 6, semester: "1st" },
      { name: "Computer Architecture", ects: 6, semester: "1st" },
      { name: "Digital Logic Design", ects: 6, semester: "1st" },
      { name: "Data Structures and Algorithms", ects: 6, semester: "2nd" },
      { name: "Web Technologies", ects: 6, semester: "2nd" },
      { name: "Database Systems", ects: 6, semester: "2nd" },
      { name: "Computer Networks", ects: 6, semester: "2nd" },
      { name: "Software Engineering Basics", ects: 6, semester: "2nd" }
    ],
    secondYear: [
      { name: "Object-Oriented Programming", ects: 6, semester: "3rd" },
      { name: "Operating Systems", ects: 6, semester: "3rd" },
      { name: "Information Security", ects: 6, semester: "3rd" },
      { name: "Mobile Application Development", ects: 6, semester: "3rd" },
      { name: "Cloud Computing Fundamentals", ects: 6, semester: "3rd" },
      { name: "Artificial Intelligence Basics", ects: 6, semester: "4th" },
      { name: "Data Analysis and Visualization", ects: 6, semester: "4th" },
      { name: "IT Project Management", ects: 6, semester: "4th" },
      { name: "Human-Computer Interaction", ects: 6, semester: "4th" },
      { name: "IT Ethics and Professional Practice", ects: 6, semester: "4th" }
    ],
    thirdYear: [
      { name: "Advanced Web Development", ects: 6, semester: "5th" },
      { name: "Cybersecurity", ects: 6, semester: "5th" },
      { name: "Big Data Technologies", ects: 6, semester: "5th" },
      { name: "Internet of Things (IoT)", ects: 6, semester: "5th" },
      { name: "Machine Learning Fundamentals", ects: 6, semester: "5th" },
      { name: "Enterprise Information Systems", ects: 6, semester: "6th" },
      { name: "Digital Transformation", ects: 6, semester: "6th" },
      { name: "IT Service Management", ects: 6, semester: "6th" },
      { name: "Business Intelligence", ects: 6, semester: "6th" },
      { name: "IT Innovation and Entrepreneurship", ects: 6, semester: "6th" }
    ],
    fourthYear: [
      { name: "Advanced IT Project", ects: 6, semester: "7th" },
      { name: "IT Strategy and Governance", ects: 6, semester: "7th" },
      { name: "Emerging Technologies", ects: 6, semester: "7th" },
      { name: "IT Consulting and Advisory", ects: 6, semester: "7th" },
      { name: "Digital Business Models", ects: 6, semester: "7th" },
      { name: "Final Project", ects: 18, semester: "8th" },
      { name: "Thesis Defense", ects: 6, semester: "8th" },
      { name: "Professional Practice", ects: 6, semester: "8th" }
    ]
  }

  const careerOpportunities = [
    {
      title: "IT Consultant",
      description: "Provide strategic IT advice and solutions to organizations across various industries.",
      skills: ["IT Strategy", "Business Analysis", "Solution Design"]
    },
    {
      title: "Information Systems Manager",
      description: "Manage and oversee information systems and technology infrastructure in organizations.",
      skills: ["System Management", "Team Leadership", "Strategic Planning"]
    },
    {
      title: "IT Project Manager",
      description: "Lead and manage IT projects from conception to completion.",
      skills: ["Project Management", "Agile Methodologies", "Risk Management"]
    },
    {
      title: "Business Analyst",
      description: "Analyze business processes and recommend IT solutions to improve efficiency.",
      skills: ["Business Analysis", "Process Improvement", "Requirements Gathering"]
    },
    {
      title: "Digital Transformation Specialist",
      description: "Lead digital transformation initiatives and modernize business processes.",
      skills: ["Digital Strategy", "Change Management", "Technology Integration"]
    },
    {
      title: "IT Service Manager",
      description: "Manage IT services and ensure high-quality service delivery to users.",
      skills: ["Service Management", "Customer Support", "Quality Assurance"]
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
                Bachelor's Programme
              </Badge>
              <h1 className="text-5xl font-bold text-slate-900 mb-6">
                Information Technologies
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                A comprehensive four-year programme that prepares you for leadership roles in information technology,
                digital transformation, and IT consulting across various industries.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>240 ECTS Credits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>4 Years Duration</span>
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
                    Our Information Technologies Bachelor's programme provides comprehensive training in IT management,
                    digital transformation, and technology consulting for modern business environments.
                  </p>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    You'll learn to manage information systems, lead digital transformation projects, provide IT consulting,
                    and develop strategic technology solutions for organizations.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      IT Management
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Digital Transformation
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      IT Consulting
                    </Badge>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Key Learning Outcomes</h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Manage information systems and technology infrastructure</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Lead digital transformation initiatives</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Provide strategic IT consulting and advisory services</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Manage IT projects and service delivery</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Develop IT strategies and governance frameworks</span>
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
                  Graduates are prepared for senior management and leadership positions in IT consulting,
                  digital transformation, and information systems management worldwide.
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
                  Our comprehensive curriculum spans four years and covers all essential aspects of information technologies,
                  IT management, and digital transformation.
                </p>
              </div>

              <Tabs defaultValue="first-year" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="first-year">Year 1</TabsTrigger>
                  <TabsTrigger value="second-year">Year 2</TabsTrigger>
                  <TabsTrigger value="third-year">Year 3</TabsTrigger>
                  <TabsTrigger value="fourth-year">Year 4</TabsTrigger>
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

                <TabsContent value="fourth-year">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-4">Seventh Semester (30 ECTS)</h3>
                      <div className="space-y-3">
                        {curriculum.fourthYear.filter(course => course.semester === "7th").map((course, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-700">{course.name}</span>
                            <Badge variant="outline">{course.ects} ECTS</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-4">Eighth Semester (30 ECTS)</h3>
                      <div className="space-y-3">
                        {curriculum.fourthYear.filter(course => course.semester === "8th").map((course, index) => (
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
