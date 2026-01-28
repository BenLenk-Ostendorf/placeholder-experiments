'use client';

import { useState } from 'react';

interface SpinnerSection {
  token: string;
  probability: number;
  color: string;
  label: string;
}

interface SpinnerWheelProps {
  sections: SpinnerSection[];
  onSelect: (section: SpinnerSection) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  completed?: boolean;
  onRestart?: () => void;
  selectedToken?: string;
}

export default function SpinnerWheel({ sections, onSelect, disabled = false, size = 'medium', completed = false, onRestart, selectedToken }: SpinnerWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);

  // Helper to convert angle to point on circle
  const angleToPoint = (angleDeg: number) => {
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const x = 100 + 100 * Math.cos(angleRad);
    const y = 100 + 100 * Math.sin(angleRad);
    return { x, y };
  };

  // Calculate angles for each section
  let currentAngle = -90; // Start at top
  const sectionAngles = sections.map((section) => {
    const startAngle = currentAngle;
    const angleSpan = section.probability * 360;
    const endAngle = currentAngle + angleSpan;
    const midAngle = startAngle + angleSpan / 2;
    currentAngle = endAngle;
    return { startAngle, endAngle, midAngle, ...section };
  });

  const handleSpin = () => {
    if (isSpinning || disabled) return;
    
    setIsSpinning(true);
    setSelectedSection(null);
    
    // Random spin: 3-5 full rotations + random final position
    const spins = 3 + Math.random() * 2;
    const randomFinalAngle = Math.random() * 360;
    const totalRotation = rotation + spins * 360 + randomFinalAngle;
    
    setRotation(totalRotation);
    
    // Calculate which section was selected based on final rotation
    // In our SVG coordinate system: 0° = top, 90° = right, 180° = bottom, 270° = left
    // CSS rotate(r deg) rotates clockwise by r degrees
    // After rotation, the wheel angle at the top (where pointer is) = -r degrees
    setTimeout(() => {
      const normalizedRotation = totalRotation % 360;
      // The pointer is fixed at 0° (top). After rotating clockwise by r degrees,
      // the wheel angle now at the top is -r degrees.
      let angleAtTop = -normalizedRotation;
      
      // Normalize to the range [-90°, 270°) to match section definitions
      while (angleAtTop < -90) angleAtTop += 360;
      while (angleAtTop >= 270) angleAtTop -= 360;
      
      // Find which section contains this angle
      for (let i = 0; i < sectionAngles.length; i++) {
        const start = sectionAngles[i].startAngle;
        const end = sectionAngles[i].endAngle;
        
        if (angleAtTop >= start && angleAtTop < end) {
          setSelectedSection(i);
          onSelect(sections[i]);
          break;
        }
      }
      setIsSpinning(false);
    }, 2000);
  };

  // Calculate appropriate font size based on token length and section size
  const getFontSize = (token: string, probability: number) => {
    const tokenLength = token.length;
    const sectionAngle = probability * 360;
    
    // Base font size calculation
    let fontSize = 16;
    
    // Adjust for token length
    if (tokenLength > 10) fontSize = 10;
    else if (tokenLength > 7) fontSize = 12;
    else if (tokenLength > 4) fontSize = 14;
    
    // Adjust for section size
    if (sectionAngle < 30) fontSize = Math.min(fontSize, 10);
    else if (sectionAngle < 60) fontSize = Math.min(fontSize, 12);
    
    return fontSize;
  };

  const sizeClasses = {
    small: { container: 'w-48 h-48', svg: 'w-6 h-8' },
    medium: { container: 'w-72 h-72', svg: 'w-8 h-10' },
    large: { container: 'w-96 h-96', svg: 'w-10 h-12' },
  };

  const sizeConfig = sizeClasses[size];

  const isCompleted = completed || selectedToken !== undefined;
  const displayedToken = selectedToken || (selectedSection !== null ? sections[selectedSection].token : null);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className={`relative ${sizeConfig.container} mx-auto mb-4`} style={{ padding: '10px' }}>
        {/* Fixed pointer at top */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
          <svg viewBox="0 0 20 25" className={sizeConfig.svg}>
            <polygon
              points="10,0 5,20 15,20"
              fill={isCompleted ? '#9CA3AF' : '#EF4444'}
            />
          </svg>
        </div>
        
        {/* Spinning wheel */}
        <div
          className={`relative transition-transform duration-2000 ease-out ${disabled ? '' : 'cursor-pointer'}`}
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center',
          }}
          onClick={isCompleted && onRestart ? onRestart : (!isCompleted ? handleSpin : undefined)}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full" style={{ overflow: 'visible', display: 'block' }}>
            {sectionAngles.map((section, index) => {
              const start = angleToPoint(section.startAngle);
              const end = angleToPoint(section.endAngle);
              const largeArc = section.probability > 0.5 ? 1 : 0;
              const fontSize = getFontSize(section.token, section.probability);
              
              return (
                <g key={index} style={{ opacity: isCompleted ? 0.4 : 1 }}>
                  <path
                    d={`M 100,100 L ${start.x},${start.y} A 100,100 0 ${largeArc},1 ${end.x},${end.y} Z`}
                    fill={isCompleted ? '#9CA3AF' : section.color}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={100 + 60 * Math.cos((section.midAngle - 90) * (Math.PI / 180))}
                    y={100 + 60 * Math.sin((section.midAngle - 90) * (Math.PI / 180))}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={fontSize}
                    fontWeight="600"
                  >
                    {section.token}
                  </text>
                </g>
              );
            })}
            
            <circle cx="100" cy="100" r="22" fill="#ffffff" stroke="#374151" strokeWidth="3" className="dark:stroke-gray-400" />
          </svg>
          
          {/* Restart overlay when completed */}
          {isCompleted && onRestart && (
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={onRestart}
            >
              <div className="bg-gray-800/70 rounded-full px-4 py-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-white font-medium text-sm">Restart</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {!isCompleted && (
        <button
          onClick={handleSpin}
          disabled={isSpinning || disabled}
          className="w-full px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
        </button>
      )}
      
      {displayedToken && (
        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Selected: <span className="font-semibold">{displayedToken}</span>
          </p>
        </div>
      )}
    </div>
  );
}
