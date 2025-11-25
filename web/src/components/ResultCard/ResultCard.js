import React from 'react';
import { Link } from 'react-router-dom';
import { extractId } from '../../utils/helpers';
import './ResultCard.scss';

function ResultCard({ result, type }) {
  
  // Render different content based on search type
  const renderContent = () => {
    switch (type) {
      case 'people':
        return (
          <>
            <h3>{result.name}</h3>
            <Link to={`/people/${extractId(result.url)}`}>See details</Link>
          </>
        );
      case 'movies':
        return (
          <>
            <h3>{result.title}</h3>
            <Link to={`/movie/${extractId(result.url)}`}>See details</Link>
          </>
        );
      default:
        return (
          <>
            <h3>{result.name || result.title}</h3>
          </>
        );
    }
  };

  return (
    <div className="result-card">
      {renderContent()}
    </div>
  );

}

export default ResultCard;