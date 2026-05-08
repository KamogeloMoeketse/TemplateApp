'use client';

import { DailyAllowances as DailyAllowancesType } from '@/types/travel-form';
import { Input } from '@/components/ui/Input';
import { SectionCard } from '@/components/ui/Card';

interface Props {
  data: DailyAllowancesType;
  onChange: (data: DailyAllowancesType) => void;
  readOnly?: boolean;
}

export function DailyAllowances({ data, onChange, readOnly = false }: Props) {
  function updateInternational(field: 'nightsAway' | 'amount', value: string) {
    const numVal = value === '' ? '' : Number(value);
    onChange({
      ...data,
      international: { ...data.international, [field]: numVal },
    });
  }

  function updateLocal(field: 'nightsAway' | 'stAmount', value: string) {
    const numVal = value === '' ? '' : Number(value);
    onChange({
      ...data,
      local: { ...data.local, [field]: numVal },
    });
  }

  return (
    <SectionCard
      title="Section 3: Daily Allowances"
      subtitle="Subsistence and travel allowance details"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* International */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🌍</span>
            <h4 className="text-sm font-semibold text-[#1E3A5F]">
              International Travel
            </h4>
          </div>
          <div className="space-y-3">
            <Input
              label="Nights Away from Home"
              type="number"
              min="0"
              placeholder="0"
              value={data.international.nightsAway === '' ? '' : String(data.international.nightsAway)}
              onChange={(e) => updateInternational('nightsAway', e.target.value)}
              readOnly={readOnly}
            />
            <Input
              label="Amount (ZAR)"
              type="number"
              min="0"
              placeholder="0"
              value={data.international.amount === '' ? '' : String(data.international.amount)}
              onChange={(e) => updateInternational('amount', e.target.value)}
              readOnly={readOnly}
            />
          </div>
        </div>

        {/* Local */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🏠</span>
            <h4 className="text-sm font-semibold text-[#1E3A5F]">
              Local Travel
            </h4>
          </div>
          <div className="space-y-3">
            <Input
              label="Nights Away from Home"
              type="number"
              min="0"
              placeholder="0"
              value={data.local.nightsAway === '' ? '' : String(data.local.nightsAway)}
              onChange={(e) => updateLocal('nightsAway', e.target.value)}
              readOnly={readOnly}
            />
            <Input
              label="S&T Amount (ZAR)"
              type="number"
              min="0"
              placeholder="0"
              value={data.local.stAmount === '' ? '' : String(data.local.stAmount)}
              onChange={(e) => updateLocal('stAmount', e.target.value)}
              readOnly={readOnly}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
