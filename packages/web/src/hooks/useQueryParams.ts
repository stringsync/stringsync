import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

export const useQueryParams = () => {
  const location = useLocation();
  const [queryParams, setQueryParams] = useState(new URLSearchParams(location.search));

  useEffect(() => {
    setQueryParams(new URLSearchParams(location.search));
  }, [location.search]);

  return queryParams;
};
