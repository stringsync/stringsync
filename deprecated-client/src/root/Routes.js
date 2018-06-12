import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotationIndex, Notation, About, Login, Signup, NotFound } from 'components';
import { AuthRoute } from './';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={NotationIndex} />
    <AuthRoute requireSignIn={false} exact path="/login" component={Login} />
    <AuthRoute requireSignIn={false} exact path="/signup" component={Signup} />
    <Route path="/n" component={Notation} />
    <Route path="/about" component={About} />
    <Route component={NotFound} />
  </Switch>
);

export default Routes;
