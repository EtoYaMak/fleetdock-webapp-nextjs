import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { LoadType } from '@/types/loads';

export function useLoadTypes() {
  const [loadTypes, setLoadTypes] = useState<LoadType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoadTypes = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('load_types')
          .select('*')
          .order('name');

        if (error) throw error;

        setLoadTypes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch load types');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoadTypes();
  }, []);

  return { loadTypes, isLoading, error };
} 