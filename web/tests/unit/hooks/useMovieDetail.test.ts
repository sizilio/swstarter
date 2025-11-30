import { renderHook, waitFor } from '@testing-library/react';
import { mockFilmDetailResponse } from '../../mocks/fixtures';

// Mocks must be declared before importing the module that uses them
const mockGetMovieById = jest.fn();

jest.mock('~/services/api', () => ({
  searchPeople: jest.fn(),
  searchMovies: jest.fn(),
  getPersonById: jest.fn(),
  getMovieById: (...args: any[]) => mockGetMovieById(...args),
}));

import { useMovieDetail } from '~/hooks/useMovieDetail';

describe('useMovieDetail', () => {
  beforeEach(() => {
    mockGetMovieById.mockReset();
  });

  describe('Successful fetch', () => {
    it('should fetch movie details successfully', async () => {
      mockGetMovieById.mockResolvedValueOnce({ data: mockFilmDetailResponse.data });

      const { result } = renderHook(() => useMovieDetail('1'));

      // Initially loading
      expect(result.current.loading).toBe(true);
      expect(result.current.movie).toBeNull();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetMovieById).toHaveBeenCalledWith('1');
      expect(result.current.movie).toEqual(mockFilmDetailResponse.data);
      expect(result.current.error).toBeNull();
    });

    it('should refetch when id changes', async () => {
      mockGetMovieById.mockResolvedValue({ data: mockFilmDetailResponse.data });

      const { result, rerender } = renderHook(
        ({ id }) => useMovieDetail(id),
        { initialProps: { id: '1' } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetMovieById).toHaveBeenCalledWith('1');

      // Rerender with new id
      rerender({ id: '2' });

      await waitFor(() => {
        expect(mockGetMovieById).toHaveBeenCalledWith('2');
      });
    });
  });

  describe('Error handling', () => {
    it('should set error when fetch fails', async () => {
      mockGetMovieById.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useMovieDetail('1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.movie).toBeNull();
    });

    it('should use response message when available', async () => {
      mockGetMovieById.mockRejectedValueOnce({
        response: { data: { error: 'Movie not found' } },
      });

      const { result } = renderHook(() => useMovieDetail('999'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Movie not found');
    });

    it('should use default message when error has no message', async () => {
      mockGetMovieById.mockRejectedValueOnce({});

      const { result } = renderHook(() => useMovieDetail('1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to fetch movie details');
    });
  });

  describe('Invalid ID', () => {
    it('should set error for undefined id', async () => {
      const { result } = renderHook(() => useMovieDetail(undefined));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Invalid movie ID');
      expect(result.current.movie).toBeNull();
      expect(mockGetMovieById).not.toHaveBeenCalled();
    });
  });
});
