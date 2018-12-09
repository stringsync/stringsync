import * as React from 'react';
import {
  compose,
  withHandlers,
  withState,
  withProps,
  lifecycle,
  ReactLifeCycleFunctionsThisArguments
} from 'recompose';
import { VextabString as VextabStringWrapper } from '../../models/vextab-string';
import { Score as ScoreWrapper } from '../../models/score';
import { debounce } from 'lodash';
import styled from 'react-emotion';
import { Row, Col } from 'antd';
import { Title } from './Title';
import { withMaestro, IWithMaestroProps } from '../../enhancers/withMaestro';
import { Maestro } from '../../models/maestro/Maestro';
import { Caret } from './Caret';
import { SpecSync } from './SpecSync';

interface IProps {
  songName: string;
  bpm: number;
  artistName: string;
  transcriberName: string;
  vextabString: string;
  deadTimeMs: number;
  width: number;
  caret: boolean;
}

interface IStateProps {
  div: HTMLDivElement | null;
  setDiv: (div: HTMLDivElement | null) => void;
}

interface IHandlerProps {
  handleDivRef: (div: HTMLDivElement) => void;
}

interface IMeasuresPerLineProps {
  measuresPerLine: number;
}

type InnerProps = IProps & IStateProps & IHandlerProps & IMeasuresPerLineProps & IWithMaestroProps;

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

    const score = new ScoreWrapper(
      this.props.width,
      this.props.div,
      new VextabStringWrapper(this.props.vextabString).asMeasures(this.props.measuresPerLine)
    );

    score.render();
    score.hydrate();

    // Now that the score is rendered, it is also hydrated. We can now mount the Maestro
    // to the store.
    const maestro = new Maestro(score);
    maestro.hydrate(this.props.deadTimeMs, this.props.bpm);
    this.props.setMaestro(maestro);
  } catch (error) {
    console.error(error);
    window.ss.message.error('could not render score');
  }
}, 250);

const enhance = compose<InnerProps, IProps>(
  withState('div', 'setDiv', null),
  withHandlers<IStateProps, IHandlerProps>({
    handleDivRef: props => div => props.setDiv(div)
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
    shouldComponentUpdate(nextProps) {
      return !!nextProps.div;
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
  background: white;
  padding-top: 48px;
  padding-bottom: 64px;
`;

export const Score = enhance(props => (
  <Outer>
    <SpecSync maestro={props.maestro} />
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
        <div ref={props.handleDivRef} />
      </Col>
    </Row>
  </Outer>
));
