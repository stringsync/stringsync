import * as React from 'react';
import { compose, branch, renderNothing } from 'recompose';
import { Maestro } from '../../models/maestro/Maestro';
import { subscribeMaestro } from '../../enhancers/subscribeMaestro';

interface IProps {
  visible: boolean;
}

const renderCaret = (maestro: Maestro) => {
  const { currentSpec } = maestro;

  if (!currentSpec) {
    return;
  }

  maestro.score.caret.render(currentSpec, maestro.currentTick);
};

const enhance = compose<IProps, IProps>(
  branch<IProps>(
    props => !props.visible,
    renderNothing
  ),
  subscribeMaestro(() => ({
    name: 'renderCaret',
    callback: renderCaret
  }))
);

export const Caret = enhance(() => null);
