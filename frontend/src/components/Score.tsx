import React from "react";

interface ScoreProps {
  score: number | null;
  loading: boolean;
  error: string | null;
}

const Score: React.FC<ScoreProps> = ({ score, loading, error }) => {
  return (
    <section className="text-center mt-8" aria-labelledby="score-title">
      <div className="bg-white p-6 rounded-xl shadow-lg w-56 opacity-90">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Score 🎯</h3>
        <div className="text-3xl font-bold text-gray-900">
          {loading ? (
            "Loading..."
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            score !== null ? `${score}` : '-'
          )}
        </div>
      </div>
    </section>
  );
};

export default Score;
