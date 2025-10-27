import { useState, useEffect } from 'react';
import { memoryAPI } from '../services/api';

export const useEmotionStats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await memoryAPI.getEmotionStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch emotion statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};