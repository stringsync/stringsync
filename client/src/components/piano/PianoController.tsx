import * as React from 'react';
import { compose, withHandlers, lifecycle } from 'recompose';
import { observeMaestro } from 'enhancers';
import { Maestro } from 'services/maestro/Maestro';
import { Piano } from 'models';
import { get } from 'lodash';


interface IInnerProps {
  handleNotification: (maestro: Maestro) => void;
}

const enhance = compose<IInnerProps, {}>(
  lifecycle<{}, {}>({
    componentWillMount(): void {
      const { maestro } = window.ss;

      if (!maestro) {
        throw new Error('expected an instance of Maestro to be defined on window.ss');
      }

      maestro.piano = new Piano();
    },
    componentWillUnmount(): void {
      const { maestro } = window.ss;

      if (maestro) {
        maestro.piano = null;
      }
    }
  }),
  withHandlers({
    handleNotification: () => (maestro: Maestro) => {
      const piano = get(window.ss.maestro, 'piano');

      if (!piano) {
        return;
      }

      piano.update(maestro);
    }
  }),
  observeMaestro<IInnerProps>(
    props => ({ name: 'PianoController', handleNotification: props.handleNotification })
  )
);

export const PianoController = enhance(() => null);
