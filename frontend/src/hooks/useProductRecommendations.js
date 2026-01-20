/**
 * Custom hook to fetch diagnosis-based product recommendations.
 * 
 * @returns {Object} { products, loading, error, recommendationReason, reload }
 */
import { useState, useEffect, useCallback } from "react";
import instance from "../api/axios";

const useProductRecommendations = () => {
  const [products, setProducts] = useState([]);
  const [recommendationReason, setRecommendationReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get("/inventory/recommendations");
      setProducts(response.data.products || []);
      setRecommendationReason(response.data.recommendationReason || "");
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to load recommendations");
      // Could set fallback products here locally if needed, but backend handles it
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { products, loading, error, recommendationReason, reload: fetchRecommendations };
};

export default useProductRecommendations;
