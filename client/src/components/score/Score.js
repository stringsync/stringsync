import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { ScoreLine } from './';
import { compose, setPropTypes, withState, lifecycle } from 'recompose';
import { Vextab } from 'models';

const enhance = compose(
  setPropTypes({
    vextabString: PropTypes.string.isRequired,
    measuresPerLine: PropTypes.number
  }),
  withState('vextab', 'setVextab', new Vextab([], 1)),
  lifecycle({
    componentWillUpdate(nextProps) {
      const shouldSetVextab = (
        this.props.vextabString !== nextProps.vextabString ||
        this.props.measuresPerLine !== nextProps.measuresPerLine
      );

      if (shouldSetVextab) {
        const vextab = new Vextab(Vextab.decode(nextProps.vextabString), this.props.measuresPerLine);
        nextProps.setVextab(vextab);
      }
    }
  })
);

const Score = enhance(props => (
  <div>
    {
      props.vextab.lines.map((line, ndx) => {
        return (
          <ScoreLine
            key={`score-line-${ndx}`}
            line={line}
            vextab={props.vextab}
          />
        );
      })
    }
  </div>
));

export default Score;
