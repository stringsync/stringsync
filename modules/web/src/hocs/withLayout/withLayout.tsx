import React from 'react';
import { Layouts } from './types';
import { DefaultLayout } from './DefaultLayout';
import { NoneLayout } from './NoneLayout';

const getLayout = (layout: Layouts) => {
  switch (layout) {
    case Layouts.DEFAULT:
      return DefaultLayout;
    case Layouts.NONE:
      return NoneLayout;
    default:
      throw new TypeError(`unrecognized layout: '${layout}'`);
  }
};

export const withLayout = (layout: Layouts) => {
  const Layout = getLayout(layout);
  return function<P>(Component: React.ComponentType<P>) {
    return (props: P) => (
      <Layout>
        <Component {...props} />
      </Layout>
    );
  };
};
