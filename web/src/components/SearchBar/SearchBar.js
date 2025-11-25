import React, { useState } from 'react';
import './SearchBar.scss';

function SearchBar({ onSearch, searchType, onTypeChange }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const getPlaceholder = () => {
    return searchType === 'people'
      ? 'e.g. Chewbacca, Yoda, Boba Fett'
      : 'e.g. A New Hope, Empire Strikes Back';
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
                onChange={(e) => onTypeChange(e.target.value)}
              />
              <span>People</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="searchType"
                value="movies"
                checked={searchType === 'movies'}
                onChange={(e) => onTypeChange(e.target.value)}
              />
              <span>Movies</span>
            </label>
          </div>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={getPlaceholder()}
          required={true}
        />

        <button type="submit" disabled={searchTerm === ''}>Search</button>
      </form>
    </div>
  );
  
}

export default SearchBar;