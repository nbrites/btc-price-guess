import { useState, useEffect } from "react";

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

  return { score, loading, error };
};

export default useScore;
