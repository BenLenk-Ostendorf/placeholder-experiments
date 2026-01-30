'use client';

import { useState, useEffect } from 'react';
import LearningGoalsSidebar from '@/components/LearningGoalsSidebar';
import AIDialogue from '@/components/AIDialogue';
import TrustSurvey from '@/components/TrustSurvey';
import TrustAnalysis from '@/components/TrustAnalysis';
import LearningResources from '@/components/LearningResources';
import TokenSimulator from '@/components/TokenSimulator';
import StorySection from '@/components/StorySection';
import ExplanationSection from '@/components/ExplanationSection';
import TokenVisual from '@/components/TokenVisual';
import SpinnerVisual from '@/components/SpinnerVisual';
import FinalQuiz from '@/components/FinalQuiz';
import LearningComplete from '@/components/LearningComplete';
import Glossary, { GlossaryButton, GlossaryText } from '@/components/Glossary';
import SkillTree, { skillTreeNodes } from '@/components/SkillTree';

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  category: string;
}

// Map skill tree node IDs to learning goal data
const skillNodeToGoal: Record<string, LearningGoal> = {
  'ai-text-generation': {
    id: 'ai-text-generation',
    title: 'Understanding How AI Produces Text',
    description: 'Learn the fundamentals of how AI generates human-like text',
    category: 'Text Generation',
  },
};

