import React from 'react';
import { Route } from 'react-router-dom';
import { Landing } from './Landing';
import { Fallback } from './Fallback';
import { compose } from '@stringsync/common';

const Library = compose()(React.lazy(() => import('./Library')));

const Signup = compose()(React.lazy(() => import('./Signup')));

export const Routes: React.FC = () => {
  return (
    <React.Suspense fallback={<Fallback />}>
      <Route path="/" exact component={Landing} />
      <Route path="/library" component={Library} />
      <Route path="/signup" component={Signup} />
    </React.Suspense>
  );
};
