import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Singidunum University - Shape Your Future",
  description: "Join a community of innovators, thinkers, and leaders at Singidunum University. Discover cutting-edge programs, world-class faculty, and opportunities that will transform your career and life.",
  keywords: ["university", "education", "Serbia", "academic programs", "higher education", "Singidunum"],
  authors: [{ name: "Singidunum University" }],
  openGraph: {
    title: "Singidunum University - Shape Your Future",
    description: "Join a community of innovators, thinkers, and leaders at Singidunum University.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
