import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { EditorActions } from 'data';


interface IConnectProps {
  editor: Store.IEditorState;
  setElementIndex: (elementIndex: number) => void;
}

interface IHandlerProps extends IConnectProps {
  renderSelection: () => void;
}

// TODO rename this
const enhance = compose<IHandlerProps, {}>(
  connect(
    (state: Store.IState) => ({
      editor: state.editor
    }),
    (dispatch: Dispatch) => ({
      setElementIndex: (elementIndex: number) => dispatch(EditorActions.setElementIndex(elementIndex))
    })
  ),
  lifecycle<IHandlerProps, {}>({
    componentDidMount(): void {
      this.props.setElementIndex(0);
    },
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
