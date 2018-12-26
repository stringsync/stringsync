import * as React from 'react';
import {
  compose,
  withHandlers,
  withState,
  withProps,
  lifecycle,
  ReactLifeCycleFunctionsThisArguments
} from 'recompose';
import { VextabString as VextabStringModel } from '../../models/vextab-string';
import { Score as ScoreModel } from '../../models/score';
import { debounce } from 'lodash';
import styled from 'react-emotion';
import { Row, Col } from 'antd';
import { Title } from './Title';
import { withMaestro, IWithMaestroProps } from '../../enhancers/withMaestro';
import { Maestro } from '../../models/maestro/Maestro';
import { Caret } from './Caret';
import { Scroller } from './Scroller';
import { Lighter } from './Lighter';
import { Branch } from '../branch';
import { connect } from 'react-redux';
import { IStore } from '../../@types/store';
import { ScoreActions } from '../../data/score/scoreActions';
import { AutoScrollButton } from './AutoScrollButton';

interface IProps {
  songName: string;
  scrollOffset: number;
  bpm: number;
  artistName: string;
  transcriberName: string;
  vextabString: string;
  deadTimeMs: number;
  width: number;
  caret: boolean;
  fretboardVisible: boolean;
}

interface IConnectStateProps {
  scrolling: boolean;
  autoScroll: boolean;
  isVideoActive: boolean | void;
}

interface IConnectDispatchProps {
  setAutoScroll: (autoScroll: boolean) => void;
}

type ConnectProps = IConnectStateProps & IConnectDispatchProps;

interface IStateProps {
  div: HTMLDivElement | null;
  setDiv: (div: HTMLDivElement | null) => void;
}

interface IHandlerProps {
  handleDivRef: (div: HTMLDivElement) => void;
  maybeDisableAutoScroll: () => void;
}

interface IMeasuresPerLineProps {
  measuresPerLine: number;
}

type InnerProps = IProps & ConnectProps & IStateProps & IHandlerProps & IMeasuresPerLineProps & IWithMaestroProps;

const MIN_WIDTH_PER_MEASURE = 240; // px
const MIN_MEASURES_PER_LINE = 1;
const MAX_MEASURES_PER_LINE = 4;

const renderScore = debounce(function(this: ReactLifeCycleFunctionsThisArguments<InnerProps, {}, {}>) {
  if (!this.props.div) {
    return;
  }

  try {
    // We have to manually manage the children of the main div
    // since React knows nothing about them
    const { firstChild } = this.props.div;
    if (firstChild && firstChild.parentNode === this.props.div) {
      this.props.div.removeChild(firstChild);
    }

    const score = new ScoreModel(
      this.props.width,
      this.props.div,
      new VextabStringModel(this.props.vextabString).asMeasures(this.props.measuresPerLine)
    );

    score.render();
    score.hydrate();

    // Now that the score is rendered, it is also hydrated. We can now mount the Maestro
    // to the store.
    const maestro = new Maestro(score, this.props.deadTimeMs, this.props.bpm);
    maestro.hydrate();
    this.props.setMaestro(maestro);
  } catch (error) {
    console.error(error);
    window.ss.message.warn('notation rendered with issues');
  }
}, 250);

const enhance = compose<InnerProps, IProps>(
  connect<IConnectStateProps, IConnectDispatchProps, {}, IStore>(
    state => ({
      scrolling: state.score.scrolling,
      autoScroll: state.score.autoScroll,
      isVideoActive: state.video.isActive
    }),
    dispatch => ({
      setAutoScroll: (autoScroll: boolean) => dispatch(ScoreActions.setAutoScroll(autoScroll))
    })
  ),
  withState('div', 'setDiv', null),
  withHandlers<IStateProps & ConnectProps, IHandlerProps>({
    handleDivRef: props => div => props.setDiv(div),
    maybeDisableAutoScroll: props => () => {
      // turn off autoScroll only if the user is scrolling while the
      // notation is not being programmatically scrolled
      if (!props.isVideoActive || !props.autoScroll || props.scrolling) {
        return;
      }

      props.setAutoScroll(false);
    }
  }),
  withProps((props: any) => {
    let measuresPerLine: number;

    // compute mpl based on width
    measuresPerLine = Math.floor(props.width / MIN_WIDTH_PER_MEASURE);

    // ensure mpl >= MIN_MEASURES_PER_LINE
    measuresPerLine = Math.max(measuresPerLine, MIN_MEASURES_PER_LINE);

    // ensure mpl <= MAX_MEASURES_PER_LINE
    measuresPerLine = Math.min(measuresPerLine, MAX_MEASURES_PER_LINE);

    return { measuresPerLine };
  }),
  withMaestro,
  lifecycle<InnerProps, {}, {}>({
    shouldComponentUpdate(nextProps): boolean {
      return !!nextProps.div && (
        this.props.width !== nextProps.width ||
        this.props.vextabString !== nextProps.vextabString ||
        this.props.deadTimeMs !== nextProps.deadTimeMs ||
        this.props.bpm !== nextProps.bpm ||
        this.props.scrollOffset !== nextProps.scrollOffset ||
        this.props.autoScroll !== nextProps.autoScroll
      );
    },
    componentDidUpdate(): void {
      renderScore.call(this);
    },
    componentWillUnmount(): void {
      this.props.resetMaestro();
    }
  })
);

const Outer = styled('div')`
  position: relative;
`;

interface IScoreWrapperProps {
  fretboardVisible: boolean;
}

const fretboardHeight = (props: IScoreWrapperProps) => props.fretboardVisible ? 200 : 0;
const ScoreWrapper = styled('div')`
  /* the nav bar is 64px and the player bar is 64 px */
  height: calc(100vh - 128px - ${fretboardHeight}px);
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  -webkit-overflow-scrolling: touch;

  /* LG_BREAKPOINT = 992 from NotationShow */
  @media (max-width: 992px) {
    height: calc(100vh - 128px - 200px - ${fretboardHeight}px);
  }
`;

const AutoScrollWrapper = styled('div')`
  position: absolute;
  bottom: 15px;
  right: 15px;
`;

const Inner = styled('div')`
  background: white;
  padding-top: 48px;
  padding-bottom: 64px;
`;

const Spacer = styled('div')`
  width: 100%;
  height: 300px;
  background: white;
`;

export const Score = enhance(props => (
  <Outer>
    <ScoreWrapper
      id="score-wrapper"
      onScroll={props.maybeDisableAutoScroll}
      fretboardVisible={props.fretboardVisible}
    >
      <Row type="flex" justify="center">
        <Inner>
          <Row type="flex" justify="center">
            <Col span={24}>
              <Title
                songName={props.songName}
                artistName={props.artistName}
                transcriberName={props.transcriberName}
              />
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={24}>
              <Caret visible={props.caret} />
              <Branch visible={props.autoScroll}>
                <Scroller offset={props.scrollOffset} />
              </Branch>
              <Lighter />
              <div ref={props.handleDivRef} />
            </Col>
          </Row>
          <Spacer />
        </Inner>
      </Row>
    </ScoreWrapper>
    <Branch visible={!props.autoScroll}>
      <AutoScrollWrapper>
        <AutoScrollButton />
      </AutoScrollWrapper>
    </Branch>
  </Outer>
));