export default function Home() {
  // View state: 'skill-tree' or 'learning'
  const [currentView, setCurrentView] = useState<'skill-tree' | 'learning'>('skill-tree');
  const [debugMode, setDebugMode] = useState(false);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  
  // Certificate state
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [showCertificateSelection, setShowCertificateSelection] = useState(true); // Show on first load
  
  const [selectedGoal, setSelectedGoal] = useState<LearningGoal | null>(null);
  const [learningStep, setLearningStep] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [glossaryTerm, setGlossaryTerm] = useState<string | null>(null);
  
  const handleSelectCertificate = (certId: string | null) => {
    setSelectedCertificate(certId);
    if (certId === null) {
      // If changing goal (clicking "Change Goal"), show selection modal
      setShowCertificateSelection(true);
    }
  };

  const openGlossaryAtTerm = (term: string) => {
    setGlossaryTerm(term);
    setShowGlossary(true);
  };

  const handleStartGoal = (nodeId: string) => {
    const goal = skillNodeToGoal[nodeId];
    if (goal) {
      setActiveNodeId(nodeId);
      setSelectedGoal(goal);
      setLearningStep(1); // Start directly at step 1
      setUserRating(null);
      setQuizScore(0);
      setCurrentView('learning');
      setSidebarCollapsed(true);
    }
  };

  const handleToggleNodeComplete = (nodeId: string) => {
    setCompletedNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const handleBackToSkillTree = () => {
    setCurrentView('skill-tree');
    setSelectedGoal(null);
    setLearningStep(0);
  };

  // Auto-scroll to show the beginning of new content when learning step changes
  useEffect(() => {
    if (learningStep > 0 && currentView === 'learning') {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        // Find the element for the current step
        const newBlock = document.querySelector(`[data-step="${learningStep}"]`);
        if (newBlock) {
          newBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [learningStep, currentView]);

  const handleGoalSelect = (goal: LearningGoal) => {
    setSelectedGoal(goal);
    setLearningStep(1); // Start directly at step 1
    setUserRating(null);
    setQuizScore(0);
    setSidebarCollapsed(true); // Collapse sidebar when learning goal is selected
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const handleContinueFromStep1 = () => {
    setLearningStep(2);
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
    // Mark current node as complete
    if (activeNodeId && !completedNodes.includes(activeNodeId)) {
      setCompletedNodes(prev => [...prev, activeNodeId]);
    }
    // Go back to skill tree
    handleBackToSkillTree();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {currentView === 'learning' && (
            <button
              onClick={handleBackToSkillTree}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Skill Tree
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentView === 'skill-tree' ? 'Learning Path' : selectedGoal?.title}
          </h1>
        </div>
        
        {/* Debug Mode Toggle */}
        <button
          onClick={() => setDebugMode(!debugMode)}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            debugMode 
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title="Debug Mode"
        >
          {/* Bug icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="6" width="8" height="14" rx="4" />
            <path d="M8 10h8" />
            <path d="M8 14h8" />
            <path d="M12 6V2" />
            <path d="M6 10H2" />
            <path d="M22 10h-4" />
            <path d="M6 14H2" />
            <path d="M22 14h-4" />
            <path d="M6 18l-2 2" />
            <path d="M18 18l2 2" />
          </svg>
          {debugMode && <span>Debug</span>}
        </button>
      </div>

      {/* Glossary */}
      <Glossary 
        isOpen={showGlossary} 
        onClose={() => {
          setShowGlossary(false);
          setGlossaryTerm(null);
        }} 
        initialTerm={glossaryTerm}
      />
      {currentView === 'learning' && (
        <GlossaryButton onClick={() => {
          setGlossaryTerm(null);
          setShowGlossary(true);
        }} />
      )}

      {/* Skill Tree View */}
      {currentView === 'skill-tree' && (
        <SkillTree
          completedNodes={completedNodes}
          onStartGoal={handleStartGoal}
          debugMode={debugMode}
          onToggleNodeComplete={handleToggleNodeComplete}
          selectedCertificate={selectedCertificate}
          onSelectCertificate={handleSelectCertificate}
          showCertificateSelection={showCertificateSelection}
          onCloseCertificateSelection={() => setShowCertificateSelection(false)}
        />
      )}

      {/* Learning Content View */}
      {currentView === 'learning' && (
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8 max-w-5xl">

          {/* Main Content */}
          <main className="space-y-8">
            {/* Step 1: Story Introduction Part 1 */}
            {selectedGoal && learningStep >= 1 && (
              <div data-step="1">
                <StorySection
                  imageSide="left"
                  faceId="spezi_frustrated"
                  text="ChatGPT just insulted my student! I asked it to write a polite rejection email for a research position application, and the thing writes to him that he is 'academically unsuitable'! Can you believe that?"
                  onClick={learningStep === 1 ? handleStoryNext : undefined}
                />
              </div>
            )}

            {/* Step 2: Story Introduction Part 2 */}
            {selectedGoal && learningStep >= 2 && (
              <div data-step="2">
                <StorySection
                  imageSide="right"
                  faceId="puck_tea"
                  text="(sips his Yorkshire Tea) Welllll... and you're surprised?"
                  onClick={learningStep === 2 ? handleStoryNext : undefined}
                />
              </div>
            )}

            {/* Step 3: Trust Survey */}
            {selectedGoal && learningStep >= 3 && (
              <div data-step="3">
                <StorySection
                  imageSide="left"
                  faceId="spezi_frustrated"
                  text="Same prompt as last week! It was perfect then!"
                  onClick={learningStep === 3 ? handleStoryNext : undefined}
                />
              </div>
            )}

            {selectedGoal && learningStep >= 3.1 && (
              <div data-step="3.1">
                <StorySection
                  imageSide="right"
                  faceId="puck_asking"
                  text="Tell me – how often do you think an LLM produces the same answer for the same prompt?"
                  onClick={learningStep === 3.1 ? handleStoryNext : undefined}
                />
              </div>
            )}

            {selectedGoal && learningStep >= 3.2 && learningStep < 4 && (
              <div data-step="3.2">
                <TrustSurvey onSubmit={handleSurveySubmit} />
              </div>
            )}

            {/* Show Trust Analysis after survey submission */}
            {selectedGoal && learningStep >= 4 && userRating !== null && (
              <div data-step="4-analysis">
                <TrustAnalysis userRating={userRating} />
              </div>
            )}

            {/* Step 4: Reflection on insights - adaptive based on user rating */}
            {selectedGoal && learningStep >= 4 && userRating !== null && (
              <div data-step="4">
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
              </div>
            )}

            {selectedGoal && learningStep >= 4.1 && userRating !== null && (
              <div data-step="4.1">
                <StorySection
                  imageSide="right"
                  faceId="puck_explaining"
                  text={
                    userRating >= 4
                      ? "...that's a common assumption! But LLMs are probabilistic - like rolling dice, not following a recipe. Let me show you why..."
                      : userRating === 3
                      ? "... you're right to be uncertain! LLMs are probabilistic - they involve chance. Let me show you why..."
                      : "Precisely! They're probabilistic - involving chance and randomness. Let me show you exactly why..."
                  }
                  onClick={learningStep === 4.1 ? handleStoryNext : undefined}
                  onGlossaryTermClick={openGlossaryAtTerm}
                />
              </div>
            )}

            {/* Step 5: Continue explanation - always explain tokens */}
            {selectedGoal && learningStep >= 5 && (
              <div data-step="5">
                <StorySection
                  imageSide="right"
                  faceId="puck_explaining"
                  text="To understand this, we first need to talk about 'tokens'..."
                  onClick={learningStep === 5 ? handleStoryNext : undefined}
                  onGlossaryTermClick={openGlossaryAtTerm}
                />
              </div>
            )}

            {selectedGoal && learningStep >= 5.1 && (
              <div data-step="5.1">
                <StorySection
                  imageSide="left"
                  faceId="spezi_confused"
                  text="Tokens? Never heard of them."
                  onClick={learningStep === 5.1 ? handleStoryNext : undefined}
                  onGlossaryTermClick={openGlossaryAtTerm}
                />
              </div>
            )}

            {/* Step 6: Token Explanation Section - always show */}
            {selectedGoal && learningStep >= 6 && (
              <div data-step="6">
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
                {learningStep === 6 && (
                  <button
                    onClick={handleStoryNext}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mt-4"
                  >
                    Continue
                  </button>
                )}
              </div>
            )}

            {selectedGoal && learningStep >= 6.1 && (
              <div data-step="6.1">
                <StorySection
                  imageSide="right"
                  faceId="puck_asking"
                  text="Now, here's the key: how does the AI choose which token comes next?"
                  onClick={learningStep === 6.1 ? handleStoryNext : undefined}
                  onGlossaryTermClick={openGlossaryAtTerm}
                />
              </div>
            )}

            {/* Step 7: Probability Distribution Explanation - always show */}
            {selectedGoal && learningStep >= 7 && (
              <div data-step="7">
                <StorySection
                  imageSide="left"
                  faceId="spezi_confused"
                  text="I assume it just picks the most likely word?"
                  onClick={learningStep === 7 ? handleStoryNext : undefined}
                  onGlossaryTermClick={openGlossaryAtTerm}
                />
              </div>
            )}

            {selectedGoal && learningStep >= 7.1 && (
              <div data-step="7.1">
                <StorySection
                  imageSide="right"
                  faceId="puck_pointing"
                  text="Not quite! It uses something called a probability distribution. Let me show you with a visual..."
                  onClick={learningStep === 7.1 ? handleStoryNext : undefined}
                  onGlossaryTermClick={openGlossaryAtTerm}
                />
              </div>
            )}

            {selectedGoal && learningStep >= 7.2 && (
              <div data-step="7.2">
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
                {learningStep === 7.2 && (
                  <button
                    onClick={() => setLearningStep(7.5)}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mt-4"
                  >
                    Try It Yourself
                  </button>
                )}
              </div>
            )}

            {/* Step 7.5: Token Simulator */}
            {selectedGoal && learningStep >= 7.5 && (
              <div data-step="7.5">
                <TokenSimulator />
                {learningStep === 7.5 && (
                  <button
                    onClick={handleStoryNext}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mt-4"
                  >
                    Continue
                  </button>
                )}
              </div>
            )}

            {/* Step 8: Short Story Block */}
            {selectedGoal && learningStep >= 8 && (
              <div data-step="8">
                <StorySection
                  imageSide="right"
                  faceId="puck_explaining"
                  text="NNNAAAJAAA... technically speaking, you've just observed how the model makes sequential token predictions. Each choice influences the probability distribution of subsequent tokens - remember the spinner wheel analogy - which explains the variability in output."
                  onClick={learningStep === 8 ? handleStoryNext : undefined}
                />
              </div>
            )}

            {selectedGoal && learningStep >= 8.1 && (
              <div data-step="8.1">
                <StorySection
                  imageSide="left"
                  faceId="spezi_understanding"
                  text="Oh... so that's why ChatGPT gave me different results with the same prompt. It's making probabilistic choices each time, not just picking the same thing."
                  onClick={learningStep === 8.1 ? handleStoryNext : undefined}
                />
              </div>
            )}

            {selectedGoal && learningStep >= 8.2 && (
              <div data-step="8.2">
                <StorySection
                  imageSide="right"
                  faceId="puck_explaining"
                  text="To be precise, yes. Now, let's assess your understanding with a brief quiz."
                  onClick={learningStep === 8.2 ? handleStoryNext : undefined}
                />
              </div>
            )}

            {/* Step 9: Final Quiz */}
            {selectedGoal && learningStep >= 9 && learningStep < 10 && (
              <div data-step="9">
                <FinalQuiz onComplete={handleQuizComplete} />
              </div>
            )}

            {/* Step 10: Learning Complete */}
            {selectedGoal && learningStep >= 10 && (
              <div data-step="10">
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
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-500">
          </footer>
        </div>
      </div>
      )}
    </div>
  );
}
