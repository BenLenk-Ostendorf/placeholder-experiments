'use client';

import { ReactNode } from 'react';

interface ExplanationSectionProps {
  title: string;
  content: string | string[]; // Can be string or array of paragraphs
  visual?: ReactNode; // Custom visual component
}

export default function ExplanationSection({ title, content, visual }: ExplanationSectionProps) {
  const paragraphs = Array.isArray(content) ? content : [content];
  
  return (
    <div className="my-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-xl">
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
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
