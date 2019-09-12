import React, { ComponentType, ReactNode } from 'react';

const withSuspense = function<P>(
  Component: ComponentType<P>,
  fallback: NonNullable<ReactNode>
) {
  return (props: P) => {
    return (
      <React.Suspense fallback={fallback}>
        <Component {...props} />
      </React.Suspense>
    );
  };
};

export default withSuspense;
