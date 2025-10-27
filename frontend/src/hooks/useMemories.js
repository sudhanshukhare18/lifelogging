import { useState, useEffect, useCallback } from 'react';
import { memoryAPI } from '../services/api';

export const useMemories = (initialFilters = {}) => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchMemories = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await memoryAPI.getMemories({ ...filters, ...params });
      setMemories(response.data.results || response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch memories');
      console.error('Error fetching memories:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Semantic search
  const searchMemories = async (query) => {
    if (!query.trim()) {
      await fetchMemories();
      return;
    }
    
    setLoading(true);
    try {
      const response = await memoryAPI.semanticSearch(query);
      setMemories(response.data);
    } catch (err) {
      setError('Search failed');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations
  const createMemory = async (memoryData) => {
    try {
      const response = await memoryAPI.createMemory(memoryData);
      setMemories(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError('Failed to create memory');
      throw err;
    }
  };

  const updateMemory = async (id, memoryData) => {
    try {
      const response = await memoryAPI.updateMemory(id, memoryData);
      setMemories(prev => prev.map(m => m.id === id ? response.data : m));
      return response.data;
    } catch (err) {
      setError('Failed to update memory');
      throw err;
    }
  };

  const deleteMemory = async (id) => {
    try {
      await memoryAPI.deleteMemory(id);
      setMemories(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      setError('Failed to delete memory');
      throw err;
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  return {
    memories,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchMemories,
    searchMemories,
    createMemory,
    updateMemory,
    deleteMemory,
  };
};