import * as React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import { NotationIndex, NotationNew, NotationEdit, NotationPrint, NotationShow, NotationStudio  } from '../notations';

export const Routes = () => (
  <Switch>
    <Route exact={true} path="/"             component={NotationIndex}  />
    <Route exact={true} path="/upload"       component={NotationNew}    />
    <Route exact={true} path="/n/:id/edit"   component={NotationEdit}   />
    <Route exact={true} path="/n/:id/print"  component={NotationPrint}  />
    <Route exact={true} path="/n/:id/studio" component={NotationStudio} />
    <Route exact={true} path="/n/:id"        component={NotationShow}   />
  </Switch>
);
