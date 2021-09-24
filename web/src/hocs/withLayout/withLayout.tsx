import React from 'react';
import { DefaultLayout } from './DefaultLayout';
import { NoneLayout } from './NoneLayout';

export enum Layout {
  DEFAULT = 'DEFAULT',
  NONE = 'NONE',
}

export type LayoutOptions = {
  lanes: boolean;
  footer: boolean;
};

const DEFAULT_OPTIONS: LayoutOptions = {
  lanes: true,
  footer: true,
};

const getLayout = (layout: Layout, opts: LayoutOptions): React.FC => {
  switch (layout) {
    case Layout.DEFAULT:
      return (props) => (
        <DefaultLayout lanes={opts.lanes} footer={opts.footer}>
          {props.children}
        </DefaultLayout>
      );
    case Layout.NONE:
      return NoneLayout;
    default:
      throw new TypeError(`unrecognized layout: '${layout}'`);
  }
};

export const withLayout = (layout: Layout, opts: LayoutOptions = DEFAULT_OPTIONS) => {
  const LayoutComponent = getLayout(layout, opts);
  return function<P>(Component: React.ComponentType<P>) {
    return (props: P) => (
      <LayoutComponent>
        <Component {...props} />
      </LayoutComponent>
    );
  };
};
