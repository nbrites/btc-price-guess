import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const useScore = (userId: string | null) => {
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError("User ID is missing");
      setLoading(false);
      return;
    }

    const fetchScore = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/scores/${userId}`);
        const data = await response.json();
        setScore(data.score || 0);
        setError(null);
      } catch (err) {
        setError("Failed to fetch score");
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [userId]);

  const upsertScore = useCallback(
    async (newScore: number) => {
      if (!userId) {
        setError("User ID is missing");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/scores`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, score: newScore }),
        });

        if (!response.ok) {
          throw new Error("Failed to upsert score");
        }
        setScore(newScore);
      } catch (err) {
        setError("Failed to upsert the score");
      }
    },
    [userId]
  );

  return { score, loading, error, upsertScore };
};

export default useScore;
