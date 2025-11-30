import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '~/components/organisms/SearchBar/SearchBar';

describe('SearchBar', () => {
  const defaultProps = {
    onSearch: jest.fn(),
    searchType: 'people' as const,
    onTypeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render People and Movies radio buttons', () => {
      render(<SearchBar {...defaultProps} />);

      expect(screen.getByLabelText(/people/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/movies/i)).toBeInTheDocument();
    });

    it('should render text input', () => {
      render(<SearchBar {...defaultProps} />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render Search button', () => {
      render(<SearchBar {...defaultProps} />);

      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    it('should have People radio selected when searchType=people', () => {
      render(<SearchBar {...defaultProps} searchType="people" />);

      expect(screen.getByLabelText(/people/i)).toBeChecked();
      expect(screen.getByLabelText(/movies/i)).not.toBeChecked();
    });

    it('should have Movies radio selected when searchType=movies', () => {
      render(<SearchBar {...defaultProps} searchType="movies" />);

      expect(screen.getByLabelText(/movies/i)).toBeChecked();
      expect(screen.getByLabelText(/people/i)).not.toBeChecked();
    });
  });

  describe('Placeholder', () => {
    it('should show people placeholder when searchType=people', () => {
      render(<SearchBar {...defaultProps} searchType="people" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'e.g. Chewbacca, Yoda, Boba Fett');
    });

    it('should show movies placeholder when searchType=movies', () => {
      render(<SearchBar {...defaultProps} searchType="movies" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'e.g. A New Hope, Empire Strikes Back');
    });
  });

  describe('Interactions', () => {
    it('should call onSearch when submitting form with filled input', async () => {
      const onSearch = jest.fn();
      render(<SearchBar {...defaultProps} onSearch={onSearch} />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /search/i });

      await userEvent.type(input, 'Luke');
      await userEvent.click(button);

      expect(onSearch).toHaveBeenCalledWith('Luke');
    });

    it('should not call onSearch with empty input', async () => {
      const onSearch = jest.fn();
      render(<SearchBar {...defaultProps} onSearch={onSearch} />);

      const button = screen.getByRole('button', { name: /search/i });
      await userEvent.click(button);

      expect(onSearch).not.toHaveBeenCalled();
    });

    it('should not call onSearch with input containing only spaces', async () => {
      const onSearch = jest.fn();
      render(<SearchBar {...defaultProps} onSearch={onSearch} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '   ' } });

      const form = input.closest('form');
      fireEvent.submit(form!);

      expect(onSearch).not.toHaveBeenCalled();
    });

    it('should call onTypeChange when clicking Movies', async () => {
      const onTypeChange = jest.fn();
      render(<SearchBar {...defaultProps} onTypeChange={onTypeChange} />);

      const moviesRadio = screen.getByLabelText(/movies/i);
      await userEvent.click(moviesRadio);

      expect(onTypeChange).toHaveBeenCalledWith('movies');
    });

    it('should call onTypeChange when clicking People', async () => {
      const onTypeChange = jest.fn();
      render(<SearchBar {...defaultProps} searchType="movies" onTypeChange={onTypeChange} />);

      const peopleRadio = screen.getByLabelText(/people/i);
      await userEvent.click(peopleRadio);

      expect(onTypeChange).toHaveBeenCalledWith('people');
    });
  });

  describe('Search button', () => {
    it('should be disabled when input is empty', () => {
      render(<SearchBar {...defaultProps} />);

      const button = screen.getByRole('button', { name: /search/i });
      expect(button).toBeDisabled();
    });

    it('should be enabled when input has text', async () => {
      render(<SearchBar {...defaultProps} />);

      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'Luke');

      const button = screen.getByRole('button', { name: /search/i });
      expect(button).not.toBeDisabled();
    });
  });
});
