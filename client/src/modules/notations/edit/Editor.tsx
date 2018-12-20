import * as React from 'react';
import { compose } from 'recompose';
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

type InnerProps = IStateProps & IDispatchProps;

const enhance = compose<InnerProps, {}>(
  connect<IStateProps, IDispatchProps, {}, IStore>(
    state => ({
      notation: state.notation
    }),
    dispatch => ({
      setNotation: (notation: INotation) => dispatch(NotationActions.setNotation(notation))
    })
  )
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
        />
      </Form.Item>
      <Form.Item label="bpm">
        <InputNumber
          value={props.notation.bpm}
        />
      </Form.Item>
      <Form.Item label="vextab string">
        <Input.TextArea
          autosize={{ minRows: 5 }}
          value={props.notation.vextabString}
        />
      </Form.Item>
    </Form>
  </Outer>
));
