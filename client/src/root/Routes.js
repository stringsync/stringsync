import React from 'react';
import { Route } from 'react-router-dom';
import { NotationIndex, About, Login } from 'components';

const Routes = () => (
  <div id="routes" className="routes">
    <Route exact path="/" component={NotationIndex} />
    <Route path="/about" component={About} />
    <Route path="/login" component={Login} />
  </div>
);

export default Routes;
