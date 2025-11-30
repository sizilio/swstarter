import React from 'react';
import { Link } from 'react-router-dom';
import './Header.scss';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">SWStarter</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
