import React from 'react';
import { Layout } from './types';
import { DefaultLayout } from './DefaultLayout';
import { NoneLayout } from './NoneLayout';

const getLayout = (layout: Layout) => {
  switch (layout) {
    case Layout.DEFAULT:
      return DefaultLayout;
    case Layout.NONE:
      return NoneLayout;
    default:
      throw new TypeError(`unrecognized layout: '${layout}'`);
  }
};

export const withLayout = (layout: Layout) => {
  const Layout = getLayout(layout);
  return function<P>(Component: React.ComponentType<P>) {
    return (props: P) => (
      <Layout>
        <Component {...props} />
      </Layout>
    );
  };
};
