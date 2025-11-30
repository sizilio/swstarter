import React from 'react';
import { Link } from 'react-router-dom';
import { ResultCardProps, SwapiPerson, SwapiFilm } from '~/types';
import './ResultCard.scss';

const ResultCard: React.FC<ResultCardProps> = ({ result, type }) => {

  // Render different content based on search type
  const renderContent = (): React.ReactElement => {
    switch (type) {
      case 'people':
        const person = result.properties as SwapiPerson;
        return (
          <>
            <h3>{person.name}</h3>
            <Link to={`/people/${result.uid}`}>See details</Link>
          </>
        );
      case 'movies':
        const movie = result.properties as SwapiFilm;
        return (
          <>
            <h3>{movie.title}</h3>
            <Link to={`/movie/${result.uid}`}>See details</Link>
          </>
        );
      default:
        const item = result.properties as SwapiPerson | SwapiFilm;
        return (
          <>
            <h3>{'name' in item ? item.name : item.title}</h3>
          </>
        );
    }
  };

  return (
    <div className="result-card">
      {renderContent()}
    </div>
  );
};

export default ResultCard;
