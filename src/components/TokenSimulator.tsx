'use client';

import { useState } from 'react';
import tokenTreeData from '@/data/token-tree.json';

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                LLM Token Probability Simulator
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                See how small token choices dramatically affect output tone
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Generated Email at Top */}
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 mb-6">
          <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Generated Email:</p>
          <p className="text-sm leading-relaxed text-gray-900 dark:text-white whitespace-pre-line">
            {getGeneratedText()}
          </p>
          
          {/* Tone Rating Right Below Email */}
          {isComplete && (
            <div className={`mt-4 p-3 rounded-lg border ${
              getFinalTone() === 'nice'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800'
            }`}>
              <div className="flex items-center gap-2">
                <svg className={`w-5 h-5 ${
                  getFinalTone() === 'nice' ? 'text-green-600 dark:text-green-400' : 'text-rose-600 dark:text-rose-400'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className={`text-sm font-medium ${
                  getFinalTone() === 'nice' ? 'text-green-900 dark:text-green-100' : 'text-rose-900 dark:text-rose-100'
                }`}>
                  Final Tone: {getFinalTone() === 'nice' ? '😊 Nice & Respectful' : '😒 Passive-Aggressive'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Token Selection Levels */}
      <div className="space-y-6 mb-6">
        {/* Probability Annotation */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Probability:</strong> The percentage and bar show how likely each token is to be selected by the AI model.
          </p>
        </div>

        {/* Level 1 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Level 1: Choose First Token
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {tree.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleLevel1Select(option)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  level1Selection?.token === option.token
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold ${level1Selection?.token === option.token ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                    {option.token}
                  </span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {(option.probability * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                    style={{ width: `${option.probability * 100}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Level 2 */}
        <div className={level1Selection ? '' : 'opacity-50 pointer-events-none'}>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Level 2: Choose Second Token
            {!level1Selection && <span className="text-gray-400 ml-2">(Select Level 1 first)</span>}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {(level1Selection?.options || []).map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleLevel2Select(option)}
                disabled={!level1Selection}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  level2Selection?.token === option.token
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold ${level2Selection?.token === option.token ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                    {option.token}
                  </span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {(option.probability * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                    style={{ width: `${option.probability * 100}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Level 3 */}
        <div className={level2Selection ? '' : 'opacity-50 pointer-events-none'}>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Level 3: Choose Final Token
            {!level2Selection && <span className="text-gray-400 ml-2">(Select Level 2 first)</span>}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {(level2Selection?.options || []).map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleLevel3Select(option)}
                disabled={!level2Selection}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  level3Selection?.token === option.token
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold ${level3Selection?.token === option.token ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                    {option.token}
                  </span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {(option.probability * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                    style={{ width: `${option.probability * 100}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tone Analysis - Only show after completion */}
      {isComplete && (
        <div className={`p-4 rounded-lg border ${
          getFinalTone() === 'nice'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex gap-3">
            <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              getFinalTone() === 'nice' ? 'text-green-600 dark:text-green-400' : 'text-rose-600 dark:text-rose-400'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className={`text-sm font-medium mb-1 ${
                getFinalTone() === 'nice' ? 'text-green-900 dark:text-green-100' : 'text-rose-900 dark:text-rose-100'
              }`}>
                Final Tone: {getFinalTone() === 'nice' ? '😊 Nice & Respectful' : '😒 Passive-Aggressive'}
              </p>
              <p className={`text-sm ${
                getFinalTone() === 'nice' ? 'text-green-800 dark:text-green-200' : 'text-rose-800 dark:text-rose-200'
              }`}>
                {getFinalTone() === 'nice'
                  ? 'Notice how neutral tokens like "certainly" or "was" can still lead to a positive outcome when followed by the right choices.'
                  : 'Even seemingly neutral tokens can branch into passive-aggressive territory. Small word choices matter!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Teaching Point */}
      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">Key Learning</p>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              This demonstrates how language models work: at each step, they choose the next token based on probabilities. Neutral tokens can branch into completely different tones depending on subsequent choices. This is why AI outputs can vary so much!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
