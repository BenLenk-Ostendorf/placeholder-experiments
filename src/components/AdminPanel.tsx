'use client';

import { useState } from 'react';

interface FeedbackEntry {
  id: string;
  learningObjective: string;
  resource: string;
  contentId: string;
  flag: 'technicalError' | 'falseInformation' | 'generalFeedback';
  text: string;
  timestamp: string;
  university: string;
}

// Mock data for the feedback table
const mockFeedbackData: FeedbackEntry[] = [
  {
    id: '1',
    learningObjective: 'Understanding How AI Produces Text',
    resource: 'Story-driven Course',
    contentId: 'step-1',
    flag: 'generalFeedback',
    text: 'The opening dialogue is engaging but could use more context about what Spezi was trying to do.',
    timestamp: '2026-01-27 10:30',
    university: 'TU Munich',
  },
  {
    id: '2',
    learningObjective: 'Understanding How AI Produces Text',
    resource: 'Story-driven Course',
    contentId: 'step-3.2',
    flag: 'technicalError',
    text: 'The survey options are cut off on mobile devices.',
    timestamp: '2026-01-27 11:15',
    university: 'LMU Munich',
  },
  {
    id: '3',
    learningObjective: 'Understanding How AI Produces Text',
    resource: 'Story-driven Course',
    contentId: 'step-6',
    flag: 'falseInformation',
    text: 'Tokens can also include special characters like emojis, this should be mentioned.',
    timestamp: '2026-01-27 12:00',
    university: 'TU Munich',
  },
  {
    id: '4',
    learningObjective: 'Understanding How AI Produces Text',
    resource: 'Story-driven Course',
    contentId: 'step-7.2',
    flag: 'generalFeedback',
    text: 'The spinner visual is great! Maybe add more examples with different probability distributions.',
    timestamp: '2026-01-27 14:20',
    university: 'University of Stuttgart',
  },
  {
    id: '5',
    learningObjective: 'Understanding How AI Produces Text',
    resource: 'Story-driven Course',
    contentId: 'step-7.5',
    flag: 'technicalError',
    text: 'Token simulator wheel sometimes gets stuck when clicking rapidly.',
    timestamp: '2026-01-27 15:45',
    university: 'RWTH Aachen',
  },
  {
    id: '6',
    learningObjective: 'Understanding How AI Produces Text',
    resource: 'Story-driven Course',
    contentId: 'step-9',
    flag: 'falseInformation',
    text: 'Question 2 answer explanation could be clearer about why option B is incorrect.',
    timestamp: '2026-01-27 16:30',
    university: 'TU Munich',
  },
  {
    id: '7',
    learningObjective: 'AI Ethics Fundamentals',
    resource: 'Video Course',
    contentId: 'video-intro-1',
    flag: 'generalFeedback',
    text: 'Video quality is good but subtitles are slightly out of sync.',
    timestamp: '2026-01-26 09:00',
    university: 'LMU Munich',
  },
  {
    id: '8',
    learningObjective: 'Prompt Engineering Basics',
    resource: 'Story-driven Course',
    contentId: 'step-2',
    flag: 'technicalError',
    text: 'Image of Dr. Puck not loading correctly on Safari.',
    timestamp: '2026-01-26 11:30',
    university: 'University of Heidelberg',
  },
];

const flagLabels: Record<string, { label: string; color: string; icon: string }> = {
  technicalError: { label: 'Technical Error', color: 'red', icon: '🔧' },
  falseInformation: { label: 'False Information', color: 'orange', icon: '❌' },
  generalFeedback: { label: 'General Feedback', color: 'blue', icon: '💬' },
};

interface AdminPanelProps {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'feedback' | 'create' | 'publish'>('feedback');
  const [filterFlag, setFilterFlag] = useState<string | null>(null);
  const [filterObjective, setFilterObjective] = useState<string | null>(null);
  const [filterUniversity, setFilterUniversity] = useState<string | null>(null);

  const uniqueObjectives = [...new Set(mockFeedbackData.map(f => f.learningObjective))];
  const uniqueUniversities = [...new Set(mockFeedbackData.map(f => f.university))];

  const filteredData = mockFeedbackData.filter(entry => {
    if (filterFlag && entry.flag !== filterFlag) return false;
    if (filterObjective && entry.learningObjective !== filterObjective) return false;
    if (filterUniversity && entry.university !== filterUniversity) return false;
    return true;
  });

  const handleContentIdClick = (entry: FeedbackEntry) => {
    // Build URL with parameters for editing mode
    const params = new URLSearchParams({
      mode: 'edit',
      step: entry.contentId,
      highlight: entry.contentId,
      feedbackId: entry.id,
    });
    
    // Map learning objectives to node IDs
    const objectiveToNodeId: Record<string, string> = {
      'Understanding How AI Produces Text': 'ai-text-generation',
      'AI Ethics Fundamentals': 'ai-ethics',
      'Prompt Engineering Basics': 'prompt-basics',
    };
    
    const nodeId = objectiveToNodeId[entry.learningObjective] || 'ai-text-generation';
    const url = `/?goal=${nodeId}&${params.toString()}`;
    
    // Open in new tab
    window.open(url, '_blank');
  };

  const tabs = [
    { id: 'feedback', label: 'Look at Feedback', icon: '📋' },
    { id: 'create', label: 'Create Content', icon: '✏️' },
    { id: 'publish', label: 'Publish Content', icon: '📤' },
  ] as const;

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Admin Control Panel
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-b-2 border-blue-500'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Filter by Flag
                </label>
                <select
                  value={filterFlag || ''}
                  onChange={e => setFilterFlag(e.target.value || null)}
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Flags</option>
                  <option value="technicalError">🔧 Technical Error</option>
                  <option value="falseInformation">❌ False Information</option>
                  <option value="generalFeedback">💬 General Feedback</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Filter by Learning Objective
                </label>
                <select
                  value={filterObjective || ''}
                  onChange={e => setFilterObjective(e.target.value || null)}
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Objectives</option>
                  {uniqueObjectives.map(obj => (
                    <option key={obj} value={obj}>{obj}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Filter by University
                </label>
                <select
                  value={filterUniversity || ''}
                  onChange={e => setFilterUniversity(e.target.value || null)}
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Universities</option>
                  {uniqueUniversities.map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredData.length} entries
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        University
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Learning Objective
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Resource
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Content ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Flag
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Feedback Text
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredData.map(entry => {
                      const flagInfo = flagLabels[entry.flag];
                      return (
                        <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {entry.university}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {entry.learningObjective}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {entry.resource}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleContentIdClick(entry)}
                              className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300"
                              title="Open in editing mode (new tab)"
                            >
                              {entry.contentId}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                              flagInfo.color === 'red'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                : flagInfo.color === 'orange'
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              <span>{flagInfo.icon}</span>
                              {flagInfo.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-md">
                            <p className="line-clamp-2">{entry.text}</p>
                            <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
                              {entry.timestamp}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-3xl">✏️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Create Content
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Coming Soon
              </p>
            </div>
          </div>
        )}

        {activeTab === 'publish' && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-3xl">📤</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Publish Content to Group
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Coming Soon
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
