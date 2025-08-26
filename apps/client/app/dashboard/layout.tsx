import { AppSidebar } from "./components/app-sidebar"
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar"
import { AuthGuard } from "../../components/auth"
import { TopNav } from "./components/top-nav"

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<AuthGuard>
			<SidebarProvider
				style={
					{
						"--sidebar-width": "20rem",
						"--header-height": "4rem",
					} as React.CSSProperties
				}
			>
				<div className="flex min-h-screen w-full">
					<AppSidebar variant="sidebar" />
					<SidebarInset className="flex-1 min-w-0 w-full">
						<div className="flex flex-1 flex-col min-h-screen bg-slate-50/50 w-full">
							{/* Top Navigation Bar */}
							<TopNav />
							
							{/* Main Content */}
							<main className="flex flex-1 flex-col w-full">
								<div className="flex flex-1 flex-col w-full">
									<div className="flex flex-col gap-6 p-6 lg:p-8 w-full">
										{children}
									</div>
								</div>
							</main>
						</div>
					</SidebarInset>
				</div>
			</SidebarProvider>
		</AuthGuard>
	)
}
