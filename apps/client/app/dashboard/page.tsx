import { AppSidebar } from "./components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "../../components/ui/sidebar"

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Welcome to your Singidunum University dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">📚</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Active Courses</p>
              <p className="text-2xl font-bold text-slate-900">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-semibold">📊</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Average Grade</p>
              <p className="text-2xl font-bold text-slate-900">8.7</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <span className="text-amber-600 font-semibold">📅</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Next Class</p>
              <p className="text-2xl font-bold text-slate-900">2h</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 text-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <div className="text-2xl mb-2">📝</div>
            <p className="text-sm font-medium text-slate-700">View Grades</p>
          </button>
          <button className="p-4 text-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <div className="text-2xl mb-2">📚</div>
            <p className="text-sm font-medium text-slate-700">Course Materials</p>
          </button>
          <button className="p-4 text-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <div className="text-2xl mb-2">👥</div>
            <p className="text-sm font-medium text-slate-700">Classmates</p>
          </button>
          <button className="p-4 text-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <div className="text-2xl mb-2">⚙️</div>
            <p className="text-sm font-medium text-slate-700">Settings</p>
          </button>
        </div>
      </div>
    </div>
  )
}
