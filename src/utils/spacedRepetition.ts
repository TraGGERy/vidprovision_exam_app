import { Question } from './questionUtils';

// Define the difficulty levels for the spaced repetition algorithm
export enum DifficultyLevel {
  VeryHard = 0,  // Review very frequently
  Hard = 1,      // Review frequently
  Medium = 2,    // Review occasionally
  Easy = 3,      // Review rarely
  VeryEasy = 4   // Review very rarely
}

// Define the structure for tracking question performance
export interface QuestionPerformance {
  questionId: string;
  correctCount: number;
  incorrectCount: number;
  lastAnsweredAt: number; // timestamp
  nextReviewAt: number;   // timestamp
  difficultyLevel: DifficultyLevel;
  consecutiveCorrect: number;
}

// Define the structure for the user's study progress
export interface StudyProgress {
  questionPerformance: Record<string, QuestionPerformance>;
  lastStudySession: number; // timestamp
}

// Initialize or get the user's study progress from localStorage
export const getStudyProgress = (): StudyProgress => {
  if (typeof window === 'undefined') {
    return { questionPerformance: {}, lastStudySession: Date.now() };
  }
  
  const savedProgress = localStorage.getItem('studyProgress');
  if (savedProgress) {
    return JSON.parse(savedProgress);
  }
  
  return { questionPerformance: {}, lastStudySession: Date.now() };
};

// Save the user's study progress to localStorage
export const saveStudyProgress = (progress: StudyProgress): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('studyProgress', JSON.stringify(progress));
};

// Calculate the next review time based on difficulty level
const calculateNextReview = (difficultyLevel: DifficultyLevel): number => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000; // milliseconds in a day
  
  switch (difficultyLevel) {
    case DifficultyLevel.VeryHard:
      return now + (1 * day); // Review after 1 day
    case DifficultyLevel.Hard:
      return now + (3 * day); // Review after 3 days
    case DifficultyLevel.Medium:
      return now + (7 * day); // Review after 1 week
    case DifficultyLevel.Easy:
      return now + (14 * day); // Review after 2 weeks
    case DifficultyLevel.VeryEasy:
      return now + (30 * day); // Review after 1 month
    default:
      return now + (1 * day); // Default to 1 day
  }
};

// Update the performance record for a question after answering
export const updateQuestionPerformance = (
  questionId: string,
  isCorrect: boolean
): void => {
  const progress = getStudyProgress();
  const now = Date.now();
  
  // Get or initialize the performance record for this question
  const performance = progress.questionPerformance[questionId] || {
    questionId,
    correctCount: 0,
    incorrectCount: 0,
    lastAnsweredAt: now,
    nextReviewAt: now,
    difficultyLevel: DifficultyLevel.Medium,
    consecutiveCorrect: 0
  };
  
  // Update the performance based on the answer
  if (isCorrect) {
    performance.correctCount++;
    performance.consecutiveCorrect++;
    
    // Potentially make the question easier if consistently correct
    if (performance.consecutiveCorrect >= 3 && performance.difficultyLevel < DifficultyLevel.VeryEasy) {
      performance.difficultyLevel = (performance.difficultyLevel + 1) as DifficultyLevel;
      performance.consecutiveCorrect = 0; // Reset consecutive correct counter after level change
    }
  } else {
    performance.incorrectCount++;
    performance.consecutiveCorrect = 0;
    
    // Make the question harder when answered incorrectly
    if (performance.difficultyLevel > DifficultyLevel.VeryHard) {
      performance.difficultyLevel = (performance.difficultyLevel - 1) as DifficultyLevel;
    }
  }
  
  // Update timestamps
  performance.lastAnsweredAt = now;
  performance.nextReviewAt = calculateNextReview(performance.difficultyLevel);
  
  // Save the updated performance
  progress.questionPerformance[questionId] = performance;
  progress.lastStudySession = now;
  saveStudyProgress(progress);
};

// Get questions that are due for review based on spaced repetition algorithm
export const getQuestionsForReview = (allQuestions: Question[], count: number): Question[] => {
  const progress = getStudyProgress();
  const now = Date.now();
  
  // Filter questions that are due for review
  const dueQuestions = allQuestions.filter(question => {
    const performance = progress.questionPerformance[question.question_id];
    
    // If no performance record exists or it's due for review
    return !performance || performance.nextReviewAt <= now;
  });
  
  // Sort questions by priority (hardest first)
  const sortedQuestions = dueQuestions.sort((a, b) => {
    const perfA = progress.questionPerformance[a.question_id];
    const perfB = progress.questionPerformance[b.question_id];
    
    // If no performance record, prioritize new questions
    if (!perfA) return -1;
    if (!perfB) return 1;
    
    // Sort by difficulty level (hardest first)
    return perfA.difficultyLevel - perfB.difficultyLevel;
  });
  
  // Return the requested number of questions
  return sortedQuestions.slice(0, count);
};

// Get the difficulty level description for a question
export const getDifficultyDescription = (questionId: string): string => {
  const progress = getStudyProgress();
  const performance = progress.questionPerformance[questionId];
  
  if (!performance) return 'New Question';
  
  switch (performance.difficultyLevel) {
    case DifficultyLevel.VeryHard:
      return 'Very Hard';
    case DifficultyLevel.Hard:
      return 'Hard';
    case DifficultyLevel.Medium:
      return 'Medium';
    case DifficultyLevel.Easy:
      return 'Easy';
    case DifficultyLevel.VeryEasy:
      return 'Very Easy';
    default:
      return 'Unknown';
  }
};

// Get statistics about the user's overall progress
export const getProgressStats = (): {
  totalAnswered: number;
  totalCorrect: number;
  totalIncorrect: number;
  masteryPercentage: number;
} => {
  const progress = getStudyProgress();
  const performances = Object.values(progress.questionPerformance);
  
  const totalAnswered = performances.length;
  const totalCorrect = performances.reduce((sum, perf) => sum + perf.correctCount, 0);
  const totalIncorrect = performances.reduce((sum, perf) => sum + perf.incorrectCount, 0);
  
  // Calculate mastery percentage (questions at Easy or Very Easy level)
  const masteredQuestions = performances.filter(
    perf => perf.difficultyLevel >= DifficultyLevel.Easy
  ).length;
  
  const masteryPercentage = totalAnswered > 0 
    ? (masteredQuestions / totalAnswered) * 100 
    : 0;
  
  return {
    totalAnswered,
    totalCorrect,
    totalIncorrect,
    masteryPercentage
  };
};