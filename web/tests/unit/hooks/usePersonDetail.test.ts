import { renderHook, waitFor } from '@testing-library/react';
import { mockPersonDetailResponse } from '../../mocks/fixtures';

// Mocks must be declared before importing the module that uses them
const mockGetPersonById = jest.fn();

jest.mock('~/services/api', () => ({
  searchPeople: jest.fn(),
  searchMovies: jest.fn(),
  getPersonById: (...args: any[]) => mockGetPersonById(...args),
  getMovieById: jest.fn(),
}));

import { usePersonDetail } from '~/hooks/usePersonDetail';

describe('usePersonDetail', () => {
  beforeEach(() => {
    mockGetPersonById.mockReset();
  });

  describe('Successful fetch', () => {
    it('should fetch person details successfully', async () => {
      mockGetPersonById.mockResolvedValueOnce({ data: mockPersonDetailResponse.data });

      const { result } = renderHook(() => usePersonDetail('1'));

      // Initially loading
      expect(result.current.loading).toBe(true);
      expect(result.current.person).toBeNull();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetPersonById).toHaveBeenCalledWith('1');
      expect(result.current.person).toEqual(mockPersonDetailResponse.data);
      expect(result.current.error).toBeNull();
    });

    it('should refetch when id changes', async () => {
      mockGetPersonById.mockResolvedValue({ data: mockPersonDetailResponse.data });

      const { result, rerender } = renderHook(
        ({ id }) => usePersonDetail(id),
        { initialProps: { id: '1' } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetPersonById).toHaveBeenCalledWith('1');

      // Rerender with new id
      rerender({ id: '2' });

      await waitFor(() => {
        expect(mockGetPersonById).toHaveBeenCalledWith('2');
      });
    });
  });

  describe('Error handling', () => {
    it('should set error when fetch fails', async () => {
      mockGetPersonById.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => usePersonDetail('1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.person).toBeNull();
    });

    it('should use response message when available', async () => {
      mockGetPersonById.mockRejectedValueOnce({
        response: { data: { error: 'Person not found' } },
      });

      const { result } = renderHook(() => usePersonDetail('999'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Person not found');
    });

    it('should use default message when error has no message', async () => {
      mockGetPersonById.mockRejectedValueOnce({});

      const { result } = renderHook(() => usePersonDetail('1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to fetch person details');
    });
  });

  describe('Invalid ID', () => {
    it('should set error for undefined id', async () => {
      const { result } = renderHook(() => usePersonDetail(undefined));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Invalid person ID');
      expect(result.current.person).toBeNull();
      expect(mockGetPersonById).not.toHaveBeenCalled();
    });
  });
});
