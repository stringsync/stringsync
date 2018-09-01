import * as React from 'react';
import { compose } from 'recompose';
import { Bar as BarModel } from 'models';
import { Form, Select, InputNumber } from 'antd';
import { withEditorHandlers } from 'enhancers';
import { SelectValue } from 'antd/lib/select';

const { Option } = Select;

interface IOuterProps {
  element: BarModel;
  editor: Store.IEditorState;
}

interface IVextabChangeHandlerProps extends IOuterProps {
  handleSelectChange: (value: SelectValue) => void;
}

const enhance = compose<IVextabChangeHandlerProps, IOuterProps>(
  withEditorHandlers<SelectValue, IOuterProps>({
    handleSelectChange: () => (value, editor) => {
      editor.updateBarKind(value as Vextab.Parsed.IBarTypes);
    }
  })
);

export const Bar = enhance(props => (
  <Form layout="inline">
    <Form.Item label="kind">
      <Select defaultValue={props.element.kind} onChange={props.handleSelectChange}>
        {BarModel.KINDS.map(kind => <Option key={kind}>{kind}</Option>)}
      </Select>
    </Form.Item>
  </Form>
));
