import * as React from 'react';
import { compose } from 'recompose';
import { Form, Input, Checkbox } from 'antd';
import { Rhythm as RhythmModel } from 'models';
import { Tuplet } from './Tuplet';
import { withEditorHandlers } from 'enhancers';
import { get } from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

interface IOuterProps {
  element: RhythmModel;
  editor: Store.IEditorState;
}

interface IHandlerProps extends IOuterProps {
  handleValueChange: (event: React.FormEvent<HTMLInputElement>) => void;
  handleDotChange: (checked: CheckboxChangeEvent) => void;
}

const enhance = compose<IHandlerProps, IOuterProps>(
  withEditorHandlers<CheckboxChangeEvent | React.FormEvent<HTMLInputElement>, IOuterProps>({
    handleDotChange: () => (event: CheckboxChangeEvent, editor) => {
      editor.updateRhythmDot(event.target.checked);
    },
    handleValueChange: () => (event: React.FormEvent<HTMLInputElement>, editor) => {
      editor.updateRhythmValue(event.currentTarget.value);
    }
  })
);

export const Rhythm = enhance(props => (
  <div>
    <Form layout="inline">
      <Form.Item label="value">
        <Input
          defaultValue={props.element.value}
          onChange={props.handleValueChange}
        />
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
