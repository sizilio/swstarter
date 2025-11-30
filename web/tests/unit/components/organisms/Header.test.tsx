import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../mocks/helpers';
import Header from '~/components/organisms/Header/Header';

describe('Header', () => {
  it('should render the logo/title', () => {
    renderWithRouter(<Header />);

    expect(screen.getByText('SWStarter')).toBeInTheDocument();
  });

  it('should have link to home', () => {
    renderWithRouter(<Header />);

    const link = screen.getByRole('link', { name: /swstarter/i });
    expect(link).toHaveAttribute('href', '/');
  });

  it('should have header class', () => {
    renderWithRouter(<Header />);

    const header = document.querySelector('.header');
    expect(header).toBeInTheDocument();
  });

  it('should have logo class on link container', () => {
    renderWithRouter(<Header />);

    const logo = document.querySelector('.logo');
    expect(logo).toBeInTheDocument();
  });

  it('should render inside a header element', () => {
    renderWithRouter(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });
});
