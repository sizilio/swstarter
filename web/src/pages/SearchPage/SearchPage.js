import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import ResultsList from '../../components/ResultsList/ResultsList';
import {
  searchPeople,
  searchMovies
} from '../../services/api';
import './SearchPage.scss';

// Search Page
function SearchPage() {
  const [searchType, setSearchType] = useState('people');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search
  const handleSearch = async (searchTerm) => {
    setHasSearched(true);
    setLoading(true);
    setError(null);

    try {
      let response;

      // Call appropriate API based on search type
      switch (searchType) {
        case 'people':
          response = await searchPeople(searchTerm);
          break;
        case 'movies':
          response = await searchMovies(searchTerm);
          break;
        default:
          response = await searchPeople(searchTerm);
      }

      setResults(response.results);
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear results
  useEffect(() => {
    setResults([]);
  }, [searchType]);

  // Clear search
  const handleClearSearch = () => {
    setHasSearched(false);
    setResults([]);
    setError(null);
  };

  return (
    <div className={`search-page ${hasSearched ? 'has-results' : ''}`}>
      <SearchBar
        onSearch={handleSearch}
        searchType={searchType}
        onTypeChange={setSearchType}
      />

      {error && <div className="error-message">{error}</div>}

      <ResultsList
        results={results}
        type={searchType}
        loading={loading}
        onClear={handleClearSearch}
      />
    </div>
  );
}

export default SearchPage;