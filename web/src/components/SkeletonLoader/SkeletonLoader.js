import React from 'react';
import './SkeletonLoader.scss';

function SkeletonLoader({ count = 3 }) {
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
}

export default SkeletonLoader;
