'use client';

import { useState } from 'react';

interface LearningCompleteProps {
  score: number;
  totalQuestions: number;
  onNextGoal: () => void;
  goalTitle?: string;
}

export default function LearningComplete({ score, totalQuestions, onNextGoal, goalTitle = "Understanding How AI Produces Text" }: LearningCompleteProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const ratingLabels = [
    { value: 1, emoji: '😕', label: 'Not helpful' },
    { value: 2, emoji: '😐', label: 'Okay' },
    { value: 3, emoji: '🙂', label: 'Good' },
    { value: 4, emoji: '😊', label: 'Very good' },
    { value: 5, emoji: '🤩', label: 'Excellent!' },
  ];

  const handleSubmitRating = () => {
    if (rating !== null) {
      // Here you could send the rating to a backend
      console.log('Rating submitted:', { rating, feedback, goalTitle });
      setSubmitted(true);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 w-full space-y-6">
      {/* Main completion content */}
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
            {goalTitle}
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
      </div>

      {/* Rating Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
        {!submitted ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                How was this learning activity?
              </p>
              <div className="flex items-center gap-2">
                {ratingLabels.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setRating(item.value)}
                    onMouseEnter={() => setHoveredRating(item.value)}
                    onMouseLeave={() => setHoveredRating(null)}
                    className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                      rating === item.value
                        ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className={`text-2xl transition-transform ${
                      (hoveredRating === item.value || rating === item.value) ? 'scale-125' : ''
                    }`}>
                      {item.emoji}
                    </span>
                  </button>
                ))}
              </div>
              {(hoveredRating || rating) && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {ratingLabels.find(r => r.value === (hoveredRating || rating))?.label}
                </p>
              )}
            </div>

            {rating !== null && (
              <div className="space-y-3">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Any additional feedback? (optional)"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSubmitRating}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Submit Feedback
                  </button>
                  <button
                    onClick={() => {
                      setSubmitted(true);
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">
                {rating ? 'Thanks for your feedback!' : 'Feedback skipped'}
              </span>
            </div>
            <button
              onClick={onNextGoal}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Next Goal →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
