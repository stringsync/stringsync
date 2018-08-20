import * as React from 'react';
import { compose, withHandlers, lifecycle } from 'recompose';
import { Maestro } from 'services';
import { LoopCaretRenderer } from 'models/vextab/renderers/LoopCaretRenderer';
import { get } from 'lodash';
import { observeMaestro } from 'enhancers';
import { connect } from 'react-redux';

interface IConnectProps {
  isLoopVisible: boolean;
}

interface IInnerProps extends IConnectProps {
  syncLoopVisibility: (maestro: Maestro) => void;
}

const enhance = compose(
  connect(
    (state: Store.IState) => ({
      isLoopVisible: state.ui.isLoopVisible
    })
  ),
  withHandlers({
    syncLoopVisibility: (props: IConnectProps) => (maestro: Maestro) => {
      const renderer: LoopCaretRenderer | void = get(maestro.vextab, 'renderer.loopCaretRenderer');

      if (!renderer) {
        return;
      }

      if (props.isLoopVisible) {
        renderer.render(maestro);
      } else {
        renderer.clear();
      }
    }
  }),
  observeMaestro<IInnerProps>(
    props => ({ name: 'LoopCaretController', handleNotification: props.syncLoopVisibility })
  ),
  lifecycle<IInnerProps, {}>({
    componentDidUpdate(): void {
      if (window.ss.maestro) {
        this.props.syncLoopVisibility(window.ss.maestro);
      }
    }
  })
);

export const LoopCaret = enhance(() => null);
