import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotationIndex, NotationNew, NotationEdit, NotationPrint, NotationShow, NotationStudio  } from '../notations';
import { NotFound } from '../../components/not-found/NotFound';
import { About } from '../about/About';
import { Contact } from '../contact/Contact';
import { Terms } from '../terms/Terms';
import { Privacy } from '../privacy/Privacy';

export const Routes = () => (
  <Switch>
    <Route exact={true} path="/"             component={NotationIndex}  />
    <Route exact={true} path="/upload"       component={NotationNew}    />
    <Route exact={true} path="/n/:id/edit"   component={NotationEdit}   />
    <Route exact={true} path="/n/:id/print"  component={NotationPrint}  />
    <Route exact={true} path="/n/:id/studio" component={NotationStudio} />
    <Route exact={true} path="/n/:id"        component={NotationShow}   />
    <Route exact={true} path="/about"        component={About}          />
    <Route exact={true} path="/contact"      component={Contact}        />
    <Route exact={true} path="/terms"        component={Terms}          />
    <Route exact={true} path="/privacy"      component={Privacy}        />
    <Route                                   component={NotFound}       />
  </Switch>
);
