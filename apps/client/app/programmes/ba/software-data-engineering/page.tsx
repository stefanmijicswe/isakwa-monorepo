import { Header } from "../../../components/Header"
import { Footer } from "../../../components/Footer"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Separator } from "../../../../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"

export default function SoftwareDataEngineeringPage() {
  const curriculum = {
    firstYear: [
      { name: "Introduction to Programming", ects: 6, semester: "1st" },
      { name: "Mathematics for Computer Science", ects: 6, semester: "1st" },
      { name: "Computer Architecture", ects: 6, semester: "1st" },
      { name: "English for IT", ects: 3, semester: "1st" },
      { name: "Digital Logic Design", ects: 6, semester: "1st" },
      { name: "Computer Organization", ects: 3, semester: "1st" },
      { name: "Data Structures and Algorithms", ects: 6, semester: "2nd" },
      { name: "Object-Oriented Programming", ects: 6, semester: "2nd" },
      { name: "Database Fundamentals", ects: 6, semester: "2nd" },
      { name: "Web Technologies", ects: 6, semester: "2nd" },
      { name: "Academic Writing", ects: 3, semester: "2nd" },
      { name: "Discrete Mathematics", ects: 3, semester: "2nd" }
    ],
    secondYear: [
      { name: "Software Engineering", ects: 6, semester: "3rd" },
      { name: "Operating Systems", ects: 6, semester: "3rd" },
      { name: "Computer Networks", ects: 6, semester: "3rd" },
      { name: "Statistics and Probability", ects: 6, semester: "3rd" },
      { name: "Linear Algebra", ects: 6, semester: "3rd" },
      { name: "Data Analysis", ects: 6, semester: "4th" },
      { name: "Machine Learning Basics", ects: 6, semester: "4th" },
      { name: "Software Testing", ects: 6, semester: "4th" },
      { name: "Project Management", ects: 6, semester: "4th" },
      { name: "Human-Computer Interaction", ects: 6, semester: "4th" }
    ],
    thirdYear: [
      { name: "Advanced Algorithms", ects: 6, semester: "5th" },
      { name: "Big Data Technologies", ects: 6, semester: "5th" },
      { name: "Cloud Computing", ects: 6, semester: "5th" },
      { name: "Cybersecurity", ects: 6, semester: "5th" },
      { name: "Software Project Management", ects: 6, semester: "5th" },
      { name: "Data Visualization", ects: 6, semester: "6th" },
      { name: "Deep Learning", ects: 6, semester: "6th" },
      { name: "Software Architecture", ects: 6, semester: "6th" },
      { name: "Internship", ects: 6, semester: "6th" },
      { name: "Professional Ethics", ects: 6, semester: "6th" }
    ],
    fourthYear: [
      { name: "Advanced Software Development", ects: 6, semester: "7th" },
      { name: "Data Engineering", ects: 6, semester: "7th" },
      { name: "Artificial Intelligence", ects: 6, semester: "7th" },
      { name: "Research Methods", ects: 6, semester: "7th" },
      { name: "Capstone Project Preparation", ects: 6, semester: "7th" },
      { name: "Final Project", ects: 18, semester: "8th" },
      { name: "Professional Practice", ects: 6, semester: "8th" },
      { name: "Thesis Defense", ects: 6, semester: "8th" }
    ]
  }

  const careerOpportunities = [
    {
      title: "Software Developer",
      description: "Develop applications, websites, and software solutions using modern programming languages and frameworks.",
      skills: ["Programming", "Problem Solving", "Team Collaboration"]
    },
    {
      title: "Data Engineer",
      description: "Design, build, and maintain data pipelines and infrastructure for data processing and analytics.",
      skills: ["Data Modeling", "ETL Processes", "Big Data Technologies"]
    },
    {
      title: "Machine Learning Engineer",
      description: "Develop and deploy machine learning models and AI solutions for real-world applications.",
      skills: ["ML Algorithms", "Model Deployment", "Data Science"]
    },
    {
      title: "DevOps Engineer",
      description: "Bridge development and operations, implementing CI/CD pipelines and infrastructure automation.",
      skills: ["Automation", "Cloud Platforms", "System Administration"]
    },
    {
      title: "Data Scientist",
      description: "Analyze complex data sets to extract insights and support business decision-making.",
      skills: ["Statistical Analysis", "Data Visualization", "Business Intelligence"]
    },
    {
      title: "Full Stack Developer",
      description: "Develop both frontend and backend components of web applications and software systems.",
      skills: ["Frontend Development", "Backend Development", "Database Design"]
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
                Undergraduate Programme
              </Badge>
              <h1 className="text-5xl font-bold text-slate-900 mb-6">
                Software and Data Engineering
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                A comprehensive four-year programme that combines software development expertise with advanced data engineering skills. 
                Learn to build robust applications, design efficient data systems, and implement cutting-edge AI solutions.
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
                    Our Software and Data Engineering programme is designed to prepare you for the rapidly evolving technology landscape. 
                    You'll gain hands-on experience with modern development tools, cloud platforms, and data technologies.
                  </p>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    The curriculum balances theoretical knowledge with practical application, ensuring you graduate with the skills 
                    needed to excel in software development, data engineering, and artificial intelligence roles.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Modern Technologies
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
                      <span>Master modern programming languages and frameworks</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Design and implement scalable data architectures</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Develop and deploy machine learning models</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Apply software engineering best practices</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Work effectively in agile development teams</span>
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
                  Graduates of our Software and Data Engineering programme are highly sought after by leading technology companies, 
                  startups, and organizations across various industries.
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
                  Our comprehensive curriculum spans four years and covers all essential aspects of software development and data engineering.
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
