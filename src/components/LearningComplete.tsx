'use client';

interface LearningCompleteProps {
  score: number;
  totalQuestions: number;
  onNextGoal: () => void;
}

export default function LearningComplete({ score, totalQuestions, onNextGoal }: LearningCompleteProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 w-full">
      <div className="flex items-start gap-4">
        {/* Left: Icon and Title */}
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        {/* Middle: Content */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Goal Complete!
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Understanding How AI Produces Text
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Score */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {score}/{totalQuestions} <span className="text-base font-normal text-gray-500">({percentage}%)</span>
              </p>
            </div>
            
            {/* What you learned */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">What you learned</p>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Tokens in AI</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Probability selection</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Tone variation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Right: Action */}
        <div className="flex-shrink-0">
          <button
            onClick={onNextGoal}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Next Goal →
          </button>
        </div>
      </div>
    </div>
  );
}
