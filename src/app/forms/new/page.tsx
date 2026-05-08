'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { TravelFormEditor } from '@/components/TravelFormEditor';

export default function NewFormPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace('/login');
      return;
    }
    if (session.role !== 'submitter') {
      router.replace('/approvals');
    }
  }, [router]);

  return <TravelFormEditor />;
}
