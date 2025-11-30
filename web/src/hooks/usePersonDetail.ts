import { useState, useEffect } from 'react';
import { getPersonById } from '~/services/api';
import { SwapiPersonWithFilms, SwapiDetailResponse } from '~/types';

export interface UsePersonDetailReturn {
  person: SwapiDetailResponse<SwapiPersonWithFilms> | null;
  loading: boolean;
  error: string | null;
}

export const usePersonDetail = (id: string | undefined): UsePersonDetailReturn => {
  const [person, setPerson] = useState<SwapiDetailResponse<SwapiPersonWithFilms> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonDetails = async (): Promise<void> => {
      if (!id) {
        setError('Invalid person ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getPersonById(id);
        setPerson(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch person details');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [id]);

  return {
    person,
    loading,
    error,
  };
};

export default usePersonDetail;
