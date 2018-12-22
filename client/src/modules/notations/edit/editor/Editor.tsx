import * as React from 'react';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import styled from 'react-emotion';
import { InputNumber, Form, Input, Button } from 'antd';
import { INotation } from '../../../../@types/notation';
import { connect } from 'react-redux';
import { IStore } from '../../../../@types/store';
import { NotationActions } from '../../../../data/notation/notationActions';
import { VextabString } from '../../../../models/vextab-string/VextabString';
import { Score } from '../../../../models/score';
import { updateNotation } from '../../../../data/notation/notationApi';
import { DurationMsSync } from './DurationMsSync';
import { Status } from './Status';

interface IProps {
  notationId: string;
}

interface IStateProps {
  notation: INotation;
}

interface IDispatchProps {
  setNotation: (notation: INotation) => void;
}

interface IInnerStateProps {
  editorVextabString: string | null;
  error: string | null;
  setEditorVextabString: (editorVextabString: string) => void;
  setError: (error: string | null) => void;
}

interface IHandlerProps {
  updateDeadTimeMs: (value: number | string | undefined) => void;
  updateBpm: (value: number | string | undefined) => void;
  updateVextabString: (event: any) => void;
  updateNotation: () => void;
}

type InnerProps = IProps & IStateProps & IDispatchProps & IInnerStateProps & IHandlerProps;

const enhance = compose<InnerProps, IProps>(
  connect<IStateProps, IDispatchProps, {}, IStore>(
    state => ({
      notation: state.notation
    }),
    dispatch => ({
      setNotation: (notation: INotation) => dispatch(NotationActions.setNotation(notation))
    })
  ),
  withState('editorVextabString', 'setEditorVextabString', null),
  withState('error', 'setError', null),
  withHandlers<IProps & IStateProps & IDispatchProps & IInnerStateProps, IHandlerProps>({
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
      props.setEditorVextabString(vextabString);

      const dummyDiv = document.createElement('div');

      try {
        // If the score can render, then it is ok to set the notation
        const formattedVextabString = new VextabString(vextabString).asMeasures(3);
        const score = new Score(800, dummyDiv, formattedVextabString);
        score.render();

        // Will not run if can't render
        props.setNotation({ ...props.notation, vextabString });
        props.setError(null);
      } catch (error) {
        props.setError(error.message);
      }
    },
    updateNotation: props => async () => {
      const { notationId, notation } = props;

      try {
        const updatedNotation = await updateNotation(parseInt(notationId, 10), {
          bpm: notation.bpm,
          dead_time_ms: notation.deadTimeMs,
          duration_ms: notation.durationMs,
          vextab_string: notation.vextabString
        });

        props.setNotation(updatedNotation);
        window.ss.message.success('updated notation');
      } catch (error) {
        console.error(error);
        window.ss.notification.error({ message: 'notation', description: error.message });
      }
    }
  }),
  lifecycle<InnerProps, {}, {}>({
    componentDidUpdate(): void {
      if (this.props.editorVextabString === null && this.props.notation.vextabString) {
        this.props.setEditorVextabString(this.props.notation.vextabString);
      }
    }
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
        <DurationMsSync />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          onClick={props.updateNotation}
        >
          Save
        </Button>
      </Form.Item>
      <Form.Item label="vextab string">
        <Input.TextArea
          autosize={{ minRows: 5 }}
          value={props.editorVextabString || ''}
          onChange={props.updateVextabString}
        />
      </Form.Item>
      <Form.Item>
        <Status error={props.error} />
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
    </Form>
  </Outer>
));
