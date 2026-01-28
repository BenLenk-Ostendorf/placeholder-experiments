'use client';

import { useState } from 'react';

interface TrustSurveyProps {
  onSubmit: (rating: number) => void;
}

export default function TrustSurvey({ onSubmit }: TrustSurveyProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const options = [
    { value: 1, label: 'Never the same', description: 'Every response is completely different' },
    { value: 2, label: 'Rarely the same', description: 'Mostly different with occasional similarities' },
    { value: 3, label: 'Sometimes the same', description: 'About 50/50 similar and different' },
    { value: 4, label: 'Usually the same', description: 'Mostly similar with minor variations' },
    { value: 5, label: 'Always the same', description: 'Identical or nearly identical every time' },
  ];

  const handleSubmit = async () => {
    if (selectedRating === null) return;
    setIsSubmitting(true);
    await onSubmit(selectedRating);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-8">
        <p className="text-xl font-semibold text-gray-900 dark:text-white">
          How often do you think an LLM produces the same answer for the same prompt?
        </p>
      </div>

      {/* Option Buttons */}
      <div className="space-y-3 mb-8">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedRating(option.value)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selectedRating === option.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedRating === option.value
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 dark:border-gray-500'
              }`}>
                {selectedRating === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <div>
                <p className={`font-medium ${
                  selectedRating === option.value
                    ? 'text-blue-900 dark:text-blue-100'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {option.label}
                </p>
                <p className={`text-sm ${
                  selectedRating === option.value
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {option.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || selectedRating === null}
        className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
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
    </div>
  );
}
