import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { Vextab } from 'models';

interface IOuterProps {
  vextab: Vextab;
}

interface IInnerProps extends IOuterProps {
  editor: Store.IEditorState;
}

const enhance = compose<IInnerProps, IOuterProps>(
  connect(
    (state: Store.IState) => ({
      editor: state.editor
    })
  ),
  lifecycle<IInnerProps, {}>({
    componentDidUpdate(): void {
      const { editor, vextab } = this.props;
      const { selectorRenderer } = this.props.vextab.renderer;

      const selected = vextab.elements[editor.elementIndex];

      if (!selected || !editor.enabled) {
        selectorRenderer.clear();
      } else {
        selectorRenderer.render(selected);
      }
    }
  })
);

export const Editor = enhance(() => null);
