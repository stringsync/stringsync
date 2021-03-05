import React from 'react';
import { DefaultLayout } from './DefaultLayout';
import { NoneLayout } from './NoneLayout';
import { Layout } from './types';

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
  const LayoutComponent = getLayout(layout);
  return function<P>(Component: React.ComponentType<P>) {
    return (props: P) => (
      <LayoutComponent>
        <Component {...props} />
      </LayoutComponent>
    );
  };
};
