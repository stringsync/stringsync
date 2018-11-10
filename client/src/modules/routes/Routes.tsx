import * as React from 'react';
import { Switch, Route } from 'react-router';
import { Index as NotationsIndex } from '../notations/index/Index.tsx';

export const Routes = () => (
  <Switch>
    <Route exact={true} path="/" component={NotationsIndex} />
  </Switch>
);
