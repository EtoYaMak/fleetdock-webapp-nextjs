import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import supabase from '@/lib/supabase';
import { LoadType } from '@/types/loads';

export function useLoadTypes() {
  const [loadTypes, setLoadTypes] = useState<LoadType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track component mount state
  const isMounted = useRef(true);
  const lastFetchTime = useRef(0);
  const FETCH_COOLDOWN = 60000; // 1 minute cooldown since load types rarely change

  // Memoize fetch function
  const fetchLoadTypes = useCallback(async (forceFetch = false) => {
    const now = Date.now();
    if (!forceFetch && now - lastFetchTime.current < FETCH_COOLDOWN) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('load_types')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;
      if (!isMounted.current) return;

      setLoadTypes(data || []);
      lastFetchTime.current = now;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch load types');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Initial fetch and cleanup
  useEffect(() => {
    fetchLoadTypes(true);
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchLoadTypes]);

  // Memoize return value
  return useMemo(() => ({
    loadTypes,
    isLoading,
    error,
    refetch: fetchLoadTypes
  }), [loadTypes, isLoading, error, fetchLoadTypes]);
} 