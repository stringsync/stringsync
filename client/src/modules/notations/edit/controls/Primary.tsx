import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect, Dispatch } from 'react-redux';
import { Form, Checkbox, InputNumber } from 'antd';
import { EditorActions } from 'data';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { UpdatedAgo } from './UpdatedAgo';

interface IConnectProps {
  enabled: boolean;
  autosave: boolean;
  setEnabled: (enabled: boolean) => void;
  setAutosave: (autosave: boolean) => void;
}

interface IHandlerProps extends IConnectProps {
  handleAutosaveChange: (event: CheckboxChangeEvent) => void;
  handleEnabledChange: (event: CheckboxChangeEvent) => void;
}

const enhance = compose<IHandlerProps, {}>(
  connect(
    (state: Store.IState) => ({
      autosave: state.editor.autosave,
      enabled: state.editor.enabled
    }),
    (dispatch: Dispatch) => ({
      setAutosave: (autosave: boolean) => dispatch(EditorActions.setAutosave(autosave)),
      setEnabled: (enabled: boolean) => dispatch(EditorActions.setEnabled(enabled))
    })
  ),
  withHandlers({
    handleAutosaveChange: (props: IConnectProps) => (event: CheckboxChangeEvent) => {
      props.setAutosave(!!event.target.checked);
    },
    handleEnabledChange: (props: IConnectProps) => (event: CheckboxChangeEvent) => {
      props.setEnabled(!!event.target.checked);
    }
  })
);

export const Primary = enhance(props => (
  <Form.Item>
    <Form.Item>
      <Checkbox
        checked={props.enabled}
        onChange={props.handleEnabledChange}
      >
        enabled
      </Checkbox>
    </Form.Item>
    <Form.Item>
      <Checkbox
        checked={props.autosave}
        onChange={props.handleAutosaveChange}
      >
        autosave
      </Checkbox>
      <UpdatedAgo />
    </Form.Item>
  </Form.Item>
));
