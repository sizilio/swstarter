import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Wrapper com BrowserRouter para componentes que usam Link/useParams
const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

// Render customizado com router
export const renderWithRouter = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { renderWithRouter };
