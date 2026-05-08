'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { logout, getSession } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { SessionUser } from '@/lib/store';

const roleLabels: Record<string, string> = {
  submitter: 'Staff',
  finance_approver: 'Finance Manager',
  final_approver: 'Final Approver',
};

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    setUser(getSession());
  }, [pathname]);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  if (!user || pathname === '/login') return null;

  const isApprover =
    user.role === 'finance_approver' || user.role === 'final_approver';

  return (
    <nav className="bg-[#1E3A5F] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">TravelForm</span>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {!isApprover && (
              <Link
                href="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/dashboard') || pathname.startsWith('/forms')
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                My Forms
              </Link>
            )}
            {isApprover && (
              <Link
                href="/approvals"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/approvals')
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Approvals
              </Link>
            )}
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-[#EAB308]">{roleLabels[user.role] ?? user.role}</p>
            </div>
            <div className="w-8 h-8 bg-[#F97316] rounded-full flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <button
              onClick={handleLogout}
              className="text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
