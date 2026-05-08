'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { getForms } from '@/lib/store';
import { TravelForm, FormStatus } from '@/types/travel-form';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SessionUser } from '@/lib/store';

type TabKey = 'queue' | 'all';

export default function ApprovalsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<TravelForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [tab, setTab] = useState<TabKey>('queue');

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace('/login');
      return;
    }
    if (session.role === 'submitter') {
      router.replace('/dashboard');
      return;
    }
    setUser(session);
    const allForms = getForms();
    allForms.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    setForms(allForms);
    setLoading(false);
  }, [router]);

  function getQueueForms(): TravelForm[] {
    if (!user) return [];
    if (user.role === 'finance_approver') {
      return forms.filter((f) => f.status === 'Pending');
    }
    if (user.role === 'final_approver') {
      return forms.filter((f) => f.status === 'FinanceApproved');
    }
    return [];
  }

  const queueForms = getQueueForms();
  const allForms = forms;
  const displayForms = tab === 'queue' ? queueForms : allForms;

  const roleLabel =
    user?.role === 'finance_approver' ? 'Finance Manager' : 'Final Approver';

  const queueStatusLabel: Record<string, string> = {
    finance_approver: 'Pending Approval',
    final_approver: 'Finance Approved',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#1E3A5F] animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E3A5F]">Approvals Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {roleLabel} — Review and action pending travel requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Awaiting Your Action',
            value: queueForms.length,
            color: 'text-[#F97316]',
            bg: 'bg-orange-50',
          },
          {
            label: 'Total Pending',
            value: forms.filter((f) => f.status === 'Pending').length,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
          },
          {
            label: 'Finance Approved',
            value: forms.filter((f) => f.status === 'FinanceApproved').length,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          },
          {
            label: 'Fully Approved',
            value: forms.filter((f) => f.status === 'Approved').length,
            color: 'text-green-600',
            bg: 'bg-green-50',
          },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-4 border border-gray-100`}>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {stat.label}
            </p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        <button
          onClick={() => setTab('queue')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'queue'
              ? 'bg-white shadow-sm text-[#1E3A5F]'
              : 'text-gray-500 hover:text-[#1E3A5F]'
          }`}
        >
          My Queue
          {queueForms.length > 0 && (
            <span className="ml-2 bg-[#F97316] text-white text-xs rounded-full px-1.5 py-0.5">
              {queueForms.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'all'
              ? 'bg-white shadow-sm text-[#1E3A5F]'
              : 'text-gray-500 hover:text-[#1E3A5F]'
          }`}
        >
          All Forms
        </button>
      </div>

      {/* Forms list */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-[#1E3A5F]">
            {tab === 'queue'
              ? `Forms Awaiting Your Approval (${queueStatusLabel[user?.role ?? '']})`
              : 'All Travel Requests'}
          </h2>
        </div>

        {displayForms.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium">
              {tab === 'queue' ? 'No forms awaiting your approval!' : 'No forms found.'}
            </p>
            <p className="text-gray-300 text-sm mt-1">
              {tab === 'queue' ? "You're all caught up." : ''}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Trip No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Purpose
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Travel Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Submitted
                    </th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayForms.map((form) => {
                    const needsAction =
                      (user?.role === 'finance_approver' && form.status === 'Pending') ||
                      (user?.role === 'final_approver' && form.status === 'FinanceApproved');
                    return (
                      <tr
                        key={form.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          needsAction ? 'border-l-4 border-l-[#F97316]' : ''
                        }`}
                      >
                        <td className="px-6 py-4 font-medium text-[#1E3A5F]">
                          {form.tripNo}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {form.applicantName}
                        </td>
                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                          {form.purpose || <span className="text-gray-300 italic">No purpose</span>}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs">
                          {form.travelFromDate && form.travelToDate
                            ? `${form.travelFromDate} — ${form.travelToDate}`
                            : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={form.status} />
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs">
                          {new Date(form.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/forms/${form.id}`}>
                            <Button
                              variant={needsAction ? 'secondary' : 'ghost'}
                              size="sm"
                            >
                              {needsAction ? 'Review & Action' : 'View'}
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-100">
              {displayForms.map((form) => {
                const needsAction =
                  (user?.role === 'finance_approver' && form.status === 'Pending') ||
                  (user?.role === 'final_approver' && form.status === 'FinanceApproved');
                return (
                  <div
                    key={form.id}
                    className={`px-4 py-4 ${needsAction ? 'border-l-4 border-l-[#F97316]' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-[#1E3A5F] text-sm">{form.tripNo}</p>
                        <p className="text-xs text-gray-400">{form.applicantName}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">
                          {form.purpose || 'No purpose'}
                        </p>
                      </div>
                      <StatusBadge status={form.status} />
                    </div>
                    <Link href={`/forms/${form.id}`}>
                      <Button
                        variant={needsAction ? 'secondary' : 'outline'}
                        size="sm"
                        className="w-full mt-2"
                      >
                        {needsAction ? 'Review & Action' : 'View'}
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
