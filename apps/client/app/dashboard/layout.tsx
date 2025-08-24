import { AppSidebar } from "./components/app-sidebar"
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar"

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "18rem",
					"--header-height": "4rem",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<div className="flex flex-1 flex-col min-h-screen bg-slate-50/50">
					{/* Top Navigation Bar */}
					<div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-6">
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-green-500"></div>
							<span className="text-sm font-medium text-slate-700">Dashboard</span>
						</div>
						<div className="flex-1"></div>
						<div className="flex items-center gap-2">
							<div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
								<span className="text-sm font-medium text-white">JD</span>
							</div>
						</div>
					</div>
					
					{/* Main Content */}
					<div className="flex flex-1 flex-col">
						<div className="flex flex-1 flex-col">
							<div className="flex flex-col gap-6 p-6 lg:p-8">
								{children}
							</div>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
