import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../../../mocks/helpers';
import ResultsList from '~/components/organisms/ResultsList/ResultsList';
import { mockPersonSearchResult, mockFilmSearchResult } from '../../../mocks/fixtures';

describe('ResultsList', () => {
  const defaultProps = {
    results: [],
    type: 'people' as const,
    loading: false,
    error: null as string | null,
    onClear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should render SkeletonLoader when loading=true', () => {
      renderWithRouter(<ResultsList {...defaultProps} loading={true} />);

      const skeletonLoader = document.querySelector('.skeleton-loader');
      expect(skeletonLoader).toBeInTheDocument();
    });

    it('should render 5 skeleton items by default', () => {
      renderWithRouter(<ResultsList {...defaultProps} loading={true} />);

      const skeletonItems = document.querySelectorAll('.skeleton-item');
      expect(skeletonItems).toHaveLength(5);
    });
  });

  describe('Error state', () => {
    it('should render error message when error is defined', () => {
      renderWithRouter(
        <ResultsList {...defaultProps} error="Failed to fetch results" />
      );

      expect(screen.getByText('Failed to fetch results')).toBeInTheDocument();
    });

    it('should render "Error" title when there is an error', () => {
      renderWithRouter(
        <ResultsList {...defaultProps} error="Network error" />
      );

      expect(screen.getByRole('heading', { name: /error/i })).toBeInTheDocument();
    });

    it('should show "Back to search" button when there is error and onClear is defined', () => {
      renderWithRouter(
        <ResultsList {...defaultProps} error="Error" onClear={jest.fn()} />
      );

      expect(screen.getByRole('button', { name: /back to search/i })).toBeInTheDocument();
    });
  });

  describe('Empty results state', () => {
    it('should render "zero matches" when results is empty', () => {
      renderWithRouter(<ResultsList {...defaultProps} results={[]} />);

      expect(screen.getByText(/zero matches/i)).toBeInTheDocument();
    });

    it('should render instruction to use the form', () => {
      renderWithRouter(<ResultsList {...defaultProps} results={[]} />);

      expect(screen.getByText(/use the form to search/i)).toBeInTheDocument();
    });
  });

  describe('Results state', () => {
    it('should render ResultCards when there are people results', () => {
      renderWithRouter(
        <ResultsList
          {...defaultProps}
          results={[mockPersonSearchResult]}
          type="people"
        />
      );

      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /see details/i })).toBeInTheDocument();
    });

    it('should render ResultCards when there are movie results', () => {
      renderWithRouter(
        <ResultsList
          {...defaultProps}
          results={[mockFilmSearchResult]}
          type="movies"
        />
      );

      expect(screen.getByText('A New Hope')).toBeInTheDocument();
    });

    it('should render multiple ResultCards', () => {
      renderWithRouter(
        <ResultsList
          {...defaultProps}
          results={[mockPersonSearchResult, mockPersonSearchResult]}
          type="people"
        />
      );

      const cards = document.querySelectorAll('.result-card');
      expect(cards).toHaveLength(2);
    });

    it('should render "Results" title', () => {
      renderWithRouter(
        <ResultsList
          {...defaultProps}
          results={[mockPersonSearchResult]}
        />
      );

      expect(screen.getByRole('heading', { name: /results/i })).toBeInTheDocument();
    });
  });

  describe('Back to search button', () => {
    it('should call onClear when clicking the button', async () => {
      const onClear = jest.fn();
      renderWithRouter(
        <ResultsList
          {...defaultProps}
          results={[mockPersonSearchResult]}
          onClear={onClear}
        />
      );

      const buttons = screen.getAllByRole('button', { name: /back to search/i });
      await userEvent.click(buttons[0]);

      expect(onClear).toHaveBeenCalled();
    });

    it('should not render button when onClear is not defined', () => {
      renderWithRouter(
        <ResultsList
          {...defaultProps}
          results={[mockPersonSearchResult]}
          onClear={undefined}
        />
      );

      expect(screen.queryByRole('button', { name: /back to search/i })).not.toBeInTheDocument();
    });
  });

  describe('Structure', () => {
    it('should have results-list class', () => {
      renderWithRouter(<ResultsList {...defaultProps} />);

      const container = document.querySelector('.results-list');
      expect(container).toBeInTheDocument();
    });

    it('should have results-grid class when there are results', () => {
      renderWithRouter(
        <ResultsList
          {...defaultProps}
          results={[mockPersonSearchResult]}
        />
      );

      const grid = document.querySelector('.results-grid');
      expect(grid).toBeInTheDocument();
    });
  });
});
