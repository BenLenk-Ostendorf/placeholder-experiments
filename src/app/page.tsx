'use client';

import { useState, useEffect } from 'react';
import LearningGoalsSidebar from '@/components/LearningGoalsSidebar';
import AIDialogue from '@/components/AIDialogue';
import TrustSurvey from '@/components/TrustSurvey';
import TrustAnalysis from '@/components/TrustAnalysis';
import LearningResources from '@/components/LearningResources';
import PrerequisiteModal from '@/components/PrerequisiteModal';
import TokenSimulator from '@/components/TokenSimulator';
import StorySection from '@/components/StorySection';
import ExplanationSection from '@/components/ExplanationSection';
import FinalQuiz from '@/components/FinalQuiz';
import LearningComplete from '@/components/LearningComplete';

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  category: string;
}

// Define the first learning goal
const defaultLearningGoal: LearningGoal = {
  id: '1',
  title: 'Understanding How AI Produces Text',
  description: 'Learn the fundamentals of how AI generates human-like text',
  category: 'Text Generation',
};

export default function Home() {
  const [selectedGoal, setSelectedGoal] = useState<LearningGoal | null>(null);
  const [showPrerequisiteModal, setShowPrerequisiteModal] = useState(false);
  const [learningStep, setLearningStep] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auto-select first learning goal on mount and show prerequisite modal
  useEffect(() => {
    setSelectedGoal(defaultLearningGoal);
    setShowPrerequisiteModal(true);
    setSidebarCollapsed(true); // Collapse sidebar when learning goal is selected
  }, []);

  const handleGoalSelect = (goal: LearningGoal) => {
    setSelectedGoal(goal);
    setShowPrerequisiteModal(true);
    setLearningStep(0);
    setUserRating(null);
    setQuizScore(0);
    setSidebarCollapsed(true); // Collapse sidebar when learning goal is selected
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handlePrerequisiteAccept = () => {
    setShowPrerequisiteModal(false);
    setLearningStep(1); // Start with story introduction
  };
  
  const handleContinueFromStep1 = () => {
    setLearningStep(2);
  };

  const handlePrerequisiteClose = () => {
    setShowPrerequisiteModal(false);
    setSelectedGoal(null);
  };

  const handleStoryNext = () => {
    setLearningStep(learningStep + 1);
  };

  const handleSurveySubmit = async (rating: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setUserRating(rating);
    setLearningStep(learningStep + 1); // Progress to next step
  };

  const handleQuizComplete = () => {
    setQuizScore(3); // Placeholder score
    setLearningStep(10); // Move to completion
  };

  const handleNextGoal = () => {
    // Reset for next learning goal
    setSelectedGoal(null);
    setLearningStep(0);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Collapsible Sidebar */}
      <LearningGoalsSidebar 
        onSelectGoal={handleGoalSelect}
        selectedGoalId={selectedGoal?.id}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* Prerequisite Modal */}
      <PrerequisiteModal
        isOpen={showPrerequisiteModal}
        onClose={handlePrerequisiteClose}
        onAccept={handlePrerequisiteAccept}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          {/* Learning Goal Title */}
          {selectedGoal && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {selectedGoal.title}
              </h1>
            </div>
          )}

          {/* Main Content */}
          <main className="space-y-8">
            {/* Step 1: Story Introduction Part 1 */}
            {selectedGoal && learningStep >= 1 && (
              <StorySection
                imageSide="left"
                imageAlt="Spezi"
                characterName="Spezi"
                text="ChatGPT just insulted my student! I wanted a polite rejection, and the thing writes to him that he is 'academically unsuitable'!"
                onClick={learningStep === 1 ? handleStoryNext : undefined}
              />
            )}

            {/* Step 2: Story Introduction Part 2 */}
            {selectedGoal && learningStep >= 2 && (
              <StorySection
                imageSide="right"
                imageAlt="Dr. Puck"
                characterName="Dr. Puck"
                text="(sips his Yorkshire Tea) Welllll... and you're surprised?"
                onClick={learningStep === 2 ? handleStoryNext : undefined}
              />
            )}

            {/* Step 3: Trust Survey */}
            {selectedGoal && learningStep >= 3 && (
              <StorySection
                imageSide="left"
                imageAlt="Spezi"
                characterName="Spezi"
                text="Same prompt as last week! It was perfect then!"
              />
            )}

            {selectedGoal && learningStep >= 3 && (
              <StorySection
                imageSide="right"
                imageAlt="Dr. Puck"
                characterName="Dr. Puck"
                text="Tell me – how often do you think an LLM produces the same answer for the same prompt?"
              />
            )}

            {selectedGoal && learningStep === 3 && (
              <TrustSurvey onSubmit={handleSurveySubmit} />
            )}

            {/* Show Trust Analysis after survey submission */}
            {selectedGoal && learningStep >= 4 && userRating !== null && (
              <TrustAnalysis userRating={userRating} />
            )}

            {/* Step 4: Reflection on insights - adaptive based on user rating */}
            {selectedGoal && learningStep >= 4 && userRating !== null && (
              <StorySection
                imageSide="right"
                imageAlt="Dr. Puck"
                characterName="Dr. Puck"
                text={
                  userRating >= 4
                    ? "Ah, you think LLMs are quite consistent! That's a common assumption. But here's the surprising truth - they're actually probabilistic by nature. Let me show you why..."
                    : userRating === 3
                    ? "You're uncertain about consistency? Smart! Most people don't realize that LLMs are fundamentally probabilistic. The same prompt can yield different outputs. Let me explain why..."
                    : "You suspect LLMs aren't very consistent? You're absolutely right! They're probabilistic systems, not deterministic ones. Let me show you exactly why that happens..."
                }
              />
            )}

            {/* Step 5: Continue explanation */}
            {selectedGoal && learningStep >= 5 && (
              <>
                <StorySection
                  imageSide="right"
                  imageAlt="Dr. Puck"
                  characterName="Dr. Puck"
                  text="AI text generation is based on something called 'tokens'. Each time the model generates text, it's making probabilistic choices..."
                />
                <StorySection
                  imageSide="left"
                  imageAlt="Spezi"
                  characterName="Spezi"
                  text="Tokens? What are those exactly?"
                />
              </>
            )}

            {selectedGoal && learningStep === 4 && (
              <button
                onClick={handleStoryNext}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            )}

            {selectedGoal && learningStep === 5 && (
              <button
                onClick={handleStoryNext}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            )}

            {/* Step 6: Explanation Section */}
            {selectedGoal && learningStep >= 6 && (
              <ExplanationSection
                title="Understanding Tokens"
                content="Tokens are the building blocks of AI-generated text. Think of them as small pieces of text - they could be words, parts of words, or even punctuation marks. When an AI model generates text, it doesn't write entire sentences at once. Instead, it predicts one token at a time, choosing the most likely next token based on what came before. Each token has a probability - a likelihood of being selected. The AI calculates these probabilities and makes choices, just like you're about to do in our interactive simulator!"
              />
            )}

            {selectedGoal && learningStep === 6 && (
              <button
                onClick={handleStoryNext}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try It Yourself
              </button>
            )}

            {/* Step 7: Token Simulator */}
            {selectedGoal && learningStep >= 7 && (
              <TokenSimulator />
            )}

            {selectedGoal && learningStep === 7 && (
              <button
                onClick={handleStoryNext}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mt-4"
              >
                Continue
              </button>
            )}

            {/* Step 8: Short Story Block */}
            {selectedGoal && learningStep >= 8 && (
              <>
                <StorySection
                  imageSide="right"
                  imageAlt="Dr. Puck"
                  characterName="Dr. Puck"
                  text="So, Spezi, you've just experienced how AI makes decisions token by token. Did you notice how even neutral tokens can lead to completely different tones depending on what follows?"
                />
                <StorySection
                  imageSide="left"
                  imageAlt="Spezi"
                  characterName="Spezi"
                  text="Wow! So that's why ChatGPT gave me different results with the same prompt! It's making probabilistic choices each time!"
                />
                <StorySection
                  imageSide="right"
                  imageAlt="Dr. Puck"
                  characterName="Dr. Puck"
                  text="Precisely! Now let's test your understanding with a quick quiz."
                />
              </>
            )}

            {selectedGoal && learningStep === 8 && (
              <button
                onClick={handleStoryNext}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Take the Quiz
              </button>
            )}

            {/* Step 9: Final Quiz */}
            {selectedGoal && learningStep >= 9 && learningStep < 10 && (
              <FinalQuiz onComplete={handleQuizComplete} />
            )}

            {/* Step 10: Learning Complete */}
            {selectedGoal && learningStep >= 10 && (
              <>
                <LearningComplete
                  score={quizScore}
                  totalQuestions={3}
                  onNextGoal={handleNextGoal}
                />
                
                {/* Learning Resources - Further Deep Dive */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Further Deep Dive
                  </h2>
                  <LearningResources />
                </div>
              </>
            )}
          </main>

          {/* Footer */}
          <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-500">
            <p>Built with Next.js, Tailwind CSS & Firebase</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
