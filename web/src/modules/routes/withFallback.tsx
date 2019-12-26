import React from 'react';
import { Fallback } from './Fallback';

// HOC that shows loading spinner while the browser fetches the
// js bundle for the component.
const withFallback = function<P>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return (props) => {
    return (
      <React.Suspense fallback={<Fallback />}>
        <Component {...props} />
      </React.Suspense>
    );
  };
};

export default withFallback;
