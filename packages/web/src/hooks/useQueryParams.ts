import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

export const useQueryParams = () => {
  const location = useLocation();
  const history = useHistory();
  const [queryParams, setQueryParams] = useState(new URLSearchParams());

  const pushQueryParams = (nextQueryParams: URLSearchParams) => {
    history.push({
      pathname: location.pathname,
      hash: location.hash,
      search: `?${nextQueryParams.toString()}`,
    });
  };

  useEffect(() => {
    setQueryParams(new URLSearchParams(location.search));
  }, [location.search]);

  return { queryParams, pushQueryParams };
};
