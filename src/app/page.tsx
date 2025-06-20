'use client';

import { useState, useEffect, useMemo } from "react";
import QuestionImage from "../components/QuestionImage";
import { Question, getAllQuestions, getQuestionsByTest, getAllTestIds, shuffle } from "../utils/questionUtils";

// Legacy interface for backward compatibility
// Removed unused interface

// Legacy questions array (keeping for reference)


// Quiz modes
type QuizMode = 'random' | 'by-test' | 'practice' | 'exam';

interface QuizConfig {
  mode: QuizMode;
  testId?: string;
  questionCount: number;
  timeLimit: number; // in seconds
}

export default function DrivingQuizApp() {
  // Quiz configuration
  const [quizConfig, setQuizConfig] = useState<QuizConfig>({
    mode: 'random',
    questionCount: 20,
    timeLimit: 30
  });
  
  const [stage, setStage] = useState<'start' | 'quiz' | 'result'>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
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

  // Timer effect
  useEffect(() => {
    if (stage === 'quiz' && timeLeft > 0 && !showExplanation) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showExplanation) {
      handleTimeUp();
    }
  }, [timeLeft, stage, showExplanation]); // Removed handleTimeUp from dependency array since it's defined later

  const startQuiz = (config: QuizConfig = quizConfig) => {
    // Get questions based on configuration
    let selectedQuestions: Question[] = [];
    
    if (config.mode === 'by-test' && config.testId) {
      // Get questions from specific test
      const testQuestions = getQuestionsByTest(config.testId);
      selectedQuestions = shuffle(testQuestions).slice(0, config.questionCount);
    } else {
      // Get random questions from all tests
      selectedQuestions = shuffle(availableQuestions).slice(0, config.questionCount);
    }
    
    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimeLeft(config.timeLimit);
    // setQuizStartTime(new Date()); // Removed assignment to unused variable
    setStage('quiz');
  };

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer !== null || showExplanation) return;
    
    setSelectedAnswer(option);
    setShowExplanation(true);
    
    const newUserAnswers = [...userAnswers, option];
    setUserAnswers(newUserAnswers);
    
    if (option === questions[currentQuestionIndex].correct_answer) {
      setScore(score + 1);
    }
  };

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer(''); // Indicate no answer selected
      setUserAnswers([...userAnswers, '']);
      setShowExplanation(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(quizConfig.timeLimit);
    } else {
      setStage('result');
    }
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'Excellent! You\'re ready to drive safely!';
    if (percentage >= 80) return 'Great job! You have a good understanding of driving rules.';
    if (percentage >= 70) return 'Good work! Review the areas you missed.';
    if (percentage >= 60) return 'You\'re getting there! More study needed.';
    return 'Keep studying! Practice makes perfect.';
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-black py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">🚗 Driving License Quiz</h1>
          <p className="text-sm sm:text-base text-gray-300">Test your knowledge of driving rules and regulations</p>
        </div>

        {/* Start Screen */}
        {stage === 'start' && (
          <div className="bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-800">
            <div className="mb-6 text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4">🚦</div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Ready to Test Your Driving Knowledge?</h2>
              <p className="text-sm sm:text-base text-gray-300 mb-6">Configure your quiz below and test your driving knowledge!</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quiz Mode</label>
                <select 
                  className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={quizConfig.mode}
                  onChange={(e) => setQuizConfig({...quizConfig, mode: e.target.value as QuizMode})}
                >
                  <option value="random">Random Questions</option>
                  <option value="by-test">Specific Test</option>
                  <option value="practice">Practice Mode</option>
                  <option value="exam">Exam Mode</option>
                </select>
              </div>
              
              {quizConfig.mode === 'by-test' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Test</label>
                  <select 
                    className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Number of Questions</label>
                <select 
                  className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={quizConfig.questionCount}
                  onChange={(e) => setQuizConfig({...quizConfig, questionCount: parseInt(e.target.value)})}
                >
                  <option value={10}>10 Questions</option>
                  <option value={20}>20 Questions</option>
                  <option value={30}>30 Questions</option>
                  <option value={50}>50 Questions</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time Per Question</label>
                <select 
                  className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={quizConfig.timeLimit}
                  onChange={(e) => setQuizConfig({...quizConfig, timeLimit: parseInt(e.target.value)})}
                >
                  <option value={15}>15 Seconds</option>
                  <option value={30}>30 Seconds</option>
                  <option value={45}>45 Seconds</option>
                  <option value={60}>60 Seconds</option>
                </select>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => startQuiz()}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors duration-200 shadow-md hover:shadow-lg touch-manipulation border border-blue-500"
              >
                Start Quiz
              </button>
            </div>
          </div>
        )}

        {/* Quiz Screen */}
        {stage === 'quiz' && currentQuestion && (
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
            </div>

            {/* Timer */}
            <div className="mb-4 sm:mb-6 text-center">
              <div className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${
                timeLeft <= 10 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <span className="mr-2">⏱️</span>
                Time: {timeLeft}s
              </div>
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
              <div className="space-y-2 sm:space-y-3">
                {currentQuestion.options.map((option, index) => {
                  let buttonClass = "w-full p-3 sm:p-4 text-left rounded-lg border-2 transition-all duration-200 touch-manipulation text-sm sm:text-base ";
                  
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
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-900 border border-blue-700 rounded-lg">
                <h4 className="font-semibold text-blue-100 mb-2 text-sm sm:text-base">Correct Answer:</h4>
                <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                  The correct answer is: <strong>{currentQuestion.correct_answer}</strong>
                </p>
              </div>
            )}

            {/* Next Button */}
            {showExplanation && (
              <div className="text-center">
                <button
                  onClick={nextQuestion}
                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 touch-manipulation text-sm sm:text-base border border-blue-500"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Screen */}
        {stage === 'result' && (
          <div className="bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-center border border-gray-800">
            <div className="mb-6">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4">
                {score >= questions.length * 0.8 ? '🎉' : score >= questions.length * 0.7 ? '👍' : '📚'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Quiz Complete!</h2>
              <div className={`text-3xl sm:text-4xl font-bold mb-4 ${getScoreColor(score, questions.length)}`}>
                {score} / {questions.length}
              </div>
              <div className={`text-lg sm:text-xl mb-4 ${getScoreColor(score, questions.length)}`}>
                {Math.round((score / questions.length) * 100)}%
              </div>
              <p className="text-gray-300 text-base sm:text-lg mb-6 leading-relaxed px-2">
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

            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={() => startQuiz()}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors duration-200 shadow-md hover:shadow-lg touch-manipulation w-full sm:w-auto border border-blue-500"
              >
                Take Another Quiz
              </button>
              <div>
                <button
                  onClick={() => setStage('start')}
                  className="text-blue-400 hover:text-blue-300 active:text-blue-200 font-medium transition-colors duration-200 touch-manipulation text-sm sm:text-base"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-gray-400 text-xs sm:text-sm px-4">
          <p>© 2024 Driving License Quiz App • Study Safe, Drive Safe</p>
        </div>
      </div>
    </div>
  );
}
