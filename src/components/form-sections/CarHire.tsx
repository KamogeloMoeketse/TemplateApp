'use client';

import { CarHire as CarHireType } from '@/types/travel-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/Card';
import { generateId } from '@/lib/store';

interface Props {
  carHires: CarHireType[];
  onChange: (carHires: CarHireType[]) => void;
  readOnly?: boolean;
}

function emptyCarHire(): CarHireType {
  return {
    id: generateId(),
    pickupDate: '',
    dropoffDate: '',
    location: '',
  };
}

export function CarHire({ carHires, onChange, readOnly = false }: Props) {
  function updateCarHire(id: string, field: keyof CarHireType, value: string) {
    onChange(
      carHires.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  }

  function addCarHire() {
    onChange([...carHires, emptyCarHire()]);
  }

  function removeCarHire(id: string) {
    onChange(carHires.filter((c) => c.id !== id));
  }

  return (
    <SectionCard
      title="2.3 Car Hire"
      subtitle="Add car hire requirements for this trip"
    >
      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700 font-medium">
          Note: Flights to be flexible — enable changes in case there is a need.
        </p>
      </div>

      {carHires.length === 0 && (
        <p className="text-sm text-gray-400 italic py-4 text-center">
          No car hire bookings added yet.
        </p>
      )}

      <div className="space-y-4">
        {carHires.map((car, idx) => (
          <div
            key={car.id}
            className="border border-gray-200 rounded-xl p-4 bg-gray-50"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-[#1E3A5F]">
                Car Hire {idx + 1}
              </span>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => removeCarHire(car.id)}
                  className="text-red-400 hover:text-red-600 text-sm transition-colors"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Pick-up Date"
                type="date"
                value={car.pickupDate}
                onChange={(e) => updateCarHire(car.id, 'pickupDate', e.target.value)}
                readOnly={readOnly}
                required
              />
              <Input
                label="Drop-off Date"
                type="date"
                value={car.dropoffDate}
                onChange={(e) => updateCarHire(car.id, 'dropoffDate', e.target.value)}
                readOnly={readOnly}
                required
              />
              <Input
                label="Location"
                placeholder="e.g. Cape Town"
                value={car.location}
                onChange={(e) => updateCarHire(car.id, 'location', e.target.value)}
                readOnly={readOnly}
                required
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
          onClick={addCarHire}
          className="mt-4 border border-dashed border-[#1E3A5F]/40 w-full justify-center"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Car Hire
        </Button>
      )}
    </SectionCard>
  );
}
