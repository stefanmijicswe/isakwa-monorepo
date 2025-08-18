import { Header } from "../../../components/Header"
import { Footer } from "../../../components/Footer"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Separator } from "../../../../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"

export default function AppliedArtificialIntelligenceBA() {
  const curriculum = {
    firstYear: [
      { name: "Introduction to Artificial Intelligence", ects: 6, semester: "1st" },
      { name: "Programming Fundamentals for AI", ects: 6, semester: "1st" },
      { name: "Mathematics for AI and Machine Learning", ects: 6, semester: "1st" },
      { name: "Computer Science Fundamentals", ects: 6, semester: "1st" },
      { name: "Digital Logic and Computer Architecture", ects: 6, semester: "1st" },
      { name: "Data Structures and Algorithms", ects: 6, semester: "2nd" },
      { name: "Python for AI Development", ects: 6, semester: "2nd" },
      { name: "Database Systems and Data Management", ects: 6, semester: "2nd" },
      { name: "Statistics and Probability", ects: 6, semester: "2nd" },
      { name: "Introduction to Machine Learning", ects: 6, semester: "2nd" }
    ],
    secondYear: [
      { name: "Machine Learning Fundamentals", ects: 6, semester: "3rd" },
      { name: "Neural Networks and Deep Learning", ects: 6, semester: "3rd" },
      { name: "Computer Vision and Image Processing", ects: 6, semester: "3rd" },
      { name: "Natural Language Processing", ects: 6, semester: "3rd" },
      { name: "Data Preprocessing and Feature Engineering", ects: 6, semester: "3rd" },
      { name: "Supervised Learning Algorithms", ects: 6, semester: "4th" },
      { name: "Unsupervised Learning and Clustering", ects: 6, semester: "4th" },
      { name: "AI Ethics and Responsible AI", ects: 6, semester: "4th" },
      { name: "AI Project Management", ects: 6, semester: "4th" },
      { name: "Big Data Technologies for AI", ects: 6, semester: "4th" }
    ],
    thirdYear: [
      { name: "Advanced Deep Learning", ects: 6, semester: "5th" },
      { name: "Reinforcement Learning", ects: 6, semester: "5th" },
      { name: "AI in Robotics and Automation", ects: 6, semester: "5th" },
      { name: "AI for Business Applications", ects: 6, semester: "5th" },
      { name: "AI Model Deployment and MLOps", ects: 6, semester: "5th" },
      { name: "AI in Healthcare and Medicine", ects: 6, semester: "6th" },
      { name: "AI in Finance and Economics", ects: 6, semester: "6th" },
      { name: "AI in Transportation and Logistics", ects: 6, semester: "6th" },
      { name: "AI Research Methods", ects: 6, semester: "6th" },
      { name: "AI Innovation and Entrepreneurship", ects: 6, semester: "6th" }
    ],
    fourthYear: [
      { name: "Advanced AI Applications", ects: 6, semester: "7th" },
      { name: "AI Strategy and Governance", ects: 6, semester: "7th" },
      { name: "Emerging AI Technologies", ects: 6, semester: "7th" },
      { name: "AI Consulting and Advisory", ects: 6, semester: "7th" },
      { name: "AI for Social Impact", ects: 6, semester: "7th" },
      { name: "Final AI Project", ects: 18, semester: "8th" },
      { name: "Thesis Defense", ects: 6, semester: "8th" },
      { name: "Professional Practice in AI", ects: 6, semester: "8th" }
    ]
  }

  const careerOpportunities = [
    {
      title: "AI Engineer",
      description: "Design, develop, and deploy artificial intelligence systems and machine learning models.",
      skills: ["Machine Learning", "Deep Learning", "Model Deployment"]
    },
    {
      title: "Machine Learning Engineer",
      description: "Build and optimize machine learning pipelines and data processing systems.",
      skills: ["ML Pipelines", "Data Engineering", "Algorithm Optimization"]
    },
    {
      title: "Data Scientist",
      description: "Analyze complex data sets and develop predictive models using AI techniques.",
      skills: ["Data Analysis", "Statistical Modeling", "Predictive Analytics"]
    },
    {
      title: "AI Research Scientist",
      description: "Conduct research in artificial intelligence and develop new AI algorithms.",
      skills: ["AI Research", "Algorithm Development", "Academic Writing"]
    },
    {
      title: "AI Product Manager",
      description: "Lead AI product development and manage AI-driven product strategies.",
      skills: ["Product Management", "AI Strategy", "User Experience"]
    },
    {
      title: "AI Consultant",
      description: "Provide strategic AI advice and implement AI solutions for organizations.",
      skills: ["AI Strategy", "Solution Design", "Change Management"]
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
                Applied Artificial Intelligence
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                A comprehensive four-year programme that prepares you for leadership roles in artificial intelligence,
                machine learning, and AI-driven innovation across various industries.
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
                    Our Applied Artificial Intelligence Bachelor's programme provides comprehensive training in AI development,
                    machine learning, and intelligent systems for modern technological environments.
                  </p>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    You'll learn to develop AI systems, implement machine learning algorithms, create intelligent applications,
                    and apply AI solutions across various industry domains.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      AI Development
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Machine Learning
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Intelligent Systems
                    </Badge>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Key Learning Outcomes</h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Develop and deploy AI systems and machine learning models</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Implement advanced deep learning and neural network architectures</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Apply AI solutions to real-world business and industry challenges</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Design and manage AI projects and research initiatives</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Ensure responsible and ethical AI development and deployment</span>
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
                  Graduates are prepared for senior technical and leadership positions in AI development,
                  machine learning engineering, and AI consulting worldwide.
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
                  Our comprehensive curriculum spans four years and covers all essential aspects of artificial intelligence,
                  machine learning, and intelligent systems development.
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
