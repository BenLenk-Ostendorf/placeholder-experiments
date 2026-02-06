'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import AdminPanel from '@/components/AdminPanel';

function AdminPageContent() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/learning-path');
  };

  return <AdminPanel onBack={handleBack} />;
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-10 h-10 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading admin panel...</p>
      </div>
    }>
      <AdminPageContent />
    </Suspense>
  );
}
