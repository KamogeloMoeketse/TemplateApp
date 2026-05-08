'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getFormById } from '@/lib/store';
import { TravelForm } from '@/types/travel-form';
import { TravelFormEditor } from '@/components/TravelFormEditor';

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState<TravelForm | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace('/login');
      return;
    }
    const id = params.id as string;
    const found = getFormById(id);
    if (!found) {
      setNotFound(true);
      return;
    }
    setForm(found);
  }, [params.id, router]);

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-xl font-semibold text-[#1E3A5F]">Form not found</p>
        <p className="text-gray-400 mt-2">The requested travel form does not exist.</p>
        <button
          onClick={() => router.back()}
          className="mt-6 text-[#F97316] underline text-sm"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#1E3A5F] animate-pulse text-sm">Loading form...</div>
      </div>
    );
  }

  return <TravelFormEditor existingForm={form} />;
}
