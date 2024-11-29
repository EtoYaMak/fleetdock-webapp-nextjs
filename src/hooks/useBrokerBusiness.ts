import { useState, useEffect } from 'react';
import { BrokerBusiness } from '@/types/broker';

export function useBrokerBusiness() {
  const [business, setBusiness] = useState<BrokerBusiness | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusiness = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/broker/business');
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);
      setBusiness(data.business);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch business details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, []);

  const updateBusiness = async (businessData: Partial<BrokerBusiness>) => {
    try {
      const response = await fetch('/api/broker/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setBusiness(data.business);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update business'
      };
    }
  };

  return { 
    business, 
    isLoading, 
    error, 
    updateBusiness,
    refetch: fetchBusiness
  };
} 