import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"

export function ProgramsSection() {
  const programs = [
    {
      title: "Computer Science",
      description: "Learn cutting-edge technologies and develop innovative solutions for tomorrow's challenges.",
      duration: "4 years",
      level: "Bachelor",
      features: ["AI & Machine Learning", "Software Engineering", "Cybersecurity"],
      badge: "Popular",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Business Administration",
      description: "Develop leadership skills and business acumen for the global marketplace.",
      duration: "4 years",
      level: "Bachelor",
      features: ["International Business", "Marketing", "Finance"],
      badge: "New",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Data Science",
      description: "Master the art of extracting insights from data to drive business decisions.",
      duration: "2 years",
      level: "Master",
      features: ["Big Data Analytics", "Statistical Modeling", "Business Intelligence"],
      badge: "Trending",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Engineering",
      description: "Build the future with innovative engineering solutions and sustainable practices.",
      duration: "4 years",
      level: "Bachelor",
      features: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering"],
      badge: "Accredited",
      color: "from-orange-500 to-orange-600"
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Explore Our Programs
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Choose from our diverse range of academic programs designed to prepare you for success
            in today's dynamic world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-slate-50 to-white shadow-lg hover:shadow-2xl flex flex-col h-full">
              <CardHeader className="pb-4 flex-shrink-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <Badge variant="secondary" className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-0">
                    {program.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300">
                  {program.title}
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">
                  {program.level} • {program.duration}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col flex-1">
                <div className="flex-1">
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {program.description}
                  </p>
                  <div className="space-y-3 mb-6">
                    {program.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-slate-600">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-10 border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 rounded-lg flex items-center justify-center"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-600 px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            View All Programs
          </Button>
        </div>
      </div>
    </section>
  )
} 