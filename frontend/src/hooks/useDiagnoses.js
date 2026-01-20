import { useState, useEffect } from "react";
import instance from "../api/axios";

const useDiagnoses = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const response = await instance.get("/diagnoses");
        setDiagnoses(response.data.map((d) => d.name)); // Map to simple array of strings for compatibility
        setLoading(false);
      } catch (err) {
        console.error("Error fetching diagnoses:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, []);

  return { diagnoses, loading, error };
};

export default useDiagnoses;
