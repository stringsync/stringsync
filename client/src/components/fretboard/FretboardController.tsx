import * as React from 'react';
import { compose, withHandlers, lifecycle } from 'recompose';
import { observeMaestro } from 'enhancers';
import { Maestro } from 'services/maestro/Maestro';
import { Fretboard } from 'models';
import { get } from 'lodash';


interface IInnerProps {
  handleNotification: (maestro: Maestro) => void;
}

const enhance = compose<IInnerProps, {}>(
  lifecycle<{}, {}>({
    componentDidMount(): void {
      const { maestro } = window.ss;

      if (!maestro) {
        throw new Error('expected an instance of Maestro to be defined on window.ss');
      }

      maestro.fretboard = new Fretboard();
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
  observeMaestro<IInnerProps>(
    props => ({ name: 'FretboardController', handleNotification: props.handleNotification })
  )
);

export const FretboardController = enhance(() => null);
