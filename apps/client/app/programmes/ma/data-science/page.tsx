import { Header } from "../../../components/Header"
import { Footer } from "../../../components/Footer"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Separator } from "../../../../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"

export default function DataScienceMA() {
  const curriculum = {
    firstYear: [
      { name: "Advanced Statistics and Probability", ects: 6, semester: "1st" },
      { name: "Machine Learning Fundamentals", ects: 6, semester: "1st" },
      { name: "Data Mining and Analytics", ects: 6, semester: "1st" },
      { name: "Big Data Technologies", ects: 6, semester: "1st" },
      { name: "Research Methods in Data Science", ects: 6, semester: "1st" },
      { name: "Deep Learning and Neural Networks", ects: 6, semester: "2nd" },
      { name: "Data Visualization and Communication", ects: 6, semester: "2nd" },
      { name: "Master's Thesis in Data Science", ects: 18, semester: "2nd" }
    ]
  }

  const careerOpportunities = [
    {
      title: "Data Scientist",
      description: "Analyze complex data sets to extract insights and support business decision-making processes.",
      skills: ["Statistical Analysis", "Machine Learning", "Data Visualization"]
    },
    {
      title: "Machine Learning Engineer",
      description: "Develop and deploy production-ready machine learning models and AI solutions.",
      skills: ["ML Engineering", "Model Deployment", "MLOps"]
    },
    {
      title: "Business Intelligence Analyst",
      description: "Transform raw data into actionable business insights and strategic recommendations.",
      skills: ["Business Analysis", "Data Modeling", "Strategic Thinking"]
    },
    {
      title: "Data Engineer",
      description: "Design and implement scalable data pipelines and infrastructure for data processing.",
      skills: ["Data Architecture", "ETL Processes", "Big Data Technologies"]
    },
    {
      title: "Quantitative Analyst",
      description: "Apply statistical and mathematical methods to financial and business problems.",
      skills: ["Quantitative Methods", "Financial Modeling", "Risk Analysis"]
    },
    {
      title: "Research Analyst",
      description: "Conduct research and analysis in academic, government, or private sector settings.",
      skills: ["Research Design", "Statistical Analysis", "Report Writing"]
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
                Data Science
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                An intensive one-year programme that equips you with advanced skills in data analysis, 
                machine learning, and statistical modeling. Learn to extract meaningful insights from complex data.
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
                    Our Data Science Master's programme provides comprehensive training in modern data analysis
                    techniques, machine learning algorithms, and statistical modeling approaches.
                  </p>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    You'll work with real-world datasets, develop predictive models, and learn to communicate
                    data insights effectively to stakeholders across various industries.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Advanced Analytics
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Machine Learning
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
                      <span>Master advanced statistical analysis and modeling techniques</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Develop and deploy machine learning models</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Extract actionable insights from complex datasets</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Communicate data findings effectively to diverse audiences</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Apply data science to real-world business problems</span>
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
                  Data Science graduates are in high demand across industries including technology, 
                  finance, healthcare, and consulting.
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
                  Our comprehensive curriculum spans one year and covers all essential aspects of modern data science.
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
