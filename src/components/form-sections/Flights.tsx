'use client';

import { Flight } from '@/types/travel-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/Card';
import { generateId } from '@/lib/store';

interface Props {
  flights: Flight[];
  onChange: (flights: Flight[]) => void;
  readOnly?: boolean;
}

function emptyFlight(): Flight {
  return {
    id: generateId(),
    date: '',
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    flightNo: '',
    priorityPass: false,
    windowSeat: false,
  };
}

export function Flights({ flights, onChange, readOnly = false }: Props) {
  function updateFlight(id: string, field: keyof Flight, value: string | boolean) {
    onChange(
      flights.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  }

  function addFlight() {
    onChange([...flights, emptyFlight()]);
  }

  function removeFlight(id: string) {
    onChange(flights.filter((f) => f.id !== id));
  }

  return (
    <SectionCard
      title="2.1 Flights (Economy Class)"
      subtitle="Add all flight legs required for this trip"
    >
      <div className="mb-3 p-3 bg-[#EAB308]/10 border border-[#EAB308]/30 rounded-lg">
        <p className="text-xs text-yellow-800 font-medium">
          Note: Business class including upgrades require additional approval from management.
        </p>
      </div>

      {flights.length === 0 && (
        <p className="text-sm text-gray-400 italic py-4 text-center">
          No flights added yet.
        </p>
      )}

      <div className="space-y-4">
        {flights.map((flight, idx) => (
          <div
            key={flight.id}
            className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-[#1E3A5F]">
                Flight {idx + 1}
              </span>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => removeFlight(flight.id)}
                  className="text-red-400 hover:text-red-600 text-sm transition-colors"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Input
                label="Date"
                type="date"
                value={flight.date}
                onChange={(e) => updateFlight(flight.id, 'date', e.target.value)}
                readOnly={readOnly}
                required
              />
              <Input
                label="From"
                placeholder="e.g. JHB"
                value={flight.from}
                onChange={(e) => updateFlight(flight.id, 'from', e.target.value)}
                readOnly={readOnly}
                required
              />
              <Input
                label="To"
                placeholder="e.g. CPT"
                value={flight.to}
                onChange={(e) => updateFlight(flight.id, 'to', e.target.value)}
                readOnly={readOnly}
                required
              />
              <Input
                label="Departure Time"
                type="time"
                value={flight.departureTime}
                onChange={(e) => updateFlight(flight.id, 'departureTime', e.target.value)}
                readOnly={readOnly}
              />
              <Input
                label="Arrival Time"
                type="time"
                value={flight.arrivalTime}
                onChange={(e) => updateFlight(flight.id, 'arrivalTime', e.target.value)}
                readOnly={readOnly}
              />
              <Input
                label="Flight No."
                placeholder="e.g. FA101"
                value={flight.flightNo}
                onChange={(e) => updateFlight(flight.id, 'flightNo', e.target.value)}
                readOnly={readOnly}
              />
            </div>

            <div className="mt-3 flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flight.priorityPass}
                  onChange={(e) => updateFlight(flight.id, 'priorityPass', e.target.checked)}
                  disabled={readOnly}
                  className="w-4 h-4 rounded accent-[#F97316]"
                />
                <span className="text-sm text-gray-600">Priority Pass</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flight.windowSeat}
                  onChange={(e) => updateFlight(flight.id, 'windowSeat', e.target.checked)}
                  disabled={readOnly}
                  className="w-4 h-4 rounded accent-[#F97316]"
                />
                <span className="text-sm text-gray-600">Window Seat</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      {!readOnly && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addFlight}
          className="mt-4 border border-dashed border-[#1E3A5F]/40 w-full justify-center"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Flight
        </Button>
      )}
    </SectionCard>
  );
}
