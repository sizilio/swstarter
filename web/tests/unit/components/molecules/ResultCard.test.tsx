import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../mocks/helpers';
import ResultCard from '~/components/molecules/ResultCard/ResultCard';
import { mockPersonSearchResult, mockFilmSearchResult } from '../../../mocks/fixtures';

describe('ResultCard', () => {
  describe('People type', () => {
    it('should render person name', () => {
      renderWithRouter(
        <ResultCard result={mockPersonSearchResult} type="people" />
      );

      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    it('should have correct link to /people/:id', () => {
      renderWithRouter(
        <ResultCard result={mockPersonSearchResult} type="people" />
      );

      const link = screen.getByRole('link', { name: /see details/i });
      expect(link).toHaveAttribute('href', '/people/1');
    });

    it('should render "See details" text', () => {
      renderWithRouter(
        <ResultCard result={mockPersonSearchResult} type="people" />
      );

      expect(screen.getByText('See details')).toBeInTheDocument();
    });
  });

  describe('Movies type', () => {
    it('should render movie title', () => {
      renderWithRouter(
        <ResultCard result={mockFilmSearchResult} type="movies" />
      );

      expect(screen.getByText('A New Hope')).toBeInTheDocument();
    });

    it('should have correct link to /movie/:id', () => {
      renderWithRouter(
        <ResultCard result={mockFilmSearchResult} type="movies" />
      );

      const link = screen.getByRole('link', { name: /see details/i });
      expect(link).toHaveAttribute('href', '/movie/1');
    });
  });

  describe('Structure', () => {
    it('should have result-card class', () => {
      renderWithRouter(
        <ResultCard result={mockPersonSearchResult} type="people" />
      );

      const card = document.querySelector('.result-card');
      expect(card).toBeInTheDocument();
    });

    it('should render h3 with name/title', () => {
      renderWithRouter(
        <ResultCard result={mockPersonSearchResult} type="people" />
      );

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Luke Skywalker');
    });
  });
});
