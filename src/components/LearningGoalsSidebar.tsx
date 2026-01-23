'use client';

import { useState } from 'react';

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  category: string;
}

const learningGoals: LearningGoal[] = [
  {
    id: '1',
    title: 'What is AI?',
    description: 'Understanding artificial intelligence fundamentals',
    category: 'Basics',
  },
  {
    id: '2',
    title: 'Machine Learning Basics',
    description: 'Introduction to ML algorithms and concepts',
    category: 'Basics',
  },
  {
    id: '3',
    title: 'Neural Networks',
    description: 'How neural networks work and learn',
    category: 'ML',
  },
  {
    id: '4',
    title: 'Natural Language Processing',
    description: 'Understanding how AI processes language',
    category: 'NLP',
  },
  {
    id: '5',
    title: 'Computer Vision',
    description: 'How AI sees and interprets images',
    category: 'Applications',
  },
  {
    id: '6',
    title: 'AI Ethics',
    description: 'Ethical considerations in AI development',
    category: 'Ethics',
  },
  {
    id: '7',
    title: 'Large Language Models',
    description: 'Understanding LLMs like GPT and Claude',
    category: 'NLP',
  },
  {
    id: '8',
    title: 'AI in Healthcare',
    description: 'Applications of AI in medical field',
    category: 'Applications',
  },
];

interface LearningGoalsSidebarProps {
  onSelectGoal: (goal: LearningGoal) => void;
  selectedGoalId?: string;
}

export default function LearningGoalsSidebar({ onSelectGoal, selectedGoalId }: LearningGoalsSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const categories = Array.from(new Set(learningGoals.map(g => g.category)));

  return (
    <div
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Learning Goals
          </h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
              isCollapsed ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-73px)]">
        {isCollapsed ? (
          <div className="flex flex-col items-center py-4 space-y-2">
            {learningGoals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => onSelectGoal(goal)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  selectedGoalId === goal.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title={goal.title}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {category}
                </h3>
                <div className="space-y-1">
                  {learningGoals
                    .filter((goal) => goal.category === category)
                    .map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => onSelectGoal(goal)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedGoalId === goal.id
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{goal.title}</div>
                        <div
                          className={`text-xs mt-1 ${
                            selectedGoalId === goal.id
                              ? 'text-blue-100'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {goal.description}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
