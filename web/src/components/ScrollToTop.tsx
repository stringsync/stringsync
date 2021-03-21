import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { scrollToTop } from '../util/scrollToTop';

export const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    scrollToTop({ duration: 0 });
  }, [location.pathname]);

  return null;
};
