interface QuizTimerProps {
  timeLeft: number;
  isActive: boolean;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({ timeLeft, isActive }) => {
  return (
    <div className="mb-4 sm:mb-6 text-center">
      <div className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${
        timeLeft <= 10 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
      }`}>
        <span className="mr-2">⏱️</span>
        Time: {timeLeft}s
      </div>
    </div>
  );
};