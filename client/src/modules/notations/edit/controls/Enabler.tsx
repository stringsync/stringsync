import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { Form, Checkbox } from 'antd';
import { EditorActions } from 'data';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

interface IConnectProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

interface IHandlerProps extends IConnectProps {
  handleCheckboxChange: (event: CheckboxChangeEvent) => void;
}

const enhance = compose<IHandlerProps, {}>(
  connect(
    (state: Store.IState) => ({
      enabled: state.editor.enabled
    }),
    (dispatch: Dispatch) => ({
      setEnabled: (enabled: boolean) => dispatch(EditorActions.setEnabled(enabled))
    })
  ),
  withHandlers({
    handleCheckboxChange: (props: IConnectProps) => (event: CheckboxChangeEvent) => {
      props.setEnabled(!!event.target.checked);
    }
  })
);

export const Enabler = enhance(props => (
  <Form.Item>
    <Checkbox 
      checked={props.enabled}
      onChange={props.handleCheckboxChange}
    >
      enabled
    </Checkbox>
  </Form.Item>
));
