'use client';

interface PrerequisiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function PrerequisiteModal({ isOpen, onClose, onAccept }: PrerequisiteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Prerequisites
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Before starting, you should know:
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-md p-3 mb-4">
          <ul className="space-y-1">
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                What a <strong>Token</strong> is in language models
              </span>
            </li>
          </ul>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={onAccept}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            I Understand
          </button>
        </div>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
          We'll explain as we go!
        </p>
      </div>
    </div>
  );
}
