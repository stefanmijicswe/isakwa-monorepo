export default function StudyHistoryPage() {
  const passedCourses = [
    {
      id: 1,
      name: "Introduction to Information Technologies",
      professor: "John Doe",
      tries: 1,
      finalPoints: 85,
      grade: 9,
      ects: 6
    },
    {
      id: 2,
      name: "Programming Fundamentals",
      professor: "John Doe",
      tries: 2,
      finalPoints: 78,
      grade: 8,
      ects: 6
    },
    {
      id: 3,
      name: "Mathematics for IT",
      professor: "John Doe",
      tries: 1,
      finalPoints: 92,
      grade: 10,
      ects: 6
    },
    {
      id: 4,
      name: "Computer Architecture",
      professor: "John Doe",
      tries: 1,
      finalPoints: 88,
      grade: 9,
      ects: 6
    },
    {
      id: 5,
      name: "Digital Logic Design",
      professor: "John Doe",
      tries: 1,
      finalPoints: 76,
      grade: 8,
      ects: 6
    },
    {
      id: 6,
      name: "Data Structures and Algorithms",
      professor: "John Doe",
      tries: 2,
      finalPoints: 82,
      grade: 9,
      ects: 6
    },
    {
      id: 7,
      name: "Web Technologies",
      professor: "John Doe",
      tries: 1,
      finalPoints: 95,
      grade: 10,
      ects: 6
    },
    {
      id: 8,
      name: "Database Systems",
      professor: "John Doe",
      tries: 1,
      finalPoints: 89,
      grade: 9,
      ects: 6
    },
    {
      id: 9,
      name: "Computer Networks",
      professor: "John Doe",
      tries: 1,
      finalPoints: 73,
      grade: 8,
      ects: 6
    },
    {
      id: 10,
      name: "Software Engineering Basics",
      professor: "John Doe",
      tries: 1,
      finalPoints: 87,
      grade: 9,
      ects: 6
    }
  ]

  const calculateGrade = (points: number) => {
    if (points < 51) return "Failed"
    if (points <= 60) return 6
    if (points <= 70) return 7
    if (points <= 80) return 8
    if (points <= 90) return 9
    return 10
  }

  const totalEcts = passedCourses.reduce((sum, course) => sum + course.ects, 0)
  const averageGrade = passedCourses.reduce((sum, course) => sum + course.grade, 0) / passedCourses.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Study History</h1>
        <p className="text-slate-600">View your academic history, grades, and ECTS credits</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{passedCourses.length}</div>
            <div className="text-sm text-slate-600">Passed Courses</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{totalEcts}</div>
            <div className="text-sm text-slate-600">Total ECTS</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{averageGrade.toFixed(1)}</div>
            <div className="text-sm text-slate-600">Average Grade</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Passed Courses</h2>
          <p className="text-sm text-slate-600 mt-1">Academic achievements and completed coursework</p>
        </div>
        
        <div className="divide-y divide-slate-200">
          {passedCourses.map((course) => (
            <div key={course.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg mb-1">{course.name}</h3>
                  <p className="text-sm text-slate-600">Prof. {course.professor}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{course.grade}</div>
                  <div className="text-xs text-slate-500">Grade</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Final Points:</span>
                  <span className="ml-2 font-medium text-slate-900">{course.finalPoints}</span>
                </div>
                <div>
                  <span className="text-slate-600">Number of Tries:</span>
                  <span className="ml-2 font-medium text-slate-900">{course.tries}</span>
                </div>
                <div>
                  <span className="text-slate-600">ECTS Points:</span>
                  <span className="ml-2 font-medium text-slate-900">{course.ects}</span>
                </div>
                <div>
                  <span className="text-slate-600">Grade Scale:</span>
                  <span className="ml-2 font-medium text-slate-900">{calculateGrade(course.finalPoints)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
