import React from 'react';
import Header from '../Header/Header';
import './Layout.scss';

function Layout({ children }) {
  return (
    <div className="layout">
      <Header />

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;