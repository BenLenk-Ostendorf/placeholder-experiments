'use client';

interface ExplanationSectionProps {
  title: string;
  content: string;
}

export default function ExplanationSection({ title, content }: ExplanationSectionProps) {
  return (
    <div className="my-8 flex gap-8 items-start bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-xl">
      {/* Image Placeholder */}
      <div className="flex-shrink-0">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
          <span className="text-blue-600 dark:text-blue-400">💡</span>
          {title}
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
