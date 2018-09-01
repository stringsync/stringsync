import * as React from 'react';
import { compose, branch, renderNothing } from 'recompose';
import { Form, InputNumber, Button } from 'antd';
import { Tuplet as TupletModel } from 'models';
import { get } from 'lodash';
import { withEditorHandlers } from 'enhancers';

interface IOuterProps {
  tuplet: TupletModel | null;
}

interface IEditorHandlerProps extends IOuterProps {
  handleValueChange: (value: number | string) => void;
}

const enhance = compose<IEditorHandlerProps, IOuterProps>(
  withEditorHandlers<number | string, IOuterProps>({
    handleValueChange: () => (value, editor) => {
      if (typeof value === 'number') {
        editor.addTuplet(value);
      } else {
        editor.removeTuplet();
      }
    }
  })
);

export const Tuplet = enhance(props => (
  <Form.Item label="tuplet value">
    <InputNumber
      onChange={props.handleValueChange}
      defaultValue={get(props.tuplet, 'value')}
    />
  </Form.Item>
));
