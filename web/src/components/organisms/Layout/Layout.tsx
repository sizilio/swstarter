import React from 'react';
import Header from '~/components/organisms/Header/Header';
import { LayoutProps } from '~/types';
import './Layout.scss';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
