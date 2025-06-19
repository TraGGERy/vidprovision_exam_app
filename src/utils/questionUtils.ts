import questionsData from '../../questions.json';

// Define interfaces to match JSON structure
export interface Question {
  question_id: string;
  question_text: string;
  image_url?: string;
  options: string[];
  correct_answer: string;
}

export interface DrivingTest {
  test_id: string;
  questions: Question[];
}

export interface QuestionsData {
  driving_tests: DrivingTest[];
}

// Function to get all questions from all tests
export const getAllQuestions = (): Question[] => {
  const data = questionsData as QuestionsData;
  return data.driving_tests.flatMap(test => test.questions);
};

// Function to get questions by test ID
export const getQuestionsByTest = (testId: string): Question[] => {
  const data = questionsData as QuestionsData;
  const test = data.driving_tests.find(test => test.test_id === testId);
  return test ? test.questions : [];
};

// Function to get all available test IDs
export const getAllTestIds = (): string[] => {
  const data = questionsData as QuestionsData;
  return data.driving_tests.map(test => test.test_id);
};

// Function to shuffle array
export const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Function to get a random set of questions
export const getRandomQuestions = (count: number): Question[] => {
  const allQuestions = getAllQuestions();
  return shuffle(allQuestions).slice(0, count);
};

// Function to convert string answer to index
export const getAnswerIndex = (question: Question): number => {
  return question.options.findIndex(option => option === question.correct_answer);
};

// Function to check if an answer is correct
export const isAnswerCorrect = (question: Question, selectedOption: string): boolean => {
  return selectedOption === question.correct_answer;
};