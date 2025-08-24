export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Assignments</h1>
        <p className="text-slate-600">Manage course assignments and submissions</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Current Assignments</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-900">Final Project - Web Application</h3>
              <p className="text-sm text-slate-600">CS301 • Due: December 15, 2024</p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">In Progress</span>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-900">Algorithm Implementation</h3>
              <p className="text-sm text-slate-600">CS201 • Due: November 30, 2024</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Completed</span>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-900">Research Paper</h3>
              <p className="text-sm text-slate-600">CS101 • Due: January 10, 2025</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Not Started</span>
          </div>
        </div>
      </div>
    </div>
  )
}
