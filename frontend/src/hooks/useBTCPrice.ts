import { useState, useEffect } from "react";

const API_BASE_URL =
  process.env.REACT_APP_BTC_PRICE_URL ||
  "https://api.coinbase.com/v2/prices/spot?currency=USD";
const REFRESH_INTERVAL_MILLISECONDS = 10000;

const useBTCPrice = () => {
  const [price, setPrice] = useState<number | null>(null);
  const [priceAtTimeOfGuess, setPriceAtTimeOfGuess] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const fetchBTCPrice = async () => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error while fetching Bitcoin price");
      }

      const { data } = await response.json();
      const btcPrice = parseFloat(data.amount);
      setPrice(btcPrice);
    } catch (err: any) {
      setError(err.message || "Failed to fetch Bitcoin price");
    }
  };

  useEffect(() => {
    fetchBTCPrice();
    const interval = setInterval(fetchBTCPrice, REFRESH_INTERVAL_MILLISECONDS);

    return () => clearInterval(interval);
  }, []);

  return { price, priceAtTimeOfGuess, setPriceAtTimeOfGuess, error };
};

export default useBTCPrice;