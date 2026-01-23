'use client';

interface LearningCompleteProps {
  score: number;
  totalQuestions: number;
  onNextGoal: () => void;
}

export default function LearningComplete({ score, totalQuestions, onNextGoal }: LearningCompleteProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Congratulations! 🎉
        </h2>
        
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          You've completed the learning goal: <strong>Understanding How AI Produces Text</strong>
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your Score</p>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {score} / {totalQuestions}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
            {percentage}% Correct
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            What You've Learned:
          </h3>
          <ul className="text-left space-y-2 max-w-md mx-auto">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">What tokens are and how AI uses them</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">How probability affects token selection</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">How small choices can change the tone of AI-generated text</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Ready to continue your learning journey?
          </p>
          <button
            onClick={onNextGoal}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Start Next Learning Goal
          </button>
        </div>
      </div>
    </div>
  );
}
