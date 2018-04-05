import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NotationEdit, NotationPrint, NotationShow, NotationStudio } from './';
import { NotFound } from 'components';

const Notation = props => (
  <Switch>
    <Route exact path={`${props.match.url}/:id/edit`} component={NotationEdit} />
    <Route exact path={`${props.match.url}/:id/print`} component={NotationPrint} />
    <Route exact path={`${props.match.url}/:id/studio`} component={NotationStudio} />
    <Route exact path={`${props.match.url}/:id`} component={NotationShow} />
    <Route component={NotFound} />
  </Switch>
);

export default Notation;