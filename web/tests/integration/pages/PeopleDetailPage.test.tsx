import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { mockPersonDetailResponse } from '../../mocks/fixtures';

// Mocks must be declared before importing the module that uses them
const mockGetPersonById = jest.fn();

jest.mock('~/services/api', () => ({
  searchPeople: jest.fn(),
  searchMovies: jest.fn(),
  getPersonById: (...args: any[]) => mockGetPersonById(...args),
  getMovieById: jest.fn(),
}));

import PeopleDetailPage from '~/pages/PeopleDetailPage/PeopleDetailPage';

// Helper to render with parameterized route
const renderWithRoute = (id: string) => {
  return render(
    <MemoryRouter initialEntries={[`/people/${id}`]}>
      <Routes>
        <Route path="/people/:id" element={<PeopleDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('PeopleDetailPage', () => {
  beforeEach(() => {
    mockGetPersonById.mockReset();
  });

  describe('Loading state', () => {
    it('should show SkeletonLoader while loading', async () => {
      mockGetPersonById.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: mockPersonDetailResponse.data }), 100))
      );

      renderWithRoute('1');

      expect(document.querySelector('.skeleton-loader')).toBeInTheDocument();

      await waitFor(() => {
        expect(document.querySelector('.skeleton-loader')).not.toBeInTheDocument();
      });
    });
  });

  describe('Success state', () => {
    it('should show person name', async () => {
      mockGetPersonById.mockResolvedValueOnce({ data: mockPersonDetailResponse.data });

      renderWithRoute('1');

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Luke Skywalker' })).toBeInTheDocument();
      });
    });

    it('should show person details', async () => {
      mockGetPersonById.mockResolvedValueOnce({ data: mockPersonDetailResponse.data });

      renderWithRoute('1');

      await waitFor(() => {
        expect(screen.getByText(/Birth Year: 19BBY/i)).toBeInTheDocument();
        expect(screen.getByText(/Gender: male/i)).toBeInTheDocument();
        expect(screen.getByText(/Eye Color: blue/i)).toBeInTheDocument();
        expect(screen.getByText(/Hair Color: blond/i)).toBeInTheDocument();
        expect(screen.getByText(/Height: 172/i)).toBeInTheDocument();
        expect(screen.getByText(/Mass: 77/i)).toBeInTheDocument();
      });
    });

    it('should show person movies', async () => {
      mockGetPersonById.mockResolvedValueOnce({ data: mockPersonDetailResponse.data });

      renderWithRoute('1');

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /movies/i })).toBeInTheDocument();
        expect(screen.getByText('A New Hope')).toBeInTheDocument();
      });
    });

    it('should have links to movies', async () => {
      mockGetPersonById.mockResolvedValueOnce({ data: mockPersonDetailResponse.data });

      renderWithRoute('1');

      await waitFor(() => {
        const filmLink = screen.getByRole('link', { name: 'A New Hope' });
        expect(filmLink).toHaveAttribute('href', '/movie/1');
      });
    });
  });

  describe('Error state', () => {
    it('should show error message', async () => {
      mockGetPersonById.mockRejectedValueOnce(new Error('Person not found'));

      renderWithRoute('999');

      await waitFor(() => {
        expect(screen.getByText('Person not found')).toBeInTheDocument();
      });
    });

    it('should show API response error', async () => {
      mockGetPersonById.mockRejectedValueOnce({
        response: { data: { error: 'Person with ID 999 not found' } },
      });

      renderWithRoute('999');

      await waitFor(() => {
        expect(screen.getByText('Person with ID 999 not found')).toBeInTheDocument();
      });
    });
  });

  describe('Link "Back to Search"', () => {
    it('should have link to go back to search', async () => {
      mockGetPersonById.mockResolvedValueOnce({ data: mockPersonDetailResponse.data });

      renderWithRoute('1');

      await waitFor(() => {
        const backLinks = screen.getAllByRole('link', { name: /back to search/i });
        expect(backLinks.length).toBeGreaterThan(0);
        expect(backLinks[0]).toHaveAttribute('href', '/');
      });
    });
  });

  describe('CSS classes', () => {
    it('should have people-detail-page class', async () => {
      mockGetPersonById.mockResolvedValueOnce({ data: mockPersonDetailResponse.data });

      renderWithRoute('1');

      await waitFor(() => {
        const page = document.querySelector('.people-detail-page');
        expect(page).toBeInTheDocument();
      });
    });

    it('should have person-details class', async () => {
      mockGetPersonById.mockResolvedValueOnce({ data: mockPersonDetailResponse.data });

      renderWithRoute('1');

      await waitFor(() => {
        const details = document.querySelector('.person-details');
        expect(details).toBeInTheDocument();
      });
    });
  });
});
