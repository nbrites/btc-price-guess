import React from "react";

interface ScoreProps {
  score: number | null;
  loading: boolean;
  error: string | null;
}

const Score: React.FC<ScoreProps> = ({ score, loading, error }) => {
  return (
    <section className="text-center mt-8" aria-labelledby="score-title">
      <div className="bg-white p-6 rounded-xl shadow-lg w-56" aria-live="polite">
        {loading ? (
          <p>Loading score...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Score 🎯</h3>
            <p
              className="text-3xl font-bold text-gray-500"
              aria-label={`Current score is ${score}`}
            >
              {score}
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default Score;
