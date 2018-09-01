import * as React from 'react';
import { compose } from 'recompose';
import { Form, Checkbox, Radio } from 'antd';
import { Rhythm as RhythmModel } from 'models';
import { Tuplet } from './Tuplet';
import { withEditorHandlers } from 'enhancers';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { RadioChangeEvent } from 'antd/lib/radio';

interface IOuterProps {
  element: RhythmModel;
  editor: Store.IEditorState;
}

interface IHandlerProps extends IOuterProps {
  handleValueChange: (event: RadioChangeEvent) => void;
  handleDotChange: (checked: CheckboxChangeEvent) => void;
}

const enhance = compose<IHandlerProps, IOuterProps>(
  withEditorHandlers<CheckboxChangeEvent | RadioChangeEvent, IOuterProps>({
    handleDotChange: () => (event: CheckboxChangeEvent, editor) => {
      editor.updateRhythmDot(event.target.checked);
    },
    handleValueChange: () => (event: RadioChangeEvent, editor) => {
      editor.updateRhythmValue(event.target.value);
    }
  })
);

export const Rhythm = enhance(props => (
  <div>
    <Form layout="inline">
      <Form.Item label="value">
        <Radio.Group
          onChange={props.handleValueChange}
          defaultValue={props.element.value}
        >
          <Radio.Button value={1}>1</Radio.Button>
          <Radio.Button value={2}>2</Radio.Button>
          <Radio.Button value={4}>4</Radio.Button>
          <Radio.Button value={8}>8</Radio.Button>
          <Radio.Button value={16}>16</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="dot">
        <Checkbox
          defaultChecked={props.element.dot}
          onChange={props.handleDotChange}
        />
      </Form.Item>
    </Form>
    <Tuplet tuplet={props.element.tuplet} />
  </div>
));
