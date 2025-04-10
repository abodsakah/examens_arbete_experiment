import React from 'react';
import { FallbackProps } from 'react-error-boundary';

/**
 * Loading fallback component for React Suspense
 * Shows a minimal loading indicator with ARIA attributes for accessibility
 */
export const LoadingFallback: React.FC = () => (
  <div 
    className="loading-fallback" 
    role="alert" 
    aria-busy="true"
    aria-live="polite"
  >
    <div className="loading-spinner" />
    <span className="loading-text">Loading...</span>
  </div>
);

/**
 * Error fallback component for React Error Boundary
 * Shows error details and provides a reset button
 */
export const ErrorFallback: React.FC<FallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => (
  <div 
    className="error-fallback" 
    role="alert" 
    aria-live="assertive"
  >
    <h2>Something went wrong</h2>
    <pre className="error-message">{error.message}</pre>
    <button 
      onClick={resetErrorBoundary}
      className="reset-button"
    >
      Try again
    </button>
  </div>
);

/**
 * Component fallback for when images fail to load
 */
export const ImageFallback: React.FC<{ alt?: string }> = ({ alt = 'Image' }) => (
  <div className="image-fallback" aria-label={`${alt} placeholder`}>
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" fill="#f0f0f0" />
      <path 
        d="M30,40 L70,40 L70,70 L30,70 Z" 
        fill="#e0e0e0" 
        stroke="#d0d0d0" 
      />
      <circle cx="45" cy="50" r="5" fill="#d0d0d0" />
      <path 
        d="M40,65 L60,65 L50,55 Z" 
        fill="#d0d0d0" 
      />
    </svg>
  </div>
);

/**
 * Component to use when data is not available or still loading
 */
export const ContentPlaceholder: React.FC = () => (
  <div className="content-placeholder" aria-hidden="true">
    <div className="placeholder-line placeholder-title" />
    <div className="placeholder-line" />
    <div className="placeholder-line" />
    <div className="placeholder-line placeholder-short" />
  </div>
);