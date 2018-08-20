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
import { Controls } from '../show/controls';
import { Fretboard, MaestroController } from 'components';

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
  foo: (event: React.SyntheticEvent<HTMLElement>) => void;
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
    componentWillMount() {
      $('body').addClass('no-scroll');
    },
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
      $('body').removeClass('no-scroll');
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
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const LeftCol = styled(Col)`
  overflow: auto;
  height: auto;
  -webkit-overflow-scrolling: touch;
  border-right: 1px solid #efefef;
`;

const RightCol = styled(Col)`
  overflow: hidden;
`;

const Spacer = styled('div')`
  border: 1px solid red;
  height: 110vh;
`

/**
 * The purpose of this component is to manage the state.notations.edit and video state
 * as well as setting the layout for the NotationEdit component.
 */
export const Edit = enhance(props => (
  <div>
    <MaestroController
      bpm={props.notation.bpm}
      durationMs={props.notation.durationMs}
      deadTimeMs={props.notation.deadTimeMs}
    />
    <StyledRow type="flex">
      <LeftCol span={6}>
        <EditVideo />
        <Spacer />
      </LeftCol>
      <RightCol span={18}>
        <Fretboard />
        <EditScore />
      </RightCol>
    </StyledRow>
  </div>
));
