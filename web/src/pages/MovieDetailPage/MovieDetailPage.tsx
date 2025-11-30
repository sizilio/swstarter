import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SkeletonLoader from '~/components/molecules/SkeletonLoader/SkeletonLoader';
import { useMovieDetail } from '~/hooks';
import { extractId } from '~/utils/helpers';
import './MovieDetailPage.scss';

// Movie Page
const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { movie, loading, error } = useMovieDetail(id);

  if (error) {
    return (
      <div className="movie-detail-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  const props = movie?.result.properties;

  return (
    <div className="movie-detail-page">
      {loading ?
        <SkeletonLoader count={3} /> :
        <>
          <h1>{props!.title}</h1>
          <div className="movie-details">
            <div>
              <h2>Opening Crawl</h2>
              <p dangerouslySetInnerHTML={{ __html: props!.opening_crawl.replaceAll("\r\n", "<br>") }}></p>
            </div>
            <div>
              <h2>Characters</h2>
              {props!.charactersData && props!.charactersData.length > 0 &&
                props!.charactersData.map((character, index) => (
                  <React.Fragment key={index}>
                    <Link to={`/people/${extractId(character.url)}`}>{character.name}</Link>
                    {index < props!.charactersData.length - 1 && ', '}
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

export default MovieDetailPage;
