import { useState, useEffect } from 'react';
import { getMovieById } from '~/services/api';
import { SwapiFilmWithCharacters, SwapiDetailResponse } from '~/types';

export interface UseMovieDetailReturn {
  movie: SwapiDetailResponse<SwapiFilmWithCharacters> | null;
  loading: boolean;
  error: string | null;
}

export const useMovieDetail = (id: string | undefined): UseMovieDetailReturn => {
  const [movie, setMovie] = useState<SwapiDetailResponse<SwapiFilmWithCharacters> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async (): Promise<void> => {
      if (!id) {
        setError('Invalid movie ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getMovieById(id);
        setMovie(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  return {
    movie,
    loading,
    error,
  };
};

export default useMovieDetail;
