import { useState, useEffect, useCallback } from 'react';
import { searchPeople, searchMovies } from '~/services/api';
import { SearchType, SwapiPerson, SwapiFilm, SearchResultItem } from '~/types';

export interface UseSearchReturn {
  results: SearchResultItem<SwapiPerson | SwapiFilm>[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  search: (term: string) => Promise<void>;
  clear: () => void;
}

export const useSearch = (): UseSearchReturn => {
  const [searchType, setSearchType] = useState<SearchType>('people');
  const [results, setResults] = useState<SearchResultItem<SwapiPerson | SwapiFilm>[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Search function
  const search = useCallback(async (searchTerm: string): Promise<void> => {
    setHasSearched(true);
    setLoading(true);
    setError(null);

    try {
      let response;

      switch (searchType) {
        case 'people':
          response = await searchPeople(searchTerm);
          break;
        case 'movies':
          response = await searchMovies(searchTerm);
          break;
        default:
          response = await searchPeople(searchTerm);
      }

      setResults(response.data.result);
    } catch (err: any) {
      setError('Failed to fetch results. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [searchType]);

  // Clear results when search type changes
  useEffect(() => {
    setResults([]);
  }, [searchType]);

  // Clear search
  const clear = useCallback((): void => {
    setHasSearched(false);
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    hasSearched,
    searchType,
    setSearchType,
    search,
    clear,
  };
};

export default useSearch;
