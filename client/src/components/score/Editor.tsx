import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';


interface IConnectProps {
  editor: Store.IEditorState;
}

interface IHandlerProps extends IConnectProps {
  renderSelection: () => void;
}

// TODO rename this
const enhance = compose<IHandlerProps, {}>(
  connect(
    (state: Store.IState) => ({
      editor: state.editor
    })
  ),
  lifecycle<IHandlerProps, {}>({
    componentDidUpdate(): void {
      const { vextab, elementIndex, enabled } = this.props.editor;

      if (!vextab) {
        return;
      }

      const { selectorRenderer } = vextab.renderer;

      if (!selectorRenderer.isRenderable) {
        return;
      }

      const selected = vextab.elements[elementIndex];

      if (!selected || !enabled) {
        selectorRenderer.clear();
      } else {
        selectorRenderer.render(selected);
      }
    }
  }),
);

export const Editor = enhance(() => null);
