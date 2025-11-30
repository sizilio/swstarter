import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SkeletonLoader from '~/components/molecules/SkeletonLoader/SkeletonLoader';
import { usePersonDetail } from '~/hooks';
import { extractId } from '~/utils/helpers';
import './PeopleDetailPage.scss';

// People Page
const PeopleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { person, loading, error } = usePersonDetail(id);

  if (error) {
    return (
      <div className="people-detail-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  const props = person?.result.properties;

  return (
    <div className="people-detail-page">
      {loading ?
        <SkeletonLoader count={3} /> :
        <>
          <h1>{props!.name}</h1>
          <div className="person-details">
            <div>
              <h2>Details</h2>
              <p>Birth Year: {props!.birth_year}</p>
              <p>Gender: {props!.gender}</p>
              <p>Eye Color: {props!.eye_color}</p>
              <p>Hair Color: {props!.hair_color}</p>
              <p>Height: {props!.height}</p>
              <p>Mass: {props!.mass}</p>
            </div>
            <div>
              <h2>Movies</h2>
              {props!.filmsData && props!.filmsData.length > 0 &&
                props!.filmsData.map((film, index) => (
                  <React.Fragment key={index}>
                    <Link to={`/movie/${extractId(film.url)}`}>{film.title}</Link>
                    {index < props!.filmsData.length - 1 && ', '}
                  </React.Fragment>
                ))
              }
            </div>
          </div>
        </>
      }

      <div className="back-link">
        <Link to="/">Back to Search</Link>
        <Link to="/" className="back-header">Back to Search</Link>
      </div>
    </div>
  );
};

export default PeopleDetailPage;
