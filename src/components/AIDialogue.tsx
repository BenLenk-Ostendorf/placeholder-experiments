'use client';

interface Message {
  id: number;
  speaker: 'alex' | 'sam';
  text: string;
}

const dialogue: Message[] = [
  {
    id: 1,
    speaker: 'alex',
    text: "Hey Sam! I've been learning about AI lately. Can you explain what machine learning actually is?",
  },
  {
    id: 2,
    speaker: 'sam',
    text: "Sure! Machine learning is a subset of AI where computers learn from data without being explicitly programmed. Instead of writing specific rules, we feed the system examples and it learns patterns.",
  },
  {
    id: 3,
    speaker: 'alex',
    text: "That's fascinating! So it's like teaching a child by showing examples rather than giving strict instructions?",
  },
  {
    id: 4,
    speaker: 'sam',
    text: "Exactly! For instance, instead of programming every rule for recognizing a cat, you show the system thousands of cat images and it learns the patterns that make something a cat.",
  },
  {
    id: 5,
    speaker: 'alex',
    text: "I see! And what about neural networks? I keep hearing that term everywhere.",
  },
  {
    id: 6,
    speaker: 'sam',
    text: "Neural networks are inspired by how our brains work. They consist of layers of interconnected nodes that process information. Each connection has a weight that gets adjusted during learning.",
  },
  {
    id: 7,
    speaker: 'alex',
    text: "So the AI is literally learning by adjusting these weights? That's incredible!",
  },
  {
    id: 8,
    speaker: 'sam',
    text: "Yes! Through a process called backpropagation, the network adjusts weights to minimize errors. It's like fine-tuning a musical instrument until it sounds just right.",
  },
];

export default function AIDialogue() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Learning Conversation</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Alex & Sam discuss AI concepts</p>
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {dialogue.map((message) => {
          const isAlex = message.speaker === 'alex';
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isAlex ? '' : 'flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    isAlex
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                      : 'bg-gradient-to-br from-green-500 to-emerald-500'
                  }`}
                >
                  {isAlex ? 'A' : 'S'}
                </div>
              </div>

              {/* Message Bubble */}
              <div className={`flex-1 ${isAlex ? 'mr-12' : 'ml-12'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`font-semibold text-sm ${
                      isAlex
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-green-600 dark:text-green-400'
                    }`}
                  >
                    {isAlex ? 'Alex' : 'Sam'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {isAlex ? 'Learner' : 'AI Expert'}
                  </span>
                </div>
                <div
                  className={`p-4 rounded-2xl ${
                    isAlex
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-gray-800 dark:text-gray-200 rounded-tl-none'
                      : 'bg-green-50 dark:bg-green-900/20 text-gray-800 dark:text-gray-200 rounded-tr-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area (placeholder) */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask a question about AI..."
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            disabled
          />
          <button
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Interactive chat coming soon!
        </p>
      </div>
    </div>
  );
}
