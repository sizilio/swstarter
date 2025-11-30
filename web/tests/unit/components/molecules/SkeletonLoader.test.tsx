import React from 'react';
import { render, screen } from '@testing-library/react';
import SkeletonLoader from '~/components/molecules/SkeletonLoader/SkeletonLoader';

describe('SkeletonLoader', () => {
  it('should render 3 items by default', () => {
    render(<SkeletonLoader />);

    const skeletonItems = document.querySelectorAll('.skeleton-item');
    expect(skeletonItems).toHaveLength(3);
  });

  it('should render N items when count=N', () => {
    render(<SkeletonLoader count={5} />);

    const skeletonItems = document.querySelectorAll('.skeleton-item');
    expect(skeletonItems).toHaveLength(5);
  });

  it('should render 1 item when count=1', () => {
    render(<SkeletonLoader count={1} />);

    const skeletonItems = document.querySelectorAll('.skeleton-item');
    expect(skeletonItems).toHaveLength(1);
  });

  it('should have correct skeleton lines structure', () => {
    render(<SkeletonLoader count={1} />);

    const titleLine = document.querySelector('.skeleton-title');
    const textLines = document.querySelectorAll('.skeleton-text');

    expect(titleLine).toBeInTheDocument();
    expect(textLines).toHaveLength(2);
  });

  it('should have skeleton-loader class on container', () => {
    render(<SkeletonLoader />);

    const container = document.querySelector('.skeleton-loader');
    expect(container).toBeInTheDocument();
  });
});
