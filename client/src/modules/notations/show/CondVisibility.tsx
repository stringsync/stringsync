import * as React from 'react';
import { compose, branch, defaultProps, renderNothing } from 'recompose';

interface IProps {
  shouldShow: () => boolean;
}

const enhance = compose<IProps, IProps>(
  defaultProps({ affixProps: {} }),
  branch<IProps>(
    props => !props.shouldShow(),
    renderNothing
  )
);

export const CondVisibility = enhance(props => <>{props.children}</>);
