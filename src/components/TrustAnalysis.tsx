'use client';

interface TrustAnalysisProps {
  userRating: number;
}

export default function TrustAnalysis({ userRating }: TrustAnalysisProps) {
  // Placeholder data for how others rated
  const participantData = [
    { rating: 1, label: 'Absolutely Not', percentage: 8, count: 42 },
    { rating: 2, label: 'Not Really', percentage: 15, count: 78 },
    { rating: 3, label: 'Somewhat', percentage: 35, count: 182 },
    { rating: 4, label: 'Mostly', percentage: 28, count: 145 },
    { rating: 5, label: 'Absolutely', percentage: 14, count: 73 },
  ];

  const totalParticipants = participantData.reduce((sum, item) => sum + item.count, 0);
  const userRatingData = participantData.find(d => d.rating === userRating);
  const averageRating = (
    participantData.reduce((sum, item) => sum + (item.rating * item.count), 0) / totalParticipants
  ).toFixed(1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Do you trust AI to generate accurate and reliable text?
        </h2>
      </div>

      {/* Distribution Chart */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Response Distribution</h3>
        {participantData.map((item) => {
          const isUserRating = item.rating === userRating;
          return (
            <div key={item.rating} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className={`font-medium ${isUserRating ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {item.label}
                  {isUserRating && ' (You)'}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {item.percentage}% ({item.count})
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isUserRating
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                      : 'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageRating}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Average Rating</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalParticipants}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Responses</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {participantData.find(d => d.rating === 3)?.percentage}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Neutral (Somewhat)</p>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">Insight</p>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              {userRating >= 4 
                ? "You're among the more trusting participants. Most people are cautiously optimistic about AI text generation."
                : userRating === 3
                ? "You're in the majority! Most participants share your neutral stance on AI trust."
                : "You're more skeptical than most. Understanding how AI works may help build confidence in its capabilities."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
