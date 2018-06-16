import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthRoute } from './AuthRoute';
import { Notation, NotationIndex } from 'modules/notations';
import { About } from 'modules/about';
import { NotFound } from 'components';

export const Routes = () => (
  <Switch>
    <Route exact={true} path="/" component={NotationIndex} />
    <Route path="/n" component={Notation} />
    <Route path="/about" component={About} />
    <Route component={NotFound} />
  </Switch>
);
