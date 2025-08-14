"use client"

import { cn } from "../../../../lib/utils"

interface PasswordRequirement {
  label: string
  regex: RegExp
  met: boolean
}

interface PasswordStrengthMeterProps {
  password: string
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const requirements: PasswordRequirement[] = [
    {
      label: "At least 12 characters",
      regex: /.{12,}/,
      met: false
    },
    {
      label: "At least one uppercase letter",
      regex: /[A-Z]/,
      met: false
    },
    {
      label: "At least one lowercase letter",
      regex: /[a-z]/,
      met: false
    },
    {
      label: "At least one number",
      regex: /\d/,
      met: false
    },
    {
      label: "At least one special character",
      regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      met: false
    }
  ]

  requirements.forEach(req => {
    req.met = req.regex.test(password)
  })

  const metCount = requirements.filter(req => req.met).length
  const strength = metCount / requirements.length

  const getStrengthColor = () => {
    if (strength === 1) return "bg-green-500"
    if (strength >= 0.8) return "bg-blue-500"
    if (strength >= 0.6) return "bg-yellow-500"
    if (strength >= 0.4) return "bg-orange-500"
    return "bg-red-500"
  }

  const getStrengthText = () => {
    if (strength === 1) return "Strong"
    if (strength >= 0.8) return "Good"
    if (strength >= 0.6) return "Fair"
    if (strength >= 0.4) return "Weak"
    return "Very Weak"
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Password strength</span>
          <span className={cn(
            "font-medium",
            strength === 1 ? "text-green-600" :
            strength >= 0.8 ? "text-blue-600" :
            strength >= 0.6 ? "text-yellow-600" :
            strength >= 0.4 ? "text-orange-600" :
            "text-red-600"
          )}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className={cn("h-2 rounded-full transition-all duration-300", getStrengthColor())}
            style={{ width: `${strength * 100}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Requirements:</p>
        <div className="space-y-1">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                req.met ? "bg-green-500" : "bg-slate-300"
              )} />
              <span className={cn(
                "text-sm",
                req.met ? "text-green-600" : "text-slate-500"
              )}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
