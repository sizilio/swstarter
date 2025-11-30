import React, { useState } from 'react';
import { SearchBarProps, SearchType } from '~/types';
import './SearchBar.scss';

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchType, onTypeChange }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const getPlaceholder = (): string => {
    return searchType === 'people'
      ? 'e.g. Chewbacca, Yoda, Boba Fett'
      : 'e.g. A New Hope, Empire Strikes Back';
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onTypeChange(e.target.value as SearchType);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <div className="search-type">
          <b className="search-type-label">What are you searching for?</b>

          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="searchType"
                value="people"
                checked={searchType === 'people'}
                onChange={handleTypeChange}
              />
              <span>People</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="searchType"
                value="movies"
                checked={searchType === 'movies'}
                onChange={handleTypeChange}
              />
              <span>Movies</span>
            </label>
          </div>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          placeholder={getPlaceholder()}
          required={true}
        />

        <button type="submit" disabled={searchTerm === ''}>Search</button>
      </form>
    </div>
  );
};

export default SearchBar;
