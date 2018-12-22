import * as React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { ISpec, Maestro } from '../../models/maestro/Maestro';
import { subscribeMaestro } from '../../enhancers/subscribeMaestro';

interface IStateProps {
  spec: ISpec | null;
  setSpec: (spec: ISpec | null) => void;
}

interface IHandlerProps {
  updateLit: (maestro: Maestro) => void;
}

type InnerProps = IStateProps & IHandlerProps;

const enhance = compose<InnerProps, {}>(
  withState('spec', 'setSpec', null),
  withHandlers<IStateProps, IHandlerProps>({
    updateLit: props => (maestro: Maestro) => {
      const { currentSpec } = maestro;

      if (props.spec === currentSpec) {
        return;
      }

      if (props.spec && props.spec.note) {
        props.spec.note.unlight();
      }

      if (currentSpec && currentSpec.note) {
        currentSpec.note.light();
      }

      props.setSpec(currentSpec);
    }
  }),
  subscribeMaestro<InnerProps>(props => ({
    name: 'updateLit',
    callback: props.updateLit
  }))
);

export const Lighter = enhance(() => null);
