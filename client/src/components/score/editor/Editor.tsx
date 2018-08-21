import * as React from 'react';
import { Vextab, Editor as EditorModel } from 'models';
import { compose, withState, lifecycle } from 'recompose';
import { Selector } from './Selector';

interface IOuterProps {
  vextab: Vextab;
}

interface IInnerProps extends IOuterProps {
  editor: EditorModel | null;
  setEditor: (editor: EditorModel) => void;
}

const enhance = compose<IInnerProps, IOuterProps>(
  withState('editor', 'setEditor', null),
  lifecycle<IInnerProps, {}>({
    componentDidMount(): void {
      const editor = new EditorModel(this.props.vextab);
      this.props.setEditor(editor);
    },
    componentDidUpdate(): void {
      this.props.editor!.vextab = this.props.vextab;
    }
  })
);

/**
 * This component is used to enable notation editing. It is purpose nested under the Score
 * component to ensure a vextab is present.
 */
export const Editor = enhance(() => (
  <div>
    <Selector />
  </div>
));