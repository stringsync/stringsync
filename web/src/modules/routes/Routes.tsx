import React from 'react';
import { Route } from 'react-router-dom';
import withSuspense from '../../hocs/with-suspense/withSuspense';
import Landing from '../landing/Landing';
import Fallback from './Fallback';

const withFallback = (Component: React.ComponentType) =>
  withSuspense(Component, <Fallback />);

const Library = withFallback(React.lazy(() => import('../library/Library')));
const Signup = withFallback(React.lazy(() => import('../signup/Signup')));
const Login = withFallback(React.lazy(() => import('../login/Login')));

interface Props {}

const Router: React.FC<Props> = (props) => {
  return (
    <React.Fragment>
      <Route path="/" exact component={Landing} />
      <Route path="/library" component={Library} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
    </React.Fragment>
  );
};

export default Router;
