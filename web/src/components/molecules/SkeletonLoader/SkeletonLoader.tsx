import React from 'react';
import { SkeletonLoaderProps } from '~/types';
import './SkeletonLoader.scss';

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 3 }) => {
  return (
    <div className="skeleton-loader">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-item">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-text"></div>
          <div className="skeleton-line skeleton-text"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
