import { renderHook, act, waitFor } from '@testing-library/react';
import { mockPersonSearchResponse, mockFilmSearchResponse } from '../../mocks/fixtures';

// Mocks must be declared before importing the module that uses them
const mockSearchPeople = jest.fn();
const mockSearchMovies = jest.fn();

jest.mock('~/services/api', () => ({
  searchPeople: (...args: any[]) => mockSearchPeople(...args),
  searchMovies: (...args: any[]) => mockSearchMovies(...args),
  getPersonById: jest.fn(),
  getMovieById: jest.fn(),
}));

import { useSearch } from '~/hooks/useSearch';

describe('useSearch', () => {
  beforeEach(() => {
    mockSearchPeople.mockReset();
    mockSearchMovies.mockReset();
  });

  describe('Initial state', () => {
    it('should return correct initial state', () => {
      const { result } = renderHook(() => useSearch());

      expect(result.current.results).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.hasSearched).toBe(false);
      expect(result.current.searchType).toBe('people');
    });
  });

  describe('search() with people', () => {
    it('should search people successfully', async () => {
      mockSearchPeople.mockResolvedValueOnce({ data: mockPersonSearchResponse.data });

      const { result } = renderHook(() => useSearch());

      await act(async () => {
        await result.current.search('Luke');
      });

      expect(mockSearchPeople).toHaveBeenCalledWith('Luke');
      expect(result.current.results).toEqual(mockPersonSearchResponse.data.result);
      expect(result.current.loading).toBe(false);
      expect(result.current.hasSearched).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should set loading=true during search', async () => {
      mockSearchPeople.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: mockPersonSearchResponse.data }), 100))
      );

      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.search('Luke');
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('search() with movies', () => {
    it('should search movies successfully', async () => {
      mockSearchMovies.mockResolvedValueOnce({ data: mockFilmSearchResponse.data });

      const { result } = renderHook(() => useSearch());

      // Switch to movies
      act(() => {
        result.current.setSearchType('movies');
      });

      await act(async () => {
        await result.current.search('Hope');
      });

      expect(mockSearchMovies).toHaveBeenCalledWith('Hope');
      expect(result.current.results).toEqual(mockFilmSearchResponse.data.result);
      expect(result.current.loading).toBe(false);
      expect(result.current.hasSearched).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should set error when search fails', async () => {
      mockSearchPeople.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useSearch());

      await act(async () => {
        await result.current.search('Luke');
      });

      expect(result.current.error).toBe('Failed to fetch results. Please try again.');
      expect(result.current.results).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.hasSearched).toBe(true);
    });
  });

  describe('clear()', () => {
    it('should clear results and states', async () => {
      mockSearchPeople.mockResolvedValueOnce({ data: mockPersonSearchResponse.data });

      const { result } = renderHook(() => useSearch());

      // First perform a search
      await act(async () => {
        await result.current.search('Luke');
      });

      expect(result.current.results.length).toBeGreaterThan(0);
      expect(result.current.hasSearched).toBe(true);

      // Then clear
      act(() => {
        result.current.clear();
      });

      expect(result.current.results).toEqual([]);
      expect(result.current.hasSearched).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('setSearchType()', () => {
    it('should clear results when changing search type', async () => {
      mockSearchPeople.mockResolvedValueOnce({ data: mockPersonSearchResponse.data });

      const { result } = renderHook(() => useSearch());

      // Search for people
      await act(async () => {
        await result.current.search('Luke');
      });

      expect(result.current.results.length).toBeGreaterThan(0);

      // Switch to movies - should clear results
      act(() => {
        result.current.setSearchType('movies');
      });

      expect(result.current.searchType).toBe('movies');
      expect(result.current.results).toEqual([]);
    });

    it('should toggle between people and movies', () => {
      const { result } = renderHook(() => useSearch());

      expect(result.current.searchType).toBe('people');

      act(() => {
        result.current.setSearchType('movies');
      });

      expect(result.current.searchType).toBe('movies');

      act(() => {
        result.current.setSearchType('people');
      });

      expect(result.current.searchType).toBe('people');
    });
  });
});
