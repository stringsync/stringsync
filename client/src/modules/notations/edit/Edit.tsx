import * as React from 'react';
import { compose, lifecycle } from 'recompose';
import { RouteComponentProps } from 'react-router';
import { ViewportTypes } from 'data/viewport/getViewportType';
import { connect, Dispatch } from 'react-redux';
import { fetchNotation, NotationsActions, VideoActions } from 'data';

type OuterProps = RouteComponentProps<{ id: string }>;

interface IConnectProps extends OuterProps {
  notation: Notation.INotation;
  viewportWidth: number;
  viewportType: ViewportTypes;
  fetchNotation: (id: number) => Notation.INotation;
  resetNotation: () => void;
  resetVideo: () => void;
  setNotation: (notation: Notation.INotation) => void;
  setVideo: (video: Video.IVideo) => void;
}

interface IInnerProps extends IConnectProps {
  foo: string;
}

const enhance = compose<IInnerProps, OuterProps>(
  connect(
    (state: Store.IState) => ({
      notation: state.notations.edit,
      viewportType: state.viewport.type,
      viewportWidth: state.viewport.width
    }),
    (dispatch: Dispatch) => ({
      fetchNotation: (id: number) => dispatch(fetchNotation(id) as any),
      resetNotation: () => dispatch(NotationsActions.resetNotationEdit()),
      resetVideo: () => dispatch(VideoActions.resetVideo()),
      setNotation: (notation: Notation.INotation) => dispatch(NotationsActions.setNotationEdit(notation)),
      setVideo: (video: Video.IVideo) => dispatch(VideoActions.setVideo(video))
    })
  ),
  lifecycle<IInnerProps, {}>({
    async componentDidMount() {
      const id = parseInt(this.props.match.params.id, 10);

      try {
        const notation = await this.props.fetchNotation(id);
        this.props.setNotation(notation);
      } catch (error) {
        console.error(error);
        window.ss.message.error('something went wrong');
      }
    }
  })
);

export const Edit = enhance(props => (
  <div>
    {props.notation.vextabString}
  </div>
));
