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
import TokenVisual from '@/components/TokenVisual';
import SpinnerVisual from '@/components/SpinnerVisual';
import FinalQuiz from '@/components/FinalQuiz';
import LearningComplete from '@/components/LearningComplete';
import Glossary, { GlossaryButton, GlossaryText } from '@/components/Glossary';

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
  const [showGlossary, setShowGlossary] = useState(false);
  const [glossaryTerm, setGlossaryTerm] = useState<string | null>(null);

  const openGlossaryAtTerm = (term: string) => {
    setGlossaryTerm(term);
    setShowGlossary(true);
  };

  // Auto-select first learning goal on mount and show prerequisite modal
  useEffect(() => {
    setSelectedGoal(defaultLearningGoal);
    setShowPrerequisiteModal(true);
    setSidebarCollapsed(true); // Collapse sidebar when learning goal is selected
  }, []);

  // Auto-scroll to bottom when learning step changes
  useEffect(() => {
    if (learningStep > 0) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        // Find the scrollable container
        const scrollContainer = document.querySelector('.flex-1.overflow-y-auto');
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 150);
    }
  }, [learningStep]);

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
    // Define explicit step transitions to ensure proper progression
    const currentStep = learningStep;
    
    if (currentStep === 1) setLearningStep(2);
    else if (currentStep === 2) setLearningStep(3);
    else if (currentStep === 3) setLearningStep(3.1);
    else if (currentStep === 3.1) setLearningStep(3.2);
    else if (currentStep === 4) setLearningStep(4.1);
    else if (currentStep === 4.1) setLearningStep(5);
    else if (currentStep === 5) setLearningStep(5.1);
    else if (currentStep === 5.1) setLearningStep(6);
    else if (currentStep === 6) setLearningStep(6.1);
    else if (currentStep === 6.1) setLearningStep(7);
    else if (currentStep === 7) setLearningStep(7.1);
    else if (currentStep === 7.1) setLearningStep(7.2);
    else if (currentStep === 7.5) setLearningStep(8);
    else if (currentStep === 8) setLearningStep(8.1);
    else if (currentStep === 8.1) setLearningStep(8.2);
    else if (currentStep === 8.2) setLearningStep(9);
    else {
      // Fallback: increment by 0.1
      setLearningStep(Math.round((learningStep + 0.1) * 10) / 10);
    }
  };

  const handleSurveySubmit = async (rating: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setUserRating(rating);
    setLearningStep(4); // Progress to step 4 after survey
  };

  const handleQuizComplete = (finalScore: number) => {
    setQuizScore(finalScore); // Use actual quiz score
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

      {/* Glossary */}
      <Glossary 
        isOpen={showGlossary} 
        onClose={() => {
          setShowGlossary(false);
          setGlossaryTerm(null);
        }} 
        initialTerm={glossaryTerm}
      />
      <GlossaryButton onClick={() => {
        setGlossaryTerm(null);
        setShowGlossary(true);
      }} />

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
                faceId="spezi_frustrated"
                text="ChatGPT just insulted my student! I asked it to write a polite rejection email for a research position application, and the thing writes to him that he is 'academically unsuitable'! Can you believe that?"
                onClick={learningStep === 1 ? handleStoryNext : undefined}
              />
            )}

            {/* Step 2: Story Introduction Part 2 */}
            {selectedGoal && learningStep >= 2 && (
              <StorySection
                imageSide="right"
                faceId="puck_tea"
                text="(sips his Yorkshire Tea) Welllll... and you're surprised?"
                onClick={learningStep === 2 ? handleStoryNext : undefined}
              />
            )}

            {/* Step 3: Trust Survey */}
            {selectedGoal && learningStep >= 3 && (
              <StorySection
                imageSide="left"
                faceId="spezi_frustrated"
                text="Same prompt as last week! It was perfect then!"
                onClick={learningStep === 3 ? handleStoryNext : undefined}
              />
            )}

            {selectedGoal && learningStep >= 3.1 && (
              <StorySection
                imageSide="right"
                faceId="puck_asking"
                text="Tell me – how often do you think an LLM produces the same answer for the same prompt?"
                onClick={learningStep === 3.1 ? handleStoryNext : undefined}
              />
            )}

            {selectedGoal && learningStep >= 3.2 && learningStep < 4 && (
              <TrustSurvey onSubmit={handleSurveySubmit} />
            )}

            {/* Show Trust Analysis after survey submission */}
            {selectedGoal && learningStep >= 4 && userRating !== null && (
              <TrustAnalysis userRating={userRating} />
            )}

            {/* Step 4: Reflection on insights - adaptive based on user rating */}
            {selectedGoal && learningStep >= 4 && userRating !== null && (
              <StorySection
                imageSide="left"
                faceId="spezi_confused"
                text={
                  userRating >= 4
                    ? "But I thought they were consistent! The same prompt should give the same answer, right?"
                    : userRating === 3
                    ? "I'm not sure... sometimes it seems consistent, sometimes not?"
                    : "Yeah, I've noticed they're not very consistent at all."
                }
                onClick={learningStep === 4 ? handleStoryNext : undefined}
              />
            )}

            {selectedGoal && learningStep >= 4.1 && userRating !== null && (
              <StorySection
                imageSide="right"
                faceId="puck_explaining"
                text={
                  userRating >= 4
                    ? "NNNAAAJAAA... that's a common assumption! But LLMs are probabilistic - like rolling dice, not following a recipe. Let me show you why..."
                    : userRating === 3
                    ? "NNNAAAJAAA... you're right to be uncertain! LLMs are probabilistic - they involve chance. Let me show you why..."
                    : "Precisely! They're probabilistic - involving chance and randomness. Let me show you exactly why..."
                }
                onClick={learningStep === 4.1 ? handleStoryNext : undefined}
                onGlossaryTermClick={openGlossaryAtTerm}
              />
            )}

            {/* Step 5: Continue explanation - always explain tokens */}
            {selectedGoal && learningStep >= 5 && (
              <StorySection
                imageSide="right"
                faceId="puck_explaining"
                text="To understand this, we first need to talk about 'tokens'..."
                onClick={learningStep === 5 ? handleStoryNext : undefined}
                onGlossaryTermClick={openGlossaryAtTerm}
              />
            )}

            {selectedGoal && learningStep >= 5.1 && (
              <StorySection
                imageSide="left"
                faceId="spezi_confused"
                text="Tokens? Never heard of them."
                onClick={learningStep === 5.1 ? handleStoryNext : undefined}
                onGlossaryTermClick={openGlossaryAtTerm}
              />
            )}

            {/* Step 6: Token Explanation Section - always show */}
            {selectedGoal && learningStep >= 6 && (
              <ExplanationSection
                title="Understanding Tokens"
                content={[
                  "Tokens are the building blocks of AI-generated text. Think of them as small pieces of text - they could be words, parts of words, or even punctuation marks.",
                  "When an AI model generates text, it doesn't write entire sentences at once. Instead, it predicts one token at a time, choosing the most likely next token based on what came before.",
                  "Each token has a probability - a likelihood of being selected. The AI calculates these probabilities and makes choices, just like you're about to do in our interactive simulator!"
                ]}
                visual={<TokenVisual />}
                onGlossaryTermClick={openGlossaryAtTerm}
              />
            )}

            {selectedGoal && learningStep === 6 && (
              <button
                onClick={handleStoryNext}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mt-4"
              >
                Continue
              </button>
            )}

            {selectedGoal && learningStep >= 6.1 && (
              <StorySection
                imageSide="right"
                faceId="puck_asking"
                text="Now, here's the key: how does the AI choose which token comes next?"
                onClick={learningStep === 6.1 ? handleStoryNext : undefined}
                onGlossaryTermClick={openGlossaryAtTerm}
              />
            )}

            {/* Step 7: Probability Distribution Explanation - always show */}
            {selectedGoal && learningStep >= 7 && (
              <StorySection
                imageSide="left"
                faceId="spezi_confused"
                text="I assume it just picks the most likely word?"
                onClick={learningStep === 7 ? handleStoryNext : undefined}
                onGlossaryTermClick={openGlossaryAtTerm}
              />
            )}

            {selectedGoal && learningStep >= 7.1 && (
              <StorySection
                imageSide="right"
                faceId="puck_pointing"
                text="Not quite! It uses something called a probability distribution. Let me show you with a visual..."
                onClick={learningStep === 7.1 ? handleStoryNext : undefined}
                onGlossaryTermClick={openGlossaryAtTerm}
              />
            )}

            {selectedGoal && learningStep >= 7.2 && (
              <ExplanationSection
                title="Understanding Probability Distributions"
                content={[
                  "A probability distribution is just a fancy way of saying 'some options are more likely than others'. Think of a spinner wheel: if one section takes up half the wheel, it's much more likely to land there than a tiny section.",
                  "For AI text generation, each word position has its own spinner - with thousands of sections! Some words (likely ones) have big sections, others (unlikely ones) have tiny sections.",
                  "The AI 'spins the wheel' to pick each word. That's why the same prompt can give different results - each spin is random! Try spinning the wheel below to see how it works."
                ]}
                visual={<SpinnerVisual />}
                onGlossaryTermClick={openGlossaryAtTerm}
              />
            )}

            {selectedGoal && learningStep === 7.2 && (
              <button
                onClick={() => setLearningStep(7.5)}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mt-4"
              >
                Try It Yourself
              </button>
            )}

            {/* Step 7.5: Token Simulator */}
            {selectedGoal && learningStep >= 7.5 && (
              <TokenSimulator />
            )}

            {selectedGoal && learningStep === 7.5 && (
              <button
                onClick={handleStoryNext}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mt-4"
              >
                Continue
              </button>
            )}

            {/* Step 8: Short Story Block */}
            {selectedGoal && learningStep >= 8 && (
              <StorySection
                imageSide="right"
                faceId="puck_explaining"
                text="NNNAAAJAAA... technically speaking, you've just observed how the model makes sequential token predictions. Each choice influences the probability distribution of subsequent tokens - remember the spinner wheel analogy - which explains the variability in output."
                onClick={learningStep === 8 ? handleStoryNext : undefined}
              />
            )}

            {selectedGoal && learningStep >= 8.1 && (
              <StorySection
                imageSide="left"
                faceId="spezi_understanding"
                text="Oh... so that's why ChatGPT gave me different results with the same prompt. It's making probabilistic choices each time, not just picking the same thing."
                onClick={learningStep === 8.1 ? handleStoryNext : undefined}
              />
            )}

            {selectedGoal && learningStep >= 8.2 && (
              <StorySection
                imageSide="right"
                faceId="puck_explaining"
                text="To be precise, yes. Now, let's assess your understanding with a brief quiz."
                onClick={learningStep === 8.2 ? handleStoryNext : undefined}
              />
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
