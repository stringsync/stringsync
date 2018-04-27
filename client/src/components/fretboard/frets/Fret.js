import React from 'react';
import styled from 'react-emotion';
import { compose, setPropTypes } from 'recompose';
import PropTypes from 'prop-types';
import { Overlap, Layer } from 'components';

const enhance = compose(
  setPropTypes({
    fret: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    dots: PropTypes.number.isRequired,
    viewportType: PropTypes.string.isRequired
  })
);

const Outer = styled('div')`
  width: ${props => `${props.width}%`};
  border-right: ${props => props.fret === 0 ? 4 : props.viewportType === 'MOBILE' ? 1 : 2}px solid #aaa;
  box-shadow: 0 1px 1px 1px #222;
`;

const Dot = styled('div')`
  width: ${props => props.viewportType === 'DESKTOP' ? 16 : 12}px;
  height: ${props => props.viewportType === 'DESKTOP' ? 16 : 12}px;
  background-color: #6e6e6e;
  border-radius: 50%;
  opacity: 0.6;
`;

const DotsContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const Fret = enhance(props => (
  <Outer
    fret={props.fret}
    width={props.width}
    className="fretboard-height"
  >
    <Overlap>
      <Layer zIndex={10}>
        <DotsContainer className="fretboard-height">
          {
            Array(props.dots).fill(null).map((_, ndx) => (
              <Dot key={`fretboard-dot-${ndx}`} viewportType={props.viewportType} />
            ))
          }
        </DotsContainer>
      </Layer>
      <Layer zIndex={11}>
      </Layer>
    </Overlap>
  </Outer>
));

export default Fret;
