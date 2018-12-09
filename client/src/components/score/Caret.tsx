import * as React from 'react';
import { compose, branch, renderNothing, lifecycle } from 'recompose';
import { withMaestro, IWithMaestroProps } from '../../enhancers/withMaestro';
import { loop } from '../../enhancers/loop';
import { connect } from 'react-redux';

interface IProps {
  visible: boolean;
}

type InnerProps = IProps & IWithMaestroProps;

const enhance = compose<InnerProps, IProps>(
  withMaestro,
  branch<InnerProps>(
    props => !props.visible || !props.maestro,
    renderNothing
  ),
  loop((props: InnerProps) => {
    props.maestro!.score.caret.render(0, 0);
  })
);

export const Caret = enhance(() => null);
