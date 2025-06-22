import { shuffle } from './questionUtils';

// List of fake user names
const fakeUserNames = [
  'Tragger', 'Tinashe', 'Chiedza', 'Farai', 'Tatenda', 
  'Kudzai', 'Tendai', 'Nyasha', 'Tafadzwa', 'Vimbai',
  'Simba', 'Chipo', 'Tapiwa', 'Rudo', 'Blessing',
  'Takudzwa', 'Panashe', 'Shamiso', 'Tanaka', 'Mazvita'
];

export interface LeaderboardUser {
  name: string;
  score: number;
  totalQuestions: number;
  isCurrentUser: boolean;
}

/**
 * Generates a leaderboard with fake users and the current user
 * @param userScore - The current user's score
 * @param totalQuestions - The total number of questions in the quiz
 * @param leaderboardSize - The number of users to show in the leaderboard (default: 10)
 * @returns An array of LeaderboardUser objects sorted by score (highest first)
 */
export const generateLeaderboard = (
  userScore: number,
  totalQuestions: number,
  leaderboardSize: number = 10
): LeaderboardUser[] => {
  // Create a pool of fake users with random scores
  const fakeUsers: LeaderboardUser[] = shuffle(fakeUserNames)
    .slice(0, leaderboardSize - 1) // Leave room for the current user
    .map(name => {
      // Generate a random score that's realistic
      // Higher chance of scores between 60-90% to make it competitive
      const randomFactor = Math.random();
      let scorePercentage;
      
      if (randomFactor < 0.1) {
        // 10% chance of low score (40-60%)
        scorePercentage = 0.4 + (Math.random() * 0.2);
      } else if (randomFactor < 0.8) {
        // 70% chance of medium score (60-90%)
        scorePercentage = 0.6 + (Math.random() * 0.3);
      } else {
        // 20% chance of high score (90-100%)
        scorePercentage = 0.9 + (Math.random() * 0.1);
      }
      
      const score = Math.floor(scorePercentage * totalQuestions);
      
      return {
        name,
        score,
        totalQuestions,
        isCurrentUser: false
      };
    });
  
  // Add the current user
  const currentUser: LeaderboardUser = {
    name: 'You',
    score: userScore,
    totalQuestions,
    isCurrentUser: true
  };
  
  // Combine and sort by score (highest first)
  const allUsers = [...fakeUsers, currentUser].sort((a, b) => b.score - a.score);
  
  // Find the current user's position
  const userPosition = allUsers.findIndex(user => user.isCurrentUser) + 1;
  
  // Update the current user's name to include position
  allUsers.find(user => user.isCurrentUser)!.name = `You (${getOrdinal(userPosition)})`;
  
  return allUsers;
};

/**
 * Converts a number to its ordinal form (1st, 2nd, 3rd, etc.)
 */
const getOrdinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};