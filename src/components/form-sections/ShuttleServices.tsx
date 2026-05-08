'use client';

import { ShuttleService } from '@/types/travel-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/Card';
import { generateId } from '@/lib/store';

interface Props {
  shuttles: ShuttleService[];
  onChange: (shuttles: ShuttleService[]) => void;
  readOnly?: boolean;
}

function emptyShuttle(): ShuttleService {
  return {
    id: generateId(),
    pickupDate: '',
    shuttleCompany: '',
    pickupAddress: '',
    dropoffAddress: '',
    mobileNumber: '',
  };
}

export function ShuttleServices({ shuttles, onChange, readOnly = false }: Props) {
  function updateShuttle(id: string, field: keyof ShuttleService, value: string) {
    onChange(
      shuttles.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  function addShuttle() {
    onChange([...shuttles, emptyShuttle()]);
  }

  function removeShuttle(id: string) {
    onChange(shuttles.filter((s) => s.id !== id));
  }

  return (
    <SectionCard
      title="2.4 Shuttle Services (Transfer)"
      subtitle="Add shuttle or transfer bookings"
    >
      {shuttles.length === 0 && (
        <p className="text-sm text-gray-400 italic py-4 text-center">
          No shuttle services added yet.
        </p>
      )}

      <div className="space-y-4">
        {shuttles.map((shuttle, idx) => (
          <div
            key={shuttle.id}
            className="border border-gray-200 rounded-xl p-4 bg-gray-50"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-[#1E3A5F]">
                Shuttle {idx + 1}
              </span>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => removeShuttle(shuttle.id)}
                  className="text-red-400 hover:text-red-600 text-sm transition-colors"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Pick-up Date"
                type="date"
                value={shuttle.pickupDate}
                onChange={(e) => updateShuttle(shuttle.id, 'pickupDate', e.target.value)}
                readOnly={readOnly}
                required
              />
              <Input
                label="Shuttle Company"
                placeholder="e.g. Cape Shuttle Co."
                value={shuttle.shuttleCompany}
                onChange={(e) => updateShuttle(shuttle.id, 'shuttleCompany', e.target.value)}
                readOnly={readOnly}
                required
              />
              <Input
                label="Pick-up Address"
                placeholder="e.g. CPT Airport, Terminal 2"
                value={shuttle.pickupAddress}
                onChange={(e) => updateShuttle(shuttle.id, 'pickupAddress', e.target.value)}
                readOnly={readOnly}
                required
              />
              <Input
                label="Drop-off Address"
                placeholder="e.g. The Table Bay Hotel"
                value={shuttle.dropoffAddress}
                onChange={(e) => updateShuttle(shuttle.id, 'dropoffAddress', e.target.value)}
                readOnly={readOnly}
                required
              />
              <Input
                label="Mobile Number"
                type="tel"
                placeholder="e.g. 0821234567"
                value={shuttle.mobileNumber}
                onChange={(e) => updateShuttle(shuttle.id, 'mobileNumber', e.target.value)}
                readOnly={readOnly}
              />
            </div>
          </div>
        ))}
      </div>

      {!readOnly && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addShuttle}
          className="mt-4 border border-dashed border-[#1E3A5F]/40 w-full justify-center"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Shuttle Service
        </Button>
      )}
    </SectionCard>
  );
}
