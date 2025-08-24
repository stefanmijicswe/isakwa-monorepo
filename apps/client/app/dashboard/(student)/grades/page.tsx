export default function GradesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Grades</h1>
        <p className="text-slate-600">View and manage grades and assessments</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Grades</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-900">Introduction to Computer Science</h3>
              <p className="text-sm text-slate-600">Final Exam • December 2024</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">9.2</p>
              <p className="text-sm text-slate-600">Excellent</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-900">Data Structures & Algorithms</h3>
              <p className="text-sm text-slate-600">Midterm • November 2024</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">8.7</p>
              <p className="text-sm text-slate-600">Very Good</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-900">Web Development</h3>
              <p className="text-sm text-slate-600">Project • October 2024</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">9.5</p>
              <p className="text-sm text-slate-600">Outstanding</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
