'use client';

import { HotelBooking } from '@/types/travel-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/Card';
import { generateId } from '@/lib/store';

interface Props {
  hotels: HotelBooking[];
  onChange: (hotels: HotelBooking[]) => void;
  readOnly?: boolean;
}

function emptyHotel(): HotelBooking {
  return {
    id: generateId(),
    dateIn: '',
    dateOut: '',
    location: '',
    hotelName: '',
    boardBasis: '',
    estimatedCost: '',
  };
}

export function Hotel({ hotels, onChange, readOnly = false }: Props) {
  function updateHotel(id: string, field: keyof HotelBooking, value: string) {
    onChange(
      hotels.map((h) => (h.id === id ? { ...h, [field]: value } : h))
    );
  }

  function addHotel() {
    onChange([...hotels, emptyHotel()]);
  }

  function removeHotel(id: string) {
    onChange(hotels.filter((h) => h.id !== id));
  }

  return (
    <SectionCard
      title="2.2 Hotel Accommodation"
      subtitle="Add hotel bookings for the duration of the trip"
    >
      {hotels.length === 0 && (
        <p className="text-sm text-gray-400 italic py-4 text-center">
          No hotel bookings added yet.
        </p>
      )}

      <div className="space-y-4">
        {hotels.map((hotel, idx) => (
          <div
            key={hotel.id}
            className="border border-gray-200 rounded-xl p-4 bg-gray-50"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-[#1E3A5F]">
                Hotel Booking {idx + 1}
              </span>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => removeHotel(hotel.id)}
                  className="text-red-400 hover:text-red-600 text-sm transition-colors"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Input
                label="Date In"
                type="date"
                value={hotel.dateIn}
                onChange={(e) => updateHotel(hotel.id, 'dateIn', e.target.value)}
                readOnly={readOnly}
                required
              />
              <Input
                label="Date Out"
                type="date"
                value={hotel.dateOut}
                onChange={(e) => updateHotel(hotel.id, 'dateOut', e.target.value)}
                readOnly={readOnly}
                required
              />
              <Input
                label="Location"
                placeholder="e.g. Cape Town"
                value={hotel.location}
                onChange={(e) => updateHotel(hotel.id, 'location', e.target.value)}
                readOnly={readOnly}
                required
              />
              <div className="sm:col-span-2">
                <Input
                  label="Hotel Name & Details"
                  placeholder="e.g. The Table Bay Hotel"
                  value={hotel.hotelName}
                  onChange={(e) => updateHotel(hotel.id, 'hotelName', e.target.value)}
                  readOnly={readOnly}
                  required
                />
              </div>
              <Input
                label="Board Basis"
                placeholder="e.g. B&B, Room Only"
                value={hotel.boardBasis}
                onChange={(e) => updateHotel(hotel.id, 'boardBasis', e.target.value)}
                readOnly={readOnly}
              />
              <Input
                label="Estimated Cost (ZAR)"
                type="number"
                placeholder="0"
                value={hotel.estimatedCost}
                onChange={(e) => updateHotel(hotel.id, 'estimatedCost', e.target.value)}
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
          onClick={addHotel}
          className="mt-4 border border-dashed border-[#1E3A5F]/40 w-full justify-center"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Hotel Booking
        </Button>
      )}
    </SectionCard>
  );
}
