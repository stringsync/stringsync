import * as React from 'react';
import { compose, lifecycle, branch, renderComponent } from 'recompose';
import { RouteComponentProps } from 'react-router';
import { ViewportTypes } from 'data/viewport/getViewportType';
import { connect, Dispatch } from 'react-redux';
import { fetchNotation, NotationsActions, VideoActions } from 'data';
import { NotSupported } from './NotSupported';
import { Row, Col } from 'antd';
import { EditVideo } from './EditVideo';
import styled from 'react-emotion';
import { EditScore } from './EditScore';

const MINIMUM_VIEWPORT_WIDTH = 1024; // px

type OuterProps = RouteComponentProps<{ id: string }>;

interface IInnerProps extends OuterProps {
  notation: Notation.INotation;
  viewportWidth: number;
  viewportType: ViewportTypes;
  fetchNotation: (id: number) => Notation.INotation;
  resetNotation: () => void;
  resetVideo: () => void;
  setNotation: (notation: Notation.INotation) => void;
  setVideo: (video: Video.IVideo) => void;
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

        if (notation.video) {
          this.props.setVideo(notation.video);
        }

      } catch (error) {
        console.error(error);
        window.ss.message.error('something went wrong');
      }
    },
    componentWillUnmount() {
      this.props.resetNotation();
      this.props.resetVideo();
    }
  }),
  branch<IInnerProps>(
    props => props.viewportWidth < MINIMUM_VIEWPORT_WIDTH,
    renderComponent(NotSupported)
  )
);

const StyledRow = styled(Row)`
  background: white;
  min-height: 100vh;
`;

/**
 * The purpose of this component is to manage the state.notations.edit and video state
 * as well as setting the layout for the NotationEdit component.
 */
export const Edit = enhance(() => (
  <StyledRow>
    <Col span={6}>
      <EditVideo />
    </Col>
    <Col span={18}>
      <EditScore />
    </Col>
  </StyledRow>
));
