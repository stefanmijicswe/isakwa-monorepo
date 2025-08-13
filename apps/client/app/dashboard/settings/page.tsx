export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600">Configure your application preferences</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Application Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900">Email Notifications</h3>
              <p className="text-sm text-slate-600">Receive email updates about your courses</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-green-500"></div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900">Push Notifications</h3>
              <p className="text-sm text-slate-600">Get push notifications on your device</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-slate-300"></div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900">Dark Mode</h3>
              <p className="text-sm text-slate-600">Switch to dark theme</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-slate-300"></div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900">Language</h3>
              <p className="text-sm text-slate-600">English (US)</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Change</button>
          </div>
        </div>
      </div>
    </div>
  )
}
