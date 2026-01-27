'use client';

import { useState, useMemo } from 'react';
import tokenTreeData from '@/data/token-tree.json';
import SpinnerWheel from '@/components/SpinnerWheel';

interface TokenOption {
  token: string;
  probability: number;
  tone?: 'nice' | 'passive-aggressive' | 'neutral';
  options?: TokenOption[];
  final?: string;
}

interface TokenTree {
  prompt: string;
  options: TokenOption[];
}

export default function TokenSimulator() {
  const [level1Selection, setLevel1Selection] = useState<TokenOption | null>(null);
  const [level2Selection, setLevel2Selection] = useState<TokenOption | null>(null);
  const [level3Selection, setLevel3Selection] = useState<TokenOption | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const tree = tokenTreeData as TokenTree;

  const handleLevel1Select = (option: TokenOption) => {
    setLevel1Selection(option);
    setLevel2Selection(null);
    setLevel3Selection(null);
    setIsComplete(false);
  };

  const handleLevel2Select = (option: TokenOption) => {
    setLevel2Selection(option);
    setLevel3Selection(null);
    setIsComplete(false);
  };

  const handleLevel3Select = (option: TokenOption) => {
    setLevel3Selection(option);
    setIsComplete(true);
  };

  const handleReset = () => {
    setLevel1Selection(null);
    setLevel2Selection(null);
    setLevel3Selection(null);
    setIsComplete(false);
  };

  const getGeneratedText = () => {
    const prompt = tree.prompt;
    const token1 = level1Selection?.token || '___';
    const token2 = level2Selection?.token || '___';
    const token3 = level3Selection?.token || '___';
    const final = level3Selection?.final || '...';
    
    return `${prompt} ${token1} ${token2} ${token3} ${final}`;
  };

  const getFinalTone = () => {
    return level3Selection?.tone;
  };

  const getToneColor = (tone?: string) => {
    switch (tone) {
      case 'nice':
        return 'from-green-500 to-emerald-600';
      case 'passive-aggressive':
        return 'from-rose-500 to-red-600';
      case 'neutral':
        return 'from-gray-400 to-gray-500';
      default:
        return 'from-gray-300 to-gray-400';
    }
  };

  const getToneBgColor = (tone?: string) => {
    switch (tone) {
      case 'nice':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'passive-aggressive':
        return 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800';
      case 'neutral':
        return 'bg-gray-50 dark:bg-gray-700/20 border-gray-200 dark:border-gray-600';
      default:
        return 'bg-gray-50 dark:bg-gray-700/20 border-gray-200 dark:border-gray-600';
    }
  };

  const getToneTextColor = (tone?: string) => {
    switch (tone) {
      case 'nice':
        return 'text-green-700 dark:text-green-300';
      case 'passive-aggressive':
        return 'text-rose-700 dark:text-rose-300';
      case 'neutral':
        return 'text-gray-700 dark:text-gray-300';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  // Generate colors for spinner sections
  const generateColors = (count: number): string[] => {
    const colors = [
      '#3B82F6', // blue
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#F59E0B', // amber
      '#10B981', // emerald
      '#EF4444', // red
      '#06B6D4', // cyan
      '#84CC16', // lime
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  };

  // Convert token options to spinner sections
  const level1Sections = useMemo(() => {
    const colors = generateColors(tree.options.length);
    return tree.options.map((option, idx) => ({
      token: option.token,
      probability: option.probability,
      color: colors[idx],
      label: `${(option.probability * 100).toFixed(0)}%`,
    }));
  }, []);

  const level2Sections = useMemo(() => {
    if (!level1Selection?.options) return [];
    const colors = generateColors(level1Selection.options.length);
    return level1Selection.options.map((option, idx) => ({
      token: option.token,
      probability: option.probability,
      color: colors[idx],
      label: `${(option.probability * 100).toFixed(0)}%`,
    }));
  }, [level1Selection]);

  const level3Sections = useMemo(() => {
    if (!level2Selection?.options) return [];
    const colors = generateColors(level2Selection.options.length);
    return level2Selection.options.map((option, idx) => ({
      token: option.token,
      probability: option.probability,
      color: colors[idx],
      label: `${(option.probability * 100).toFixed(0)}%`,
    }));
  }, [level2Selection]);

  const handleLevel1SpinnerSelect = (section: { token: string; probability: number; color: string; label: string }) => {
    const option = tree.options.find(opt => opt.token === section.token);
    if (option) {
      handleLevel1Select(option);
    }
  };

  const handleLevel2SpinnerSelect = (section: { token: string; probability: number; color: string; label: string }) => {
    const option = level1Selection?.options?.find(opt => opt.token === section.token);
    if (option) {
      handleLevel2Select(option);
    }
  };

  const handleLevel3SpinnerSelect = (section: { token: string; probability: number; color: string; label: string }) => {
    const option = level2Selection?.options?.find(opt => opt.token === section.token);
    if (option) {
      handleLevel3Select(option);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Token Probability Simulator
        </h2>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Generated Email */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-xl p-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <p className="text-lg leading-relaxed text-gray-900 dark:text-white whitespace-pre-line">
            {getGeneratedText()}
          </p>
        </div>
        
        {/* Tone Rating */}
        {isComplete && (
          <div className={`mt-4 p-3 rounded-lg border ${
            getFinalTone() === 'nice'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
              : 'bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700'
          }`}>
            <p className={`text-sm font-semibold ${
              getFinalTone() === 'nice' ? 'text-green-900 dark:text-green-100' : 'text-rose-900 dark:text-rose-100'
            }`}>
              Final Tone: {getFinalTone() === 'nice' ? 'Nice & Respectful' : 'Passive-Aggressive'}
            </p>
          </div>
        )}
      </div>

      {/* Token Selection Levels - Spinner Wheels */}
      <div className="space-y-4">
        {/* Level 1 */}
        {!level1Selection && (
          <div>
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
              Spin to Choose First Token
            </h3>
            <SpinnerWheel
              sections={level1Sections}
              onSelect={handleLevel1SpinnerSelect}
              size="medium"
            />
          </div>
        )}

        {/* Level 2 */}
        {level1Selection && !level2Selection && (
          <div>
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
              Spin to Choose Second Token
            </h3>
            <SpinnerWheel
              sections={level2Sections}
              onSelect={handleLevel2SpinnerSelect}
              size="medium"
            />
          </div>
        )}

        {/* Level 3 */}
        {level2Selection && !level3Selection && (
          <div>
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
              Spin to Choose Final Token
            </h3>
            <SpinnerWheel
              sections={level3Sections}
              onSelect={handleLevel3SpinnerSelect}
              size="medium"
            />
          </div>
        )}
      </div>

      {/* Teaching Point */}
      {!isComplete && (
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-900 dark:text-blue-100">
            <strong>How it works:</strong> Spin the wheel to select tokens. Larger sections have higher probability of being selected.
          </p>
        </div>
      )}
    </div>
  );
}
