'use client';

import React, { useMemo } from 'react';
import { generateLeaderboard } from '../utils/leaderboardUtils';
import { Question } from '../utils/questionUtils';

interface LeaderboardTableProps {
  score: number;
  questions: Question[];
  limit?: number;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ score, questions, limit = 10 }) => {
  // Memoize the leaderboard generation to prevent unnecessary recalculations
  const leaderboard = useMemo(() => {
    return generateLeaderboard(score, questions.length, limit);
  }, [score, questions.length, limit]);

  return (
    <div className="overflow-hidden rounded-lg border border-blue-800">
      <table className="min-w-full divide-y divide-blue-800">
        <thead className="bg-blue-900/50">
          <tr>
            <th scope="col" className="px-2 py-1 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
              Rank
            </th>
            <th scope="col" className="px-2 py-1 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-2 py-1 text-right text-xs font-medium text-blue-300 uppercase tracking-wider">
              Score
            </th>
          </tr>
        </thead>
        <tbody className="bg-blue-900/20 divide-y divide-blue-800">
          {leaderboard.map((user, index) => (
            <tr key={index} className={user.isCurrentUser ? 'bg-blue-700/30' : ''}>
              <td className="px-2 py-1 whitespace-nowrap text-xs text-gray-300">
                {index + 1}
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-xs">
                <span className={user.isCurrentUser ? 'font-bold text-white' : 'text-gray-300'}>
                  {user.name}
                </span>
              </td>
              <td className="px-2 py-1 whitespace-nowrap text-xs text-right">
                <span className={user.isCurrentUser ? 'font-bold text-white' : 'text-gray-300'}>
                  {user.score}/{user.totalQuestions}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;