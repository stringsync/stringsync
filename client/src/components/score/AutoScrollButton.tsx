import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { IStore } from '../../@types/store';
import { ScoreActions } from '../../data/score/scoreActions';
import { IPlayer } from '../../@types/youtube';

interface IStateProps {
  player: IPlayer | null;
  isVideoActive: boolean | void;
}

interface IDispatchProps {
  setAutoScroll: (autoScroll: boolean) => void;
}

interface IHandlerProps {
  enableAutoScroll: () => void;
}

type InnerProps = IStateProps & IDispatchProps & IHandlerProps;

const enhance = compose<InnerProps, {}>(
  connect<IStateProps, IDispatchProps, {}, IStore>(
    state => ({
      player: state.video.player,
      isVideoActive: state.video.isActive
    }),
    dispatch => ({
      setAutoScroll: (autoScroll: boolean) => dispatch(ScoreActions.setAutoScroll(autoScroll))
    })
  ),
  withHandlers<IStateProps & IDispatchProps, IHandlerProps>({
    enableAutoScroll: props => () => {
      const wasVideoActive = props.isVideoActive;

      if (props.player && props.isVideoActive) {
        props.player.pauseVideo();
      }

      props.setAutoScroll(true);

      window.setTimeout(() => {
        if (props.player && wasVideoActive) {
          props.player.playVideo();
        }
      }, 300);
    }
  })
);

export const AutoScrollButton = enhance(props => (
  <Button
    type="primary"
    size="small"
    onClick={props.enableAutoScroll}
    style={{ fontSize: '0.75em' }}
  >
    autoscroll
  </Button>
));
