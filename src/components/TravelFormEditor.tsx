'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TravelForm,
  Flight,
  HotelBooking,
  CarHire as CarHireType,
  ShuttleService,
  DailyAllowances as DailyAllowancesType,
} from '@/types/travel-form';
import { saveForm, generateTripNo, generateId } from '@/lib/store';
import { getSession as getAuthSession } from '@/lib/auth';
import { ApplicationInfo } from './form-sections/ApplicationInfo';
import { Flights } from './form-sections/Flights';
import { Hotel } from './form-sections/Hotel';
import { CarHire } from './form-sections/CarHire';
import { ShuttleServices } from './form-sections/ShuttleServices';
import { DailyAllowances } from './form-sections/DailyAllowances';
import { ApprovalPanel } from './ApprovalPanel';
import { Button } from './ui/Button';
import { StatusBadge } from './ui/Badge';
import { downloadTravelFormPdf } from '@/lib/pdf';

interface Props {
  existingForm?: TravelForm;
}

const defaultAllowances: DailyAllowancesType = {
  international: { nightsAway: '', amount: '' },
  local: { nightsAway: '', stAmount: '' },
};

export function TravelFormEditor({ existingForm }: Props) {
  const router = useRouter();
  const user = getAuthSession();

  const [form, setForm] = useState<TravelForm>(() => {
    if (existingForm) return existingForm;
    return {
      id: generateId(),
      tripNo: generateTripNo(),
      applicantId: user?.id ?? '',
      applicantName: user?.name ?? '',
      travelFromDate: '',
      travelToDate: '',
      purpose: '',
      costCode: '',
      flights: [],
      hotels: [],
      carHires: [],
      shuttles: [],
      dailyAllowances: defaultAllowances,
      status: 'Draft',
      approvals: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const isReadOnly = form.status !== 'Draft';
  const isApprover =
    user?.role === 'finance_approver' || user?.role === 'final_approver';
  const canDownloadPdf = form.status === 'Approved';

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value, updatedAt: new Date().toISOString() }));
  }

  function handleSaveDraft() {
    setSaving(true);
    setTimeout(() => {
      saveForm({ ...form, updatedAt: new Date().toISOString() });
      setSaving(false);
      setSavedMsg('Draft saved!');
      setTimeout(() => setSavedMsg(''), 2500);
    }, 400);
  }

  function handleSubmit() {
    setSubmitting(true);
    setTimeout(() => {
      const updated: TravelForm = {
        ...form,
        status: 'Pending',
        updatedAt: new Date().toISOString(),
      };
      saveForm(updated);
      setForm(updated);
      setSubmitting(false);
    }, 500);
  }

  function handleApprove() {
    if (!user) return;
    const stage = user.role === 'finance_approver' ? 'finance' : 'final';
    const newStatus =
      stage === 'finance' ? 'FinanceApproved' : 'Approved';
    const updated: TravelForm = {
      ...form,
      status: newStatus,
      approvals: [
        ...form.approvals,
        {
          approverName: user.name,
          approverId: user.id,
          date: new Date().toISOString(),
          stage,
        },
      ],
      updatedAt: new Date().toISOString(),
    };
    saveForm(updated);
    setForm(updated);
  }

  function handleReject(comment: string) {
    if (!user) return;
    const stage = user.role === 'finance_approver' ? 'finance' : 'final';
    const updated: TravelForm = {
      ...form,
      status: 'Rejected',
      rejection: {
        rejectedBy: user.name,
        rejectedById: user.id,
        date: new Date().toISOString(),
        stage,
        comment,
      },
      updatedAt: new Date().toISOString(),
    };
    saveForm(updated);
    setForm(updated);
  }

  function handleDownloadPdf() {
    if (!canDownloadPdf) return;
    setDownloadingPdf(true);
    setTimeout(() => {
      downloadTravelFormPdf(form);
      setDownloadingPdf(false);
    }, 100);
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <button
              onClick={() => router.back()}
              className="hover:text-[#1E3A5F] transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <span>/</span>
            <span>Travel Form</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#1E3A5F]">{form.tripNo}</h1>
            <StatusBadge status={form.status} />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {existingForm ? `Last updated ${new Date(form.updatedAt).toLocaleString()}` : 'New travel request'}
          </p>
        </div>

        {/* Actions */}
        {!isReadOnly && !isApprover && (
          <div className="flex gap-3 flex-wrap items-center">
            {savedMsg && (
              <span className="text-sm text-green-600 font-medium">{savedMsg}</span>
            )}
            <Button variant="outline" onClick={handleSaveDraft} loading={saving}>
              Save Draft
            </Button>
            <Button
              variant="secondary"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!form.travelFromDate || !form.purpose}
            >
              Submit for Approval
            </Button>
          </div>
        )}

        {canDownloadPdf && (
          <div className="flex gap-3 flex-wrap items-center">
            <Button variant="secondary" onClick={handleDownloadPdf} loading={downloadingPdf}>
              Download PDF
            </Button>
          </div>
        )}
      </div>

      {/* Form sections */}
      <div className="space-y-6">
        <ApplicationInfo
          data={{
            tripNo: form.tripNo,
            applicantName: form.applicantName,
            travelFromDate: form.travelFromDate,
            travelToDate: form.travelToDate,
            purpose: form.purpose,
            costCode: form.costCode,
          }}
          onChange={updateField}
          readOnly={isReadOnly}
        />

        {/* Section 2 heading */}
        <div className="bg-[#1E3A5F] rounded-xl px-6 py-3">
          <h2 className="text-white font-semibold">Section 2: Reservations</h2>
        </div>

        <Flights
          flights={form.flights}
          onChange={(flights: Flight[]) => setForm((p) => ({ ...p, flights }))}
          readOnly={isReadOnly}
        />
        <Hotel
          hotels={form.hotels}
          onChange={(hotels: HotelBooking[]) => setForm((p) => ({ ...p, hotels }))}
          readOnly={isReadOnly}
        />
        <CarHire
          carHires={form.carHires}
          onChange={(carHires: CarHireType[]) => setForm((p) => ({ ...p, carHires }))}
          readOnly={isReadOnly}
        />
        <ShuttleServices
          shuttles={form.shuttles}
          onChange={(shuttles: ShuttleService[]) => setForm((p) => ({ ...p, shuttles }))}
          readOnly={isReadOnly}
        />

        <DailyAllowances
          data={form.dailyAllowances}
          onChange={(dailyAllowances: DailyAllowancesType) =>
            setForm((p) => ({ ...p, dailyAllowances }))
          }
          readOnly={isReadOnly}
        />

        {/* Approval panel — show if submitted or if approver */}
        {(form.status !== 'Draft' || isApprover) && (
          <ApprovalPanel
            form={form}
            currentUser={user}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>
    </div>
  );
}
