'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace('/login');
    } else if (session.role === 'submitter') {
      router.replace('/dashboard');
    } else {
      router.replace('/approvals');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-[#1E3A5F] animate-pulse text-sm">Loading...</div>
    </div>
  );
}
