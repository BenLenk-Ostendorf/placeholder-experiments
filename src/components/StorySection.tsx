'use client';

import Image from 'next/image';
import { GlossaryText } from './Glossary';
import { getFace } from '@/config/faceConfig';

interface StorySectionProps {
  imageSide: 'left' | 'right';
  text: string;
  faceId?: string; // e.g., "spezi_confused", "puck_tea"
  // Legacy props (used if faceId not provided)
  imageAlt?: string;
  characterName?: string;
  imagePath?: string;
  imageSize?: number;
  imageScale?: number;
  imagePositionX?: number;
  imagePositionY?: number;
  imageObjectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  // Other props
  onClick?: () => void;
  onGlossaryTermClick?: (term: string) => void;
}

export default function StorySection({ 
  imageSide, 
  text, 
  faceId,
  imageAlt: legacyImageAlt,
  characterName: legacyCharacterName, 
  imagePath: legacyImagePath, 
  onClick,
  onGlossaryTermClick,
  imageSize: legacyImageSize = 96,
  imageScale: legacyImageScale = 1.0,
  imagePositionX: legacyImagePositionX = 50,
  imagePositionY: legacyImagePositionY = 50,
  imageObjectFit: legacyImageObjectFit = 'cover'
}: StorySectionProps) {
  // Use faceId config if provided, otherwise fall back to legacy props
  const faceConfig = faceId ? getFace(faceId) : undefined;
  
  const characterName = faceConfig?.characterName ?? legacyCharacterName;
  const imagePath = faceConfig?.imagePath ?? legacyImagePath;
  const imageAlt = faceConfig?.alt ?? legacyImageAlt ?? '';
  const imageSize = faceConfig?.imageSize ?? legacyImageSize;
  const imageScale = faceConfig?.imageScale ?? legacyImageScale;
  const imagePositionX = faceConfig?.imagePositionX ?? legacyImagePositionX;
  const imagePositionY = faceConfig?.imagePositionY ?? legacyImagePositionY;
  const imageObjectFit = faceConfig?.imageObjectFit ?? legacyImageObjectFit;
  const containerSize = imageSize;
  const objectPosition = `${imagePositionX}% ${imagePositionY}%`;
  
  return (
    <div 
      className={`flex ${imageSide === 'right' ? 'flex-row-reverse' : 'flex-row'} gap-6 items-start my-8 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Image */}
      <div className="flex-shrink-0">
        {imagePath ? (
          <div 
            className="rounded-full overflow-hidden shadow-lg bg-white"
            style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
          >
            <div style={{ 
              width: '100%', 
              height: '100%', 
              transform: `scale(${imageScale})`,
              transformOrigin: `${imagePositionX}% ${imagePositionY}%`
            }}>
              <Image
                src={imagePath}
                alt={imageAlt}
                width={containerSize}
                height={containerSize}
                quality={100}
                priority
                className="w-full h-full"
                style={{ 
                  objectFit: imageObjectFit,
                  objectPosition: objectPosition,
                  imageRendering: 'crisp-edges'
                }}
                unoptimized
              />
            </div>
          </div>
        ) : (
          <div 
            className="bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm"
            style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
          >
            <svg className="w-12 h-12 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
        {characterName && (
          <p className="text-xs text-center mt-2 font-medium text-gray-600 dark:text-gray-400">
            {characterName}
          </p>
        )}
      </div>

      {/* Text Content */}
      <div className={`flex-1 ${imageSide === 'left' ? 'text-left' : 'text-right'}`}>
        <div className={`relative inline-block max-w-2xl p-4 rounded-2xl ${
          imageSide === 'left' 
            ? 'bg-gray-100 dark:bg-gray-700 rounded-tl-none' 
            : 'bg-blue-100 dark:bg-blue-900/30 rounded-tr-none'
        } ${onClick ? 'hover:shadow-lg transition-shadow' : ''}`}>
          <p className="text-base leading-relaxed text-gray-900 dark:text-white">
            {onGlossaryTermClick ? (
              <GlossaryText text={text} onTermClick={onGlossaryTermClick} />
            ) : (
              text
            )}
          </p>
          {/* Clickable indicator */}
          {onClick && (
            <div className={`absolute ${imageSide === 'left' ? 'right-2' : 'left-2'} -bottom-3`}>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-white rounded-full shadow-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-xs font-medium">Click to continue</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
