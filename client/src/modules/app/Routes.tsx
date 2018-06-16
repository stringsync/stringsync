import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthRoute } from './AuthRoute';
import { NotationIndex } from 'modules/notations';

export const Routes = () => (
  <Switch>
    <Route exact={true} path="/" component={NotationIndex} />
  </Switch>
);
