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
  { name: 'Professor Drive', emoji: '🧠', style: 'academic', intro: 'Greetings, student! I\'m Professor Drive, your academic driving instructor.' },
  { name: 'Captain Roadwise', emoji: '🚗', style: 'enthusiastic', intro: 'Hey there! Captain Roadwise at your service! Let\'s conquer these roads together!' },
  { name: 'Safety Sally', emoji: '🛡️', style: 'cautious', intro: 'Hi! I\'m Safety Sally. Remember, it\'s better to be safe than sorry on the roads.' },
  { name: 'Mechanic Mike', emoji: '🔧', style: 'technical', intro: 'G\'day! Mechanic Mike here. I know the rules of the road AND how your vehicle works.' }
];

// Mock responses for when OpenAI is not available
const MOCK_RESPONSES = {
  correct: [
    "Great job! You've got this one right. Let me explain why this answer is correct...",
    "Excellent choice! That's the correct answer because...",
    "Perfect! You selected the right option. This is important because...",
    "You're right! Good understanding of the driving rules here."
  ],
  incorrect: [
    "Not quite right. Let me explain why the correct answer is important...",
    "That's not the correct choice. Here's what you need to understand about this situation...",
    "I see where you might have been confused. The correct answer is actually... because...",
    "Let's review this one together. The right answer is... and here's why..."
  ],
  tips: [
    "Remember to always check your mirrors before changing lanes.",
    "When approaching an intersection, always be prepared to yield.",
    "Speed limits are maximum limits under ideal conditions, not targets.",
    "Maintaining a safe following distance gives you more time to react.",
    "Always signal your intentions to other road users."
  ],
  zimbabweTips: [
    "In Zimbabwe, always carry your driver's license, vehicle registration, and insurance documents while driving.",
    "Zimbabwe follows left-hand driving similar to the UK, so keep to the left side of the road.",
    "The speed limit in urban areas in Zimbabwe is typically 60 km/h unless otherwise posted.",
    "In Zimbabwe, seat belts are mandatory for all vehicle occupants, both in the front and rear seats.",
    "Be cautious of wildlife on rural roads in Zimbabwe, especially at dawn and dusk.",
    "Zimbabwe has strict laws against drunk driving with a legal blood alcohol limit of 0.08%.",
    "When approaching a roundabout in Zimbabwe, give way to vehicles already on the roundabout.",
    "In Zimbabwe, it's illegal to use a mobile phone while driving unless using a hands-free system.",
    "Zimbabwe's Highway Code requires drivers to stop completely at stop signs and red traffic lights.",
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
      mockAdvice += ` In Zimbabwe's driving context: ${zimbabweTip}`;
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
    // Simple non-game mode UI or Study Mode UI
    return (
      <div className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg border ${focusOnZimbabweLaws ? 'bg-green-900/30 border-green-700' : 'bg-gray-800 border-gray-700'}`}>
        <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
          {focusOnZimbabweLaws ? (
            <span className="flex items-center">
              <span className="mr-2">🇿🇼</span>
              Zimbabwe Driving Insights
            </span>
          ) : (
            'AI Tutor Advice'
          )}
        </h3>
        
        {focusOnZimbabweLaws && (
          <div className="mb-2 sm:mb-3 px-2 sm:px-3 py-1 sm:py-2 bg-green-900/50 border border-green-800 rounded text-xs text-green-100">
            <p>Zimbabwe driving regulations are based on British laws with local adaptations. The advice below is tailored to Zimbabwe's driving context.</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center py-3 sm:py-4">
            <div className={`animate-spin rounded-full h-5 sm:h-6 w-5 sm:w-6 border-b-2 ${focusOnZimbabweLaws ? 'border-green-500' : 'border-blue-500'}`}></div>
            <span className="ml-2 text-gray-300 text-xs sm:text-sm">Analyzing your answer...</span>
          </div>
        ) : (
          <div>
            <p className={`text-xs sm:text-sm leading-relaxed ${focusOnZimbabweLaws ? 'text-green-100' : 'text-gray-300'}`}>{advice}</p>
            
            {showDetailedExplanations && (
              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-green-800/50">
                <button 
                  onClick={showRandomTip}
                  className="text-xs px-2 py-1 bg-green-800 text-green-100 rounded hover:bg-green-700 transition-colors flex items-center"
                >
                  <span className="mr-1">🚗</span> Zimbabwe Driving Tip
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Game mode UI with character, XP, level, etc.
  return (
    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-800 rounded-lg border border-gray-700 relative overflow-hidden">
      {/* Game elements */}
      <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex space-x-1 sm:space-x-2">
        <span className="px-1 sm:px-2 py-0.5 sm:py-1 bg-purple-900 text-purple-100 text-xs rounded-md">
          Level {level}
        </span>
        <span className="px-1 sm:px-2 py-0.5 sm:py-1 bg-yellow-900 text-yellow-100 text-xs rounded-md">
          XP: {xp}
        </span>
        {streak > 2 && (
          <span className="px-1 sm:px-2 py-0.5 sm:py-1 bg-red-900 text-red-100 text-xs rounded-md animate-pulse">
            🔥 {streak}
          </span>
        )}
      </div>
      
      {/* Character section */}
      <div className="flex items-start mb-2 sm:mb-3 mt-6 sm:mt-4">
        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-900 flex items-center justify-center text-base sm:text-xl">
          {character.emoji}
        </div>
        <div className="ml-2 sm:ml-3 flex-1">
          <h3 className="text-sm sm:text-md font-semibold text-white">{character.name}</h3>
          {isLoading ? (
            <div className="flex items-center mt-1 sm:mt-2">
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-300 text-xs sm:text-sm">Thinking...</span>
            </div>
          ) : (
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{advice}</p>
          )}
        </div>
      </div>
      
      {/* Tip button */}
      <div className="mt-2 sm:mt-3 flex justify-end">
        <button 
          onClick={showRandomTip}
          className="text-xs px-2 py-0.5 sm:py-1 bg-blue-900 text-blue-100 rounded hover:bg-blue-800 transition-colors"
        >
          💡 Driving Tip
        </button>
      </div>
      
      {/* Tip popup */}
      {showTip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div 
            className={`bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full border-2 ${focusOnZimbabweLaws ? 'border-yellow-600' : 'border-blue-600'}`}
          >
            <h3 className={`text-base sm:text-lg font-bold mb-1 sm:mb-2 ${focusOnZimbabweLaws ? 'text-yellow-400' : 'text-blue-400'}`}>
              {focusOnZimbabweLaws ? '🇿🇼 Zimbabwe Driving Insight' : '💡 Driving Tip'}
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">{tipText}</p>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowTip(false)}
                className="px-3 sm:px-4 py-1 sm:py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
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