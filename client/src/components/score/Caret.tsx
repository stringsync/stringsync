import * as React from 'react';
import { compose, branch, renderNothing } from 'recompose';
import { withMaestro } from '../../enhancers/withMaestro';

interface IProps {
  visible: boolean;
}

const enhance = compose<IProps, IProps>(
  branch<IProps>(
    props => !props.visible,
    renderNothing
  ),
  withMaestro
);

export const Caret = enhance(() => null);
