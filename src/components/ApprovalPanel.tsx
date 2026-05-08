'use client';

import { useState } from 'react';
import { TravelForm, FormStatus } from '@/types/travel-form';
import { SessionUser } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/Card';

interface Props {
  form: TravelForm;
  currentUser: SessionUser;
  onApprove: (comment?: string) => void;
  onReject: (comment: string) => void;
}

const statusSteps: { status: FormStatus; label: string }[] = [
  { status: 'Draft', label: 'Draft' },
  { status: 'Pending', label: 'Pending Approval' },
  { status: 'FinanceApproved', label: 'Finance Approved' },
  { status: 'Approved', label: 'Final Approval' },
];

const statusOrder: Record<FormStatus, number> = {
  Draft: 0,
  Pending: 1,
  FinanceApproved: 2,
  Approved: 3,
  Rejected: -1,
};

export function ApprovalPanel({ form, currentUser, onApprove, onReject }: Props) {
  const [rejectComment, setRejectComment] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentStepIdx = statusOrder[form.status] ?? 0;
  const isFinanceApprover = currentUser.role === 'finance_approver';
  const isFinalApprover = currentUser.role === 'final_approver';

  const canApprove =
    (isFinanceApprover && form.status === 'Pending') ||
    (isFinalApprover && form.status === 'FinanceApproved');

  function handleApprove() {
    setLoading(true);
    setTimeout(() => {
      onApprove();
      setLoading(false);
    }, 500);
  }

  function handleReject() {
    if (!rejectComment.trim()) return;
    setLoading(true);
    setTimeout(() => {
      onReject(rejectComment.trim());
      setLoading(false);
    }, 500);
  }

  return (
    <SectionCard
      title="Section 4: Approval Status"
      subtitle="Workflow status and approval actions"
      accent
    >
      {/* Timeline */}
      {form.status !== 'Rejected' ? (
        <div className="flex items-center gap-0 mb-6 overflow-x-auto pb-2">
          {statusSteps.map((step, idx) => {
            const done = currentStepIdx > idx;
            const active = currentStepIdx === idx;
            return (
              <div key={step.status} className="flex items-center min-w-0">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                      done
                        ? 'bg-green-500 border-green-500 text-white'
                        : active
                        ? 'bg-[#F97316] border-[#F97316] text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {done ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`text-xs mt-1 text-center w-20 ${
                      active
                        ? 'text-[#F97316] font-semibold'
                        : done
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < statusSteps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 min-w-8 ${
                      done ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-semibold text-red-700">Form Rejected</p>
          {form.rejection && (
            <p className="text-xs text-red-500 mt-1">
              Rejected by {form.rejection.rejectedBy} on{' '}
              {new Date(form.rejection.date).toLocaleDateString()} —{' '}
              {form.rejection.comment}
            </p>
          )}
        </div>
      )}

      {/* Approval records */}
      {form.approvals.length > 0 && (
        <div className="mb-5 space-y-2">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Approval History
          </h4>
          {form.approvals.map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-green-800">{a.approverName}</p>
                <p className="text-xs text-green-600">
                  {a.stage === 'finance' ? 'Finance Manager' : 'Final Approver'} approval
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-600">
                  {new Date(a.date).toLocaleDateString()}
                </p>
                <p className="text-xs text-green-500">
                  {new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      {canApprove && (
        <div className="border-t border-gray-100 pt-4">
          {!showRejectForm ? (
            <div className="flex gap-3 flex-wrap">
              <Button
                variant="primary"
                onClick={handleApprove}
                loading={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowRejectForm(true)}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-sm font-medium text-[#1E3A5F]">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              />
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  onClick={handleReject}
                  loading={loading}
                  disabled={!rejectComment.trim()}
                >
                  Confirm Rejection
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectComment('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {!canApprove && form.status !== 'Approved' && form.status !== 'Rejected' && (
        <p className="text-sm text-gray-400 italic">
          {isFinanceApprover && form.status === 'FinanceApproved'
            ? 'You have already approved this form. Awaiting final approval.'
            : isFinalApprover && form.status === 'Pending'
            ? 'This form is awaiting Finance Manager approval first.'
            : 'No actions available.'}
        </p>
      )}

      {form.status === 'Approved' && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-700 font-medium">
            This travel request has been fully approved.
          </p>
        </div>
      )}
    </SectionCard>
  );
}
