import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem("userId", storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  return userId;
};

export default useUserId;
