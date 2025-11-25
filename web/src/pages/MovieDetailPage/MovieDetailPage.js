import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import { getMovieById } from '../../services/api';
import { extractId } from '../../utils/helpers';
import './MovieDetailPage.scss';

// Movie Page
function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const response = await getMovieById(id);
      setMovie(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch movie details');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="movie-detail-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      {loading ?
        <SkeletonLoader count={3} /> :
        <>
          <h1>{movie.title}</h1>
          <div className="movie-details">
            <div>
              <h2>Opening Crawl</h2>
              <p dangerouslySetInnerHTML={{ __html: movie.opening_crawl.replaceAll("\r\n", "<br>") }}></p>
            </div>
            <div>
              <h2>Characters</h2>
              {movie.characters && movie.characters.length > 0 &&
                movie.characters.map((result, index) => (
                  <>
                    <Link key={index} to={`/people/${extractId(result.url)}`}>{result.name}</Link>
                    {index < movie.characters.length - 1 && ', '}
                  </> 
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
}

export default MovieDetailPage;