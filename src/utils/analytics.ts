export interface QuizSession {
  id: string;
  date: Date;
  mode: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  categories: Record<string, { correct: number; total: number }>;
}

export const saveQuizSession = (session: QuizSession) => {
  const sessions = getQuizSessions();
  sessions.push(session);
  localStorage.setItem('quiz-sessions', JSON.stringify(sessions));
};

export const getQuizSessions = (): QuizSession[] => {
  try {
    const sessions = localStorage.getItem('quiz-sessions');
    return sessions ? JSON.parse(sessions) : [];
  } catch {
    return [];
  }
};

export const getPerformanceStats = () => {
  const sessions = getQuizSessions();
  return {
    totalQuizzes: sessions.length,
    averageScore: sessions.reduce((acc, s) => acc + (s.correctAnswers / s.totalQuestions), 0) / sessions.length,
    weakestCategories: Object.entries(
      sessions.reduce((acc, session) => {
        Object.entries(session.categories).forEach(([cat, stats]) => {
          if (!acc[cat]) acc[cat] = { correct: 0, total: 0 };
          acc[cat].correct += stats.correct;
          acc[cat].total += stats.total;
        });
        return acc;
      }, {} as Record<string, { correct: number; total: number }>)
    ).sort(([,a], [,b]) => (a.correct/a.total) - (b.correct/b.total))
  };
};