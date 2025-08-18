import { Header } from "../../../components/Header"
import { Footer } from "../../../components/Footer"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Separator } from "../../../../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"

export default function BusinessEconomicsMA() {
  const curriculum = {
    firstYear: [
      { name: "Advanced Microeconomics", ects: 6, semester: "1st" },
      { name: "Advanced Macroeconomics", ects: 6, semester: "1st" },
      { name: "Business Strategy and Management", ects: 6, semester: "1st" },
      { name: "Financial Economics and Markets", ects: 6, semester: "1st" },
      { name: "Research Methods in Economics", ects: 6, semester: "1st" },
      { name: "International Business Economics", ects: 6, semester: "2nd" },
      { name: "Corporate Finance and Investment", ects: 6, semester: "2nd" },
      { name: "Master's Thesis in Business Economics", ects: 18, semester: "2nd" }
    ]
  }

  const careerOpportunities = [
    {
      title: "Business Economist",
      description: "Analyze economic trends and provide strategic insights for business decision-making.",
      skills: ["Economic Analysis", "Business Strategy", "Data Interpretation"]
    },
    {
      title: "Financial Analyst",
      description: "Evaluate financial data and provide investment recommendations for organizations.",
      skills: ["Financial Analysis", "Investment Strategy", "Risk Assessment"]
    },
    {
      title: "Business Strategy Consultant",
      description: "Develop strategic business plans and advise organizations on growth opportunities.",
      skills: ["Strategic Planning", "Business Development", "Market Analysis"]
    },
    {
      title: "Economic Policy Advisor",
      description: "Provide economic policy recommendations for government and private sector organizations.",
      skills: ["Policy Analysis", "Economic Research", "Strategic Planning"]
    },
    {
      title: "Investment Manager",
      description: "Manage investment portfolios and develop investment strategies for clients.",
      skills: ["Portfolio Management", "Investment Analysis", "Risk Management"]
    },
    {
      title: "Business Development Manager",
      description: "Identify and develop new business opportunities and strategic partnerships.",
      skills: ["Business Development", "Market Research", "Partnership Building"]
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
                Business Economics
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                An intensive one-year programme that prepares you for leadership roles in business and economics.
                Develop expertise in economic analysis, business strategy, and financial decision-making.
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
                    Our Business Economics Master's programme provides comprehensive training in economic theory,
                    business strategy, and financial analysis for modern business environments.
                  </p>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    You'll learn to analyze economic trends, develop business strategies, make financial decisions,
                    and understand the global business landscape through an economic lens.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Economic Analysis
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Business Strategy
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Financial Economics
                    </Badge>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Key Learning Outcomes</h3>
                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Analyze economic trends and market dynamics</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Develop strategic business plans and strategies</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Make informed financial and investment decisions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Understand international business economics</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Apply research methods to business challenges</span>
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
                  Graduates are prepared for senior management and leadership positions in business,
                  finance, consulting, and economic policy organizations worldwide.
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
                  Our comprehensive curriculum spans one year and covers all essential aspects of business economics,
                  financial analysis, and strategic management.
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
