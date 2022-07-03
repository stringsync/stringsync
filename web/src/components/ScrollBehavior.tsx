import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../util/scrollToTop';

export const ScrollBehavior: React.FC = () => {
  const location = useLocation();

  // Scroll to the top of the page whenever the route changes.
  useEffect(() => {
    scrollToTop({ duration: 0 });
  }, [location.pathname]);

  return null;
};
