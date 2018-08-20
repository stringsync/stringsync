import * as React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { NotFound } from 'components';
import { Edit, Print, Studio, Show } from './';

export const Notation: React.SFC<RouteComponentProps<{}, {}>> = props => (
  <Switch>
    <Route exact={true} path={`${props.match.url}/:id/edit`} component={Edit} />
    <Route exact={true} path={`${props.match.url}/:id/print`} component={Print} />
    <Route exact={true} path={`${props.match.url}/:id/studio`} component={Studio} />
    <Route exact={true} path={`${props.match.url}/:id`} component={Show} />
    <Route component={NotFound} />
  </Switch>
);

export default Notation;
