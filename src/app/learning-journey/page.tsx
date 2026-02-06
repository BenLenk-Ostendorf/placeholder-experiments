'use client';

import { useState } from 'react';
import SkillTree from '@/components/SkillTree';
import { useRouter } from 'next/navigation';

export default function LearningJourneyPage() {
  const router = useRouter();
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [showCertificateSelection, setShowCertificateSelection] = useState(false);
  const [testingMode, setTestingMode] = useState(false);

  const handleStartGoal = (nodeId: string) => {
    // Navigate to content page with the selected goal
    router.push(`/content?goal=${nodeId}`);
  };

  const handleChallengeGoal = (nodeId: string) => {
    // Navigate to content page in challenge mode
    router.push(`/content?goal=${nodeId}&challenge=true`);
  };

  const handleToggleNodeComplete = (nodeId: string) => {
    setCompletedNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const handleSelectCertificate = (certId: string | null) => {
    setSelectedCertificate(certId);
    if (certId === null) {
      setShowCertificateSelection(true);
    }
  };

  const handleCloseCertificateSelection = () => {
    setShowCertificateSelection(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Learning Path
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Testing Mode Toggle */}
          <button
            onClick={() => setTestingMode(!testingMode)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              testingMode 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Testing Mode - Flag content issues"
          >
            <svg className="w-5 h-5" fill={testingMode ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            {testingMode && <span>Testing</span>}
          </button>

          {/* Admin Panel Button */}
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Admin Control Panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <SkillTree
          completedNodes={completedNodes}
          onStartGoal={handleStartGoal}
          onChallengeGoal={handleChallengeGoal}
          debugMode={false}
          onToggleNodeComplete={handleToggleNodeComplete}
          selectedCertificate={selectedCertificate}
          onSelectCertificate={handleSelectCertificate}
          showCertificateSelection={showCertificateSelection}
          onCloseCertificateSelection={handleCloseCertificateSelection}
        />
      </div>
    </div>
  );
}
