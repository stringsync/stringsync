import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotationIndex, Notation, About, Login, Signup, NotFound } from 'components';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={NotationIndex} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/signup" component={Signup} />
    <Route path="/n" component={Notation} />
    <Route path="/about" component={About} />
    <Route component={NotFound} />
  </Switch>
);

export default Routes;
