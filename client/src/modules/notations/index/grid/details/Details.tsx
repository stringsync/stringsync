import * as React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { GridProps } from '../Grid';
import { LoadingDetails } from './LoadingDetails';
import { LoadedDetails } from './LoadedDetails';

const enhance = compose<GridProps, GridProps>(
  branch<GridProps>(
    props => !!props.loading,
    renderComponent(LoadingDetails),
    renderComponent(LoadedDetails)
  )
);

export const Details = enhance(() => null);
