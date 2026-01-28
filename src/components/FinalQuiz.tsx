'use client';

import { useState } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface FinalQuizProps {
  onComplete: (finalScore: number) => void;
}

export default function FinalQuiz({ onComplete }: FinalQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([]);

  const questions: QuizQuestion[] = [
    {
      question: "What is a token in the context of AI language models?",
      options: [
        "A small piece of text that the AI processes",
        "A type of computer memory",
        "A programming language",
        "A database entry"
      ],
      correctAnswer: 0
    },
    {
      question: "How does an AI model choose the next token?",
      options: [
        "It always picks the most common word",
        "It randomly selects from all possible words",
        "It calculates probabilities and selects based on likelihood",
        "It copies from a database of sentences"
      ],
      correctAnswer: 2
    },
    {
      question: "Can neutral tokens lead to different tones in a sentence?",
      options: [
        "No, neutral tokens always stay neutral",
        "Yes, depending on the tokens that follow",
        "Only in formal writing",
        "Tone is not affected by token choice"
      ],
      correctAnswer: 1
    }
  ];

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowFeedback(true);
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    setCorrectAnswers(prev => [...prev, isCorrect]);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Calculate final score from all answers
      const finalScore = correctAnswers.filter(Boolean).length;
      onComplete(finalScore);
    }
  };
  
  const score = correctAnswers.filter(Boolean).length;

  const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Final Quiz
          </h2>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {questions[currentQuestion].question}
        </h3>

        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showFeedback}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedAnswer === index
                  ? showFeedback
                    ? isCorrect
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                  : showFeedback && index === questions[currentQuestion].correctAnswer
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                  : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300'
              } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">{option}</span>
                {showFeedback && (
                  <>
                    {selectedAnswer === index && isCorrect && (
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {selectedAnswer === index && !isCorrect && (
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {index === questions[currentQuestion].correctAnswer && selectedAnswer !== index && (
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {showFeedback && (
        <div className={`p-4 rounded-lg mb-6 ${
          isCorrect
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <p className={`font-medium ${
            isCorrect ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'
          }`}>
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}
