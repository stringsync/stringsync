import React, { useContext } from 'react';
import { RouteChildrenProps, Route } from 'react-router';
import { createBrowserHistory, createLocation } from 'history';
import { BrowserRouterProps, BrowserRouter } from 'react-router-dom';

const RouterContext = React.createContext<RouteChildrenProps<any, any>>({
  history: createBrowserHistory(),
  location: createLocation(window.location),
  match: null,
});

export const useRouter = () => useContext(RouterContext);

const Router: React.FC<BrowserRouterProps> = (props) => (
  // Hack to get access to routeProps from child component since
  // react-router does not have an official hook yet
  // https://github.com/ReactTraining/react-router/issues/6430
  <BrowserRouter {...props}>
    <Route>
      {(routeProps) => (
        <RouterContext.Provider value={routeProps}>
          {props.children}
        </RouterContext.Provider>
      )}
    </Route>
  </BrowserRouter>
);

export default Router;
