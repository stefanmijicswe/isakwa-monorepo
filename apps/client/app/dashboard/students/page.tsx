export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Students</h1>
        <p className="text-slate-600">Manage your student roster and information</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Student List</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="text-slate-600 font-medium">JD</span>
              </div>
              <div>
                <h3 className="font-medium text-slate-900">John Doe</h3>
                <p className="text-sm text-slate-600">Computer Science • Year 2</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Active</span>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="text-slate-600 font-medium">JS</span>
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Jane Smith</h3>
                <p className="text-sm text-slate-600">Computer Science • Year 3</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Active</span>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="text-slate-600 font-medium">MJ</span>
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Mike Johnson</h3>
                <p className="text-sm text-slate-600">Computer Science • Year 1</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">New</span>
          </div>
        </div>
      </div>
    </div>
  )
}
