import { Header } from "../../../components/Header"
import { Footer } from "../../../components/Footer"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Separator } from "../../../../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"

export default function SoftwareDataEngineeringMA() {
  const curriculum = {
    firstYear: [
      { name: "Advanced Software Engineering", ects: 6, semester: "1st" },
      { name: "Machine Learning and AI", ects: 6, semester: "1st" },
      { name: "Big Data Technologies", ects: 6, semester: "1st" },
      { name: "Cloud Computing and DevOps", ects: 6, semester: "1st" },
      { name: "Research Methods", ects: 6, semester: "1st" },
      { name: "Advanced Data Engineering", ects: 6, semester: "2nd" },
      { name: "Software Architecture", ects: 6, semester: "2nd" },
      { name: "Master's Thesis", ects: 18, semester: "2nd" }
    ]
  }

  const careerOpportunities = [
    {
      title: "Senior Software Engineer",
      description: "Lead development teams and architect complex software solutions using advanced technologies.",
      skills: ["Technical Leadership", "System Design", "Team Management"]
    },
    {
      title: "Data Engineer",
      description: "Design and implement scalable data pipelines and infrastructure for enterprise applications.",
      skills: ["Data Architecture", "ETL Processes", "Big Data Technologies"]
    },
    {
      title: "Machine Learning Engineer",
      description: "Develop and deploy production-ready machine learning models and AI solutions.",
      skills: ["ML Engineering", "Model Deployment", "MLOps"]
    },
    {
      title: "DevOps Engineer",
      description: "Implement CI/CD pipelines and manage cloud infrastructure for software development.",
      skills: ["Automation", "Cloud Platforms", "Infrastructure as Code"]
    },
    {
      title: "Software Architect",
      description: "Design high-level software architecture and technical strategy for complex systems.",
      skills: ["Architecture Design", "Technical Strategy", "System Integration"]
    },
    {
      title: "Product Manager",
      description: "Lead product development and strategy for software and data-driven products.",
      skills: ["Product Strategy", "User Research", "Technical Understanding"]
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
                Software and Data Engineering
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                An intensive one-year programme that deepens your expertise in software development and data engineering.
                Gain specialized knowledge in AI, machine learning, and modern software architecture.
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
                    Our Master's programme builds upon undergraduate foundations to provide advanced knowledge
                    in software engineering, data science, and artificial intelligence.
                  </p>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    You'll work on real-world projects, collaborate with industry partners, and develop
                    the skills needed for senior technical roles in the technology sector.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Advanced Technologies
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Industry Projects
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
                      <span>Master advanced software engineering principles</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Design and implement AI-driven solutions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Lead technical teams and projects</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Apply research methods to solve complex problems</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Develop enterprise-grade software solutions</span>
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
                  Master's graduates are prepared for senior technical roles and leadership positions
                  in leading technology companies and organizations.
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
                  Our comprehensive curriculum spans one year and covers advanced topics in software engineering and data science.
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
