import React from 'react';
import SearchBar from '~/components/organisms/SearchBar/SearchBar';
import ResultsList from '~/components/organisms/ResultsList/ResultsList';
import { useSearch } from '~/hooks';
import './SearchPage.scss';

// Search Page
const SearchPage: React.FC = () => {
  const {
    results,
    loading,
    error,
    hasSearched,
    searchType,
    setSearchType,
    search,
    clear,
  } = useSearch();

  return (
    <div className={`search-page ${hasSearched ? 'has-results' : ''}`}>
      <SearchBar
        onSearch={search}
        searchType={searchType}
        onTypeChange={setSearchType}
      />

      <ResultsList
        results={results}
        type={searchType}
        loading={loading}
        error={error}
        onClear={clear}
      />
    </div>
  );
};

export default SearchPage;
