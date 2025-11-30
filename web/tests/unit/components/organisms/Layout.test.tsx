import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../mocks/helpers';
import Layout from '~/components/organisms/Layout/Layout';

describe('Layout', () => {
  it('should render the Header', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByText('SWStarter')).toBeInTheDocument();
  });

  it('should render children', () => {
    renderWithRouter(
      <Layout>
        <div data-testid="child-content">Test Content</div>
      </Layout>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should have layout class on container', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    const layout = document.querySelector('.layout');
    expect(layout).toBeInTheDocument();
  });

  it('should have main-content class on main element', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    const main = document.querySelector('.main-content');
    expect(main).toBeInTheDocument();
  });

  it('should render children inside main', () => {
    renderWithRouter(
      <Layout>
        <p>Child paragraph</p>
      </Layout>
    );

    const main = screen.getByRole('main');
    expect(main).toContainHTML('<p>Child paragraph</p>');
  });

  it('should render multiple children', () => {
    renderWithRouter(
      <Layout>
        <div data-testid="child-1">First</div>
        <div data-testid="child-2">Second</div>
      </Layout>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });
});
