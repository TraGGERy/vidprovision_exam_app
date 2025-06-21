'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Question } from '../utils/questionUtils';

interface AITutorProps {
  currentQuestion: Question | null;
  userAnswer: string | null;
  isCorrect: boolean | null;
  onAdvice: (advice: string) => void;
  gameMode: boolean;
  characterName?: string;
  showDetailedExplanations?: boolean;
  focusOnZimbabweLaws?: boolean;
}

const AI_CHARACTERS = [
  { name: 'Professor Drive', emoji: '🧠', style: 'academic', intro: 'Greetings, student! I&apos;m Professor Drive, your academic driving instructor.' },
  { name: 'Captain Roadwise', emoji: '🚗', style: 'enthusiastic', intro: 'Hey there! Captain Roadwise at your service! Let&apos;s conquer these roads together!' },
  { name: 'Safety Sally', emoji: '🛡️', style: 'cautious', intro: 'Hi! I&apos;m Safety Sally. Remember, it&apos;s better to be safe than sorry on the roads.' },
  { name: 'Mechanic Mike', emoji: '🔧', style: 'technical', intro: 'G&apos;day! Mechanic Mike here. I know the rules of the road AND how your vehicle works.' }
];

// Mock responses for when OpenAI is not available
const MOCK_RESPONSES = {
  correct: [
    "Great job! You&apos;ve got this one right. Let me explain why this answer is correct...",
    "Excellent choice! That&apos;s the correct answer because...",
    "Perfect! You selected the right option. This is important because...",
    "You&apos;re right! Good understanding of the driving rules here."
  ],
  incorrect: [
    "Not quite right. Let me explain why the correct answer is important...",
    "That&apos;s not the correct choice. Here&apos;s what you need to understand about this situation...",
    "I see where you might have been confused. The correct answer is actually... because...",
    "Let&apos;s review this one together. The right answer is... and here&apos;s why..."
  ],
  tips: [
    "Remember to always check your mirrors before changing lanes.",
    "When approaching an intersection, always be prepared to yield.",
    "Speed limits are maximum limits under ideal conditions, not targets.",
    "Maintaining a safe following distance gives you more time to react.",
    "Always signal your intentions to other road users."
  ],
  zimbabweTips: [
    "In Zimbabwe, always carry your driver&apos;s license, vehicle registration, and insurance documents while driving.",
    "Zimbabwe follows left-hand driving similar to the UK, so keep to the left side of the road.",
    "The speed limit in urban areas in Zimbabwe is typically 60 km/h unless otherwise posted.",
    "In Zimbabwe, seat belts are mandatory for all vehicle occupants, both in the front and rear seats.",
    "Be cautious of wildlife on rural roads in Zimbabwe, especially at dawn and dusk.",
    "Zimbabwe has strict laws against drunk driving with a legal blood alcohol limit of 0.08%.",
    "When approaching a roundabout in Zimbabwe, give way to vehicles already on the roundabout.",
    "In Zimbabwe, it&apos;s illegal to use a mobile phone while driving unless using a hands-free system.",
    "Zimbabwe&apos;s Highway Code requires drivers to stop completely at stop signs and red traffic lights.",
    "During the rainy season in Zimbabwe (November to March), be extra cautious of slippery roads and reduced visibility."
  ]
};

