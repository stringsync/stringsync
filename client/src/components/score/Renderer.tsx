import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { observeMaestro } from 'enhancers';
import { Maestro } from 'services';
import { get } from 'lodash';
import { Directive } from 'models';

interface IInnerProps {
  handleNotification: (maestro: Maestro) => void;
}

const enhance = compose<IInnerProps, {}>(
  withHandlers({
    handleNotification: () => (maestro: Maestro) => {
      // First, we check to see if we should go through with the initial rendering process.
      const renderer = get(maestro, 'vextab.renderer');

      if (!renderer || !renderer.isRenderable || renderer.isRendered) {
        return;
      }

      Directive.extractAndInvoke(renderer.vextab);
      renderer.render();

      // Then, we populate the TickMap and the VextabLinkedList.
      const { tickMap } = maestro;

      if (!tickMap) {
        throw new Error('vextab and tickMap got out-of-sync, expected tickMap to be not null');
      }

      tickMap.compute();
      renderer.vextab.links.compute();

      // Last, we render the Caret if it is observing the maestro
      maestro.update(false);

      const caret = maestro.observers.find(observer => observer.name === 'CaretController');

      if (caret) {
        caret.handleNotification(maestro);
      }
    }
  }),
  observeMaestro<IInnerProps>(
    props => ({ name: 'ScoreRenderer', handleNotification: props.handleNotification })
  )
);

/**
 * The purpose of this component is to conditionally trigger rendering when the Maestro is
 * notified.
 */
export const Renderer = enhance(() => null);
