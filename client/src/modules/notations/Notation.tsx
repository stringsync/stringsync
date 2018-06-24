import * as React from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { NotFound } from 'components';
import { NotationEdit, NotationPrint, NotationStudio, NotationShow } from './';

export const Notation: React.SFC<RouteComponentProps<{}, {}>> = props => (
  <Switch>
    <Route exact={true} path={`${props.match.url}/:id/edit`} component={NotationEdit} />
    <Route exact={true} path={`${props.match.url}/:id/print`} component={NotationPrint} />
    <Route exact={true} path={`${props.match.url}/:id/studio`} component={NotationStudio} />
    <Route exact={true} path={`${props.match.url}/:id`} component={NotationShow} />
    <Route component={NotFound} />
  </Switch>
);

export default Notation;
