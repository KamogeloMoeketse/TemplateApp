'use client';

import { Input, TextArea } from '@/components/ui/Input';
import { SectionCard } from '@/components/ui/Card';

interface Props {
  data: {
    tripNo: string;
    applicantName: string;
    travelFromDate: string;
    travelToDate: string;
    purpose: string;
    costCode: string;
  };
  onChange: (field: string, value: string) => void;
  readOnly?: boolean;
}

export function ApplicationInfo({ data, onChange, readOnly = false }: Props) {
  return (
    <SectionCard
      title="Section 1: Application Information"
      subtitle="Basic trip details and applicant information"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Trip No."
          value={data.tripNo}
          readOnly
          className="bg-gray-50 cursor-not-allowed"
        />
        <Input
          label="Name of Applicant"
          value={data.applicantName}
          readOnly
          className="bg-gray-50 cursor-not-allowed"
        />
        <Input
          label="Travel From Date"
          type="date"
          value={data.travelFromDate}
          onChange={(e) => onChange('travelFromDate', e.target.value)}
          readOnly={readOnly}
          required
        />
        <Input
          label="Travel To Date"
          type="date"
          value={data.travelToDate}
          onChange={(e) => onChange('travelToDate', e.target.value)}
          readOnly={readOnly}
          required
        />
        <div className="sm:col-span-2">
          <TextArea
            label="Purpose of Travel"
            value={data.purpose}
            onChange={(e) => onChange('purpose', e.target.value)}
            readOnly={readOnly}
            rows={3}
            placeholder="Describe the purpose of this trip..."
            required
          />
        </div>
        <Input
          label="Cost Code"
          value={data.costCode}
          onChange={(e) => onChange('costCode', e.target.value)}
          readOnly={readOnly}
          placeholder="e.g. FM-2026-CC01"
          required
        />
      </div>
    </SectionCard>
  );
}
