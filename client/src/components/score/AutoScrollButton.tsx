import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { IStore } from '../../@types/store';
import { ScoreActions } from '../../data/score/scoreActions';
import { IPlayer } from '../../@types/youtube';

interface IDispatchProps {
  setAutoScroll: (autoScroll: boolean) => void;
}

interface IHandlerProps {
  enableAutoScroll: () => void;
}

type InnerProps = IDispatchProps & IHandlerProps;

const enhance = compose<InnerProps, {}>(
  connect<{}, IDispatchProps, {}, IStore>(
    null,
    dispatch => ({
      setAutoScroll: (autoScroll: boolean) => dispatch(ScoreActions.setAutoScroll(autoScroll))
    })
  ),
  withHandlers<IDispatchProps, IHandlerProps>({
    enableAutoScroll: props => () => {
      props.setAutoScroll(true);
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
