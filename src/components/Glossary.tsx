'use client';

import { useState, useEffect } from 'react';

interface GlossaryTerm {
  term: string;
  definition: string;
  simpleExplanation: string;
  keywords: string[]; // Additional keywords that should trigger this term
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'Probabilistic',
    definition: 'Involving or based on probability; subject to random variation.',
    simpleExplanation: 'Like rolling dice - you know the possible outcomes but not which one you\'ll get each time.',
    keywords: ['probabilistic', 'probability']
  },
  {
    term: 'Deterministic',
    definition: 'A system where the same input always produces the same output.',
    simpleExplanation: 'Like a calculator - 2+2 always equals 4, every single time.',
    keywords: ['deterministic']
  },
  {
    term: 'Probability Distribution',
    definition: 'A mathematical function that describes the likelihood of different outcomes.',
    simpleExplanation: 'A spinner wheel where bigger sections are more likely to be landed on than smaller ones.',
    keywords: ['probability distribution', 'distribution']
  },
  {
    term: 'Token',
    definition: 'A unit of text that AI models process, which can be a word, part of a word, or punctuation.',
    simpleExplanation: 'Small building blocks of text - like LEGO pieces that snap together to make sentences.',
    keywords: ['token', 'tokens']
  },
];

// Helper to find which glossary term matches a keyword
export function findGlossaryTerm(keyword: string): string | null {
  const lowerKeyword = keyword.toLowerCase();
  for (const term of glossaryTerms) {
    if (term.keywords.some(k => lowerKeyword.includes(k.toLowerCase()))) {
      return term.term;
    }
  }
  return null;
}

interface GlossaryProps {
  isOpen: boolean;
  onClose: () => void;
  initialTerm?: string | null;
}

export default function Glossary({ isOpen, onClose, initialTerm }: GlossaryProps) {
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  
  // Auto-expand the initial term when glossary opens
  useEffect(() => {
    if (isOpen && initialTerm) {
      setExpandedTerm(initialTerm);
    }
  }, [isOpen, initialTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Glossary</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Terms List */}
        <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
          {glossaryTerms.map((item) => (
            <div 
              key={item.term}
              className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedTerm(expandedTerm === item.term ? null : item.term)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="font-semibold text-gray-900 dark:text-white">{item.term}</span>
                <svg 
                  className={`w-5 h-5 text-gray-500 transition-transform ${expandedTerm === item.term ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedTerm === item.term && (
                <div className="px-4 pb-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Technical Definition</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item.definition}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">In Simple Terms</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">{item.simpleExplanation}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Export a button component to open the glossary
export function GlossaryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40 flex items-center gap-2"
      title="Open Glossary"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <span className="text-sm font-medium">Glossary</span>
    </button>
  );
}

// Component to render text with clickable glossary terms
interface GlossaryTextProps {
  text: string;
  onTermClick: (term: string) => void;
}

export function GlossaryText({ text, onTermClick }: GlossaryTextProps) {
  // Build a regex pattern from all keywords
  const allKeywords = glossaryTerms.flatMap(t => t.keywords);
  // Sort by length descending to match longer phrases first (e.g., "probability distribution" before "probability")
  const sortedKeywords = [...allKeywords].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`\\b(${sortedKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
  
  // Split text into parts, keeping the matched terms
  const parts: { text: string; isTerm: boolean; termName: string | null }[] = [];
  let lastIndex = 0;
  let match;
  
  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), isTerm: false, termName: null });
    }
    // Add the matched term
    const termName = findGlossaryTerm(match[0]);
    parts.push({ text: match[0], isTerm: true, termName });
    lastIndex = pattern.lastIndex;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isTerm: false, termName: null });
  }
  
  // If no terms found, just return plain text
  if (parts.length === 0) {
    return <>{text}</>;
  }
  
  return (
    <>
      {parts.map((part, index) => 
        part.isTerm && part.termName ? (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onTermClick(part.termName!);
            }}
            className="inline px-1 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-800/40 cursor-help transition-colors border-b border-blue-300 dark:border-blue-600"
          >
            {part.text}
          </button>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </>
  );
}
