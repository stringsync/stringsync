import * as React from 'react';
import { compose, branch, renderNothing, lifecycle } from 'recompose';
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
  branch<IInnerProps>(props => !props.editor.enabled, renderNothing),
  lifecycle<IInnerProps, {}>({
    componentDidUpdate(): void {
      const { editor, vextab } = this.props;
      const { selectorRenderer } = this.props.vextab.renderer;

      if (!editor.enabled) {
        return;
      }

      const selected = vextab.elements[editor.elementIndex];

      if (!selected) {
        selectorRenderer.clear();
      } else {
        selectorRenderer.render(selected);
      }
    }
  })
);

export const Editor = enhance(() => null);
