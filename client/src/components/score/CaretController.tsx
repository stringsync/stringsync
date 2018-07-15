import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { observeMaestro } from 'enhancers';
import { Maestro } from 'services/maestro/Maestro';
import { get } from 'lodash';
import { CaretRenderer } from 'models/vextab/renderers/CaretRenderer';

interface IInnerProps {
  handleNotification: (maestro: Maestro) => void;
}

const enhance = compose<IInnerProps, {}>(
  withHandlers({
    handleNotification: () => (maestro: Maestro) => {
      const renderer: CaretRenderer | void = get(maestro.vextab, 'renderer.caretRenderer');

      if (!renderer) {
        return;
      }

      renderer.render(maestro);
    }
  }),
  observeMaestro<IInnerProps>(
    props => ({ name: 'CaretController', handleNotification: props.handleNotification })
  )
);

export const CaretController = enhance(() => null);