import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import SearchPage from './pages/SearchPage/SearchPage';
import PeopleDetailPage from './pages/PeopleDetailPage/PeopleDetailPage';
import MovieDetailPage from './pages/MovieDetailPage/MovieDetailPage';
import './App.scss';

function App() {
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
}

export default App;
