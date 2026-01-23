'use client';

interface StorySectionProps {
  imageSide: 'left' | 'right';
  imageAlt: string;
  text: string;
  characterName?: string;
  onClick?: () => void;
}

export default function StorySection({ imageSide, imageAlt, text, characterName, onClick }: StorySectionProps) {
  return (
    <div 
      className={`flex ${imageSide === 'right' ? 'flex-row-reverse' : 'flex-row'} gap-6 items-start my-8 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Image Placeholder */}
      <div className="flex-shrink-0">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        {characterName && (
          <p className="text-xs text-center mt-2 font-medium text-gray-600 dark:text-gray-400">
            {characterName}
          </p>
        )}
      </div>

      {/* Text Content */}
      <div className={`flex-1 ${imageSide === 'left' ? 'text-left' : 'text-right'}`}>
        <div className={`inline-block max-w-2xl p-4 rounded-2xl ${
          imageSide === 'left' 
            ? 'bg-gray-100 dark:bg-gray-700 rounded-tl-none' 
            : 'bg-blue-100 dark:bg-blue-900/30 rounded-tr-none'
        }`}>
          <p className="text-base leading-relaxed text-gray-900 dark:text-white">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
