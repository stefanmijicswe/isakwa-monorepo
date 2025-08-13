export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Courses</h1>
        <p className="text-slate-600">Manage your courses and materials</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Courses</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-900">Introduction to Computer Science</h3>
              <p className="text-sm text-slate-600">CS101 • Prof. Dr. Smith</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Active</span>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-900">Data Structures & Algorithms</h3>
              <p className="text-sm text-slate-600">CS201 • Prof. Dr. Johnson</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Active</span>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-900">Web Development</h3>
              <p className="text-sm text-slate-600">CS301 • Prof. Dr. Williams</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Upcoming</span>
          </div>
        </div>
      </div>
    </div>
  )
}
