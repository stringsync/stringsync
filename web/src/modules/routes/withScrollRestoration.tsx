import React, { useEffect } from 'react';

const withScrollRestoration = function<P>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return (props) => {
    useEffect(() => {
      window.scrollTo(0, 0);
    });
    return <Component {...props} />;
  };
};

export default withScrollRestoration;
