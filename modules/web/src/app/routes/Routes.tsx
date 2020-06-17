import React from 'react';
import { compose } from '@stringsync/common';
import { Route } from 'react-router-dom';
import { Landing } from './Landing';
import { Fallback } from './Fallback';
import { asReturnToRoute } from '../../hocs';

const Library = compose(asReturnToRoute)(React.lazy(() => import('./Library')));

const Signup = compose()(React.lazy(() => import('./Signup')));

const Login = compose()(React.lazy(() => import('./Login')));

export const Routes: React.FC = () => {
  return (
    <React.Suspense fallback={<Fallback />}>
      <Route path="/" exact component={Landing} />
      <Route path="/library" component={Library} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
    </React.Suspense>
  );
};
