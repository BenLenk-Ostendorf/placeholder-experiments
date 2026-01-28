'use client';

export default function TokenVisual() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">
        Example: "Hello world" as tokens
      </h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {['Hello', ' world', '!'].map((token, idx) => (
          <div
            key={idx}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-mono text-sm font-semibold shadow-sm"
          >
            {token}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
        Each colored box is a token
      </p>
    </div>
  );
}
