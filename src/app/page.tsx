'use client';

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { registerServiceWorker } from "../utils/registerSW";
import QuestionImage from "../components/QuestionImage";
import AITutor from "../components/AITutor";
import SplashScreen from "../components/SplashScreen";
import LeaderboardTable from "../components/LeaderboardTable";
import Header from "../components/Header";
import { HeaderAd, ContentAd } from "../components/AdSenseAd";
import { Question, getAllQuestions, getQuestionsByTest, getAllTestIds, shuffle } from "../utils/questionUtils";
import { 
  updateQuestionPerformance, 
  getQuestionsForReview, 
  getDifficultyDescription,
} from "../utils/spacedRepetition";


// Legacy interface for backward compatibility
// Removed unused interface

// Legacy questions array (keeping for reference)


// Quiz modes
type QuizMode = 'random' | 'by-test' | 'practice' | 'exam' | 'study' | 'spaced-repetition';

interface QuizConfig {
  mode: QuizMode;
  testId?: string;
  questionCount: number;
  timeLimit: number; // in seconds
  totalTimeLimit?: number; // in seconds, for exam mode
  aiTutor: boolean;
  gameMode: boolean;
  characterName?: string;
  showDetailedExplanations?: boolean; // For study mode
  focusOnZimbabweLaws?: boolean; // For Zimbabwe-specific content
  allowUnlimitedTime?: boolean; // For study mode
  enableSpacedRepetition?: boolean; // Enable spaced repetition across all modes
  prioritizeDifficultQuestions?: boolean; // Prioritize questions marked as difficult
}