export default function AITutor({ 
  currentQuestion, 
  userAnswer, 
  isCorrect, 
  onAdvice,
  gameMode = true,
  characterName,
  showDetailedExplanations = false,
  focusOnZimbabweLaws = false
}: AITutorProps) {
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [character, setCharacter] = useState(AI_CHARACTERS[0]);
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [streak, setStreak] = useState<number>(0);
  const [showTip, setShowTip] = useState<boolean>(false);
  const [tipText, setTipText] = useState<string>('');
  const prevQuestionRef = useRef<string | null>(null);
  
  // Select a character based on name or randomly if not specified
  useEffect(() => {
    if (characterName) {
      const selectedCharacter = AI_CHARACTERS.find(c => c.name === characterName) || AI_CHARACTERS[0];
      setCharacter(selectedCharacter);
    } else if (gameMode) {
      // Random character selection in game mode if not specified
      const randomIndex = Math.floor(Math.random() * AI_CHARACTERS.length);
      setCharacter(AI_CHARACTERS[randomIndex]);
    }
  }, [characterName, gameMode]);

  // Update streak and XP when user answers correctly
  useEffect(() => {
    if (isCorrect === true) {
      setStreak(prev => prev + 1);
      const streakBonus = Math.floor(streak / 3) * 5; // Bonus XP for streaks
      setXp(prev => prev + 10 + streakBonus);
    } else if (isCorrect === false) {
      setStreak(0);
    }
    
    // Level up logic
    const newLevel = Math.floor(xp / 50) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      // Could add level up animation or notification here
    }
  }, [isCorrect, streak, xp, level]);

  // Fallback function for when API is unavailable
  const fallbackToMockResponse = useCallback((isCorrect: boolean) => {
    // Fallback to mock responses with Zimbabwe context if needed
    let mockAdvice = '';
    const responses = isCorrect ? MOCK_RESPONSES.correct : MOCK_RESPONSES.incorrect;
    const randomIndex = Math.floor(Math.random() * responses.length);
    mockAdvice = responses[randomIndex];
    
    // Add Zimbabwe context for fallback responses if in Zimbabwe focus mode
    if (focusOnZimbabweLaws) {
      const zimbabweTip = MOCK_RESPONSES.zimbabweTips[Math.floor(Math.random() * MOCK_RESPONSES.zimbabweTips.length)];
      mockAdvice += ` In Zimbabwe&apos;s driving context: ${zimbabweTip}`;
    }
    
    // Only update and notify if the advice has changed
    if (mockAdvice !== advice) {
      setAdvice(mockAdvice);
      onAdvice(mockAdvice);
    }
  }, [focusOnZimbabweLaws, advice, onAdvice]);

  // Function to generate advice using OpenAI
  const generateAdvice = useCallback(async () => {
    if (!currentQuestion || userAnswer === null || isCorrect === null) return;
    
    setIsLoading(true);
    
    try {
      // Attempt to use OpenAI API
      const response = await fetch('/api/generate-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion.question_text,
          options: currentQuestion.options,
          correctAnswer: currentQuestion.correct_answer,
          userAnswer,
          isCorrect,
          characterStyle: character.style,
          showDetailedExplanations,
          focusOnZimbabweLaws
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const newAdvice = data.advice;
        setAdvice(newAdvice);
        // Only call onAdvice if the advice has actually changed
        if (newAdvice !== advice) {
          onAdvice(newAdvice);
        }
      } else {
        // Fallback to mock responses if API fails
        fallbackToMockResponse(isCorrect);
      }
    } catch (error) {
      console.error('Error generating advice:', error);
      fallbackToMockResponse(isCorrect);
    } finally {
      setIsLoading(false);
    }
  }, [currentQuestion, userAnswer, isCorrect, character, showDetailedExplanations, focusOnZimbabweLaws, advice, onAdvice, fallbackToMockResponse]);

  // Generate advice when question or answer changes
  useEffect(() => {
    if (!currentQuestion || userAnswer === null || isCorrect === null) {
      return;
    }

    // Avoid regenerating for the same question
    if (prevQuestionRef.current === currentQuestion.question_id) {
      return;
    }
    
    prevQuestionRef.current = currentQuestion.question_id;
    generateAdvice();
  }, [currentQuestion, userAnswer, isCorrect, showDetailedExplanations, focusOnZimbabweLaws, generateAdvice]);




  // Function to show a random driving tip
  const showRandomTip = useCallback(() => {
    // Use Zimbabwe tips when in Zimbabwe focus mode, otherwise use regular tips
    const tipsArray = focusOnZimbabweLaws ? MOCK_RESPONSES.zimbabweTips : MOCK_RESPONSES.tips;
    const randomIndex = Math.floor(Math.random() * tipsArray.length);
    setTipText(tipsArray[randomIndex]);
    setShowTip(true);
    // The timeout is now handled in a useEffect below
  }, [focusOnZimbabweLaws]);
  
  // Handle tip timeout with proper cleanup
  useEffect(() => {
    let tipTimer: NodeJS.Timeout | null = null;
    
    if (showTip) {
      tipTimer = setTimeout(() => setShowTip(false), 5000); // Hide tip after 5 seconds
    }
    
    // Cleanup function to clear the timeout if component unmounts or showTip changes
    return () => {
      if (tipTimer) clearTimeout(tipTimer);
    };
  }, [showTip]);

  if (!gameMode) {
    // Simple non-game mode UI or Study Mode UI with Apple-inspired design
    return (
      <div className={`mt-4 md:mt-6 p-4 md:p-5 rounded-2xl backdrop-blur-sm shadow-lg transition-all duration-300 ${focusOnZimbabweLaws 
        ? 'bg-green-900/20 dark:bg-green-900/30 border border-green-700/30 dark:border-green-700/50' 
        : 'bg-gray-200/90 dark:bg-gray-800/90 border border-gray-300/30 dark:border-gray-700/30'}`}>
        <h3 className="text-base md:text-lg font-medium text-gray-800 dark:text-white mb-2 md:mb-3">
          {focusOnZimbabweLaws ? (
            <span className="flex items-center">
              <span className="mr-2 text-lg md:text-xl">🇿🇼</span>
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent font-semibold">Zimbabwe Driving Insights</span>
            </span>
          ) : (
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent font-semibold">AI Tutor Advice</span>
          )}
        </h3>
        
        {focusOnZimbabweLaws && (
          <div className="mb-3 md:mb-4 px-3 md:px-4 py-2 md:py-3 bg-green-900/20 dark:bg-green-900/40 border border-green-800/30 dark:border-green-800/50 rounded-xl text-xs md:text-sm text-green-900 dark:text-green-100">
            <p>Zimbabwe driving regulations are based on British laws with local adaptations. The advice below is tailored to Zimbabwe&apos;s driving context.</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center py-4 md:py-6">
            <div className="relative">
              <div className={`animate-spin rounded-full h-6 md:h-8 w-6 md:w-8 border-2 border-t-transparent ${focusOnZimbabweLaws ? 'border-green-500' : 'border-blue-500'}`}></div>
              <div className={`absolute inset-0 flex items-center justify-center ${focusOnZimbabweLaws ? 'text-green-500' : 'text-blue-500'}`}>
                <span className="text-xs">AI</span>
              </div>
            </div>
            <span className="ml-3 text-gray-600 dark:text-gray-300 text-sm md:text-base font-light">Analyzing your answer...</span>
          </div>
        ) : (
          <div className="transition-all duration-300 ease-in-out">
            <p className={`text-sm md:text-base leading-relaxed ${focusOnZimbabweLaws 
              ? 'text-green-900 dark:text-green-100' 
              : 'text-gray-700 dark:text-gray-300'}`}>{advice}</p>
            
            {showDetailedExplanations && (
              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-green-800/20 dark:border-green-800/30">
                <button 
                  onClick={showRandomTip}
                  className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-full hover:shadow-md hover:from-green-500 hover:to-emerald-600 transition-all duration-300 flex items-center"
                >
                  <span className="mr-1.5">🚗</span> Zimbabwe Driving Tip
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Game mode UI with character, XP, level, etc. - Apple-inspired design
  return (
    <div className="mt-4 md:mt-6 p-4 md:p-5 bg-gray-200/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-lg relative overflow-hidden transition-all duration-300">
      {/* Game elements with Apple-inspired design */}
      <div className="absolute top-2 md:top-3 right-2 md:right-3 flex space-x-1.5 md:space-x-2.5">
        <span className="px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-xs md:text-sm rounded-full shadow-sm">
          Level {level}
        </span>
        <span className="px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xs md:text-sm rounded-full shadow-sm">
          XP: {xp}
        </span>
        {streak > 2 && (
          <span className="px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs md:text-sm rounded-full shadow-sm animate-pulse">
            🔥 {streak}
          </span>
        )}
      </div>
      
      {/* Character section with Apple-inspired design */}
      <div className="flex items-start mb-3 md:mb-4 mt-10 md:mt-12">
        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md flex items-center justify-center text-lg md:text-xl">
          {character.emoji}
        </div>
        <div className="ml-3 md:ml-4 flex-1">
          <h3 className="text-sm md:text-base font-medium text-gray-800 dark:text-white">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent font-semibold">
              {character.name}
            </span>
          </h3>
          {isLoading ? (
            <div className="flex items-center mt-2 md:mt-3">
              <div className="relative">
                <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-2 border-t-transparent border-blue-500"></div>
                <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                  <span className="text-[8px] md:text-[10px]">AI</span>
                </div>
              </div>
              <span className="ml-2 text-gray-600 dark:text-gray-300 text-xs md:text-sm font-light">Thinking...</span>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed mt-1 md:mt-2">{advice}</p>
          )}
        </div>
      </div>
      
      {/* Tip button with Apple-inspired design */}
      <div className="mt-3 md:mt-4 flex justify-end">
        <button 
          onClick={showRandomTip}
          className="text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full hover:shadow-md hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 flex items-center"
        >
          <span className="mr-1.5">💡</span> Driving Tip
        </button>
      </div>
      
      {/* Tip popup with Apple-inspired design */}
      {showTip && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-6 transition-all duration-300 animate-fadeIn">
          <div 
            className={`bg-white/90 dark:bg-gray-800/95 rounded-2xl p-5 md:p-6 max-w-md w-full shadow-2xl border ${focusOnZimbabweLaws ? 'border-yellow-400/30 dark:border-yellow-600/30' : 'border-blue-400/30 dark:border-blue-600/30'} transform transition-all duration-300 animate-scaleIn`}
          >
            <h3 className={`text-base md:text-lg font-medium mb-2 md:mb-3 ${focusOnZimbabweLaws ? 'bg-gradient-to-r from-amber-500 to-yellow-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'} bg-clip-text text-transparent`}>
              {focusOnZimbabweLaws ? (
                <span className="flex items-center">
                  <span className="mr-2 text-lg md:text-xl">🇿🇼</span>
                  Zimbabwe Driving Insight
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="mr-2 text-lg md:text-xl">💡</span>
                  Driving Tip
                </span>
              )}
            </h3>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-4 md:mb-5 leading-relaxed">{tipText}</p>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowTip(false)}
                className="px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}