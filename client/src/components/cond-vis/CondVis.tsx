import * as React from 'react';
import { compose, branch, renderNothing } from 'recompose';

interface IProps {
  visible: boolean;
}

const enhance = compose<IProps, IProps>(
  branch<IProps>(
    props => !props.visible,
    renderNothing
  )
);

export const CondVis = enhance(props => <>{props.children}</>);
