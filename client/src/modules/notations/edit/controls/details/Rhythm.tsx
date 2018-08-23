import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Form, Input, Checkbox } from 'antd';
import { Rhythm as RhythmModel } from 'models';
import { Tuplet } from './Tuplet';
import { withVextab, IWithVextabProps } from 'enhancers';
import { get } from 'lodash';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

interface IOuterProps {
  element: RhythmModel;
  editor: Store.IEditorState;
}

type VextabProps = IOuterProps & IWithVextabProps;

interface IHandlerProps extends VextabProps {
  handleValueChange: (event: React.FormEvent<HTMLInputElement>) => void;
  handleDotChange: (checked: CheckboxChangeEvent) => void;
}

const enhance = compose<IHandlerProps, IOuterProps>(
  withVextab,
  withHandlers({
    handleDotChange: (props: VextabProps) => (event: CheckboxChangeEvent) => {
      const vextab = props.getVextab();

      const rhythm = get(vextab.elements[props.editor.elementIndex], 'rhythm') as RhythmModel;
      rhythm.dot = event.target.checked;

      props.setVextab(vextab);
    },
    handleValueChange: (props: VextabProps) => (event: React.FormEvent<HTMLInputElement>) => {
      const vextab = props.getVextab();

      const rhythm = get(vextab.elements[props.editor.elementIndex], 'rhythm') as RhythmModel;
      rhythm.value = event.currentTarget.value;

      props.setVextab(vextab);
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
    {props.element.tuplet ? <Tuplet element={props.element.tuplet} /> : null}
  </div>
));
