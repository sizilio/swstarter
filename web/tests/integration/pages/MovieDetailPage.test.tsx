import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { mockFilmDetailResponse } from '../../mocks/fixtures';

// Mocks must be declared before importing the module that uses them
const mockGetMovieById = jest.fn();

jest.mock('~/services/api', () => ({
  searchPeople: jest.fn(),
  searchMovies: jest.fn(),
  getPersonById: jest.fn(),
  getMovieById: (...args: any[]) => mockGetMovieById(...args),
}));

import MovieDetailPage from '~/pages/MovieDetailPage/MovieDetailPage';

// Helper to render with parameterized route
const renderWithRoute = (id: string) => {
  return render(
    <MemoryRouter initialEntries={[`/movie/${id}`]}>
      <Routes>
        <Route path="/movie/:id" element={<MovieDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('MovieDetailPage', () => {
  beforeEach(() => {
    mockGetMovieById.mockReset();
  });

  describe('Loading state', () => {
    it('should show SkeletonLoader while loading', async () => {
      mockGetMovieById.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: mockFilmDetailResponse.data }), 100))
      );

      renderWithRoute('1');

      expect(document.querySelector('.skeleton-loader')).toBeInTheDocument();

      await waitFor(() => {
        expect(document.querySelector('.skeleton-loader')).not.toBeInTheDocument();
      });
    });
  });

  describe('Success state', () => {
    it('should show movie title', async () => {
      mockGetMovieById.mockResolvedValueOnce({ data: mockFilmDetailResponse.data });

      renderWithRoute('1');

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'A New Hope' })).toBeInTheDocument();
      });
    });

    it('should show opening crawl', async () => {
      mockGetMovieById.mockResolvedValueOnce({ data: mockFilmDetailResponse.data });

      renderWithRoute('1');

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /opening crawl/i })).toBeInTheDocument();
        expect(screen.getByText(/it is a period of civil war/i)).toBeInTheDocument();
      });
    });

    it('should show movie characters', async () => {
      mockGetMovieById.mockResolvedValueOnce({ data: mockFilmDetailResponse.data });

      renderWithRoute('1');

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /characters/i })).toBeInTheDocument();
        expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
      });
    });

    it('should have links to characters', async () => {
      mockGetMovieById.mockResolvedValueOnce({ data: mockFilmDetailResponse.data });

      renderWithRoute('1');

      await waitFor(() => {
        const characterLink = screen.getByRole('link', { name: 'Luke Skywalker' });
        expect(characterLink).toHaveAttribute('href', '/people/1');
      });
    });
  });

  describe('Error state', () => {
    it('should show error message', async () => {
      mockGetMovieById.mockRejectedValueOnce(new Error('Movie not found'));

      renderWithRoute('999');

      await waitFor(() => {
        expect(screen.getByText('Movie not found')).toBeInTheDocument();
      });
    });

    it('should show API response error', async () => {
      mockGetMovieById.mockRejectedValueOnce({
        response: { data: { error: 'Movie with ID 999 not found' } },
      });

      renderWithRoute('999');

      await waitFor(() => {
        expect(screen.getByText('Movie with ID 999 not found')).toBeInTheDocument();
      });
    });
  });

  describe('Link "Back to Search"', () => {
    it('should have link to go back to search', async () => {
      mockGetMovieById.mockResolvedValueOnce({ data: mockFilmDetailResponse.data });

      renderWithRoute('1');

      await waitFor(() => {
        const backLinks = screen.getAllByRole('link', { name: /back to search/i });
        expect(backLinks.length).toBeGreaterThan(0);
        expect(backLinks[0]).toHaveAttribute('href', '/');
      });
    });
  });

  describe('CSS classes', () => {
    it('should have movie-detail-page class', async () => {
      mockGetMovieById.mockResolvedValueOnce({ data: mockFilmDetailResponse.data });

      renderWithRoute('1');

      await waitFor(() => {
        const page = document.querySelector('.movie-detail-page');
        expect(page).toBeInTheDocument();
      });
    });

    it('should have movie-details class', async () => {
      mockGetMovieById.mockResolvedValueOnce({ data: mockFilmDetailResponse.data });

      renderWithRoute('1');

      await waitFor(() => {
        const details = document.querySelector('.movie-details');
        expect(details).toBeInTheDocument();
      });
    });
  });
});
