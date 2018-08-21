import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { observeMaestro } from 'enhancers';
import { Maestro } from 'services/maestro/Maestro';
import { get } from 'lodash';
import { CaretRenderer } from 'models/vextab/renderers/CaretRenderer';
import { Vextab } from 'models';

interface IOuterProps {
  vextab: Vextab;
}

interface IInnerProps extends IOuterProps {
  handleNotification: (maestro: Maestro) => void;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withHandlers({
    handleNotification: () => (maestro: Maestro) => {
      const renderer: CaretRenderer | void = get(maestro.vextab, 'renderer.selectorRenderer');

      if (!renderer) {
        return;
      }

      renderer.render(maestro);
    }
  }),
  observeMaestro<IInnerProps>(
    props => ({ name: 'SelectorController', handleNotification: props.handleNotification })
  )
);

export const Selector = enhance(() => null);
