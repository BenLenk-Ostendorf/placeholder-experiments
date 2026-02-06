'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import Glossary, { GlossaryButton } from '@/components/Glossary';
import { Flaggable, FeedbackData } from '@/components/FeedbackFlag';
import Editable from '@/components/Editable';

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  category: string;
}

const skillNodeToGoal: Record<string, LearningGoal> = {
  'ai-text-generation': {
    id: 'ai-text-generation',
    title: 'Understanding How AI Produces Text',
    description: 'Learn the fundamentals of how AI generates human-like text',
    category: 'Text Generation',
  },
};

function ContentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedGoal, setSelectedGoal] = useState<LearningGoal | null>(null);
  const [learningStep, setLearningStep] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showGlossary, setShowGlossary] = useState(false);
  const [glossaryTerm, setGlossaryTerm] = useState<string | null>(null);
  const [challengeMode, setChallengeMode] = useState(false);
  const [testingMode, setTestingMode] = useState(false);
  const [editingMode, setEditingMode] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [feedbackData, setFeedbackData] = useState<Record<string, FeedbackData | null>>({});

  useEffect(() => {
    const goalId = searchParams.get('goal');
    const challenge = searchParams.get('challenge');
    const mode = searchParams.get('mode');
    const step = searchParams.get('step');
    const highlight = searchParams.get('highlight');
    const testing = searchParams.get('testing');

    if (testing === 'true') {
      setTestingMode(true);
    }

    if (goalId) {
      const goal = skillNodeToGoal[goalId];
      if (goal) {
        setSelectedGoal(goal);
        setChallengeMode(challenge === 'true');
        
        if (mode === 'edit') {
          setEditingMode(true);
          if (step) {
            const stepNum = parseFloat(step.replace('step-', ''));
            if (!isNaN(stepNum)) {
              setLearningStep(stepNum);
            } else {
              setLearningStep(10);
            }
          } else {
            setLearningStep(10);
          }
          if (highlight) {
            setHighlightedElement(highlight);
          }
        } else {
          setLearningStep(challenge === 'true' ? 9 : 1);
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (learningStep > 0) {
      setTimeout(() => {
        const newBlock = document.querySelector(`[data-step="${learningStep}"]`);
        if (newBlock) {
          newBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  }, [learningStep]);

  const handleFeedbackChange = (elementId: string, feedback: FeedbackData | null) => {
    setFeedbackData(prev => ({
      ...prev,
      [elementId]: feedback,
    }));
  };

  const openGlossaryAtTerm = (term: string) => {
    setGlossaryTerm(term);
    setShowGlossary(true);
  };

  const handleBackToLearningPath = () => {
    router.push('/learning-path');
  };

  const handleSkipToEnd = () => {
    setLearningStep(10);
    setQuizScore(3);
    setUserRating(3);
  };

  const handleStoryNext = () => {
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
      setLearningStep(Math.round((learningStep + 0.1) * 10) / 10);
    }
  };

  const handleSurveySubmit = async (rating: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setUserRating(rating);
    setLearningStep(4);
  };

  const handleQuizComplete = (finalScore: number, totalQuestions: number) => {
    setQuizScore(finalScore);
    setLearningStep(10);
  };

  const handleNextGoal = () => {
    handleBackToLearningPath();
  };

  if (!selectedGoal) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No learning goal selected</p>
          <button
            onClick={handleBackToLearningPath}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Learning Path
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (editingMode) {
                window.history.replaceState({}, '', '/content');
                setEditingMode(false);
                setHighlightedElement(null);
              }
              handleBackToLearningPath();
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Learning Path
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedGoal.title}
          </h1>
          {editingMode && (
            <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded">
              Editing Mode
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {testingMode && learningStep < 10 && (
            <button
              onClick={handleSkipToEnd}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-md hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
              title="Skip to completion (Testing Mode)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              Skip to End
            </button>
          )}
          <button
            onClick={() => setTestingMode(!testingMode)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              testingMode 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Testing Mode - Flag content issues"
          >
            <svg className="w-5 h-5" fill={testingMode ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            {testingMode && <span>Testing</span>}
          </button>
        </div>
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
      <GlossaryButton onClick={() => {
        setGlossaryTerm(null);
        setShowGlossary(true);
      }} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <main className="space-y-8">
            {challengeMode && learningStep >= 9 && (
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  🏆 Challenge for Credit
                </h2>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Complete this quiz to earn credit for this learning goal without going through the full course.
                </p>
              </div>
            )}

            {/* Step 1: Story Introduction Part 1 */}
            {selectedGoal && learningStep >= 1 && (
              <div data-step="1">
                <Editable elementId="step-1" elementLabel="Step 1: Spezi's complaint" editingMode={editingMode} isHighlighted={highlightedElement === 'step-1'}>
                  <Flaggable elementId="step-1" elementLabel="Step 1: Spezi's complaint" testingMode={testingMode && !editingMode} feedback={feedbackData['step-1']} onFeedbackChange={handleFeedbackChange}>
                    <StorySection
                      imageSide="left"
                      faceId="spezi_frustrated"
                      text="ChatGPT just insulted my student! I asked it to write a polite rejection email for a research position application, and the thing writes to him that he is 'academically unsuitable'! Can you believe that?"
                      onClick={!editingMode && learningStep === 1 ? handleStoryNext : undefined}
                    />
                  </Flaggable>
                </Editable>
              </div>
            )}

            {/* Step 2: Story Introduction Part 2 */}
            {selectedGoal && learningStep >= 2 && (
              <div data-step="2">
                <Editable elementId="step-2" elementLabel="Step 2: Puck's response" editingMode={editingMode} isHighlighted={highlightedElement === 'step-2'}>
                  <Flaggable elementId="step-2" elementLabel="Step 2: Puck's response" testingMode={testingMode && !editingMode} feedback={feedbackData['step-2']} onFeedbackChange={handleFeedbackChange}>
                    <StorySection
                      imageSide="right"
                      faceId="puck_tea"
                      text="(sips his Yorkshire Tea) Welllll... and you're surprised?"
                      onClick={!editingMode && learningStep === 2 ? handleStoryNext : undefined}
                    />
                  </Flaggable>
                </Editable>
              </div>
            )}

            {/* Step 3: Trust Survey */}
            {selectedGoal && learningStep >= 3 && (
              <div data-step="3">
                <Editable elementId="step-3" elementLabel="Step 3: Spezi on consistency" editingMode={editingMode} isHighlighted={highlightedElement === 'step-3'}>
                  <Flaggable elementId="step-3" elementLabel="Step 3: Spezi on consistency" testingMode={testingMode && !editingMode} feedback={feedbackData['step-3']} onFeedbackChange={handleFeedbackChange}>
                    <StorySection
                      imageSide="left"
                      faceId="spezi_frustrated"
                      text="Same prompt as last week! It was perfect then!"
                      onClick={!editingMode && learningStep === 3 ? handleStoryNext : undefined}
                    />
                  </Flaggable>
                </Editable>
              </div>
            )}

            {selectedGoal && learningStep >= 3.1 && (
              <div data-step="3.1">
                <Editable elementId="step-3.1" elementLabel="Step 3.1: Puck asks about consistency" editingMode={editingMode} isHighlighted={highlightedElement === 'step-3.1'}>
                  <Flaggable elementId="step-3.1" elementLabel="Step 3.1: Puck asks about consistency" testingMode={testingMode && !editingMode} feedback={feedbackData['step-3.1']} onFeedbackChange={handleFeedbackChange}>
                    <StorySection
                      imageSide="right"
                      faceId="puck_asking"
                      text="Tell me \u2013 how often do you think an LLM produces the same answer for the same prompt?"
                      onClick={!editingMode && learningStep === 3.1 ? handleStoryNext : undefined}
                    />
                  </Flaggable>
                </Editable>
              </div>
            )}

            {selectedGoal && learningStep >= 3.2 && (editingMode || learningStep < 4) && (
              <div data-step="3.2">
                <Editable elementId="step-3.2" elementLabel="Step 3.2: Trust Survey" editingMode={editingMode} isHighlighted={highlightedElement === 'step-3.2'}>
                  <Flaggable elementId="step-3.2" elementLabel="Step 3.2: Trust Survey" testingMode={testingMode && !editingMode} feedback={feedbackData['step-3.2']} onFeedbackChange={handleFeedbackChange}>
                    <TrustSurvey onSubmit={handleSurveySubmit} />
                  </Flaggable>
                </Editable>
              </div>
            )}

            {/* Show Trust Analysis after survey submission */}
            {selectedGoal && learningStep >= 4 && (editingMode || userRating !== null) && (
              <div data-step="4-analysis">
                <Editable elementId="step-4-analysis" elementLabel="Trust Analysis Results" editingMode={editingMode} isHighlighted={highlightedElement === 'step-4-analysis'}>
                  <Flaggable elementId="step-4-analysis" elementLabel="Trust Analysis Results" testingMode={testingMode && !editingMode} feedback={feedbackData['step-4-analysis']} onFeedbackChange={handleFeedbackChange}>
                    <TrustAnalysis userRating={userRating || 3} />
                  </Flaggable>
                </Editable>
              </div>
            )}

            {/* Step 4: Reflection on insights - adaptive based on user rating */}
            {selectedGoal && learningStep >= 4 && (editingMode || userRating !== null) && (
              <div data-step="4">
                <Editable elementId="step-4" elementLabel="Step 4: Spezi's reaction" editingMode={editingMode} isHighlighted={highlightedElement === 'step-4'}>
                  <Flaggable elementId="step-4" elementLabel="Step 4: Spezi's reaction" testingMode={testingMode && !editingMode} feedback={feedbackData['step-4']} onFeedbackChange={handleFeedbackChange}>
                    <StorySection
                      imageSide="left"
                      faceId="spezi_confused"
                      text={
                        userRating !== null && userRating >= 4
                          ? "But I thought they were consistent! The same prompt should give the same answer, right?"
                          : userRating === 3 || userRating === null
                          ? "I'm not sure... sometimes it seems consistent, sometimes not?"
                          : "Yeah, I've noticed they're not very consistent at all."
                      }
                      onClick={!editingMode && learningStep === 4 ? handleStoryNext : undefined}
                    />
                  </Flaggable>
                </Editable>
              </div>
            )}

            {selectedGoal && learningStep >= 4.1 && (editingMode || userRating !== null) && (
              <div data-step="4.1">
                <Editable elementId="step-4.1" elementLabel="Step 4.1: Puck explains probabilistic" editingMode={editingMode} isHighlighted={highlightedElement === 'step-4.1'}>
                  <Flaggable elementId="step-4.1" elementLabel="Step 4.1: Puck explains probabilistic" testingMode={testingMode && !editingMode} feedback={feedbackData['step-4.1']} onFeedbackChange={handleFeedbackChange}>
                    <StorySection
                      imageSide="right"
                      faceId="puck_explaining"
                      text={
                        userRating !== null && userRating >= 4
                          ? "...that's a common assumption! But LLMs are probabilistic - like rolling dice, not following a recipe. Let me show you why..."
                          : userRating === 3 || userRating === null
                          ? "... you're right to be uncertain! LLMs are probabilistic - they involve chance. Let me show you why..."
                          : "Precisely! They're probabilistic - involving chance and randomness. Let me show you exactly why..."
                      }
                      onClick={!editingMode && learningStep === 4.1 ? handleStoryNext : undefined}
                      onGlossaryTermClick={openGlossaryAtTerm}
                    />
                  </Flaggable>
                </Editable>
              </div>
            )}

            {/* Step 5: Continue explanation - always explain tokens */}
            {selectedGoal && learningStep >= 5 && (
              <div data-step="5">
                <Editable elementId="step-5" elementLabel="Step 5: Puck introduces tokens" editingMode={editingMode} isHighlighted={highlightedElement === 'step-5'}>
                  <Flaggable elementId="step-5" elementLabel="Step 5: Puck introduces tokens" testingMode={testingMode && !editingMode} feedback={feedbackData['step-5']} onFeedbackChange={handleFeedbackChange}>
                    <StorySection
                      imageSide="right"
                      faceId="puck_explaining"
                      text="To understand this, we first need to talk about 'tokens'..."
                      onClick={!editingMode && learningStep === 5 ? handleStoryNext : undefined}
                      onGlossaryTermClick={openGlossaryAtTerm}
                    />
                  </Flaggable>
                </Editable>
              </div>
            )}

            {selectedGoal && learningStep >= 5.1 && (
              <div data-step="5.1">
                <Editable elementId="step-5.1" elementLabel="Step 5.1: Spezi asks about tokens" editingMode={editingMode} isHighlighted={highlightedElement === 'step-5.1'}>
                  <Flaggable elementId="step-5.1" elementLabel="Step 5.1: Spezi asks about tokens" testingMode={testingMode && !editingMode} feedback={feedbackData['step-5.1']} onFeedbackChange={handleFeedbackChange}>
                    <StorySection
                      imageSide="left"
                      faceId="spezi_confused"
                      text="Tokens? Never heard of them."
                      onClick={!editingMode && learningStep === 5.1 ? handleStoryNext : undefined}
                      onGlossaryTermClick={openGlossaryAtTerm}
                    />
                  </Flaggable>
                </Editable>
              </div>
            )}

            {/* Step 6: Token Explanation Section - always show */}
            {selectedGoal && learningStep >= 6 && (
              <div data-step="6">
                <Editable elementId="step-6" elementLabel="Step 6: Token Explanation" editingMode={editingMode} isHighlighted={highlightedElement === 'step-6'}>
                  <Flaggable elementId="step-6" elementLabel="Step 6: Token Explanation" testingMode={testingMode && !editingMode} feedback={feedbackData['step-6']} onFeedbackChange={handleFeedbackChange}>
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
                  </Flaggable>
                </Editable>
                {!editingMode && learningStep === 6 && (
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
                <Editable elementId="step-6.1" elementLabel="Step 6.1: Puck asks about token selection" editingMode={editingMode} isHighlighted={highlightedElement === 'step-6.1'}>
                  <Flaggable elementId="step-6.1" elementLabel="Step 6.1: Puck asks about token selection" testingMode={testingMode && !editingMode} feedback={feedbackData['step-6.1']} onFeedbackChange={handleFeedbackChange}>
                    <StorySection
                      imageSide="right"
                      faceId="puck_asking"
                      text="Now, here's the key: how does the AI choose which token comes next?"
                      onClick={!editingMode && learningStep === 6.1 ? handleStoryNext : undefined}
                      onGlossaryTermClick={openGlossaryAtTerm}
                    />
                  </Flaggable>
                </Editable>
              </div>
            )}

            {/* Step 7: Probability Distribution Explanation - always show */}
            {selectedGoal && learningStep >= 7 && (
              <div data-step="7">
                <Editable elementId="step-7" elementLabel="Step 7: Spezi guesses" editingMode={editingMode} isHighlighted={highlightedElement === 'step-7'}>
                  <Flaggable elementId="step-7" elementLabel="Step 7: Spezi guesses" testingMode={testingMode && !editingMode} feedback={feedbackData['step-7']} onFeedbackChange={handleFeedbackChange}>
                    <StorySection
                      imageSide="left"
                      faceId="spezi_confused"
                      text="I assume it just picks the most likely word?"
                      onClick={!editingMode && learningStep === 7 ? handleStoryNext : undefined}
                      onGlossaryTermClick={openGlossaryAtTerm}
                    />
                  </Flaggable>
                </Editable>
              </div>
            )}

            {selectedGoal && learningStep >= 7.1 && (
              <div data-step="7.1">
                <Editable elementId="step-7.1" elementLabel="Step 7.1: Puck introduces probability" editingMode={editingMode} isHighlighted={highlightedElement === 'step-7.1'}>
                  <Flaggable elementId="step-7.1" elementLabel="Step 7.1: Puck introduces probability" testingMode={testingMode && !editingMode} feedback={feedbackData['step-7.1']} onFeedbackChange={handleFeedbackChange}>
                    <StorySection
                      imageSide="right"
                      faceId="puck_pointing"
                      text="Not quite! It uses something called a probability distribution. Let me show you with a visual..."
                      onClick={!editingMode && learningStep === 7.1 ? handleStoryNext : undefined}
                      onGlossaryTermClick={openGlossaryAtTerm}
                    />
                  </Flaggable>
                </Editable>
              </div>
            )}

            {/* Step 7.2: Probability distribution explanation */}
            {selectedGoal && learningStep >= 7.2 && (
              <div data-step="7.2">
                <Editable elementId="step-7.2" elementLabel="Step 7.2: Probability Distribution Explanation" editingMode={editingMode} isHighlighted={highlightedElement === 'step-7.2'}>
                  <Flaggable elementId="step-7.2" elementLabel="Step 7.2: Probability Distribution Explanation" testingMode={testingMode && !editingMode} feedback={feedbackData['step-7.2']} onFeedbackChange={handleFeedbackChange}>
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
                  </Flaggable>
                </Editable>
                {!editingMode && learningStep === 7.2 && (
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
                <Editable elementId="step-7.5" elementLabel="Step 7.5: Token Simulator" editingMode={editingMode} isHighlighted={highlightedElement === 'step-7.5'}>
                  <Flaggable elementId="step-7.5" elementLabel="Step 7.5: Token Simulator" testingMode={testingMode && !editingMode} feedback={feedbackData['step-7.5']} onFeedbackChange={handleFeedbackChange}>
                    <TokenSimulator />
                  </Flaggable>
                </Editable>
                {!editingMode && learningStep === 7.5 && (
                  <button
                    onClick={handleStoryNext}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mt-4"
                  >
                    Continue
                  </button>
                )}
              </div>
            )}

            {/* Step 8: Puck technical explanation */}
            {selectedGoal && learningStep >= 8 && (
              <div data-step="8">
                <Editable elementId="step-8" elementLabel="Step 8: Puck technical explanation" editingMode={editingMode} isHighlighted={highlightedElement === 'step-8'}>
                  <Flaggable elementId="step-8" elementLabel="Step 8: Puck technical explanation" testingMode={testingMode && !editingMode} feedback={feedbackData['step-8']} onFeedbackChange={handleFeedbackChange}>
                    <StorySection
                      imageSide="right"
                      faceId="puck_explaining"
                      text="NNNAAAJAAA... technically speaking, you've just observed how the model makes sequential token predictions. Each choice influences the probability distribution of subsequent tokens - remember the spinner wheel analogy - which explains the variability in output."
                      onClick={!editingMode && learningStep === 8 ? handleStoryNext : undefined}
                    />
                  </Flaggable>
                </Editable>
              </div>
            )}

            {/* Step 8.1: Spezi understands */}
            {selectedGoal && learningStep >= 8.1 && (
              <div data-step="8.1">
                <Editable elementId="step-8.1" elementLabel="Step 8.1: Spezi understands" editingMode={editingMode} isHighlighted={highlightedElement === 'step-8.1'}>
                  <Flaggable elementId="step-8.1" elementLabel="Step 8.1: Spezi understands" testingMode={testingMode && !editingMode} feedback={feedbackData['step-8.1']} onFeedbackChange={handleFeedbackChange}>
                    <StorySection
                      imageSide="left"
                      faceId="spezi_understanding"
                      text="Oh... so that's why ChatGPT gave me different results with the same prompt. It's making probabilistic choices each time, not just picking the same thing."
                      onClick={!editingMode && learningStep === 8.1 ? handleStoryNext : undefined}
                    />
                  </Flaggable>
                </Editable>
              </div>
            )}

            {/* Step 8.2: Puck introduces quiz */}
            {selectedGoal && learningStep >= 8.2 && (
              <div data-step="8.2">
                <Editable elementId="step-8.2" elementLabel="Step 8.2: Puck introduces quiz" editingMode={editingMode} isHighlighted={highlightedElement === 'step-8.2'}>
                  <Flaggable elementId="step-8.2" elementLabel="Step 8.2: Puck introduces quiz" testingMode={testingMode && !editingMode} feedback={feedbackData['step-8.2']} onFeedbackChange={handleFeedbackChange}>
                    <StorySection
                      imageSide="right"
                      faceId="puck_explaining"
                      text="To be precise, yes. Now, let's assess your understanding with a brief quiz."
                      onClick={!editingMode && learningStep === 8.2 ? handleStoryNext : undefined}
                    />
                  </Flaggable>
                </Editable>
              </div>
            )}

            {/* Step 9: Final Quiz */}
            {selectedGoal && learningStep >= 9 && (editingMode || learningStep < 10) && (
              <div data-step="9">
                <Editable elementId="step-9" elementLabel="Step 9: Final Quiz" editingMode={editingMode} isHighlighted={highlightedElement === 'step-9'}>
                  <Flaggable elementId="step-9" elementLabel="Step 9: Final Quiz" testingMode={testingMode && !editingMode} feedback={feedbackData['step-9']} onFeedbackChange={handleFeedbackChange}>
                    <FinalQuiz onComplete={handleQuizComplete} />
                  </Flaggable>
                </Editable>
              </div>
            )}

            {/* Step 10: Learning Complete */}
            {selectedGoal && learningStep >= 10 && (
              <div data-step="10">
                <Editable elementId="step-10" elementLabel="Step 10: Learning Complete" editingMode={editingMode} isHighlighted={highlightedElement === 'step-10'}>
                  <Flaggable elementId="step-10" elementLabel="Step 10: Learning Complete" testingMode={testingMode && !editingMode} feedback={feedbackData['step-10']} onFeedbackChange={handleFeedbackChange}>
                    <LearningComplete
                      score={quizScore}
                      totalQuestions={3}
                      onNextGoal={handleNextGoal}
                      goalTitle={selectedGoal.title}
                    />
                  </Flaggable>
                </Editable>
                
                <div className="mt-8">
                  <Editable elementId="step-10-resources" elementLabel="Further Deep Dive Resources" editingMode={editingMode} isHighlighted={highlightedElement === 'step-10-resources'}>
                    <Flaggable elementId="step-10-resources" elementLabel="Further Deep Dive Resources" testingMode={testingMode && !editingMode} feedback={feedbackData['step-10-resources']} onFeedbackChange={handleFeedbackChange}>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                          Further Deep Dive
                        </h2>
                        <LearningResources />
                      </div>
                    </Flaggable>
                  </Editable>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ContentPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    }>
      <ContentPageContent />
    </Suspense>
  );
}
