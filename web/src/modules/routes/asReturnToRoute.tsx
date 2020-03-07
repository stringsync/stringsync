import React, { useEffect } from 'react';
import { useSelector } from '../../hooks';
import { useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { setReturnToRoute } from '../../store';

export const asReturnToRoute = function<P>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return (props) => {
    const returnToRoute = useSelector((state) => state.history.returnToRoute);
    const dispatch = useDispatch();
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
