import * as React from 'react';
import { compose, withHandlers, lifecycle, withState } from 'recompose';
import { observeMaestro } from 'enhancers';
import { Maestro } from 'services/maestro/Maestro';
import { Fretboard } from 'models';
import { get } from 'lodash';

interface IFretboardProps {
  fretboard: Fretboard | null;
  setFretboard: (fretboard: Fretboard | null) => void;
}

interface IHandlerProps {
  handleNotification: (maestro: Maestro) => void;
}

type InnerProps = IFretboardProps & IHandlerProps;

const enhance = compose<InnerProps, {}>(
  withState('fretboard', 'setFretboard', null),
  lifecycle<IFretboardProps, {}>({
    componentWillMount(): void {
      const { maestro } = window.ss;

      if (!maestro) {
        throw new Error('expected an instance of Maestro to be defined on window.ss');
      }

      maestro.fretboard = new Fretboard();
    },
    componentWillUnmount(): void {
      const { maestro } = window.ss;

      if (maestro) {
        maestro.fretboard = null;
      }
    }
  }),
  withHandlers({
    handleNotification: () => (maestro: Maestro) => {
      const fretboard = get(window.ss.maestro, 'fretboard');

      if (!fretboard) {
        return;
      }

      fretboard.update(maestro);
    }
  }),
  observeMaestro<InnerProps>(
    props => ({ name: 'FretboardController', handleNotification: props.handleNotification })
  )
);

export const FretboardController = enhance(() => null);
