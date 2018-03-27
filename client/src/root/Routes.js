import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotationIndex, About, Login, NotFound } from 'components';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={NotationIndex} />
    <Route path="/about" component={About} />
    <Route exact path="/login" component={Login} />
    <Route component={NotFound} />
  </Switch>
);

export default Routes;
