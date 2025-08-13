import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"

export function FeaturesSection() {
  const features = [
    {
      icon: "🎯",
      title: "Industry Connections",
      description: "Strong partnerships with leading companies and organizations for internships and career opportunities.",
      highlight: "500+ Partners",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: "🌍",
      title: "Global Perspective",
      description: "International exchange programs and partnerships with universities worldwide.",
      highlight: "50+ Countries",
      color: "from-green-500 to-green-600"
    },
    {
      icon: "💡",
      title: "Innovation Hub",
      description: "State-of-the-art facilities and research centers for cutting-edge projects.",
      highlight: "20+ Labs",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: "👥",
      title: "Expert Faculty",
      description: "Learn from industry professionals and renowned academics with real-world experience.",
      highlight: "200+ Faculty",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: "📚",
      title: "Modern Curriculum",
      description: "Updated programs that align with current industry trends and technological advances.",
      highlight: "Updated 2024",
      color: "from-red-500 to-red-600"
    },
    {
      icon: "🎓",
      title: "Career Support",
      description: "Comprehensive career services including job placement, networking events, and mentorship.",
      highlight: "95% Success Rate",
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-0 px-4 py-2 text-sm">
            Why Choose Us
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            What Makes Singidunum Special
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover the unique advantages that set our university apart and create
            exceptional opportunities for our students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white shadow-lg hover:shadow-2xl">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </CardTitle>
                <Badge variant="outline" className="w-fit mx-auto bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 text-slate-700">
                  {feature.highlight}
                </Badge>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-slate-100 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-slate-900 mb-6">
              Ready to Start Your Journey?
            </h3>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who have already discovered their potential at Singidunum University.
              Your future starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="default" className="text-base px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                🎯 95% Employment Rate
              </Badge>
              <Badge variant="secondary" className="text-base px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
                🌟 Top Ranked University
              </Badge>
              <Badge variant="outline" className="text-base px-6 py-3 border-2 border-slate-300 text-slate-700 bg-white">
                💼 Industry Partnerships
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 