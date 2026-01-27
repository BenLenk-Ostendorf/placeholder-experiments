'use client';

interface Message {
  id: number;
  speaker: 'spezi' | 'drPuck';
  text: string;
}

const dialogue: Message[] = [
  {
    id: 1,
    speaker: 'spezi',
    text: "Dr. William, I'm really confused about something. ChatGPT gave me completely different answers to the same prompt, and I used it last week and it was perfect!",
  },
  {
    id: 2,
    speaker: 'drPuck',
    text: "(sips Yorkshire Tea) NNNAAAJAAA... technically speaking, you're observing the probabilistic nature of large language models. They don't produce deterministic outputs.",
  },
  {
    id: 3,
    speaker: 'spezi',
    text: "Probabilistic? So it's like... random? But that doesn't make sense, it seems so smart!",
  },
  {
    id: 4,
    speaker: 'drPuck',
    text: "Not random – probabilistic. There's a crucial difference. Each token the model generates has a probability distribution. The model calculates likelihoods and samples from them. It's actually quite elegant mathematically...",
  },
  {
    id: 5,
    speaker: 'spezi',
    text: "Wait, tokens? What are those exactly? I keep hearing that term but... well, I should probably know this, shouldn't I?",
  },
  {
    id: 6,
    speaker: 'drPuck',
    text: "Tokens are the fundamental units of text processing. Think of them as sub-word pieces – sometimes whole words, sometimes parts. When generating text, the model predicts one token at a time, each choice influencing the next. It's sequential probability calculation.",
  },
  {
    id: 7,
    speaker: 'spezi',
    text: "So that's why the same prompt can give different results? Because it's making probability-based choices each time?",
  },
  {
    id: 8,
    speaker: 'drPuck',
    text: "Precisely! And that's why your 'perfect' prompt from last week produced different output. The model doesn't remember previous generations – each run is independent, sampling from the probability distribution at each step.",
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
          <p className="text-sm text-gray-500 dark:text-gray-400">Spezi & Dr. Puck discuss AI concepts</p>
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {dialogue.map((message) => {
          const isSpezi = message.speaker === 'spezi';
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isSpezi ? '' : 'flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    isSpezi
                      ? 'bg-gradient-to-br from-gray-700 to-gray-900'
                      : 'bg-gradient-to-br from-amber-600 to-amber-800'
                  }`}
                >
                  {isSpezi ? 'S' : 'P'}
                </div>
              </div>

              {/* Message Bubble */}
              <div className={`flex-1 ${isSpezi ? 'mr-12' : 'ml-12'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`font-semibold text-sm ${
                      isSpezi
                        ? 'text-gray-700 dark:text-gray-300'
                        : 'text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {isSpezi ? 'Spezi' : 'Dr. Puck'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {isSpezi ? 'Doktorand' : 'Postdoc'}
                  </span>
                </div>
                <div
                  className={`p-4 rounded-2xl ${
                    isSpezi
                      ? 'bg-gray-50 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200 rounded-tl-none'
                      : 'bg-amber-50 dark:bg-amber-900/20 text-gray-800 dark:text-gray-200 rounded-tr-none'
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
