'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { getForms, deleteForm } from '@/lib/store';
import { TravelForm } from '@/types/travel-form';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function DashboardPage() {
  const router = useRouter();
  const [forms, setForms] = useState<TravelForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace('/login');
      return;
    }
    if (session.role !== 'submitter') {
      router.replace('/approvals');
      return;
    }
    setUserName(session.name);
    setUserId(session.id);
    const allForms = getForms().filter((f) => f.applicantId === session.id);
    allForms.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    setForms(allForms);
    setLoading(false);
  }, [router]);

  function handleDelete(id: string) {
    setDeletingId(id);
    setTimeout(() => {
      deleteForm(id);
      setForms((prev) => prev.filter((f) => f.id !== id));
      setDeletingId(null);
    }, 400);
  }

  const stats = {
    total: forms.length,
    draft: forms.filter((f) => f.status === 'Draft').length,
    pending: forms.filter((f) => f.status === 'Pending' || f.status === 'FinanceApproved').length,
    approved: forms.filter((f) => f.status === 'Approved').length,
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
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A5F]">
            Welcome back, {userName.split(' ')[0]}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your travel requests below
          </p>
        </div>
        <Link href="/forms/new">
          <Button variant="secondary" size="md">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Travel Request
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Forms', value: stats.total, color: 'text-[#1E3A5F]', bg: 'bg-blue-50' },
          { label: 'Drafts', value: stats.draft, color: 'text-gray-500', bg: 'bg-gray-50' },
          { label: 'In Progress', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Approved', value: stats.approved, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-4 border border-gray-100`}>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {stat.label}
            </p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Forms list */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1E3A5F]">My Travel Requests</h2>
          <span className="text-sm text-gray-400">{forms.length} total</span>
        </div>

        {forms.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium">No travel requests yet</p>
            <p className="text-gray-300 text-sm mt-1">Click &ldquo;New Travel Request&rdquo; to get started</p>
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
                      Purpose
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Travel Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Updated
                    </th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {forms.map((form) => (
                    <tr key={form.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-[#1E3A5F]">
                        {form.tripNo}
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                        {form.purpose || <span className="text-gray-300 italic">No purpose set</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {form.travelFromDate && form.travelToDate
                          ? `${form.travelFromDate} — ${form.travelToDate}`
                          : <span className="text-gray-300 italic">Not set</span>}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={form.status} />
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(form.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/forms/${form.id}`}>
                            <Button variant="ghost" size="sm">
                              {form.status === 'Draft' ? 'Edit' : 'View'}
                            </Button>
                          </Link>
                          {form.status === 'Draft' && (
                            <Button
                              variant="danger"
                              size="sm"
                              loading={deletingId === form.id}
                              onClick={() => handleDelete(form.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-100">
              {forms.map((form) => (
                <div key={form.id} className="px-4 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-[#1E3A5F] text-sm">{form.tripNo}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">
                        {form.purpose || 'No purpose set'}
                      </p>
                    </div>
                    <StatusBadge status={form.status} />
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Link href={`/forms/${form.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        {form.status === 'Draft' ? 'Edit' : 'View'}
                      </Button>
                    </Link>
                    {form.status === 'Draft' && (
                      <Button
                        variant="danger"
                        size="sm"
                        loading={deletingId === form.id}
                        onClick={() => handleDelete(form.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
