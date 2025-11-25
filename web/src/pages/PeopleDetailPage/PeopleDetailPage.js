import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import { getPersonById } from '../../services/api';
import { extractId } from '../../utils/helpers';
import './PeopleDetailPage.scss';

// People Page
function PeopleDetailPage() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPersonDetails();
  }, [id]);

  const fetchPersonDetails = async () => {
    try {
      setLoading(true);
      const response = await getPersonById(id);
      setPerson(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch person details');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="people-detail-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="people-detail-page">
      {loading ?
        <SkeletonLoader count={3} /> :
        <>
          <h1>{person.name}</h1>
          <div className="person-details">
            <div>
              <h2>Details</h2>
              <p>Birth Year: {person.birth_year}</p>
              <p>Gender: {person.gender}</p>
              <p>Eye Color: {person.eye_color}</p>
              <p>Hair Color: {person.hair_color}</p>
              <p>Height: {person.height}</p>
              <p>Mass: {person.mass}</p>
            </div>
            <div>
              <h2>Movies</h2>
              {person.films && person.films.length > 0 &&
                person.films.map((result, index) => (
                  <>
                    <Link key={index} to={`/movie/${extractId(result.url)}`}>{result.title}</Link>
                    {index < person.films.length - 1 && ', '}
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

export default PeopleDetailPage;