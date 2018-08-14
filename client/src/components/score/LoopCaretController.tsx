import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Maestro } from 'services';
import { LoopCaretRenderer } from 'models/vextab/renderers/LoopCaretRenderer';
import { get } from 'lodash';
import { observeMaestro } from 'enhancers';
import { connect } from 'react-redux';

interface IConnectProps {
  showLoop: boolean;
}

interface IInnerProps extends IConnectProps {
  handleNotification: (maestro: Maestro) => void;
}

const enhance = compose(
  connect(
    (state: StringSync.Store.IState) => ({
      showLoop: state.behavior.showLoop
    })
  ),
  withHandlers({
    handleNotification: (props: IConnectProps) => (maestro: Maestro) => {
      const renderer: LoopCaretRenderer | void = get(maestro.vextab, 'renderer.loopCaretRenderer');

      if (!renderer) {
        return;
      }

      if (props.showLoop) {
        renderer.render(maestro);
      } else {
        renderer.clear();
      }
    }
  }),
  observeMaestro<IInnerProps>(
    props => ({ name: 'LoopCaretController', handleNotification: props.handleNotification })
  )
);

export const LoopCaretController = enhance(() => null);
