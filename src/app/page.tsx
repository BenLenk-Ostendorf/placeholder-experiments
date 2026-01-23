'use client';

import { useState } from 'react';
import LearningGoalsSidebar from '@/components/LearningGoalsSidebar';
import AIDialogue from '@/components/AIDialogue';
import TrustSurvey from '@/components/TrustSurvey';
import TrustAnalysis from '@/components/TrustAnalysis';
import LearningResources from '@/components/LearningResources';
import PrerequisiteModal from '@/components/PrerequisiteModal';
import TokenSimulator from '@/components/TokenSimulator';

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  category: string;
}

export default function Home() {
  const [selectedGoal, setSelectedGoal] = useState<LearningGoal | null>(null);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [showPrerequisiteModal, setShowPrerequisiteModal] = useState(false);
  const [prerequisiteAccepted, setPrerequisiteAccepted] = useState(false);

  const handleGoalSelect = (goal: LearningGoal) => {
    setSelectedGoal(goal);
    setShowPrerequisiteModal(true);
    setPrerequisiteAccepted(false);
  };

  const handlePrerequisiteAccept = () => {
    setShowPrerequisiteModal(false);
    setPrerequisiteAccepted(true);
  };

  const handlePrerequisiteClose = () => {
    setShowPrerequisiteModal(false);
    setSelectedGoal(null);
  };

  const handleSurveySubmit = async (rating: number) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setUserRating(rating);
    setSurveyCompleted(true);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Collapsible Sidebar */}
      <LearningGoalsSidebar 
        onSelectGoal={handleGoalSelect}
        selectedGoalId={selectedGoal?.id}
      />

      {/* Prerequisite Modal */}
      <PrerequisiteModal
        isOpen={showPrerequisiteModal}
        onClose={handlePrerequisiteClose}
        onAccept={handlePrerequisiteAccept}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  AI Learning Hub
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Explore artificial intelligence through interactive conversations
                </p>
              </div>
            </div>

            {selectedGoal && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      Currently Learning: {selectedGoal.title}
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      {selectedGoal.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedGoal(null)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className="space-y-8">
            {/* Show Token Simulator if prerequisite accepted */}
            {prerequisiteAccepted && selectedGoal && (
              <TokenSimulator />
            )}
            
            {/* Show Survey/Analysis if no learning goal active */}
            {!prerequisiteAccepted && !surveyCompleted && (
              <TrustSurvey onSubmit={handleSurveySubmit} />
            )}
            
            {!prerequisiteAccepted && surveyCompleted && (
              <>
                <TrustAnalysis userRating={userRating!} />
                <LearningResources />
              </>
            )}
          </main>

          {/* Footer */}
          <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-500">
            <p>Built with Next.js, Tailwind CSS & Firebase</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
