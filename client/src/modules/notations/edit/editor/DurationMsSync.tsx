import * as React from 'react';
import { compose, branch, renderNothing, withHandlers, lifecycle } from 'recompose';
import { INotation } from '../../../../@types/notation';
import { connect } from 'react-redux';
import { IStore, IVideoState } from '../../../../@types/store';
import { Alert } from 'antd';
import { getDefaultState } from '../../../../data/notation/getDefaultState';
import { NotationActions } from '../../../../data/notation/notationActions';
import { updateNotation } from '../../../../data/notation/notationApi';
import { sToMs } from '../../../../utils/conversions';

interface IStateProps {
  notation: INotation;
  video: IVideoState;
}

interface IDispatchProps {
  setNotation: (notation: INotation) => void;
}

type ConnectProps = IStateProps & IDispatchProps;

interface IHandlerProps {
  updateDurationMs: (durationMs: number) => void;
}

type InnerProps = ConnectProps & IHandlerProps;

const DEFAULT_NOTATION = getDefaultState();

const enhance = compose<InnerProps, {}>(
  connect<IStateProps, IDispatchProps, {}, IStore>(
    state => ({
      notation: state.notation,
      video: state.video
    }),
    dispatch => ({
      setNotation: (notation: INotation) => dispatch(NotationActions.setNotation(notation))
    })
  ),
  branch<ConnectProps>(
    props => props.notation.id === DEFAULT_NOTATION.id || props.notation.durationMs > 0,
    renderNothing
  ),
  withHandlers<ConnectProps, IHandlerProps>({
    updateDurationMs: props => async (durationMs: number) => {
      const { notation } = props;

      if (typeof notation.id !== 'number') {
        return;
      }

      try {
        const updatedNotation = await updateNotation(notation.id, {
          duration_ms: durationMs
        });

        props.setNotation(updatedNotation);
        window.ss.message.success('updated notation duration ms');
      } catch (error) {
        console.error(error);
        window.ss.message.error('could not update duration ms');
      }
    }
  }),
  lifecycle<InnerProps, {}, {}>({
    componentDidUpdate(): void {
      const { isActive, player } = this.props.video;

      if (!isActive || !player) {
        return;
      }

      const durationMs = sToMs(player.getDuration());

      if (typeof durationMs === 'number' && durationMs > 0) {
        this.props.updateDurationMs(durationMs);
      }
    }
  })
);

export const DurationMsSync = enhance(() => (
  <Alert type="info" message="duration ms not synced" showIcon={true} />
));
