import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

export const withScrollRestoration = function<P>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return (props) => {
    const location = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location]);
    return <Component {...props} />;
  };
};
