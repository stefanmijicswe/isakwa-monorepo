export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-600">Manage your personal information and settings</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-slate-600 text-2xl font-semibold">JD</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">John Doe</h3>
              <p className="text-slate-600">Computer Science Student</p>
              <p className="text-sm text-slate-500">Student ID: CS2024001</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <p className="text-slate-900">john.doe@singidunum.edu.rs</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
              <p className="text-slate-900">+381 11 123 4567</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
              <p className="text-slate-900">Computer Science</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Year of Study</label>
              <p className="text-slate-900">2nd Year</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
