'use client';

import { ReactNode } from 'react';
import { GlossaryText } from './Glossary';

interface ExplanationSectionProps {
  title: string;
  content: string | string[]; // Can be string or array of paragraphs
  visual?: ReactNode; // Custom visual component
  onGlossaryTermClick?: (term: string) => void;
}

export default function ExplanationSection({ title, content, visual, onGlossaryTermClick }: ExplanationSectionProps) {
  const paragraphs = Array.isArray(content) ? content : [content];
  
  return (
    <div className="my-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-200 dark:border-gray-700 shadow-sm">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
        <span className="text-blue-600 dark:text-blue-400">💡</span>
        {title}
      </h2>
      
      <div className="flex gap-8 items-start flex-col md:flex-row">
        {/* Visual */}
        {visual && (
          <div className="flex-shrink-0 w-full md:w-auto">
            {visual}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
              {onGlossaryTermClick ? (
                <GlossaryText text={paragraph} onTermClick={onGlossaryTermClick} />
              ) : (
                paragraph
              )}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
