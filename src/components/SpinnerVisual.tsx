'use client';

import { useState } from 'react';

export default function SpinnerVisual() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);

  // Sections with tokens and probabilities
  const sections = [
    { token: 'I', probability: 0.50, color: '#3B82F6', label: '50%' },
    { token: 'really', probability: 0.30, color: '#8B5CF6', label: '30%' },
    { token: 'was', probability: 0.15, color: '#EC4899', label: '15%' },
    { token: 'must', probability: 0.05, color: '#F59E0B', label: '5%' },
  ];

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

  const handleSpin = () => {
    if (isSpinning) return;
    
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
          break;
        }
      }
      setIsSpinning(false);
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">
        Probability Distribution as Spinning Wheel
      </h3>
      
      <div className="relative w-72 h-72 mx-auto mb-4" style={{ padding: '10px' }}>
        {/* Fixed pointer at top */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
          <svg viewBox="0 0 20 25" className="w-8 h-10">
            <polygon
              points="10,0 5,20 15,20"
              fill="#EF4444"
            />
          </svg>
        </div>
        
        {/* Spinning wheel */}
        <div
          className="cursor-pointer transition-transform duration-2000 ease-out"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center',
          }}
          onClick={handleSpin}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full" style={{ overflow: 'visible', display: 'block' }}>
            {sectionAngles.map((section, index) => {
              const start = angleToPoint(section.startAngle);
              const end = angleToPoint(section.endAngle);
              const largeArc = section.probability > 0.5 ? 1 : 0;
              const fontSize = getFontSize(section.token, section.probability);
              
              return (
                <g key={index}>
                  <path
                    d={`M 100,100 L ${start.x},${start.y} A 100,100 0 ${largeArc},1 ${end.x},${end.y} Z`}
                    fill={section.color}
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
        </div>
      </div>
      
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="w-full px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>
      
      {selectedSection !== null && (
        <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Selected: <span className="font-semibold">{sections[selectedSection].token}</span>
          </p>
        </div>
      )}
    </div>
  );
}
