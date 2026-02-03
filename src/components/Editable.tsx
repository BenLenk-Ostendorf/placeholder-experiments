'use client';

import { useState, useEffect } from 'react';
import { FeedbackData } from './FeedbackFlag';

interface EditableProps {
  children: React.ReactNode;
  elementId: string;
  elementLabel?: string;
  editingMode: boolean;
  isHighlighted?: boolean;
  feedback?: FeedbackData | null;
  // For text editing
  editableText?: string;
  onTextChange?: (newText: string) => void;
  className?: string;
}

// Mock feedback data for editing mode (simulating what would come from admin panel)
const mockFeedbackForEditing: Record<string, FeedbackData> = {
  'step-1': {
    technicalError: '',
    falseInformation: '',
    generalFeedback: 'The opening dialogue is engaging but could use more context about what Spezi was trying to do.',
  },
  'step-3.2': {
    technicalError: 'The survey options are cut off on mobile devices.',
    falseInformation: '',
    generalFeedback: '',
  },
  'step-6': {
    technicalError: '',
    falseInformation: 'Tokens can also include special characters like emojis, this should be mentioned.',
    generalFeedback: '',
  },
  'step-7.2': {
    technicalError: '',
    falseInformation: '',
    generalFeedback: 'The spinner visual is great! Maybe add more examples with different probability distributions.',
  },
  'step-7.5': {
    technicalError: 'Token simulator wheel sometimes gets stuck when clicking rapidly.',
    falseInformation: '',
    generalFeedback: '',
  },
  'step-9': {
    technicalError: '',
    falseInformation: 'Question 2 answer explanation could be clearer about why option B is incorrect.',
    generalFeedback: '',
  },
};

const flagLabels: Record<keyof FeedbackData, { label: string; color: string; icon: string }> = {
  technicalError: { label: 'Technical Error', color: 'red', icon: '🔧' },
  falseInformation: { label: 'False Information', color: 'orange', icon: '❌' },
  generalFeedback: { label: 'General Feedback', color: 'blue', icon: '💬' },
};

export function Editable({ 
  children, 
  elementId, 
  elementLabel,
  editingMode, 
  isHighlighted,
  feedback,
  editableText,
  onTextChange,
  className = '' 
}: EditableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(editableText || '');
  const [showFeedback, setShowFeedback] = useState(isHighlighted);

  // Get feedback from props or mock data
  const elementFeedback = feedback || mockFeedbackForEditing[elementId];
  const hasFeedback = elementFeedback && (
    elementFeedback.technicalError || 
    elementFeedback.falseInformation || 
    elementFeedback.generalFeedback
  );

  useEffect(() => {
    if (editableText) {
      setLocalText(editableText);
    }
  }, [editableText]);

  useEffect(() => {
    if (isHighlighted) {
      setShowFeedback(true);
      // Scroll into view when highlighted
      setTimeout(() => {
        const element = document.querySelector(`[data-editable-id="${elementId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [isHighlighted, elementId]);

  if (!editingMode) {
    return <>{children}</>;
  }

  const handleSaveText = () => {
    if (onTextChange) {
      onTextChange(localText);
    }
    setIsEditing(false);
    console.log(`[Edit] Element ${elementId}: Text changed to:`, localText);
  };

  return (
    <div 
      data-editable-id={elementId}
      className={`relative ${className} ${isHighlighted ? 'ring-2 ring-purple-500 ring-offset-2 rounded-lg' : ''}`}
    >
      {/* Editing Mode Toolbar */}
      <div className="absolute -top-3 left-2 z-20 flex items-center gap-2">
        <span className="px-2 py-0.5 text-[10px] font-mono bg-gray-800 text-gray-300 rounded">
          {elementId}
        </span>
        {hasFeedback && (
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className={`px-2 py-0.5 text-[10px] font-medium rounded flex items-center gap-1 ${
              showFeedback
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
            }`}
          >
            💬 {showFeedback ? 'Hide' : 'Show'} Feedback
          </button>
        )}
        {editableText !== undefined && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-2 py-0.5 text-[10px] font-medium rounded ${
              isEditing
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            }`}
          >
            ✏️ {isEditing ? 'Editing' : 'Edit Text'}
          </button>
        )}
      </div>

      {/* Content and Feedback Side by Side */}
      <div className={`flex gap-4 ${showFeedback && hasFeedback ? 'items-start' : ''}`}>
        {/* Left: Content */}
        <div className={`flex-1 min-w-0 ${isEditing ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Editable Text Area */}
          {isEditing && editableText !== undefined ? (
            <div className="mb-3">
              <textarea
                value={localText}
                onChange={e => setLocalText(e.target.value)}
                className="w-full px-3 py-2 text-sm border-2 border-green-400 dark:border-green-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y min-h-[100px]"
                placeholder="Edit the text content..."
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSaveText}
                  className="px-3 py-1 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save (not persisted)
                </button>
                <button
                  onClick={() => {
                    setLocalText(editableText);
                    setIsEditing(false);
                  }}
                  className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {/* Original Content */}
          {children}
        </div>

        {/* Right: Feedback Panel */}
        {showFeedback && hasFeedback && (
          <div className="w-80 flex-shrink-0 mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                Feedback
              </span>
              {elementLabel && (
                <span className="text-xs text-purple-600 dark:text-purple-400 truncate">
                  ({elementLabel})
                </span>
              )}
            </div>
            <div className="space-y-2">
              {(Object.keys(flagLabels) as Array<keyof FeedbackData>).map(key => {
                const text = elementFeedback?.[key];
                if (!text) return null;
                const info = flagLabels[key];
                return (
                  <div key={key} className={`p-2 rounded text-sm ${
                    info.color === 'red'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      : info.color === 'orange'
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                  }`}>
                    <span className="font-medium">{info.icon} {info.label}:</span>
                    <p className="mt-1">{text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Editable;
