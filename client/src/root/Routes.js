import React from 'react';
import { Route } from 'react-router-dom';
import { NotationIndex } from 'components';

const Routes = () => (
  <div id="routes" className="routes">
    <Route exact path="/" component={NotationIndex} />
  </div>
);

export default Routes;
