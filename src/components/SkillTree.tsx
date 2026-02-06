'use client';

import { useState, useMemo } from 'react';
import { 
  getLearningGoals, 
  getCertificates,
  type SkillNode,
  type Certificate 
} from '@/services/learningGoalsService';
import FinalQuiz from '@/components/FinalQuiz';

// Export types for use in other components
export type { SkillNode, Certificate };

// Load data from service
export const skillTreeNodes: SkillNode[] = getLearningGoals();
export const certificates: Certificate[] = getCertificates();

interface SkillTreeProps {
  completedNodes: string[];
  onStartGoal: (nodeId: string) => void;
  onChallengeGoal: (nodeId: string) => void;
  debugMode: boolean;
  testingMode?: boolean;
  onToggleNodeComplete: (nodeId: string) => void;
  selectedCertificate: string | null;
  onSelectCertificate: (certId: string | null) => void;
  showCertificateSelection: boolean;
  onCloseCertificateSelection: () => void;
}

export default function SkillTree({ 
  completedNodes, 
  onStartGoal, 
  onChallengeGoal,
  debugMode, 
  testingMode = false,
  onToggleNodeComplete,
  selectedCertificate,
  onSelectCertificate,
  showCertificateSelection,
  onCloseCertificateSelection,
}: SkillTreeProps) {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [challengeNode, setChallengeNode] = useState<SkillNode | null>(null);

  // Calculate which nodes are accessible (all prerequisites completed)
  const accessibleNodes = useMemo(() => {
    return skillTreeNodes.filter(node => 
      node.prerequisites.every(prereq => completedNodes.includes(prereq))
    ).map(n => n.id);
  }, [completedNodes]);

  // Calculate the path to certificate goals (all nodes needed to reach the certificate goals)
  const certificatePath = useMemo(() => {
    if (!selectedCertificate) return new Set<string>();
    
    const cert = certificates.find(c => c.id === selectedCertificate);
    if (!cert) return new Set<string>();
    
    const pathNodes = new Set<string>();
    
    // Recursively find all prerequisites for a node
    const addNodeAndPrereqs = (nodeId: string) => {
      if (pathNodes.has(nodeId)) return;
      pathNodes.add(nodeId);
      
      const node = skillTreeNodes.find(n => n.id === nodeId);
      if (node) {
        node.prerequisites.forEach(prereq => addNodeAndPrereqs(prereq));
      }
    };
    
    // Add all required goals and their prerequisites
    cert.requiredGoals.forEach(goalId => addNodeAndPrereqs(goalId));
    
    return pathNodes;
  }, [selectedCertificate]);

  // Get current certificate info
  const currentCertificate = useMemo(() => {
    return certificates.find(c => c.id === selectedCertificate) || null;
  }, [selectedCertificate]);

  // Calculate the "dead end" goals for the certificate - goals that are required 
  // and don't have any other required goals depending on them
  const certificateEndGoals = useMemo(() => {
    if (!currentCertificate) return new Set<string>();
    
    const endGoals = new Set<string>();
    const requiredGoals = new Set(currentCertificate.requiredGoals);
    
    // For each required goal, check if any other required goal has it as a prerequisite
    currentCertificate.requiredGoals.forEach(goalId => {
      const isPrereqForOtherRequired = skillTreeNodes.some(node => 
        requiredGoals.has(node.id) && 
        node.id !== goalId && 
        node.prerequisites.includes(goalId)
      );
      
      // Also check if any node in the certificate PATH (not just required) depends on this goal
      const isPrereqInPath = skillTreeNodes.some(node =>
        certificatePath.has(node.id) &&
        node.id !== goalId &&
        node.prerequisites.includes(goalId)
      );
      
      // It's an end goal if nothing in the path depends on it
      if (!isPrereqInPath) {
        endGoals.add(goalId);
      }
    });
    
    return endGoals;
  }, [currentCertificate, certificatePath]);

  // Calculate node positions for visualization
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number; level: number }> = {};
    
    // Calculate level for each node (longest path from start)
    const calculateLevel = (nodeId: string, visited: Set<string> = new Set()): number => {
      if (visited.has(nodeId)) return 0;
      visited.add(nodeId);
      
      const node = skillTreeNodes.find(n => n.id === nodeId);
      if (!node || node.prerequisites.length === 0) return 0;
      
      return 1 + Math.max(...node.prerequisites.map(p => calculateLevel(p, visited)));
    };

    // Group nodes by level
    const levels: Record<number, string[]> = {};
    skillTreeNodes.forEach(node => {
      const level = calculateLevel(node.id);
      if (!levels[level]) levels[level] = [];
      levels[level].push(node.id);
    });

    // Card height + spacing
    const cardHeight = 140;
    const verticalSpacing = 20;
    const nodeHeight = cardHeight + verticalSpacing;
    
    // Find max nodes in any level to calculate total height
    const maxNodesInLevel = Math.max(...Object.values(levels).map(arr => arr.length));
    
    // Assign positions with proper spacing
    Object.entries(levels).forEach(([level, nodeIds]) => {
      const levelNum = parseInt(level);
      const totalInLevel = nodeIds.length;
      
      // Center the nodes vertically based on max level count
      const levelHeight = totalInLevel * nodeHeight;
      const maxHeight = maxNodesInLevel * nodeHeight;
      const startY = (maxHeight - levelHeight) / 2;
      
      nodeIds.forEach((nodeId, index) => {
        positions[nodeId] = {
          x: levelNum * 200 + 80,
          y: startY + index * nodeHeight + 20,
          level: levelNum,
        };
      });
    });

    return positions;
  }, []);

  // Find dependent nodes (nodes that require this node as a prerequisite)
  const getDependentNodes = (nodeId: string) => {
    return skillTreeNodes.filter(n => n.prerequisites.includes(nodeId));
  };

  const handleNodeClick = (node: SkillNode) => {
    const isAccessible = accessibleNodes.includes(node.id);
    if (isAccessible || debugMode || testingMode) {
      setSelectedNode(node);
    }
  };

  const handleStartGoal = () => {
    if (selectedNode) {
      onStartGoal(selectedNode.id);
      setSelectedNode(null);
    }
  };

  const handleDebugToggle = () => {
    if (selectedNode && debugMode) {
      onToggleNodeComplete(selectedNode.id);
      setSelectedNode(null);
    }
  };

  // Get max level for SVG width and calculate height
  const maxLevel = Math.max(...Object.values(nodePositions).map(p => p.level));
  const svgWidth = (maxLevel + 1) * 200 + 200;
  const maxY = Math.max(...Object.values(nodePositions).map(p => p.y));
  const svgHeight = maxY + 180; // Add space for card height + padding

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 overflow-auto flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Learning Path</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {currentCertificate 
              ? `Working towards: ${currentCertificate.icon} ${currentCertificate.title}`
              : 'Complete goals from left to right to unlock new topics'
            }
          </p>
        </div>
        <button
          onClick={() => onSelectCertificate(null)}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
        >
          Change Learning Path
        </button>
      </div>

      {/* Skill Tree Container */}
      <div className="p-8 overflow-auto flex-1">
        <div className="relative min-w-fit mx-auto" style={{ width: `${svgWidth}px`, height: `${svgHeight}px` }}>
          {/* Connection Lines SVG */}
          <svg 
            width={svgWidth} 
            height={svgHeight} 
            className="absolute inset-0 pointer-events-none"
          >
            {skillTreeNodes.map(node => 
              node.prerequisites.map(prereqId => {
                const from = nodePositions[prereqId];
                const to = nodePositions[node.id];
                if (!from || !to) return null;
                
                const isActive = completedNodes.includes(prereqId);
                const isOnCertPath = certificatePath.has(prereqId) && certificatePath.has(node.id);
                
                // Create curved path - connect from right side of card to left side
                const fromX = from.x + 70;
                const fromY = from.y + 70;
                const toX = to.x - 70;
                const toY = to.y + 70;
                const midX = (fromX + toX) / 2;
                
                const path = `M ${fromX} ${fromY} 
                             C ${midX} ${fromY}, 
                               ${midX} ${toY}, 
                               ${toX} ${toY}`;
                
                // Determine line color: gold for cert path, blue for active, gray for inactive
                let strokeColor = '#e5e7eb';
                if (isOnCertPath) {
                  strokeColor = isActive ? '#f59e0b' : '#fcd34d'; // amber-500 or amber-300
                } else if (isActive) {
                  strokeColor = '#3b82f6';
                }
                
                return (
                  <g key={`${prereqId}-${node.id}`}>
                    <path
                      d={path}
                      stroke={strokeColor}
                      strokeWidth={isOnCertPath ? '4' : '3'}
                      fill="none"
                      strokeDasharray={isActive ? '0' : '8,4'}
                      className="transition-all duration-300"
                    />
                    <circle
                      cx={toX}
                      cy={toY}
                      r={isOnCertPath ? '5' : '4'}
                      fill={strokeColor}
                    />
                  </g>
                );
              })
            )}
          </svg>

          {/* Node Cards */}
          {skillTreeNodes.map(node => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const isCompleted = completedNodes.includes(node.id);
            const isAccessible = accessibleNodes.includes(node.id);
            const isLocked = !isAccessible && !debugMode && !testingMode;
            const isCertEndGoal = certificateEndGoals.has(node.id);

            return (
              <div
                key={node.id}
                onClick={() => handleNodeClick(node)}
                className={`absolute cursor-pointer transition-all duration-200 ${
                  isLocked ? 'opacity-60' : 'hover:scale-105 hover:shadow-lg'
                }`}
                style={{
                  left: `${pos.x - 70}px`,
                  top: `${pos.y}px`,
                  width: '140px',
                }}
              >
                <div className={`rounded-xl p-4 border-2 transition-all ${
                  isCertEndGoal && !isCompleted
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-400 dark:border-amber-500 ring-2 ring-amber-300 dark:ring-amber-600'
                    : isCompleted 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600' 
                    : isAccessible 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600 shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                }`}>
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    isCompleted 
                      ? 'bg-green-500' 
                      : isAccessible 
                      ? 'bg-blue-500' 
                      : 'bg-gray-400'
                  }`}>
                    {isCompleted ? (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isLocked ? (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h3 className={`text-xs font-semibold text-center leading-tight ${
                    isCompleted 
                      ? 'text-green-700 dark:text-green-300' 
                      : isAccessible 
                      ? 'text-blue-700 dark:text-blue-300' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {node.title}
                  </h3>
                  
                  {/* Status badge */}
                  <div className="mt-2 text-center">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      isCompleted 
                        ? 'bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-200' 
                        : isAccessible 
                        ? 'bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {isCompleted ? 'Complete' : isAccessible ? 'Available' : 'Locked'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goal Preview Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-5 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                completedNodes.includes(selectedNode.id) 
                  ? 'bg-green-100 dark:bg-green-900/30' 
                  : accessibleNodes.includes(selectedNode.id)
                  ? 'bg-blue-100 dark:bg-blue-900/30'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                {completedNodes.includes(selectedNode.id) ? (
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedNode.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedNode.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-3 mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {selectedNode.hint}
              </p>
            </div>

            {!selectedNode.hasContent && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 mb-4">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  This learning goal is coming soon!
                </p>
              </div>
            )}

            {selectedNode.prerequisites.length > 0 && !accessibleNodes.includes(selectedNode.id) && (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3 mb-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Prerequisites:</p>
                <ul className="space-y-1">
                  {selectedNode.prerequisites.map(prereqId => {
                    const prereq = skillTreeNodes.find(n => n.id === prereqId);
                    const isComplete = completedNodes.includes(prereqId);
                    return (
                      <li key={prereqId} className="flex items-center gap-2 text-sm">
                        {isComplete ? (
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                          </svg>
                        )}
                        <span className={isComplete ? 'text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'}>
                          {prereq?.title}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Dependent Goals - shown for completed nodes */}
            {completedNodes.includes(selectedNode.id) && getDependentNodes(selectedNode.id).length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3 mb-4">
                <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-2">Unlocked goals:</p>
                <div className="space-y-1">
                  {getDependentNodes(selectedNode.id).map(dep => {
                    const depAccessible = accessibleNodes.includes(dep.id);
                    const depCompleted = completedNodes.includes(dep.id);
                    return (
                      <button
                        key={dep.id}
                        onClick={() => {
                          setSelectedNode(dep);
                        }}
                        className="flex items-center gap-2 text-sm w-full text-left hover:bg-green-100 dark:hover:bg-green-900/30 rounded px-2 py-1 transition-colors"
                      >
                        {depCompleted ? (
                          <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : depAccessible ? (
                          <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                        <span className={depCompleted ? 'text-green-600 dark:text-green-400' : depAccessible ? 'text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-500 dark:text-gray-400'}>
                          {dep.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Learning Nugget Options */}
            {(accessibleNodes.includes(selectedNode.id) || debugMode || testingMode) && !completedNodes.includes(selectedNode.id) && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Choose your learning nugget:</p>
                <div className="space-y-2">
                  {/* Story-driven Course */}
                  <button
                    onClick={selectedNode.hasContent ? handleStartGoal : undefined}
                    disabled={!selectedNode.hasContent}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ${
                      selectedNode.hasContent
                        ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedNode.hasContent ? 'bg-blue-500' : 'bg-gray-400'
                    }`}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${selectedNode.hasContent ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                          Story-driven Course
                        </span>
                        {selectedNode.hasContent && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                            Available
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Learn through an interactive dialogue with Spezi & Dr. Puck
                      </p>
                    </div>
                  </button>

                  {/* explAIner - External Tool */}
                  <div className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-400">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">explAIner</span>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Interactive AI-powered explanation tool
                      </p>
                    </div>
                  </div>

                  {/* Video Course with Quiz */}
                  <div className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-400">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">Video Course + Quiz</span>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Watch video lessons and test your knowledge
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Challenge for Credit - Separate Special Section */}
            {(accessibleNodes.includes(selectedNode.id) || debugMode || testingMode) && !completedNodes.includes(selectedNode.id) && (
              <div className="mb-4">
                {/* Divider with text */}
                <div className="relative flex items-center my-4">
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                  <span className="flex-shrink mx-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">or</span>
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                </div>

                <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Skip ahead if you already know this:
                </p>
                
                <button
                  onClick={() => {
                    if (selectedNode.hasContent) {
                      setChallengeNode(selectedNode);
                      setSelectedNode(null);
                    }
                  }}
                  disabled={!selectedNode.hasContent}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                    selectedNode.hasContent
                      ? 'border-amber-400 dark:border-amber-500 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/20 hover:from-amber-100 hover:to-yellow-100 dark:hover:from-amber-900/40 dark:hover:to-yellow-900/30 cursor-pointer shadow-sm hover:shadow-md'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                    selectedNode.hasContent ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'bg-gray-400'
                  }`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-base font-semibold ${
                        selectedNode.hasContent ? 'text-gray-900 dark:text-white' : 'text-gray-500'
                      }`}>
                        Challenge for Credit
                      </span>
                      {selectedNode.hasContent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 rounded-full uppercase tracking-wide">
                          Test Out
                        </span>
                      )}
                    </div>
                    <p className={`text-xs ${
                      selectedNode.hasContent ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      Already know this? Take the quiz to earn credit directly
                    </p>
                  </div>
                  {selectedNode.hasContent && (
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedNode(null)}
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              
              {(debugMode || testingMode) && (
                <button
                  onClick={() => {
                    if (selectedNode) {
                      onToggleNodeComplete(selectedNode.id);
                      setSelectedNode(null);
                    }
                  }}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    completedNodes.includes(selectedNode.id)
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {completedNodes.includes(selectedNode.id) ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Certificate Selection Modal */}
      {showCertificateSelection && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onCloseCertificateSelection}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full p-6 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="text-center flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Choose Your Learning Path
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Select a certificate to work towards, or explore freely at your own pace
                </p>
              </div>
              <button
                onClick={onCloseCertificateSelection}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Certificate Options */}
            <div className="grid gap-4 mb-6">
              {certificates.map(cert => {
                const completedGoals = cert.requiredGoals.filter(g => completedNodes.includes(g)).length;
                const totalGoals = cert.requiredGoals.length;
                const progress = Math.round((completedGoals / totalGoals) * 100);
                
                return (
                  <button
                    key={cert.id}
                    onClick={() => {
                      onSelectCertificate(cert.id);
                      onCloseCertificateSelection();
                    }}
                    className={`text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                      selectedCertificate === cert.id
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{cert.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {cert.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {cert.description}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {completedGoals}/{totalGoals} goals
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Free Exploration Option */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                onClick={() => {
                  onSelectCertificate(null);
                  onCloseCertificateSelection();
                }}
                className="w-full p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-center hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
              >
                <div className="text-2xl mb-2">🗺️</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Free Exploration
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Learn at your own pace without a specific goal
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Challenge Quiz Modal */}
      {challengeNode && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setChallengeNode(null)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full p-6 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 rounded-full uppercase tracking-wide">
                    Challenge for Credit
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {challengeNode.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pass the quiz to earn credit without completing the course
                </p>
              </div>
              <button
                onClick={() => setChallengeNode(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <FinalQuiz
              onComplete={(score, total) => {
                if (score / total >= 0.8) {
                  onToggleNodeComplete(challengeNode.id);
                }
                setTimeout(() => {
                  setChallengeNode(null);
                }, 2000);
              }}
              challengeMode={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
