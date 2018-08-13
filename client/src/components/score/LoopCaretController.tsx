import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Maestro } from 'services';
import { LoopCaretRenderer } from 'models/vextab/renderers/LoopCaretRenderer';
import { get } from 'lodash';
import { observeMaestro } from 'enhancers';

interface IInnerProps {
  handleNotification: (maestro: Maestro) => void;
}

const enhance = compose(
  withHandlers({
    handleNotification: () => (maestro: Maestro) => {
      const renderer: LoopCaretRenderer | void = get(maestro.vextab, 'renderer.loopCaretRenderer');

      if (!renderer) {
        return;
      }

      renderer.render(maestro);
    }
  }),
  observeMaestro<IInnerProps>(
    props => ({ name: 'LoopCaretController', handleNotification: props.handleNotification })
  )
);

export const LoopCaretController = enhance(() => null);
