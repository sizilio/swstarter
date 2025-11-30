import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../mocks/helpers';
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

import SearchPage from '~/pages/SearchPage/SearchPage';

describe('SearchPage', () => {
  beforeEach(() => {
    mockSearchPeople.mockReset();
    mockSearchMovies.mockReset();
  });

  describe('Initial rendering', () => {
    it('should render SearchBar', () => {
      renderWithRouter(<SearchPage />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^search$/i })).toBeInTheDocument();
    });

    it('should render ResultsList with "zero matches" message', () => {
      renderWithRouter(<SearchPage />);

      expect(screen.getByText(/zero matches/i)).toBeInTheDocument();
    });

    it('should have People radio selected by default', () => {
      renderWithRouter(<SearchPage />);

      expect(screen.getByLabelText(/people/i)).toBeChecked();
    });
  });

  describe('People search', () => {
    it('should search people successfully', async () => {
      mockSearchPeople.mockResolvedValueOnce({ data: mockPersonSearchResponse.data });

      renderWithRouter(<SearchPage />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /^search$/i });

      await userEvent.type(input, 'Luke');
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
      });

      expect(mockSearchPeople).toHaveBeenCalledWith('Luke');
    });

    it('should show loading during search', async () => {
      mockSearchPeople.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: mockPersonSearchResponse.data }), 100))
      );

      renderWithRouter(<SearchPage />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /^search$/i });

      await userEvent.type(input, 'Luke');
      await userEvent.click(button);

      // Should show skeleton loader
      expect(document.querySelector('.skeleton-loader')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
      });
    });
  });

  describe('Movie search', () => {
    it('should search movies when searchType=movies', async () => {
      mockSearchMovies.mockResolvedValueOnce({ data: mockFilmSearchResponse.data });

      renderWithRouter(<SearchPage />);

      // Switch to movies
      const moviesRadio = screen.getByLabelText(/movies/i);
      await userEvent.click(moviesRadio);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /^search$/i });

      await userEvent.type(input, 'Hope');
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('A New Hope')).toBeInTheDocument();
      });

      expect(mockSearchMovies).toHaveBeenCalledWith('Hope');
    });
  });

  describe('Error handling', () => {
    it('should show error when search fails', async () => {
      mockSearchPeople.mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<SearchPage />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /^search$/i });

      await userEvent.type(input, 'Luke');
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/failed to fetch results/i)).toBeInTheDocument();
      });
    });
  });

  describe('Clear/Back to search', () => {
    it('should clear results when clicking "Back to search"', async () => {
      mockSearchPeople.mockResolvedValueOnce({ data: mockPersonSearchResponse.data });

      renderWithRouter(<SearchPage />);

      // Perform search
      const input = screen.getByRole('textbox');
      const searchButton = screen.getByRole('button', { name: /^search$/i });

      await userEvent.type(input, 'Luke');
      await userEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
      });

      // Click Back to search
      const backButtons = screen.getAllByRole('button', { name: /back to search/i });
      await userEvent.click(backButtons[0]);

      // Should show "zero matches" again
      expect(screen.getByText(/zero matches/i)).toBeInTheDocument();
    });
  });

  describe('Search type change', () => {
    it('should clear results when changing search type', async () => {
      mockSearchPeople.mockResolvedValueOnce({ data: mockPersonSearchResponse.data });

      renderWithRouter(<SearchPage />);

      // Search for people
      const input = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /^search$/i });

      await userEvent.type(input, 'Luke');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
      });

      // Switch to movies
      const moviesRadio = screen.getByLabelText(/movies/i);
      await userEvent.click(moviesRadio);

      // Results should be cleared
      expect(screen.queryByText('Luke Skywalker')).not.toBeInTheDocument();
    });
  });

  describe('CSS classes', () => {
    it('should have search-page class', () => {
      renderWithRouter(<SearchPage />);

      const page = document.querySelector('.search-page');
      expect(page).toBeInTheDocument();
    });

    it('should add has-results class after search', async () => {
      mockSearchPeople.mockResolvedValueOnce({ data: mockPersonSearchResponse.data });

      renderWithRouter(<SearchPage />);

      const input = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: /^search$/i });

      await userEvent.type(input, 'Luke');
      await userEvent.click(submitButton);

      await waitFor(() => {
        const page = document.querySelector('.search-page.has-results');
        expect(page).toBeInTheDocument();
      });
    });
  });
});
