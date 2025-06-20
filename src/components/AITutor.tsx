'use client';

import { useState, useEffect, useRef } from 'react';
import { Question } from '../utils/questionUtils';

interface AITutorProps {
  currentQuestion: Question | null;
  userAnswer: string | null;
  isCorrect: boolean | null;
  onAdvice: (advice: string) => void;
  gameMode: boolean;
  characterName?: string;
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
  ]
};

export default function AITutor({ 
  currentQuestion, 
  userAnswer, 
  isCorrect, 
  onAdvice,
  gameMode = true,
  characterName
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
  }, [currentQuestion, userAnswer, isCorrect]);

  // Function to generate advice using OpenAI
  const generateAdvice = async () => {
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
          characterStyle: character.style
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setAdvice(data.advice);
        onAdvice(data.advice);
      } else {
        // Fallback to mock responses if API fails
        fallbackToMockResponse();
      }
    } catch (error) {
      console.error('Error generating advice:', error);
      fallbackToMockResponse();
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback function for when API is unavailable
  const fallbackToMockResponse = () => {
    const responses = isCorrect ? MOCK_RESPONSES.correct : MOCK_RESPONSES.incorrect;
    const randomIndex = Math.floor(Math.random() * responses.length);
    const mockAdvice = responses[randomIndex];
    setAdvice(mockAdvice);
    onAdvice(mockAdvice);
  };

  // Function to show a random driving tip
  const showRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * MOCK_RESPONSES.tips.length);
    setTipText(MOCK_RESPONSES.tips[randomIndex]);
    setShowTip(true);
    setTimeout(() => setShowTip(false), 5000); // Hide tip after 5 seconds
  };

  if (!gameMode) {
    // Simple non-game mode UI
    return (
      <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-2">AI Tutor Advice</h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-300">Analyzing your answer...</span>
          </div>
        ) : (
          <p className="text-gray-300 text-sm leading-relaxed">{advice}</p>
        )}
      </div>
    );
  }

  // Game mode UI with character, XP, level, etc.
  return (
    <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700 relative overflow-hidden">
      {/* Game elements */}
      <div className="absolute top-2 right-2 flex space-x-2">
        <span className="px-2 py-1 bg-purple-900 text-purple-100 text-xs rounded-md">
          Level {level}
        </span>
        <span className="px-2 py-1 bg-yellow-900 text-yellow-100 text-xs rounded-md">
          XP: {xp}
        </span>
        {streak > 2 && (
          <span className="px-2 py-1 bg-red-900 text-red-100 text-xs rounded-md animate-pulse">
            🔥 {streak}
          </span>
        )}
      </div>
      
      {/* Character section */}
      <div className="flex items-start mb-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-xl">
          {character.emoji}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-md font-semibold text-white">{character.name}</h3>
          {isLoading ? (
            <div className="flex items-center mt-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-300 text-sm">Thinking...</span>
            </div>
          ) : (
            <p className="text-gray-300 text-sm leading-relaxed">{advice}</p>
          )}
        </div>
      </div>
      
      {/* Tip button */}
      <div className="mt-3 flex justify-end">
        <button 
          onClick={showRandomTip}
          className="text-xs px-2 py-1 bg-blue-900 text-blue-100 rounded hover:bg-blue-800 transition-colors"
        >
          💡 Driving Tip
        </button>
      </div>
      
      {/* Tip popup */}
      {showTip && (
        <div className="mt-3 p-2 bg-blue-900 text-blue-100 text-xs rounded-md animate-fadeIn">
          <p className="flex items-center">
            <span className="mr-1">💡</span> 
            <span>{tipText}</span>
          </p>
        </div>
      )}
    </div>
  );
}