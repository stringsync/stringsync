import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Bar as BarModel } from 'models';
import { Form, Select, InputNumber } from 'antd';
import { withVextab, IWithVextabProps } from 'enhancers';
import { SelectValue } from 'antd/lib/select';

const { Option } = Select;

interface IOuterProps {
  element: BarModel;
  editor: Store.IEditorState;
}

type SetVextabProps = IOuterProps & IWithVextabProps;

interface ISelectHandlerProps extends SetVextabProps {
  handleSelectChange: (value: SelectValue) => void;
}

const enhance = compose<ISelectHandlerProps, IOuterProps>(
  withVextab,
  withHandlers({
    handleSelectChange: (props: SetVextabProps) => (value: SelectValue) => {
      const vextab = props.getVextabClone();
      const bar = vextab.elements[props.editor.elementIndex] as BarModel;
      bar.kind = value as Vextab.Parsed.IBarTypes;
      props.setVextab(vextab);
    }
  })
);

export const Bar = enhance(props => (
  <Form layout="inline">
    <Form.Item label="id">
      <InputNumber disabled={true} value={props.element.id} />
    </Form.Item>
    <Form.Item label="kind">
      <Select value={props.element.kind} onChange={props.handleSelectChange}>
        {BarModel.KINDS.map(kind => <Option key={kind}>{kind}</Option>)}
      </Select>
    </Form.Item>
  </Form>
));
