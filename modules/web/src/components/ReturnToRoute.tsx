import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, RouteProps, useLocation } from 'react-router';
import { AppDispatch, RootState, setReturnToRoute } from '../store';

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

export const ReturnToRoute: React.FC<RouteProps> = (props) => {
  const component = props.component ? asReturnToRoute(props.component) : undefined;
  const routeProps = { ...props, component };
  return <Route {...routeProps} />;
};
