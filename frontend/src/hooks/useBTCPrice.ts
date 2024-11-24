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
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBTCPrice = async () => {
    try {
      setLoading(true);
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
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch Bitcoin price");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBTCPrice();
    const interval = setInterval(fetchBTCPrice, REFRESH_INTERVAL_MILLISECONDS);

    return () => clearInterval(interval);
  }, []);

  return {
    price,
    priceAtTimeOfGuess,
    setPriceAtTimeOfGuess,
    finalPrice,
    setFinalPrice,
    error,
    loading,
  };
};

export default useBTCPrice;
