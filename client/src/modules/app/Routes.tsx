import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthRoute } from './AuthRoute';
import { Notation, NotationIndex } from 'modules/notations';
import { NotFound } from 'components';

export const Routes = () => (
  <Switch>
    <Route exact={true} path="/" component={NotationIndex} />
    <Route path="/n" component={Notation} />
    <Route component={NotFound} />
  </Switch>
);
