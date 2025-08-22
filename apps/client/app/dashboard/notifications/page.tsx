export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "Assignment Deadline Extended",
      dateCreated: "2024-12-19",
      text: "The deadline for the Database Systems final project has been extended to December 25th. Please ensure all team members are aware of this change.",
      professor: "John Doe",
      course: "Database Systems (DB203)"
    },
    {
      id: 2,
      title: "Exam Schedule Update",
      dateCreated: "2024-12-18",
      text: "The final exam for Web Technologies has been rescheduled to January 15th at 10:00 AM in Room 301. Please update your calendars accordingly.",
      professor: "John Doe",
      course: "Web Technologies (WT202)"
    },
    {
      id: 3,
      title: "Course Material Available",
      dateCreated: "2024-12-17",
      text: "New study materials for the upcoming Machine Learning module are now available in the course portal. Please review before next week's lecture.",
      professor: "John Doe",
      course: "Machine Learning Basics (ML201)"
    },
    {
      id: 4,
      title: "Office Hours Cancellation",
      dateCreated: "2024-12-16",
      text: "Office hours for this Friday (December 20th) have been cancelled due to a faculty meeting. Alternative times will be posted next week.",
      professor: "John Doe",
      course: "Object-Oriented Programming (OOP301)"
    },
    {
      id: 5,
      title: "Project Presentation Guidelines",
      dateCreated: "2024-12-15",
      text: "Detailed guidelines for the Software Engineering final project presentation have been uploaded. Presentations will begin on January 10th.",
      professor: "John Doe",
      course: "Software Engineering Basics (SE205)"
    },
    {
      id: 6,
      title: "Lab Session Rescheduled",
      dateCreated: "2024-12-14",
      text: "The Computer Networks lab session originally scheduled for tomorrow has been moved to Thursday at 2:00 PM. Same location, Room 205.",
      professor: "John Doe",
      course: "Computer Networks (CN204)"
    }
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
        <p className="text-slate-600">View notifications for your courses</p>
      </div>
      
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Recent Notifications</h2>
          <p className="text-sm text-slate-600 mt-1">{notifications.length} notifications</p>
        </div>
        
        <div className="divide-y divide-slate-200">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-900 text-lg">{notification.title}</h3>
                <span className="text-sm text-slate-500">{formatDate(notification.dateCreated)}</span>
              </div>
              
              <p className="text-slate-700 mb-4 leading-relaxed">{notification.text}</p>
              
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Prof. {notification.professor}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {notification.course}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
