import React from 'react';
import { Route } from 'react-router-dom';
import Landing from '../landing/Landing';
import Library from '../library/Library';
import withFallback from './withFallback';
import withScrollRestoration from './withScrollRestoration';
import Router from './Router';

const enhance = function<P>(Component: React.ComponentType<P>) {
  return withScrollRestoration(withFallback(Component));
};

const Signup = enhance(React.lazy(() => import('../signup/Signup')));
const Login = enhance(React.lazy(() => import('../login/Login')));

interface Props {}

const Routes: React.FC<Props> = (props) => {
  return (
    <Router>
      <Route path="/" exact component={Landing} />
      <Route path="/library" component={Library} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
    </Router>
  );
};

export default Routes;
