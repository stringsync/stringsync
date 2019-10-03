import React from 'react';
import { Layouts } from './Layouts';
import DefaultLayout, { DefaultLayoutProps } from './DefaultLayout';
import NoneLayout, { NoneLayoutProps } from './NoneLayout';

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

type LayoutProps = DefaultLayoutProps | NoneLayoutProps;

interface LayoutOptions {
  layout: Layouts;
  props: LayoutProps;
}

const withLayout = (layoutOptions: LayoutOptions) =>
  function<P>(Component: React.ComponentType<P>) {
    const Layout = getLayout(layoutOptions.layout);
    return (props: P) => (
      <Layout {...layoutOptions.props}>
        <Component {...props} />
      </Layout>
    );
  };

export default withLayout;
