import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthRoute } from './AuthRoute';
import { Notation, NotationIndex, NotationNew } from 'modules/notations';
import { About } from 'modules/about';
import { Login, Signup } from 'modules/session';
import { NotFound } from 'components';

export const Routes = () => (
  <Switch>
    <Route exact={true} path="/" component={NotationIndex} />
    <AuthRoute requireSignIn={false} exact={true} path="/login" component={Login} />
    <AuthRoute requireSignIn={false} exact={true} path="/signup" component={Signup} />
    <Route exact={true} path="/upload" component={NotationNew} />
    <Route path="/n" component={Notation} />
    <Route path="/about" component={About} />
    <Route component={NotFound} />
  </Switch>
);
