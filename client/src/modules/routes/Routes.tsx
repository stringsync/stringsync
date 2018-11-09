import * as React from 'react';
import { Switch, Route } from 'react-router';
import { Index as NotationsIndex } from '../notations/index/Index.tsx';
import { AuthRoute } from './AuthRoute';
import { Login } from '../session';

export const Routes = () => (
  <Switch>
    <Route exact={true} path="/" component={NotationsIndex} />
    <AuthRoute requiredSignIn={false} exact={true} path="/login" component={Login} />
  </Switch>
);
