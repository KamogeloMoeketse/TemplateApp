'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, getSession } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const DEMO_ACCOUNTS = [
  { username: 'john.doe', role: 'Staff (Submitter)' },
  { username: 'jane.smith', role: 'Staff (Submitter)' },
  { username: 'sarah.mgr', role: 'Finance Manager (Approver)' },
  { username: 'admin.final', role: 'Final Approver' },
];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session) {
      if (session.role === 'submitter') router.replace('/dashboard');
      else router.replace('/approvals');
    }
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const session = login(username.trim(), password);
      if (!session) {
        setError('Invalid username or password.');
        setLoading(false);
        return;
      }
      if (session.role === 'submitter') router.push('/dashboard');
      else router.push('/approvals');
    }, 400);
  }

  function fillDemo(u: string) {
    setUsername(u);
    setPassword('pass123');
    setError('');
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1E3A5F] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#F97316] rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
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
          <span className="text-white font-bold text-xl">TravelForm</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Digital Travel
            <br />
            <span className="text-[#F97316]">Requisitions</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Submit and manage travel requests seamlessly. No more paper forms —
            everything online and tracked.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { icon: '✈', label: 'Flight Bookings' },
              { icon: '🏨', label: 'Hotel Reservations' },
              { icon: '🚗', label: 'Car Hire' },
              { icon: '✅', label: 'Approval Workflow' },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 text-white/70 text-sm"
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-white/30 text-xs">
          © 2026 TravelForm. All rights reserved.
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="lg:hidden flex items-center gap-2 mb-8">
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
            <span className="text-[#1E3A5F] font-bold text-lg">TravelForm</span>
          </div>

          <h2 className="text-2xl font-bold text-[#1E3A5F] mb-1">Sign in</h2>
          <p className="text-gray-500 text-sm mb-8">
            Enter your credentials to access your account.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              placeholder="e.g. john.doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
              Sign In
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Demo accounts (password: pass123)
            </p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => fillDemo(acc.username)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 hover:border-[#1E3A5F]/30 hover:bg-[#1E3A5F]/5 transition-colors text-left"
                >
                  <span className="text-sm font-medium text-[#1E3A5F]">
                    {acc.username}
                  </span>
                  <span className="text-xs text-gray-400">{acc.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
