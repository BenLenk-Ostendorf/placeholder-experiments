'use client';

import { useState } from 'react';

interface TrustSurveyProps {
  onSubmit: (rating: number) => void;
}

export default function TrustSurvey({ onSubmit }: TrustSurveyProps) {
  const [selectedRating, setSelectedRating] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ratings = [
    { value: 1, label: 'Absolutely Not', color: 'from-red-500 to-red-600' },
    { value: 2, label: 'Not Really', color: 'from-orange-500 to-orange-600' },
    { value: 3, label: 'Somewhat', color: 'from-yellow-500 to-yellow-600' },
    { value: 4, label: 'Mostly', color: 'from-lime-500 to-lime-600' },
    { value: 5, label: 'Absolutely', color: 'from-green-500 to-green-600' },
  ];

  const currentRating = ratings.find(r => r.value === selectedRating);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(selectedRating);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-12">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          How often do you think an LLM produces the same answer for the same prompt?
        </p>
      </div>

      {/* Slider */}
      <div className="mb-8">
        {/* Labels Above Track */}
        <div className="flex justify-between mb-3 px-2">
          {ratings.map((rating) => (
            <button
              key={rating.value}
              onClick={() => setSelectedRating(rating.value)}
              className={`flex flex-col items-center transition-all ${
                selectedRating === rating.value
                  ? 'scale-110'
                  : 'opacity-50 hover:opacity-75'
              }`}
            >
              <span className={`text-xs font-medium text-center max-w-[70px] mb-2 ${
                selectedRating === rating.value
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {rating.label}
              </span>
            </button>
          ))}
        </div>

        <div className="relative px-2">
          {/* Track */}
          <div className="h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 dark:from-red-900/30 dark:via-yellow-900/30 dark:to-green-900/30 rounded-full" />
          
          {/* Slider Input */}
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={selectedRating}
            onChange={(e) => setSelectedRating(parseInt(e.target.value))}
            className="absolute top-0 left-0 w-full h-3 opacity-0 cursor-pointer px-2"
          />
          
          {/* Custom Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-lg border-4 border-blue-600 pointer-events-none transition-all duration-200"
            style={{ left: `calc(${((selectedRating - 1) / 4) * 100}%)` }}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Submitting...
          </span>
        ) : (
          'Submit Response'
        )}
      </button>

      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
        Your response will be compared with other participants
      </p>
    </div>
  );
}
