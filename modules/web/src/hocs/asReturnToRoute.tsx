import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { setReturnToRoute, RootState, AppDispatch } from '../store';

export const asReturnToRoute = function<P>(Component: React.ComponentType<P>): React.FC<P> {
  return (props) => {
    const dispatch = useDispatch<AppDispatch>();
    const returnToRoute = useSelector<RootState, string>((state) => state.history.returnToRoute);
    const location = useLocation();
    const nextReturnToRoute = `${location.pathname}${location.search}${location.hash}`;

    useEffect(() => {
      if (returnToRoute !== nextReturnToRoute) {
        dispatch(setReturnToRoute(nextReturnToRoute));
      }
    }, [returnToRoute, nextReturnToRoute, dispatch]);

    return <Component {...props} />;
  };
};