export default function DrivingQuizApp() {
  // Register service worker for PWA functionality
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Hide splash screen after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Quiz configuration
  const [quizConfig, setQuizConfig] = useState<QuizConfig>({
    mode: 'random',
    questionCount: 20,
    timeLimit: 30,
    totalTimeLimit: 480, // 8 minutes for exam mode
    aiTutor: true,
    gameMode: true,
    characterName: undefined,
    showDetailedExplanations: false,
    focusOnZimbabweLaws: false,
    allowUnlimitedTime: false,
    enableSpacedRepetition: true, // Enable spaced repetition by default
    prioritizeDifficultQuestions: true // Prioritize difficult questions by default
  });
  
  const [stage, setStage] = useState<'start' | 'quiz' | 'result'>('start');
  const [showSplash, setShowSplash] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalTimeLeft, setTotalTimeLeft] = useState(480); // 8 minutes for exam mode
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSiteInfo, setShowSiteInfo] = useState(false);
  // Removed unused state variable: const [aiAdvice, setAiAdvice] = useState<string>('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  // const [quizStartTime, setQuizStartTime] = useState<Date | null>(null); // Removed unused variable
  
  // Available tests
  const testIds = useMemo(() => getAllTestIds(), []);
  
  // Get all questions for the selected test or all questions
  const availableQuestions = useMemo(() => {
    if (quizConfig.mode === 'by-test' && quizConfig.testId) {
      return getQuestionsByTest(quizConfig.testId);
    }
    return getAllQuestions();
  }, [quizConfig.mode, quizConfig.testId]);

  // Timer effect is now consolidated in a single useEffect below

  const startQuiz = useMemo(() => (config: QuizConfig = quizConfig) => {
    // Get questions based on configuration
    let selectedQuestions: Question[] = [];
    let questionCount = config.questionCount;
    
    // Override question count for exam mode
    if (config.mode === 'exam') {
      questionCount = 25; // Exam mode always has 25 questions
    }
    
    if (config.mode === 'spaced-repetition') {
      // Get questions due for review using spaced repetition algorithm
      selectedQuestions = getQuestionsForReview(availableQuestions, questionCount);
      
      // If not enough questions for review, fill with random questions
      if (selectedQuestions.length < questionCount) {
        const remainingCount = questionCount - selectedQuestions.length;
        const remainingQuestions = shuffle(
          availableQuestions.filter(q => !selectedQuestions.some(sq => sq.question_id === q.question_id))
        ).slice(0, remainingCount);
        
        selectedQuestions = [...selectedQuestions, ...remainingQuestions];
      }
    } else if (config.mode === 'by-test' && config.testId) {
      // Get questions from specific test
      const testQuestions = getQuestionsByTest(config.testId);
      
      // Apply spaced repetition if enabled
      if (config.enableSpacedRepetition && config.prioritizeDifficultQuestions) {
        // Get difficult questions first based on spaced repetition data
        const difficultQuestions = getQuestionsForReview(testQuestions, questionCount);
        
        // If we have enough difficult questions, use them; otherwise mix with random questions
        if (difficultQuestions.length >= questionCount) {
          selectedQuestions = difficultQuestions.slice(0, questionCount);
        } else {
          const remainingCount = questionCount - difficultQuestions.length;
          const remainingQuestions = shuffle(
            testQuestions.filter(q => !difficultQuestions.some(dq => dq.question_id === q.question_id))
          ).slice(0, remainingCount);
          
          selectedQuestions = [...difficultQuestions, ...remainingQuestions];
        }
      } else {
        // Standard random selection from test
        selectedQuestions = shuffle(testQuestions).slice(0, questionCount);
      }
    } else {
      // Get random questions from all tests
      if (config.enableSpacedRepetition && config.prioritizeDifficultQuestions) {
        // Get difficult questions first based on spaced repetition data
        const difficultQuestions = getQuestionsForReview(availableQuestions, questionCount);
        
        // If we have enough difficult questions, use them; otherwise mix with random questions
        if (difficultQuestions.length >= questionCount) {
          selectedQuestions = difficultQuestions.slice(0, questionCount);
        } else {
          const remainingCount = questionCount - difficultQuestions.length;
          const remainingQuestions = shuffle(
            availableQuestions.filter(q => !difficultQuestions.some(dq => dq.question_id === q.question_id))
          ).slice(0, remainingCount);
          
          selectedQuestions = [...difficultQuestions, ...remainingQuestions];
        }
      } else {
        // Standard random selection
        selectedQuestions = shuffle(availableQuestions).slice(0, questionCount);
      }
    }
    
    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    // Set time limit based on mode
    if (config.mode !== 'exam') {
      // For non-exam modes, set the per-question time limit
      setTimeLeft(config.timeLimit);
    }
    
    // Set total time limit for exam mode
    if (config.mode === 'exam' && config.totalTimeLimit) {
      setTotalTimeLeft(config.totalTimeLimit);
    }
    
    // setQuizStartTime(new Date()); // Removed assignment to unused variable
    setStage('quiz');
  }, [availableQuestions, quizConfig]);

  const handleAnswerSelect = useMemo(() => (option: string) => {
    // Prevent multiple selections or clicks during explanation
    if (selectedAnswer !== null || showExplanation) return;
    
    setSelectedAnswer(option);
    setShowExplanation(true);
    
    // Update user answers using functional update to ensure latest state
    setUserAnswers(prev => [...prev, option]);
    
    const currentQuestion = questions[currentQuestionIndex];
    const correct = option === currentQuestion.correct_answer;
    setIsAnswerCorrect(correct);
    
    // Update score if answer is correct using functional update
    if (correct) {
      setScore(prev => prev + 1);
    }
    
    // Update spaced repetition data for this question
    if (quizConfig.enableSpacedRepetition || quizConfig.mode === 'spaced-repetition') {
      updateQuestionPerformance(currentQuestion.question_id, correct);
    }
  }, [selectedAnswer, showExplanation, questions, currentQuestionIndex, quizConfig.enableSpacedRepetition, quizConfig.mode]);


  // Define handleTimeUp with useCallback to prevent recreation on every render
  const handleTimeUp = useMemo(() => {
    return () => {
      if (selectedAnswer === null) {
        setSelectedAnswer(''); // Indicate no answer selected
        setUserAnswers([...userAnswers, '']);
        setShowExplanation(true);
        setIsAnswerCorrect(false); // Time's up means incorrect answer
        
        // Update spaced repetition data for this question (mark as incorrect due to timeout)
        if (quizConfig.enableSpacedRepetition || quizConfig.mode === 'spaced-repetition') {
          const currentQuestion = questions[currentQuestionIndex];
          updateQuestionPerformance(currentQuestion.question_id, false);
        }
      }
    };
  }, [selectedAnswer, userAnswers, quizConfig.enableSpacedRepetition, quizConfig.mode, questions, currentQuestionIndex]);

  // Timer effect - optimized with useRef to prevent unnecessary re-renders
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Per-question timer effect
  useEffect(() => {
    // Skip timer in study mode with unlimited time enabled or in exam mode
    if ((quizConfig.mode === 'study' && quizConfig.allowUnlimitedTime) || quizConfig.mode === 'exam') {
      return;
    }
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (stage === 'quiz' && timeLeft > 0 && !showExplanation) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showExplanation) {
      handleTimeUp();
    }
    
    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeLeft, stage, showExplanation, handleTimeUp, quizConfig.mode, quizConfig.allowUnlimitedTime]);
  
  // Total exam time timer effect
  useEffect(() => {
    // Only run this timer for exam mode
    if (quizConfig.mode !== 'exam' || stage !== 'quiz') {
      return;
    }
    
    // Clear any existing timer
    if (totalTimerRef.current) {
      clearTimeout(totalTimerRef.current);
      totalTimerRef.current = null;
    }
    
    if (totalTimeLeft > 0) {
      totalTimerRef.current = setTimeout(() => setTotalTimeLeft(totalTimeLeft - 1), 1000);
    } else if (totalTimeLeft === 0) {
      // Time's up for the entire exam
      setStage('result');
    }
    
    // Cleanup function
    return () => {
      if (totalTimerRef.current) {
        clearTimeout(totalTimerRef.current);
        totalTimerRef.current = null;
      }
    };
  }, [totalTimeLeft, stage, quizConfig.mode]);

  const nextQuestion = useMemo(() => () => {
    // Reset state for the next question
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsAnswerCorrect(null);
    
    if (currentQuestionIndex < questions.length - 1) {
      // Move to the next question
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      // Reset per-question timer (only for non-exam modes)
      if (quizConfig.mode !== 'exam') {
        setTimeLeft(quizConfig.timeLimit);
      }
      
      // For exam mode, check if total time is up
      if (quizConfig.mode === 'exam' && totalTimeLeft <= 0) {
        // End of exam due to time limit
        setStage('result');
      }
    } else {
      // End of quiz
      setStage('result');
    }
  }, [currentQuestionIndex, questions.length, quizConfig.timeLimit, quizConfig.mode, totalTimeLeft]);
  
  // Function to go back to the previous question
  const previousQuestion = useMemo(() => () => {
    if (currentQuestionIndex > 0) {
      // Reset state for the previous question
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1] || null);
      setShowExplanation(true); // Show explanation for the previous question
      setIsAnswerCorrect(userAnswers[currentQuestionIndex - 1] === questions[currentQuestionIndex - 1].correct_answer);
      
      // Move to the previous question
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
      // Reset per-question timer (only for non-exam modes)
      if (quizConfig.mode !== 'exam') {
        setTimeLeft(quizConfig.timeLimit);
      }
    }
  }, [currentQuestionIndex, questions, quizConfig.timeLimit, quizConfig.mode, userAnswers]);

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = useMemo(() => (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'Excellent! You\'re ready to drive safely!';
    if (percentage >= 80) return 'Great job! You have a good understanding of driving rules.';
    if (percentage >= 70) return 'Good work! Review the areas you missed.';
    if (percentage >= 60) return 'You\'re getting there! More study needed.';
    return 'Keep studying! Practice makes perfect.';
  }, []);

  // Handler for AI advice - currently not storing advice in state
  // This is called by AITutor component but we're not using the advice elsewhere
  const handleAiAdvice = (advice: string) => {
    // No-op - we're not using the advice in the parent component
    // If needed in the future, we could store it in state or use it directly
    console.log('Received advice from AI Tutor:', advice);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
      {showSplash && <SplashScreen />}
      
      {/* Header - Always visible at the top */}
      <Header />
      
      {/* Floating Info Icon - Only visible before quiz starts */}
      {useMemo(() => {
        if (stage !== 'start') return null;
        
        return (
          <div className="fixed top-3 left-3 z-50 group">
            <button 
              onClick={() => setShowSiteInfo(prev => !prev)}
              className="bg-blue-900/90 rounded-full p-2 border border-blue-700 shadow-lg hover:bg-blue-800/90 transition-colors flex items-center justify-center"
              title="Site Information"
            >
              <span className="text-sm sm:text-xl">ℹ️</span>
            </button>
            <div className="absolute left-0 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none whitespace-nowrap">
              Site Information
            </div>
          </div>
        );
      }, [stage])}
      
      {/* Floating Trophy Icon - Memoized to prevent unnecessary re-renders */}
      {useMemo(() => {
        if (stage !== 'result') return null;
        
        return (
          <div className="fixed top-3 right-3 z-50">
            <button 
              onClick={() => setShowLeaderboard(prev => !prev)}
              className="bg-blue-900/90 rounded-full p-2 border border-blue-700 shadow-lg hover:bg-blue-800/90 transition-colors"
              title="View leaderboard"
            >
              <span className="text-sm sm:text-xl">🏆</span>
            </button>
          </div>
        );
      }, [stage, setShowLeaderboard])}
      
      {/* Floating Leaderboard - Memoized to prevent unnecessary re-renders */}
      {useMemo(() => {
        if (!showLeaderboard || stage !== 'result') return null;
        
        return (
          <div className="fixed top-12 left-2 right-2 sm:left-0 sm:right-0 z-50 mx-auto max-w-md bg-blue-900/90 rounded-lg border border-blue-700 shadow-lg p-3 sm:p-4 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm sm:text-base font-semibold text-white flex items-center">
                <span className="mr-1 sm:mr-2">🏆</span> Leaderboard
              </h3>
              <button 
                onClick={() => setShowLeaderboard(false)}
                className="text-gray-300 hover:text-white text-sm sm:text-base p-1"
              >
                ✕
              </button>
            </div>
            <LeaderboardTable score={score} questions={questions} limit={5} />
          </div>
        );
      }, [showLeaderboard, stage, score, questions])}
      
      {/* Site Information Modal - Memoized to prevent unnecessary re-renders */}
      {useMemo(() => {
        if (!showSiteInfo || stage !== 'start') return null;
        
        // Function to detect platform
        const getPlatformInfo = () => {
          const userAgent = navigator.userAgent.toLowerCase();
          let platform = 'Unknown';
          let icon = '💻';
          
          if (userAgent.includes('android')) {
            platform = 'Android';
            icon = '📱';
          } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
            platform = 'iOS';
            icon = '📱';
          } else if (userAgent.includes('windows')) {
            platform = 'Windows';
            icon = '💻';
          } else if (userAgent.includes('mac')) {
            platform = 'macOS';
            icon = '💻';
          } else if (userAgent.includes('linux')) {
            platform = 'Linux';
            icon = '💻';
          }
          
          return { platform, icon };
        };
        
        const { platform, icon } = getPlatformInfo();
        const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-2xl p-4 sm:p-6 max-w-md mx-4 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center">
                  <span className="mr-2">ℹ️</span> Site Information
                </h3>
                <button 
                  onClick={() => setShowSiteInfo(false)}
                  className="text-gray-400 hover:text-white text-xl p-1 rounded-full hover:bg-gray-800 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Site URL */}
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center">
                    <span className="mr-2">🌐</span> Current URL
                  </h4>
                  <div className="bg-gray-900 rounded p-2 border border-gray-600">
                    <code className="text-xs sm:text-sm text-green-400 break-all">{currentUrl}</code>
                  </div>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'VidApp - Zimbabwe Driving License Quiz',
                          text: 'Check out this driving license quiz app!',
                          url: currentUrl,
                        })
                        .catch(err => console.error('Error sharing:', err));
                      } else {
                        // Fallback for browsers that don't support Web Share API
                        navigator.clipboard?.writeText(currentUrl);
                        alert('URL copied to clipboard!');
                      }
                    }}
                    className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    🔗 Share
                  </button>
                </div>
                
                {/* Platform Information */}
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <h4 className="text-sm font-medium text-purple-400 mb-2 flex items-center">
                    <span className="mr-2">{icon}</span> Your Platform
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{icon}</span>
                    <span className="text-white font-medium">{platform}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Detected from your device's user agent
                  </p>
                </div>
                
                {/* App Information */}
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <h4 className="text-sm font-medium text-yellow-400 mb-2 flex items-center">
                    <span className="mr-2">🚗</span> About VidApp
                  </h4>
                  <p className="text-sm text-gray-300 mb-2">
                    Zimbabwe Driving License Quiz App
                  </p>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>• Progressive Web App (PWA)</div>
                    <div>• Works offline after first visit</div>
                    <div>• Installable on your device</div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex space-x-2">
                  <a
                    href="/blog"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-lg transition-colors text-center"
                  >
                    📚 Visit Blog
                  </a>
                  <a
                    href="/content-policy"
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 px-3 rounded-lg transition-colors text-center"
                  >
                    📋 Content Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      }, [showSiteInfo, stage])}
      <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4 max-w-4xl">
        

        {/* Start Screen */}
        {stage === 'start' && (
          <>
            {/* Header Ad - Only shown with sufficient content */}
            <HeaderAd />
            
            <div className="bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-800">
              <div className="mb-4 sm:mb-6 text-center">
                <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🚦</div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Ready to Test Your Driving Knowledge?</h2>
                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">Configure your quiz below and test your driving knowledge!</p>
              </div>
            
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">Quiz Mode</label>
                <select 
                  className="w-full p-2 sm:p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  value={quizConfig.mode}
                  onChange={(e) => {
                    const newMode = e.target.value as QuizMode;
                    // Reset study-specific settings when changing modes
                    if (newMode === 'exam') {
                      // Special settings for exam mode
                      setQuizConfig({
                        ...quizConfig, 
                        mode: newMode,
                        questionCount: 25, // Force 25 questions for exam mode
                        totalTimeLimit: 480, // 8 minutes
                        showDetailedExplanations: false,
                        focusOnZimbabweLaws: false,
                        allowUnlimitedTime: false
                      });
                    } else if (newMode !== 'study') {
                      setQuizConfig({
                        ...quizConfig, 
                        mode: newMode,
                        showDetailedExplanations: false,
                        focusOnZimbabweLaws: false,
                        allowUnlimitedTime: false
                      });
                    } else {
                      setQuizConfig({
                        ...quizConfig, 
                        mode: newMode,
                        showDetailedExplanations: true,
                        focusOnZimbabweLaws: true,
                        allowUnlimitedTime: true,
                        aiTutor: true // Enable AI tutor by default in study mode
                      });
                    }
                  }}
                >
                  <option value="random">Random Questions</option>
                  <option value="by-test">Specific Test</option>
                  <option value="practice">Practice Mode</option>
                  <option value="exam">🔥 Exam Mode (8 min, 25 Questions)</option>
                  <option value="study">📚 Study Mode</option>
                  
                </select>
                {quizConfig.mode === 'exam' && (
                  <div className="mt-2 p-2 bg-yellow-900/30 rounded border border-yellow-800">
                    <p className="text-xs text-yellow-300 flex items-center">
                      <span className="mr-1">⚠️</span> Exam mode simulates a real driving test with 25 questions and an 8-minute time limit
                    </p>
                  </div>
                )}
              </div>
              
              {quizConfig.mode === 'by-test' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">Select Test</label>
                  <select 
                    className="w-full p-2 sm:p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    value={quizConfig.testId || ''}
                    onChange={(e) => setQuizConfig({...quizConfig, testId: e.target.value})}
                  >
                    <option value="">Choose a test...</option>
                    {testIds.map(id => (
                      <option key={id} value={id}>Test {id}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">Number of Questions</label>
                <select 
                  className="w-full p-2 sm:p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  value={quizConfig.mode === 'exam' ? 25 : quizConfig.questionCount}
                  onChange={(e) => setQuizConfig({...quizConfig, questionCount: parseInt(e.target.value)})}
                  disabled={quizConfig.mode === 'exam'} // Disable for exam mode
                >
                  <option value={10}>10 Questions</option>
                  <option value={20}>20 Questions</option>
                  <option value={25}>25 Questions</option>
                  <option value={30}>30 Questions</option>
                  <option value={50}>50 Questions</option>
                </select>
                {quizConfig.mode === 'exam' && (
                  <p className="text-xs text-yellow-400 mt-1">Exam mode always uses 25 questions</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  {quizConfig.mode === 'exam' ? 'Exam Time Limit' : 'Time Per Question'}
                </label>
                {quizConfig.mode !== 'exam' ? (
                  <select 
                    className="w-full p-2 sm:p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    value={quizConfig.timeLimit}
                    onChange={(e) => setQuizConfig({...quizConfig, timeLimit: parseInt(e.target.value)})}
                  >
                    <option value={15}>15 Seconds</option>
                    <option value={30}>30 Seconds</option>
                    <option value={45}>45 Seconds</option>
                    <option value={60}>60 Seconds</option>
                  </select>
                ) : (
                  <div className="p-2 sm:p-3 border border-gray-700 rounded-lg bg-gray-800 text-white text-sm sm:text-base flex items-center justify-center">
                    <span className="mr-2">⏳</span> 8 minutes for 25 questions
                  </div>
                )}
                {quizConfig.mode === 'exam' && (
                  <div className="mt-2 p-2 bg-blue-900/30 rounded border border-blue-800">
                    <p className="text-xs text-blue-300 flex items-center">
                      <span className="mr-1">⏳</span> Exam mode: 8 minute total time limit only
                    </p>
                  </div>
                )}
              </div>

              {/* Spaced Repetition is enabled by default but hidden from UI */}
              
              <div className="border-t border-gray-700 pt-3 sm:pt-4 mt-3 sm:mt-4">
                <h3 className="text-base sm:text-lg font-medium text-blue-400 mb-2 sm:mb-3">🧠 AI Tutor Settings</h3>
                
                <div className="mb-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={quizConfig.aiTutor}
                      onChange={(e) => setQuizConfig({...quizConfig, aiTutor: e.target.checked})}
                      className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-700 bg-gray-800 focus:ring-blue-500"
                    />
                    <span className="text-sm sm:text-base text-gray-300">Enable AI Tutor</span>
                  </label>
                  <p className="text-xs text-gray-400 mt-1 ml-7">Get personalized advice and explanations from an AI tutor</p>
                </div>
                
                {quizConfig.mode === 'study' && (
                  <div className="bg-gray-800 p-2 sm:p-3 rounded-lg border border-gray-700 mb-3 sm:mb-4">
                    <h4 className="text-sm sm:text-md font-medium text-green-400 mb-1 sm:mb-2">📚 Study Mode Settings</h4>
                    
                    <div className="mb-3">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={quizConfig.focusOnZimbabweLaws}
                          onChange={(e) => setQuizConfig({...quizConfig, focusOnZimbabweLaws: e.target.checked})}
                          className="form-checkbox h-5 w-5 text-green-500 rounded border-gray-700 bg-gray-800 focus:ring-green-500"
                        />
                        <span className="text-sm sm:text-base text-gray-300">Focus on Zimbabwe Driving Laws</span>
                      </label>
                      <p className="text-xs text-gray-400 mt-1 ml-7">Get explanations specific to Zimbabwe driving regulations (similar to British laws)</p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={quizConfig.showDetailedExplanations}
                          onChange={(e) => setQuizConfig({...quizConfig, showDetailedExplanations: e.target.checked})}
                          className="form-checkbox h-5 w-5 text-green-500 rounded border-gray-700 bg-gray-800 focus:ring-green-500"
                        />
                        <span className="text-sm sm:text-base text-gray-300">Show Detailed Explanations</span>
                      </label>
                      <p className="text-xs text-gray-400 mt-1 ml-7">Get comprehensive explanations for each question</p>
                    </div>
                    
                    <div className="mb-1">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={quizConfig.allowUnlimitedTime}
                          onChange={(e) => setQuizConfig({...quizConfig, allowUnlimitedTime: e.target.checked})}
                          className="form-checkbox h-5 w-5 text-green-500 rounded border-gray-700 bg-gray-800 focus:ring-green-500"
                        />
                        <span className="text-sm sm:text-base text-gray-300">Unlimited Time</span>
                      </label>
                      <p className="text-xs text-gray-400 mt-1 ml-7">Take as much time as you need to study each question</p>
                    </div>
                  </div>
                )}

                {quizConfig.aiTutor && (
                  <>
                    <div className="mb-3">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={quizConfig.gameMode}
                          onChange={(e) => setQuizConfig({...quizConfig, gameMode: e.target.checked})}
                          className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-700 bg-gray-800 focus:ring-blue-500"
                        />
                        <span className="text-sm sm:text-base text-gray-300">Game Mode</span>
                      </label>
                      <p className="text-xs text-gray-400 mt-1 ml-7">Enable XP, levels, and character interactions</p>
                    </div>

                    {quizConfig.gameMode && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">Select Tutor Character</label>
                        <select
                          className="w-full p-2 sm:p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                          value={quizConfig.characterName || ''}
                          onChange={(e) => setQuizConfig({...quizConfig, characterName: e.target.value || undefined})}
                        >
                          <option value="">Random Character</option>
                          <option value="Professor Drive">🧠 Professor Drive</option>
                          <option value="Captain Roadwise">🚗 Captain Roadwise</option>
                          <option value="Safety Sally">🛡️ Safety Sally</option>
                          <option value="Mechanic Mike">🔧 Mechanic Mike</option>
                        </select>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => startQuiz()}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 sm:py-3 px-5 sm:px-8 rounded-lg text-sm sm:text-lg transition-colors duration-200 shadow-md hover:shadow-lg touch-manipulation border border-blue-500 w-full sm:w-auto"
              >
                Start Quiz
              </button>
            </div>
          </div>
          
          {/* Content Ad - Only shown with sufficient content */}
          <ContentAd />
          </>
        )}

        {/* Quiz Screen */}
        {useMemo(() => {
          if (stage === 'quiz' && currentQuestion) {
            return (
          <div className="bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-800">
            {/* Progress Bar */}
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-300">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-300">
                  Score: {score}/{currentQuestionIndex + (showExplanation ? 1 : 0)}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + (showExplanation ? 1 : 0)) / questions.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Difficulty Level - Only show when spaced repetition is enabled */}
              {(quizConfig.enableSpacedRepetition || quizConfig.mode === 'spaced-repetition') && currentQuestion && (
                <div className="mt-2 flex justify-end">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300">
                    Difficulty: {getDifficultyDescription(currentQuestion.question_id)}
                  </span>
                </div>
              )}
            </div>

            {/* Timer */}
            <div className="mb-4 sm:mb-6 text-center">
              {quizConfig.mode === 'study' && quizConfig.allowUnlimitedTime ? (
                <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                  <span className="mr-2">📚</span>
                  Study Mode: Unlimited Time
                </div>
              ) : quizConfig.mode === 'exam' ? (
                <div className="flex justify-center items-center">
                  <div className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${
                    totalTimeLeft <= 60 ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    <span className="mr-2">⏳</span>
                    Exam Time: {Math.floor(totalTimeLeft / 60)}:{(totalTimeLeft % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              ) : (
                <div className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${
                  timeLeft <= 10 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  <span className="mr-2">⏱️</span>
                  Time: {timeLeft}s
                </div>
              )}
            </div>

            {/* Question */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 leading-relaxed">
                {currentQuestion.question_text}
              </h3>

              {/* Question Image */}
              {currentQuestion.image_url && (
                <QuestionImage 
                  imageUrl={currentQuestion.image_url} 
                  alt={`Question ${currentQuestionIndex + 1} illustration`}
                />
              )}

              {/* Answer Options */}
              <div className="space-y-1 sm:space-y-3">
                {currentQuestion.options.map((option, index) => {
                  let buttonClass = "w-full p-2 sm:p-4 text-left rounded-lg border-2 transition-all duration-200 touch-manipulation text-xs sm:text-base ";
                  
                  if (showExplanation) {
                    if (option === currentQuestion.correct_answer) {
                      buttonClass += "border-green-500 bg-green-900 text-green-100";
                    } else if (option === selectedAnswer && selectedAnswer !== currentQuestion.correct_answer) {
                      buttonClass += "border-red-500 bg-red-900 text-red-100";
                    } else {
                      buttonClass += "border-gray-700 bg-gray-800 text-gray-400";
                    }
                  } else {
                    if (selectedAnswer === option) {
                      buttonClass += "border-blue-500 bg-blue-900 text-blue-100";
                    } else {
                      buttonClass += "border-gray-700 bg-gray-800 text-white hover:border-blue-500 hover:bg-gray-700 active:bg-gray-600";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showExplanation}
                      className={buttonClass}
                    >
                      <span className="font-medium mr-2 sm:mr-3">{String.fromCharCode(65 + index)}.</span>
                      <span className="leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className={`mb-4 sm:mb-6 p-3 sm:p-4 ${quizConfig.mode === 'study' ? 'bg-green-900 border border-green-700' : 'bg-blue-900 border border-blue-700'} rounded-lg`}>
                <h4 className={`font-semibold ${quizConfig.mode === 'study' ? 'text-green-100' : 'text-blue-100'} mb-2 text-sm sm:text-base`}>
                  {quizConfig.mode === 'study' ? '📚 Study Note:' : 'Correct Answer:'}
                </h4>
                <p className={`${quizConfig.mode === 'study' ? 'text-green-200' : 'text-blue-200'} text-sm sm:text-base leading-relaxed`}>
                  The correct answer is: <strong>{currentQuestion.correct_answer}</strong>
                </p>
                
                {quizConfig.mode === 'study' && (
                  <div className="mt-3 pt-3 border-t border-green-700">
                    <div className="flex items-center mb-2">
                      <span className="mr-2 text-green-300">🔍</span>
                      <h5 className="text-green-300 font-medium text-sm">Key Points to Remember:</h5>
                    </div>
                    <ul className="list-disc list-inside text-green-200 text-sm space-y-1 pl-1">
                      {/* Dynamic content will be provided by AI Tutor */}
                      <li>Pay attention to the specific road signs and markings shown</li>
                      <li>Remember the right-of-way rules at intersections</li>
                      <li>Consider safety implications of each possible action</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* AI Tutor */}
            {quizConfig.aiTutor && showExplanation && (
              <AITutor
                currentQuestion={currentQuestion}
                userAnswer={selectedAnswer}
                isCorrect={isAnswerCorrect}
                onAdvice={handleAiAdvice}
                gameMode={quizConfig.gameMode}
                characterName={quizConfig.characterName}
                showDetailedExplanations={quizConfig.showDetailedExplanations}
                focusOnZimbabweLaws={quizConfig.focusOnZimbabweLaws}
              />
            )}

            {/* Navigation Buttons */}
            {showExplanation && (
              <div className="flex justify-center gap-3 mt-3 sm:mt-4">
                {currentQuestionIndex > 0 && (
                  <button
                    onClick={previousQuestion}
                    className="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition-colors duration-200 touch-manipulation text-xs sm:text-base border border-gray-500 sm:w-auto"
                  >
                    Previous Question
                  </button>
                )}
                <button
                  onClick={nextQuestion}
                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition-colors duration-200 touch-manipulation text-xs sm:text-base border border-blue-500 sm:w-auto"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                </button>
              </div>
            )}
          </div>
            );
          }
          return null;
        }, [currentQuestion, currentQuestionIndex, questions.length, score, showExplanation, timeLeft, selectedAnswer, isAnswerCorrect, quizConfig, handleAnswerSelect, nextQuestion, previousQuestion, stage])}

        {/* Results Screen */}
        {useMemo(() => {
          if (stage === 'result') {
            return (
          <div className="bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-center border border-gray-800">
            <div className="mb-4 sm:mb-6">
              <div className="text-3xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">
                {score >= questions.length * 0.8 ? '🎉' : score >= questions.length * 0.7 ? '👍' : '📚'}
              </div>
              <h2 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Quiz Complete!</h2>
              <div className={`text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 ${getScoreColor(score, questions.length)}`}>
                {score} / {questions.length}
              </div>
              <div className={`text-base sm:text-xl mb-3 sm:mb-4 ${getScoreColor(score, questions.length)}`}>
                {Math.round((score / questions.length) * 100)}%
              </div>
              <p className="text-gray-300 text-sm sm:text-lg mb-4 sm:mb-6 leading-relaxed px-2">
                {getScoreMessage(score, questions.length)}
              </p>
            </div>

            {/* Performance Breakdown */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Performance Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-400">{score}</div>
                  <div className="text-gray-300">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-red-400">{questions.length - score}</div>
                  <div className="text-gray-300">Incorrect</div>
                </div>
              </div>
            </div>
            
            {/* Removed leaderboard section - now accessible via floating trophy icon */}
            
            {/* Spaced Repetition functionality is enabled in the background but stats are hidden from the UI */}
            
            {/* Zimbabwe Study Resources - Only shown when Zimbabwe focus is enabled */}
            {quizConfig.focusOnZimbabweLaws && (
              <div className="mb-6 p-6 bg-green-900/30 border border-green-700 rounded-lg text-left">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <span className="mr-2">🇿🇼</span> Zimbabwe Driving Resources
                </h3>
                <p className="mb-4 text-green-100">Continue your study with these official Zimbabwe driving resources:</p>
                
                <ul className="list-disc pl-5 mb-4 text-green-100 space-y-2">
                  <li>Zimbabwe Traffic Safety Council - Road safety information and defensive driving courses</li>
                  <li>Zimbabwe Highway Code - Official rules and regulations for driving in Zimbabwe</li>
                  <li>Vehicle Inspection Department (VID) - Official testing center information</li>
                  <li>Central Vehicle Registry (CVR) - Vehicle registration and licensing information</li>
                </ul>
                
                <div className="mt-4 p-3 bg-green-900/50 rounded border border-green-800">
                  <p className="text-sm text-green-100">
                    <strong>Study Tip:</strong> The Zimbabwe Highway Code is the most comprehensive resource for learning driving laws and regulations in Zimbabwe. It covers all aspects of road safety, traffic signs, and driving procedures.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={() => startQuiz()}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base transition-colors duration-200 shadow-md hover:shadow-lg touch-manipulation w-full mx-auto border border-blue-500"
              >
                Take Another Quiz
              </button>
              <div>
                <button
                  onClick={() => setStage('start')}
                  className="text-blue-400 hover:text-blue-300 active:text-blue-200 font-medium transition-colors duration-200 touch-manipulation text-sm mt-2"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
            );
          }
          return null;
        }, [score, questions.length, quizConfig.focusOnZimbabweLaws, getScoreColor, getScoreMessage, startQuiz, stage])}

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-gray-400 text-xs sm:text-sm px-4">
          <p>© 2024 Driving License Quiz App • Study Safe, Drive Safe</p>
        </div>
      </div>
    </div>
  );
}
