import * as React from 'react';
import { compose } from 'recompose';
import { Form, Input, InputNumber } from 'antd';
import { Chord, Note } from 'models';
import { withEditorHandlers } from 'enhancers';

interface IOuterProps {
  element: Chord | Note;
  editor: Store.IEditorState;
  position: Guitar.IPosition;
}

interface IHandlerProps extends IOuterProps {
  handleFretChange: (fret: number | string) => void;
}

const enhance = compose<IHandlerProps, IOuterProps>(
  withEditorHandlers<number | string, IOuterProps>({
    handleFretChange: props => (fret, editor) => {
      const { position } = props;

      if (typeof fret === 'number') {
        const nextPosition = { ...position, ...{ fret } };
        editor.addNotePosition(nextPosition);
      } else {
        editor.removeNotePosition(position.str);
      }
    }
  })
);

export const Position = enhance(props => (
  <Form.Item>
    <Input.Group compact={true}>
      <InputNumber disabled={true} value={props.position.str} />
      <InputNumber
        min={0}
        max={30}
        defaultValue={props.position.fret}
        onChange={props.handleFretChange}
      />
    </Input.Group>
  </Form.Item>
));
