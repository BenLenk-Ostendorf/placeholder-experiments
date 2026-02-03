'use client';

import { useState, useEffect } from 'react';

export interface FeedbackData {
  technicalError: string;
  falseInformation: string;
  generalFeedback: string;
}

interface FeedbackFlagProps {
  elementId: string;
  elementLabel?: string;
  feedback: FeedbackData | null;
  onFeedbackChange: (elementId: string, feedback: FeedbackData | null) => void;
}

export function FeedbackFlag({ elementId, elementLabel, feedback, onFeedbackChange }: FeedbackFlagProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFeedback, setLocalFeedback] = useState<FeedbackData>({
    technicalError: '',
    falseInformation: '',
    generalFeedback: '',
  });
  const [activeTags, setActiveTags] = useState<Set<keyof FeedbackData>>(new Set());

  // Sync local state with props when opening
  useEffect(() => {
    if (isOpen && feedback) {
      setLocalFeedback(feedback);
      const tags = new Set<keyof FeedbackData>();
      if (feedback.technicalError) tags.add('technicalError');
      if (feedback.falseInformation) tags.add('falseInformation');
      if (feedback.generalFeedback) tags.add('generalFeedback');
      setActiveTags(tags);
    } else if (isOpen && !feedback) {
      setLocalFeedback({ technicalError: '', falseInformation: '', generalFeedback: '' });
      setActiveTags(new Set());
    }
  }, [isOpen, feedback]);

  const hasFeedback = feedback && (feedback.technicalError || feedback.falseInformation || feedback.generalFeedback);

  const toggleTag = (tag: keyof FeedbackData) => {
    setActiveTags(prev => {
      const newTags = new Set(prev);
      if (newTags.has(tag)) {
        newTags.delete(tag);
        setLocalFeedback(f => ({ ...f, [tag]: '' }));
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  };

  const handleSave = () => {
    const hasContent = localFeedback.technicalError || localFeedback.falseInformation || localFeedback.generalFeedback;
    if (hasContent) {
      onFeedbackChange(elementId, localFeedback);
      console.log(`[Feedback] Element: ${elementId}`, localFeedback);
    } else {
      onFeedbackChange(elementId, null);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalFeedback({ technicalError: '', falseInformation: '', generalFeedback: '' });
    setActiveTags(new Set());
    onFeedbackChange(elementId, null);
    console.log(`[Feedback Cleared] Element: ${elementId}`);
    setIsOpen(false);
  };

  const tags: { key: keyof FeedbackData; label: string; icon: string; color: string }[] = [
    { key: 'technicalError', label: 'Technical Error', icon: '🔧', color: 'red' },
    { key: 'falseInformation', label: 'False Information', icon: '❌', color: 'orange' },
    { key: 'generalFeedback', label: 'General Feedback', icon: '💬', color: 'blue' },
  ];

  return (
    <>
      {/* Flag Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-md transition-all ${
          hasFeedback
            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 ring-2 ring-red-300'
            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        title={hasFeedback ? 'Edit feedback' : 'Add feedback'}
      >
        <svg className="w-4 h-4" fill={hasFeedback ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsOpen(false)}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Flag Content
                </h3>
                {elementLabel && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {elementLabel}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select the type(s) of feedback and add your comments:
              </p>

              {tags.map(tag => (
                <div key={tag.key} className="space-y-2">
                  <button
                    onClick={() => toggleTag(tag.key)}
                    className={`flex items-center gap-2 w-full p-2 rounded-md border transition-all text-left ${
                      activeTags.has(tag.key)
                        ? tag.color === 'red'
                          ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700'
                          : tag.color === 'orange'
                          ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700'
                          : 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="text-lg">{tag.icon}</span>
                    <span className={`text-sm font-medium ${
                      activeTags.has(tag.key)
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {tag.label}
                    </span>
                    {activeTags.has(tag.key) && (
                      <svg className="w-4 h-4 ml-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {activeTags.has(tag.key) && (
                    <textarea
                      value={localFeedback[tag.key]}
                      onChange={e => setLocalFeedback(f => ({ ...f, [tag.key]: e.target.value }))}
                      placeholder={`Describe the ${tag.label.toLowerCase()}...`}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={2}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
              {hasFeedback ? (
                <button
                  onClick={handleClear}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  Clear All Feedback
                </button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Wrapper component to add flag functionality to any element
interface FlaggableProps {
  children: React.ReactNode;
  elementId: string;
  elementLabel?: string;
  testingMode: boolean;
  feedback: FeedbackData | null;
  onFeedbackChange: (elementId: string, feedback: FeedbackData | null) => void;
  className?: string;
}

export function Flaggable({ children, elementId, elementLabel, testingMode, feedback, onFeedbackChange, className = '' }: FlaggableProps) {
  if (!testingMode) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {children}
      <FeedbackFlag
        elementId={elementId}
        elementLabel={elementLabel}
        feedback={feedback}
        onFeedbackChange={onFeedbackChange}
      />
    </div>
  );
}

export default FeedbackFlag;
