import React from 'react';
import ResultCard from '../ResultCard/ResultCard';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import './ResultsList.scss';

function ResultsList({ results, type, loading, onClear }) {
  
  if (!loading && (!results || results.length === 0)) {
    return (
      <div className="results-list">
        <h1>Results</h1>

        <div className="empty">
          <p>There are zero matches.</p>
          <p>Use the form to search for People or Movies.</p>
        </div>

        {onClear && <button type="button" onClick={onClear}>Back to search</button>}
      </div>
    );
  }

  return (
    <div className="results-list">
      <h1>Results</h1>

      <div className="results-grid">
        {loading ? (
          <SkeletonLoader count={5} />
        ) :
          results.map((result, index) => (
            <ResultCard key={index} result={result} type={type} />
          ))
        }
      </div>

      {!loading && onClear && 
        <>
          <button type="button" onClick={onClear}>Back to search</button>
          <button type="button" className="back-header" onClick={onClear}>Back to search</button>
        </>
      }
    </div>
  );

}

export default ResultsList;