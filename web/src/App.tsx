import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '~/components/organisms/Layout/Layout';
import SearchPage from '~/pages/SearchPage/SearchPage';
import PeopleDetailPage from '~/pages/PeopleDetailPage/PeopleDetailPage';
import MovieDetailPage from '~/pages/MovieDetailPage/MovieDetailPage';
import './App.scss';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/people/:id" element={<PeopleDetailPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
