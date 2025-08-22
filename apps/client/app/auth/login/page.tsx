import { LoginForm } from "./components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-svh w-full bg-slate-50 relative overflow-hidden">

      
      <div className="relative z-10 flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10">
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2">
            <Image src="/logos/logo.svg" alt="Logo" width={32} height={32} />
            <span className="text-xl font-bold text-white">Harvox</span>
          </div>
        </div>
        
        <div className="w-full max-w-sm mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Welcome Back</h2>
            <p className="text-lg text-slate-600">Sign in to your account</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
