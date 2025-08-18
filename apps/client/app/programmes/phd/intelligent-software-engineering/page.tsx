import { Header } from "../../../components/Header"
import { Footer } from "../../../components/Footer"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Separator } from "../../../../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"

export default function IntelligentSoftwareEngineeringPhD() {
  const curriculum = {
    firstYear: [
      { name: "Advanced Research Methods", ects: 6, semester: "1st" },
      { name: "Intelligent Systems Theory", ects: 6, semester: "1st" },
      { name: "Machine Learning Fundamentals", ects: 6, semester: "1st" },
      { name: "Software Architecture for AI", ects: 6, semester: "1st" },
      { name: "Research Seminar I", ects: 6, semester: "1st" },
      { name: "Advanced Algorithms and Complexity", ects: 6, semester: "2nd" },
      { name: "Natural Language Processing", ects: 6, semester: "2nd" },
      { name: "Computer Vision and Pattern Recognition", ects: 6, semester: "2nd" },
      { name: "Research Seminar II", ects: 6, semester: "2nd" },
      { name: "Literature Review", ects: 6, semester: "2nd" }
    ],
    secondYear: [
      { name: "Deep Learning and Neural Networks", ects: 6, semester: "3rd" },
      { name: "Reinforcement Learning", ects: 6, semester: "3rd" },
      { name: "AI Ethics and Responsible Development", ects: 6, semester: "3rd" },
      { name: "Research Seminar III", ects: 6, semester: "3rd" },
      { name: "Research Proposal Development", ects: 6, semester: "3rd" },
      { name: "Advanced Software Engineering", ects: 6, semester: "4th" },
      { name: "Distributed AI Systems", ects: 6, semester: "4th" },
      { name: "Research Seminar IV", ects: 6, semester: "4th" },
      { name: "Preliminary Research", ects: 6, semester: "4th" },
      { name: "Academic Writing and Publishing", ects: 6, semester: "4th" }
    ],
    thirdYear: [
      { name: "Advanced Research Topics", ects: 6, semester: "5th" },
      { name: "Research Seminar V", ects: 6, semester: "5th" },
      { name: "Thesis Research and Development", ects: 6, semester: "5th" },
      { name: "Conference Presentation", ects: 6, semester: "5th" },
      { name: "Research Collaboration", ects: 6, semester: "5th" },
      { name: "Thesis Writing and Completion", ects: 12, semester: "6th" },
      { name: "Thesis Defense Preparation", ects: 6, semester: "6th" },
      { name: "Final Defense", ects: 6, semester: "6th" },
      { name: "Research Publication", ects: 6, semester: "6th" }
    ]
  }

  const careerOpportunities = [
    {
      title: "AI Research Scientist",
      description: "Lead cutting-edge research in artificial intelligence, machine learning, and intelligent software systems.",
      skills: ["Research Methodology", "AI/ML Expertise", "Academic Publishing"]
    },
    {
      title: "Senior Software Architect",
      description: "Design and implement intelligent software systems and AI-driven applications for enterprise solutions.",
      skills: ["System Architecture", "AI Integration", "Technical Leadership"]
    },
    {
      title: "Machine Learning Engineer",
      description: "Develop and deploy advanced machine learning models and intelligent algorithms.",
      skills: ["ML Algorithms", "Model Deployment", "Data Science"]
    },
    {
      title: "AI Ethics Specialist",
      description: "Ensure responsible development and deployment of AI systems with ethical considerations.",
      skills: ["AI Ethics", "Policy Development", "Risk Assessment"]
    },
    {
      title: "Research Director",
      description: "Lead research teams and strategic initiatives in intelligent software engineering.",
      skills: ["Team Leadership", "Strategic Planning", "Research Management"]
    },
    {
      title: "University Professor",
      description: "Teach and mentor students while conducting research in intelligent software engineering.",
      skills: ["Teaching", "Mentoring", "Academic Research"]
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
                Intelligent Software Engineering
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                A cutting-edge PhD programme focused on the intersection of artificial intelligence and software engineering.
                Develop advanced research skills and contribute to the future of intelligent software systems.
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
                    Our PhD programme in Intelligent Software Engineering prepares you for leadership roles in research,
                    academia, and industry. You'll work on cutting-edge problems at the intersection of AI and software engineering.
                  </p>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    The programme emphasizes original research, advanced theoretical knowledge, and practical applications
                    in intelligent software systems, machine learning, and artificial intelligence.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Research Focus
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      AI & ML
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Expert Faculty
                    </Badge>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Key Learning Outcomes</h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Conduct original research in intelligent software engineering</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Develop advanced AI and machine learning solutions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Publish research in top-tier academic journals</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Lead research teams and projects</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Contribute to the advancement of AI technology</span>
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
                  PhD graduates in Intelligent Software Engineering are highly sought after by leading technology companies,
                  research institutions, and universities worldwide.
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
                  Our comprehensive curriculum spans three years and covers all essential aspects of intelligent software engineering research.
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
