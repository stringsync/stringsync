import React from 'react';
import { Route } from 'react-router-dom';
import Library from '../library/Library';
import Signup from '../signup/Signup';
import Login from '../login/Login';

interface Props {}

const Router: React.FC<Props> = (props) => {
  return (
    <React.Fragment>
      <Route path="/" exact component={Library} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
    </React.Fragment>
  );
};

export default Router;
