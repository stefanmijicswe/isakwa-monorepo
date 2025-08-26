'use client';

import { useAuth } from "../../../components/auth";

export function TopNav() {
  const { user } = useAuth();

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : '...'}
          </span>
        </div>
      </div>
    </div>
  );
}
