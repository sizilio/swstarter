import React from 'react';
import { Link } from 'react-router-dom';
import './Header.scss';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">SWStarter</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;