export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Schedule</h1>
        <p className="text-slate-600">View your class schedule and upcoming events</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Today's Schedule</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">9:00</span>
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Introduction to Computer Science</h3>
                <p className="text-sm text-slate-600">Room 101 • Prof. Dr. Smith</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Active</span>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-semibold">11:00</span>
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Data Structures & Algorithms</h3>
                <p className="text-sm text-slate-600">Room 203 • Prof. Dr. Johnson</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Upcoming</span>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                <span className="text-amber-600 font-semibold">14:00</span>
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Web Development Lab</h3>
                <p className="text-sm text-slate-600">Computer Lab A • Prof. Dr. Williams</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Upcoming</span>
          </div>
        </div>
      </div>
    </div>
  )
}
