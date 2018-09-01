import * as React from 'react';
import { compose, withProps, withHandlers, withState, lifecycle } from 'recompose';
import { connect } from 'react-redux';

interface IConnectProps {
  lastUpdatedAt: number;
}

interface ICurrentTimeMsProps extends IConnectProps {
  currentTimeMs: number;
  setCurrentTimeMs: (currentTimeMs: number) => void;
}

interface ILoopHandleProps extends ICurrentTimeMsProps {
  loopHandle: number;
  setLoopHandle: (loopHandle: number) => void;
}

interface ISecondsAgoProps extends ILoopHandleProps {
  secondsAgo: number;
}

interface IUpdateTimeProps extends ISecondsAgoProps {
  updateTime: () => void;
}

const loopUpdateTime = async (props: IUpdateTimeProps) => {
  props.updateTime();
  const loopHandle = await window.setTimeout(() => loopUpdateTime(props), 1000);
  props.setLoopHandle(loopHandle);
}

const enhance = compose<IUpdateTimeProps, {}>(
  connect(
    (state: Store.IState) => ({
      lastUpdatedAt: state.editor.lastUpdatedAt
    })
  ),
  withState('currentTimeMs', 'setCurrentTimeMs', new Date().getTime()),
  withState('loopHandle', 'setLoopHandle', null),
  withProps((props: ICurrentTimeMsProps) => ({
    secondsAgo: Math.floor((props.currentTimeMs - props.lastUpdatedAt) / 1000)
  })),
  withHandlers({
    updateTime: (props: ISecondsAgoProps) => () => {
      props.setCurrentTimeMs(new Date().getTime())
    }
  }),
  lifecycle<IUpdateTimeProps, {}>({
    componentDidMount() {
      loopUpdateTime(this.props);
    },
    componentWillUnmount() {
      window.clearTimeout(this.props.loopHandle);
    }
  })
);

export const UpdatedAgo = enhance(props => (
  <span>about {props.secondsAgo} seconds ago</span>
));
