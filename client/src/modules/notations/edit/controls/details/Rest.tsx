import * as React from 'react';
import { compose } from 'recompose';
import { Form, InputNumber } from 'antd';
import { Rest as RestModel } from 'models';
import { Rhythm } from './Rhythm';
import { withEditorHandlers } from 'enhancers';

interface IOuterProps {
  element: RestModel;
  editor: Store.IEditorState;
}

interface IHandlerProps extends IOuterProps {
  handlePositionChange: (value: number | string) => void;
}

const enhance = compose<IHandlerProps, IOuterProps>(
  withEditorHandlers<number | string, IOuterProps>({
    handlePositionChange: () => (value, editor) => {
      if (typeof value === 'number') {
        editor.updateRestPosition(value);
      }
    }
  })
);

export const Rest = enhance(props => (
  <div>
    <Rhythm editor={props.editor} element={props.element.rhythm} />
    <Form layout="inline">
      <Form.Item label="position">
        <InputNumber
          defaultValue={props.element.position}
          onChange={props.handlePositionChange}
        />
      </Form.Item>
    </Form>
  </div>
));
