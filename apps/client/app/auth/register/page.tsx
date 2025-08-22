import { RegisterForm } from "./components/register-form"
import Image from "next/image"

export default function RegisterPage() {
  return (
    <div className="min-h-svh w-full bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image src="/logos/logo.svg" alt="Logo" width={24} height={24} />
            <span className="text-lg font-semibold text-slate-800">Harvox</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Create Account</h1>
          <p className="text-sm text-slate-600">Join Harvox University today</p>
        </div>
        <RegisterForm />
        <div className="text-center mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </a>
        </div>
      </div>
    </div>
  )
}
