import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import styled from 'react-emotion';
import { InputNumber, Form, Input, Button } from 'antd';
import { INotation } from '../../../@types/notation';
import { connect } from 'react-redux';
import { IStore } from '../../../@types/store';
import { NotationActions } from '../../../data/notation/notationActions';

interface IStateProps {
  notation: INotation;
}

interface IDispatchProps {
  setNotation: (notation: INotation) => void;
}

interface IHandlerProps {
  updateDeadTimeMs: (value: number | string | undefined) => void;
  updateBpm: (value: number | string | undefined) => void;
  updateVextabString: (event: any) => void;
}

type InnerProps = IStateProps & IDispatchProps & IHandlerProps;

const enhance = compose<InnerProps, {}>(
  connect<IStateProps, IDispatchProps, {}, IStore>(
    state => ({
      notation: state.notation
    }),
    dispatch => ({
      setNotation: (notation: INotation) => dispatch(NotationActions.setNotation(notation))
    })
  ),
  withHandlers<IStateProps & IDispatchProps, IHandlerProps>({
    updateDeadTimeMs: props => value => {
      const deadTimeMs = (typeof value === 'string' ? parseInt(value, 10) : value) || 0;
      props.setNotation({ ...props.notation, deadTimeMs });
    },
    updateBpm: props => value => {
      const bpm = (typeof value === 'string' ? parseInt(value, 10) : value) || 0;
      props.setNotation({ ...props.notation, bpm });
    },
    updateVextabString: props => event => {
      const vextabString = event.target.value;
      props.setNotation({ ...props.notation, vextabString });
    },
  })
);

const Outer = styled('div')`
  margin: 24px;
  padding-bottom: 72px;
`;

export const Editor = enhance(props => (
  <Outer>
    <Form>
      <Form.Item>
        <Button type="primary">Save</Button>
      </Form.Item>
      <Form.Item label="dead time (ms)">
        <InputNumber
          value={props.notation.deadTimeMs}
          onChange={props.updateDeadTimeMs}
        />
      </Form.Item>
      <Form.Item label="bpm">
        <InputNumber
          min={1}
          value={props.notation.bpm}
          onChange={props.updateBpm}
        />
      </Form.Item>
      <Form.Item label="vextab string">
        <Input.TextArea
          autosize={{ minRows: 5 }}
          value={props.notation.vextabString}
          onChange={props.updateVextabString}
        />
      </Form.Item>
    </Form>
  </Outer>
));
