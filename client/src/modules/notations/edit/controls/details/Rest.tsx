import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Form, InputNumber } from 'antd';
import { Rest as RestModel } from 'models';
import { Rhythm } from './Rhythm';
import { withVextab, IWithVextabProps } from 'enhancers';

interface IOuterProps {
  element: RestModel;
  editor: Store.IEditorState;
}

type VextabProps = IOuterProps & IWithVextabProps;

interface IHandlerProps extends VextabProps {
  handlePositionChange: (value: number | string) => void;
}

const enhance = compose<IHandlerProps, IOuterProps>(
  withVextab,
  withHandlers({
    handlePositionChange: (props: VextabProps) => (value: number | string) => {
      const vextab = props.getVextab();

      const rest = vextab.elements[props.editor.elementIndex] as RestModel;
      const position = typeof value === 'number' ? value : parseInt(value, 10);
      rest.position = position;

      props.setVextab(vextab);
    }
  })
);

export const Rest = enhance(props => (
  <Form layout="inline">
    <Form.Item label="id">
      <InputNumber disabled={true} value={props.element.id} />
    </Form.Item>
    <Form.Item label="position">
      <InputNumber
        defaultValue={props.element.position}
        onChange={props.handlePositionChange}
      />
    </Form.Item>
    <Rhythm element={props.element.rhythm} />
  </Form>
));
