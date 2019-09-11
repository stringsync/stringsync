import React from 'react';
import { Route } from 'react-router-dom';
import Library from '../library/Library';

const Signup = React.lazy(() => import('../signup/Signup'));
const Login = React.lazy(() => import('../login/Login'));

interface Props {}

const Router: React.FC<Props> = (props) => {
  console.log('Router rerendered');
  return (
    <React.Fragment>
      <Route path="/" exact component={Library} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
    </React.Fragment>
  );
};

export default Router;
